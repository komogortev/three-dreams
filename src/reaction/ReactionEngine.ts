/**
 * ReactionEngine — BaseModule that wires EventBus stimuli to the registry + executor.
 *
 * Mount as a child of the scene module (or alongside GameLogicModule) after the
 * engine is ready. Wire getFlag/setFlag from GameLogicModule via options so the
 * engine stays decoupled from direct module references.
 *
 * Usage:
 *   const engine = new ReactionEngine({
 *     getFlag: (k) => logic.getMechanicFlag(k),
 *     setFlag: (k, v) => logic.setMechanicFlag(k, v),
 *   })
 *   await threeModule.mountChild('reaction-engine', engine)
 *
 *   // Register a reaction for an NPC:
 *   engine.register('npc-dad-scene-01', 'proximity_enter', {
 *     conditions: [{ kind: 'once' }],
 *     reaction: {
 *       kind: 'dialog',
 *       speakerId: 'npc-dad-scene-01',
 *       lines: [{ text: 'You came back.' }],
 *     },
 *   })
 *
 *   // Scene module emits stimulus when player crosses proximity threshold:
 *   engine.emitStimulus({ type: 'proximity_enter', entityId: 'npc-dad-scene-01', sourceId: 'player' })
 */

import { BaseModule } from '@base/engine-core'
import type { EngineContext } from '@base/engine-core'
import type { GamePhase } from '@/game/sessionTypes'
import { GAME_EVENTS } from '@/game/sessionTypes'
import type { StimulusType, StimulusEvent, ReactionEntry, ReactionContext } from './types'
import { REACTION_EVENTS } from './types'
import { ReactionRegistry } from './ReactionRegistry'
import { ReactionExecutor } from './ReactionExecutor'
import {
  evaluateConditions,
  newConditionState,
  recordFired,
  type ConditionState,
} from './ConditionEvaluator'

// ─── Options ──────────────────────────────────────────────────────────────────

export interface ReactionEngineOptions {
  /**
   * Bridge to GameLogicModule.getMechanicFlag.
   * If omitted, all flag conditions evaluate to false.
   */
  getFlag?: (key: string) => boolean
  /**
   * Bridge to GameLogicModule.setMechanicFlag.
   * If omitted, set_flag reactions are silently ignored.
   */
  setFlag?: (key: string, value: boolean) => void
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class ReactionEngine extends BaseModule {
  readonly id = 'reaction-engine'

  private readonly opts: ReactionEngineOptions

  private readonly registry = new ReactionRegistry()
  private readonly executor = new ReactionExecutor()

  /** Per-entry runtime state keyed by object identity — GC-friendly. */
  private readonly entryStates = new WeakMap<ReactionEntry, ConditionState>()

  private currentPhase: GamePhase = 'booting'
  private simTime = 0   // seconds, monotonic, incremented from engine:frame

  private unsubs: Array<() => void> = []

  constructor(options: ReactionEngineOptions = {}) {
    super()
    this.opts = options
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Register a reaction for an entity + stimulus pair.
   *
   * @returns Unsubscribe function — call it to remove this specific entry.
   *          For bulk cleanup call registry.unregisterAll(entityId).
   */
  register(
    entityId: string,
    stimulus: StimulusType,
    entry: ReactionEntry,
  ): () => void {
    this.registry.register(entityId, stimulus, entry)
    // Return a scoped unregister that only removes this specific entry
    return () => {
      const remaining = this.registry
        .lookup(entityId, stimulus)
        .filter(e => e !== entry)
      this.registry.unregister(entityId, stimulus)
      for (const e of remaining) this.registry.register(entityId, stimulus, e)
    }
  }

  /** Remove all reactions for an entity. Call on NPC teardown. */
  unregisterEntity(entityId: string): void {
    this.registry.unregisterAll(entityId)
  }

  /**
   * Programmatically emit a stimulus.
   *
   * Scene modules call this when a proximity zone crosses, the player presses
   * interact, a flag changes, or a scene loads. The event routes through the
   * shared EventBus so external systems can also observe stimulus traffic.
   */
  emitStimulus(stimulus: StimulusEvent): void {
    this.context.eventBus.emit(REACTION_EVENTS.STIMULUS, stimulus)
  }

  /** True while any multi-step sequence is executing (e.g. to lock player input). */
  get busy(): boolean {
    return this.executor.hasActiveSequences()
  }

  // ─── Mount / Unmount ────────────────────────────────────────────────────────

  protected async onMount(_container: HTMLElement, context: EngineContext): Promise<void> {
    const bus = context.eventBus

    // Mirror session phase for condition evaluation
    this.unsubs.push(
      bus.on(GAME_EVENTS.PHASE_CHANGED, (raw) => {
        const p = raw as { phase: GamePhase }
        this.currentPhase = p.phase
      }),
    )

    // Handle inbound stimuli
    this.unsubs.push(
      bus.on(REACTION_EVENTS.STIMULUS, (raw) => {
        this.handleStimulus(raw as StimulusEvent)
      }),
    )

    // Advance sequence runners every frame
    this.unsubs.push(
      bus.on('engine:frame', (raw) => {
        const delta = raw as number   // THREE.Clock.getDelta() — seconds
        this.simTime += delta
        this.executor.tick(delta, this.buildContext())
      }),
    )
  }

  protected async onUnmount(): Promise<void> {
    for (const off of this.unsubs) off()
    this.unsubs = []
    this.executor.clearAll()
    this.registry.clear()
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  private handleStimulus(stimulus: StimulusEvent): void {
    const entries = this.registry.lookup(stimulus.entityId, stimulus.type)
    if (entries.length === 0) return

    const ctx = this.buildContext()

    for (const entry of entries) {
      const state = this.getEntryState(entry)
      if (!evaluateConditions(entry.conditions, ctx, state)) continue

      recordFired(state, this.simTime)
      this.executor.execute(entry.reaction, ctx)

      if (entry.stopPropagation !== false) break  // default: stop at first match
    }
  }

  private buildContext(): ReactionContext {
    const bus = this.context.eventBus
    return {
      getFlag:  (key) => this.opts.getFlag?.(key) ?? false,
      setFlag:  (key, value) => this.opts.setFlag?.(key, value),
      phase:    this.currentPhase,
      emit:     (event, payload) => bus.emit(event, payload),
      now:      this.simTime,
    }
  }

  private getEntryState(entry: ReactionEntry): ConditionState {
    if (!this.entryStates.has(entry)) {
      this.entryStates.set(entry, newConditionState())
    }
    return this.entryStates.get(entry)!
  }
}

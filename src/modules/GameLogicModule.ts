import { BaseModule } from '@base/engine-core'
import type { EngineContext } from '@base/engine-core'
import type { InputActionEvent } from '@base/input'
import { canTransitionSessionPhase } from '@/game/sessionTransitions'
import {
  GAME_EVENTS,
  type GameOutcomePayload,
  type GameOutcomeReportPayload,
  type GamePhase,
  type GamePhaseChangedPayload,
  type GameRequestNewRunPayload,
  type GameSceneChangedPayload,
  type GameSessionSnapshot,
} from '@/game/sessionTypes'

export interface GameLogicModuleOptions {
  /** First scene id after `booting` → `playing`. */
  initialSceneId?: string
}

function newRunId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Session / runtime layer — phase FSM, run id, scene pointer, mechanic flags.
 * Emits on `context.eventBus`: {@link GAME_EVENTS}.
 *
 * Listens: `input:action` (pause), `game:request-*`, `game:report-outcome`.
 */
export class GameLogicModule extends BaseModule {
  readonly id = 'game-logic'

  private readonly opts: GameLogicModuleOptions

  private phase: GamePhase = 'booting'
  private runId = ''
  private sceneId = 'default'
  private readonly mechanicFlags: Record<string, boolean> = {}

  private unsubs: Array<() => void> = []

  constructor(options: GameLogicModuleOptions = {}) {
    super()
    this.opts = options
  }

  /** Authoritative session snapshot (for tests, devtools, future store sync). */
  getSessionSnapshot(): GameSessionSnapshot {
    return {
      phase: this.phase,
      runId: this.runId,
      sceneId: this.sceneId,
      mechanicFlags: { ...this.mechanicFlags },
    }
  }

  getSessionPhase(): GamePhase {
    return this.phase
  }

  /** Scenario / mechanics — toggles internal flags only (no bus event). */
  setMechanicFlag(key: string, value: boolean): void {
    this.mechanicFlags[key] = value
  }

  getMechanicFlag(key: string): boolean {
    return !!this.mechanicFlags[key]
  }

  protected async onMount(_container: HTMLElement, context: EngineContext): Promise<void> {
    const bus = context.eventBus

    this.runId = newRunId()
    this.sceneId = this.opts.initialSceneId?.trim() || 'default'
    this.phase = 'booting'

    this.unsubs.push(
      bus.on('input:action', (raw) => {
        const e = raw as InputActionEvent
        if (e.action !== 'pause' || e.type !== 'pressed') return
        this.onPausePressed()
      }),
    )

    this.unsubs.push(
      bus.on(GAME_EVENTS.REQUEST_PAUSE, () => {
        this.tryTransition('paused')
      }),
    )

    this.unsubs.push(
      bus.on(GAME_EVENTS.REQUEST_RESUME, () => {
        this.tryTransition('playing')
      }),
    )

    this.unsubs.push(
      bus.on(GAME_EVENTS.REQUEST_NEW_RUN, (raw) => {
        const p = (raw as GameRequestNewRunPayload | undefined) ?? {}
        this.applyNewRun(p)
      }),
    )

    this.unsubs.push(
      bus.on(GAME_EVENTS.REQUEST_RETRY, () => {
        this.applyRetry()
      }),
    )

    this.unsubs.push(
      bus.on(GAME_EVENTS.REQUEST_EXIT, () => {
        this.tryTransition('exiting')
      }),
    )

    this.unsubs.push(
      bus.on(GAME_EVENTS.REPORT_OUTCOME, (raw) => {
        const p = raw as GameOutcomeReportPayload
        if (p?.kind !== 'win' && p?.kind !== 'lose') return
        this.applyOutcomeReport(p.kind, p.reason)
      }),
    )

    this.tryTransition('playing')
    bus.emit(GAME_EVENTS.LOGIC_READY, { moduleId: this.id, runId: this.runId, sceneId: this.sceneId })
  }

  protected async onUnmount(): Promise<void> {
    for (const off of this.unsubs) off()
    this.unsubs = []
  }

  private onPausePressed(): void {
    if (this.phase === 'playing') {
      this.tryTransition('paused')
      return
    }
    if (this.phase === 'paused') {
      this.tryTransition('playing')
    }
  }

  /** New run id, optional scene change, then `playing` (from terminal or mid-run). */
  private applyNewRun(payload: GameRequestNewRunPayload): void {
    if (this.phase === 'exiting') return

    this.runId = newRunId()
    for (const k of Object.keys(this.mechanicFlags)) delete this.mechanicFlags[k]

    if (payload.sceneId !== undefined && payload.sceneId.trim() !== '') {
      this.setSceneId(payload.sceneId.trim())
    }

    const previousPhase = this.phase
    this.phase = 'playing'
    this.emitPhaseChanged(previousPhase)
  }

  /** Same scene: new run id, clear flags, back to `playing` (from `won` / `lost`). */
  private applyRetry(): void {
    if (this.phase !== 'won' && this.phase !== 'lost') return

    this.runId = newRunId()
    for (const k of Object.keys(this.mechanicFlags)) delete this.mechanicFlags[k]

    const previousPhase = this.phase
    this.phase = 'playing'
    this.emitPhaseChanged(previousPhase)
  }

  private applyOutcomeReport(kind: 'win' | 'lose', reason?: string): void {
    if (this.phase !== 'playing' && this.phase !== 'resolving') return

    const next: GamePhase = kind === 'win' ? 'won' : 'lost'
    if (!canTransitionSessionPhase(this.phase, next)) return

    const bus = this.context.eventBus
    bus.emit(GAME_EVENTS.OUTCOME, {
      kind,
      reason,
      runId: this.runId,
      sceneId: this.sceneId,
    } satisfies GameOutcomePayload)

    const previousPhase = this.phase
    this.phase = next
    this.emitPhaseChanged(previousPhase)
  }

  private setSceneId(next: string): void {
    if (next === this.sceneId) return
    const previousSceneId = this.sceneId
    this.sceneId = next
    this.context.eventBus.emit(GAME_EVENTS.SCENE_CHANGED, {
      sceneId: this.sceneId,
      previousSceneId,
      runId: this.runId,
    } satisfies GameSceneChangedPayload)
  }

  private tryTransition(to: GamePhase): boolean {
    if (!canTransitionSessionPhase(this.phase, to)) return false
    const previousPhase = this.phase
    this.phase = to
    this.emitPhaseChanged(previousPhase)
    return true
  }

  private emitPhaseChanged(previousPhase: GamePhase): void {
    const payload: GamePhaseChangedPayload = {
      phase: this.phase,
      previousPhase,
      runId: this.runId,
      sceneId: this.sceneId,
    }
    this.context.eventBus.emit(GAME_EVENTS.PHASE_CHANGED, payload)
  }
}

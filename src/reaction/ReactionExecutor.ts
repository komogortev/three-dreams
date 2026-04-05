/**
 * ReactionExecutor — runs reaction definitions and manages active sequences.
 *
 * Sequences are driven by tick(delta) called from the engine:frame handler
 * in ReactionEngine. All other reaction kinds dispatch immediately.
 *
 * No Three.js coupling. Animation reactions are dispatched as EventBus events;
 * scene modules (NpcModule etc.) subscribe and drive the AnimationMixer.
 */

import type {
  ReactionDef,
  SequenceStep,
  ReactionContext,
  DialogStartPayload,
  PlayAnimationPayload,
} from './types'
import { REACTION_EVENTS } from './types'

// ─── Sequence runner ──────────────────────────────────────────────────────────

interface SequenceRunner {
  steps: SequenceStep[]
  currentStep: number
  /** Seconds remaining before the current step fires. */
  waitRemaining: number
}

// ─── Executor ─────────────────────────────────────────────────────────────────

export class ReactionExecutor {
  private activeSequences: SequenceRunner[] = []

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Execute a reaction immediately, or enqueue if it is a sequence.
   * Safe to call mid-frame — no allocations beyond sequence queue push.
   */
  execute(reaction: ReactionDef, ctx: ReactionContext): void {
    switch (reaction.kind) {
      case 'dialog':
        ctx.emit(REACTION_EVENTS.DIALOG_START, {
          speakerId: reaction.speakerId,
          lines: reaction.lines,
        } satisfies DialogStartPayload)
        break

      case 'animation':
        ctx.emit(REACTION_EVENTS.PLAY_ANIMATION, {
          entityId:  reaction.entityId,
          clipName:  reaction.clipName,
          clipIndex: reaction.clipIndex,
          loop:      reaction.loop      ?? false,
          transient: reaction.transient ?? false,
        } satisfies PlayAnimationPayload)
        break

      case 'set_flag':
        ctx.setFlag(reaction.key, reaction.value)
        break

      case 'emit':
        ctx.emit(reaction.event, reaction.payload)
        break

      case 'sequence':
        this.startSequence(reaction.steps, ctx)
        break

      case 'wait':
        // wait is meaningful only inside a sequence; standalone is a no-op
        break
    }
  }

  /**
   * Advance active sequence runners.
   * Call once per frame with the Three.js Clock delta (seconds).
   */
  tick(delta: number, ctx: ReactionContext): void {
    for (let i = this.activeSequences.length - 1; i >= 0; i--) {
      const runner = this.activeSequences[i]
      runner.waitRemaining -= delta

      while (runner.waitRemaining <= 0 && runner.currentStep < runner.steps.length) {
        const step = runner.steps[runner.currentStep]
        runner.currentStep++

        // Fire the step reaction (sequences within sequences are not supported)
        this.execute(step.reaction, ctx)

        if (runner.currentStep >= runner.steps.length) {
          ctx.emit(REACTION_EVENTS.SEQUENCE_END, {})
          this.activeSequences.splice(i, 1)
          break
        }

        // Load delay for next step; carry over any leftover time
        const nextDelay = runner.steps[runner.currentStep].delaySeconds ?? 0
        runner.waitRemaining += nextDelay
      }
    }
  }

  /** True if any sequence is currently running (e.g. to block input). */
  hasActiveSequences(): boolean {
    return this.activeSequences.length > 0
  }

  /** Cancel all running sequences. Call on scene unload or unmount. */
  clearAll(): void {
    this.activeSequences = []
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  private startSequence(steps: SequenceStep[], ctx: ReactionContext): void {
    if (steps.length === 0) return

    ctx.emit(REACTION_EVENTS.SEQUENCE_START, {})

    const firstDelay = steps[0].delaySeconds ?? 0
    this.activeSequences.push({
      steps,
      currentStep: 0,
      waitRemaining: firstDelay,
    })
  }
}

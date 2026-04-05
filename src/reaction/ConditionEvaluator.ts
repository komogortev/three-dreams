/**
 * Condition evaluation — pure functions, no side effects.
 *
 * ConditionState is the only mutable piece; it lives in ReactionEngine
 * (per ReactionEntry, via WeakMap) and is passed in here.
 */

import type { ConditionDef, ReactionContext } from './types'

// ─── Per-entry runtime state ──────────────────────────────────────────────────

export interface ConditionState {
  /** How many times this entry has fired in the current run. */
  firedCount: number
  /** ctx.now (seconds) at the last fire — used for cooldown. */
  lastFiredAt: number
}

export function newConditionState(): ConditionState {
  return { firedCount: 0, lastFiredAt: -Infinity }
}

export function recordFired(state: ConditionState, now: number): void {
  state.firedCount++
  state.lastFiredAt = now
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

/**
 * Returns true if all conditions in the array pass.
 * Empty array always passes (unconditional reaction).
 */
export function evaluateConditions(
  conditions: ConditionDef[],
  ctx: ReactionContext,
  state: ConditionState,
): boolean {
  return conditions.every(c => evaluateOne(c, ctx, state))
}

function evaluateOne(
  c: ConditionDef,
  ctx: ReactionContext,
  state: ConditionState,
): boolean {
  switch (c.kind) {
    case 'flag_is':
      return ctx.getFlag(c.key) === c.value

    case 'phase_is':
      return ctx.phase === c.phase

    case 'once':
      return state.firedCount === 0

    case 'cooldown':
      return (ctx.now - state.lastFiredAt) >= c.seconds

    case 'not':
      return !evaluateOne(c.condition, ctx, state)
  }
}

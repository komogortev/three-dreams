import type { GamePhase } from './sessionTypes'

const ALLOWED: Readonly<Record<GamePhase, ReadonlySet<GamePhase>>> = {
  booting: new Set<GamePhase>(['playing', 'exiting']),
  playing: new Set<GamePhase>(['paused', 'resolving', 'won', 'lost', 'exiting']),
  paused: new Set<GamePhase>(['playing', 'exiting']),
  resolving: new Set<GamePhase>(['won', 'lost', 'playing']),
  won: new Set<GamePhase>(['playing', 'exiting']),
  lost: new Set<GamePhase>(['playing', 'exiting']),
  exiting: new Set<GamePhase>(),
}

export function canTransitionSessionPhase(from: GamePhase, to: GamePhase): boolean {
  if (from === to) return false
  return ALLOWED[from]?.has(to) ?? false
}

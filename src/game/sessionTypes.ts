/**
 * Session / runtime game state (layer 1) — owned by {@link GameLogicModule}.
 * UI and Pinia mirror these facts via `game:*` EventBus payloads; do not duplicate rules there.
 */

export type GamePhase =
  | 'booting'
  | 'playing'
  | 'paused'
  | 'resolving'
  | 'won'
  | 'lost'
  | 'exiting'

/** Emitted on every phase transition the module accepts. */
export interface GamePhaseChangedPayload {
  phase: GamePhase
  previousPhase: GamePhase
  runId: string
  sceneId: string
}

/** Emitted when {@link GameLogicModule} changes the active scene id. */
export interface GameSceneChangedPayload {
  sceneId: string
  previousSceneId: string
  runId: string
}

/** Emitted when a run resolves to a terminal outcome (same moment as entering `won` / `lost`). */
export interface GameOutcomePayload {
  kind: 'win' | 'lose'
  reason?: string
  runId: string
  sceneId: string
}

/** Bus payload for `game:report-outcome` (mechanics / scenario layer). */
export interface GameOutcomeReportPayload {
  kind: 'win' | 'lose'
  reason?: string
}

/** Bus payload for `game:request-new-run`. */
export interface GameRequestNewRunPayload {
  sceneId?: string
}

/** Payload for {@link GAME_EVENTS.LOGIC_READY}. */
export interface GameLogicReadyPayload {
  moduleId: string
  runId: string
  sceneId: string
}

/** Read-only snapshot for debugging or future Pinia hydration. */
export interface GameSessionSnapshot {
  phase: GamePhase
  runId: string
  sceneId: string
  mechanicFlags: Record<string, boolean>
}

/** Stable EventBus names — use these instead of string literals at call sites. */
export const GAME_EVENTS = {
  LOGIC_READY: 'game:logic-ready',
  PHASE_CHANGED: 'game:phase-changed',
  SCENE_CHANGED: 'game:scene-changed',
  OUTCOME: 'game:outcome',
  REQUEST_PAUSE: 'game:request-pause',
  REQUEST_RESUME: 'game:request-resume',
  REQUEST_NEW_RUN: 'game:request-new-run',
  REQUEST_RETRY: 'game:request-retry',
  REQUEST_EXIT: 'game:request-exit',
  REPORT_OUTCOME: 'game:report-outcome',
} as const

export type GameEventName = (typeof GAME_EVENTS)[keyof typeof GAME_EVENTS]

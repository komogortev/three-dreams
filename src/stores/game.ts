import { defineStore } from 'pinia'
import { ref } from 'vue'
import { EventBus } from '@base/engine-core'
import { usePlatformAdapter } from '@/composables/usePlatformAdapter'
import {
  GAME_EVENTS,
  type GameLogicReadyPayload,
  type GameOutcomePayload,
  type GamePhase,
  type GamePhaseChangedPayload,
  type GameRequestNewRunPayload,
  type GameSceneChangedPayload,
} from '@/game/sessionTypes'

/** localStorage / electron-store key for Continue (see {@link GameSaveV1}). */
export const GAME_SAVE_STORAGE_KEY = 'first-game-save-v1'

export interface GameSaveV1 {
  schemaVersion: 1
  sceneId: string
  savedAt: number
}

function isSaveV1(x: unknown): x is GameSaveV1 {
  if (x === null || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return o.schemaVersion === 1 && typeof o.sceneId === 'string' && typeof o.savedAt === 'number'
}

/**
 * Layer 2 — UI mirror of session/runtime state + save/continue helpers.
 * Syncs from `game:*` bus events via {@link attachToEventBus}; does not encode FSM rules.
 */
export const useGameStore = defineStore('game', () => {
  const phase = ref<GamePhase | null>(null)
  const runId = ref<string | null>(null)
  const sceneId = ref('default')
  const lastOutcome = ref<Pick<GameOutcomePayload, 'kind' | 'reason' | 'runId' | 'sceneId'> | null>(
    null,
  )
  const logicReady = ref(false)

  const canContinue = ref(false)

  /** One-shot scene id for `GameLogicModule` when entering `/game` via Continue. */
  const bootstrapSceneId = ref<string | null>(null)

  let busDetach: (() => void) | null = null

  /** Minimal save for Continue (manual checkpoints / devtools until autosave lands). */
  async function saveProgressForContinue(scene: string): Promise<void> {
    const storage = usePlatformAdapter().storage
    const payload: GameSaveV1 = {
      schemaVersion: 1,
      sceneId: scene,
      savedAt: Date.now(),
    }
    await storage.set(GAME_SAVE_STORAGE_KEY, payload)
    canContinue.value = true
  }

  function applyPhasePayload(p: GamePhaseChangedPayload): void {
    const prevRun = runId.value
    if (p.phase === 'playing' && prevRun !== null && p.runId !== prevRun) {
      lastOutcome.value = null
    }

    phase.value = p.phase
    runId.value = p.runId
    sceneId.value = p.sceneId
  }

  function applyScenePayload(p: GameSceneChangedPayload): void {
    sceneId.value = p.sceneId
    runId.value = p.runId
  }

  function applyOutcomePayload(p: GameOutcomePayload): void {
    lastOutcome.value = {
      kind: p.kind,
      reason: p.reason,
      runId: p.runId,
      sceneId: p.sceneId,
    }
  }

  function applyLogicReady(p: GameLogicReadyPayload): void {
    logicReady.value = true
    runId.value = p.runId
    sceneId.value = p.sceneId
  }

  /** Subscribe to `game:*` emissions from {@link GameLogicModule}. Idempotent re-attach. */
  function attachToEventBus(bus: EventBus): void {
    detachGameBus()

    const offs: Array<() => void> = [
      bus.on(GAME_EVENTS.PHASE_CHANGED, (raw) => {
        applyPhasePayload(raw as GamePhaseChangedPayload)
      }),
      bus.on(GAME_EVENTS.SCENE_CHANGED, (raw) => {
        applyScenePayload(raw as GameSceneChangedPayload)
      }),
      bus.on(GAME_EVENTS.OUTCOME, (raw) => {
        applyOutcomePayload(raw as GameOutcomePayload)
      }),
      bus.on(GAME_EVENTS.LOGIC_READY, (raw) => {
        applyLogicReady(raw as GameLogicReadyPayload)
      }),
    ]

    busDetach = () => {
      for (const off of offs) off()
      busDetach = null
    }
  }

  function detachGameBus(): void {
    busDetach?.()
    busDetach = null
  }

  /** Clear mirror when leaving `/game` (runtime module is gone). */
  function resetSessionMirror(): void {
    phase.value = null
    runId.value = null
    sceneId.value = 'default'
    lastOutcome.value = null
    logicReady.value = false
  }

  async function refreshCanContinue(): Promise<void> {
    const storage = usePlatformAdapter().storage
    try {
      const raw = await storage.get(GAME_SAVE_STORAGE_KEY)
      canContinue.value = isSaveV1(raw)
    } catch {
      canContinue.value = false
    }
  }

  /** Read save and stage bootstrap scene for the next `/game` visit. */
  async function loadContinueBootstrap(): Promise<boolean> {
    const storage = usePlatformAdapter().storage
    try {
      const raw = await storage.get(GAME_SAVE_STORAGE_KEY)
      if (!isSaveV1(raw)) {
        bootstrapSceneId.value = null
        return false
      }
      bootstrapSceneId.value = raw.sceneId
      return true
    } catch {
      bootstrapSceneId.value = null
      return false
    }
  }

  /**
   * Consume one-shot continue scene id for `new GameLogicModule({ initialSceneId })`.
   * Call once when `GameView` is created.
   */
  function pullBootstrapSceneId(): string | undefined {
    const v = bootstrapSceneId.value
    bootstrapSceneId.value = null
    return v ?? undefined
  }

  /** User chose New Game / Play — drop a staged Continue payload. */
  function discardPendingContinue(): void {
    bootstrapSceneId.value = null
  }

  async function clearSavedProgress(): Promise<void> {
    await usePlatformAdapter().storage.remove(GAME_SAVE_STORAGE_KEY)
    canContinue.value = false
  }

  /** Emit bus requests (shell must be on same EventBus as game modules). */
  function requestPause(bus: EventBus): void {
    bus.emit(GAME_EVENTS.REQUEST_PAUSE)
  }

  function requestResume(bus: EventBus): void {
    bus.emit(GAME_EVENTS.REQUEST_RESUME)
  }

  function requestNewRun(bus: EventBus, payload?: GameRequestNewRunPayload): void {
    bus.emit(GAME_EVENTS.REQUEST_NEW_RUN, payload ?? {})
  }

  function requestRetry(bus: EventBus): void {
    bus.emit(GAME_EVENTS.REQUEST_RETRY)
  }

  return {
    phase,
    runId,
    sceneId,
    lastOutcome,
    logicReady,
    canContinue,
    attachToEventBus,
    detachGameBus,
    resetSessionMirror,
    refreshCanContinue,
    loadContinueBootstrap,
    pullBootstrapSceneId,
    discardPendingContinue,
    saveProgressForContinue,
    clearSavedProgress,
    requestPause,
    requestResume,
    requestNewRun,
    requestRetry,
  }
})

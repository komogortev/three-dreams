/**
 * Reaction Engine — shared types, interfaces, and event name constants.
 *
 * Stimulus → Condition → Reaction is the single dispatch path for all
 * NPC responses, world events, dialog, and narrative scenarios.
 *
 * Deliberately free of Three.js imports — nothing here touches the renderer.
 */

import type { GamePhase } from '@/game/sessionTypes'

// ─── Stimulus ─────────────────────────────────────────────────────────────────

/**
 * Every trigger input that can wake a registered reaction.
 *
 * Scene modules emit these via the EventBus; the ReactionEngine
 * subscribes and dispatches to the registry. Proximity detection
 * is the scene module's responsibility — it emits when a threshold crosses,
 * not every frame.
 */
export type StimulusType =
  | 'proximity_enter'   // player entered entity's trigger radius
  | 'proximity_exit'    // player left entity's trigger radius
  | 'interact'          // player pressed interact while near entity
  | 'look_at'           // player's look ray hit entity (future)
  | 'flag_changed'      // a mechanic flag was set (payload: { key, value })
  | 'scene_entered'     // scene finished loading (entityId: scene id)
  | 'custom'            // any ad-hoc trigger emitted by scene logic

export interface StimulusEvent {
  type: StimulusType
  /** The entity that receives this stimulus (registry lookup key). */
  entityId: string
  /** Who or what caused the stimulus — 'player', another entityId, or omitted. */
  sourceId?: string
  /** Arbitrary data from the emitter (e.g. flag key/value for flag_changed). */
  payload?: Record<string, unknown>
}

// ─── Conditions ───────────────────────────────────────────────────────────────

/**
 * Guards evaluated before a reaction fires.
 * All conditions in an entry's array must pass (implicit AND).
 * Compose OR logic with multiple ReactionEntries at different priorities.
 */
export type ConditionDef =
  | { kind: 'flag_is';   key: string; value: boolean }
  | { kind: 'phase_is';  phase: GamePhase }
  | { kind: 'once' }
  | { kind: 'cooldown';  seconds: number }
  | { kind: 'not';       condition: ConditionDef }

// ─── Reactions ────────────────────────────────────────────────────────────────

export type ReactionDef =
  | DialogReactionDef
  | AnimationReactionDef
  | SetFlagReactionDef
  | EmitReactionDef
  | SequenceReactionDef
  | WaitReactionDef

// ── Dialog ────────────────────────────────────────────────────────────────────

/**
 * Emits REACTION_EVENTS.DIALOG_START on the EventBus.
 * The UI layer (Vue component) subscribes and renders the dialog.
 * Player-advance is sent back via REACTION_EVENTS.DIALOG_ADVANCE.
 */
export interface DialogReactionDef {
  kind: 'dialog'
  /** EntityId of the speaker, or 'player'. */
  speakerId: string
  lines: DialogLine[]
}

export interface DialogLine {
  text: string
  /**
   * Auto-advance after this many seconds (0 or omitted = wait for player input).
   * Keep consistent with `engine:frame` delta unit (seconds).
   */
  autoAdvanceSeconds?: number
  /** Optional clip name to play on the speaker for this line. */
  animationClip?: string
  /** Mood hint — future lip-sync / facial expression hook. */
  mood?: 'neutral' | 'sad' | 'happy' | 'angry' | 'fearful'
}

// ── Animation ─────────────────────────────────────────────────────────────────

/**
 * Emits 'reaction:play-animation' on the EventBus.
 * Scene modules (NpcModule, future CharacterAnimationRig bridge) subscribe
 * and drive the actual AnimationMixer — the Reaction Engine has no Three.js coupling.
 */
export interface AnimationReactionDef {
  kind: 'animation'
  /** EntityId of the target (NPC, player, or any animated object). */
  entityId: string
  /**
   * Clip name resolved by CharacterAnimationRig (Mixamo internal name).
   * Use this for player-rig targets that went through mixamoRetargetClips.
   */
  clipName?: string
  /**
   * Clip index for NPC GLBs driven by loopClipIndex (SceneDescriptor objects).
   * Use NPC_BASE_ANIM or NPC_EXTENDED_ANIM constants.
   */
  clipIndex?: number
  loop?: boolean
  /** If true, animation is temporary — return to previous clip on complete. */
  transient?: boolean
}

// ── Set flag ──────────────────────────────────────────────────────────────────

/** Calls setFlag(key, value) in the ReactionContext — routed to GameLogicModule. */
export interface SetFlagReactionDef {
  kind: 'set_flag'
  key: string
  value: boolean
}

// ── Emit ──────────────────────────────────────────────────────────────────────

/** Emits an arbitrary event on the shared EventBus. Escape hatch for ad-hoc wiring. */
export interface EmitReactionDef {
  kind: 'emit'
  event: string
  payload?: unknown
}

// ── Sequence ──────────────────────────────────────────────────────────────────

/**
 * Ordered list of reactions with optional per-step delays.
 * Driven by ReactionExecutor.tick(); does not block the frame.
 * Nesting is intentionally one level — sequence steps may not contain sequences.
 */
export interface SequenceReactionDef {
  kind: 'sequence'
  steps: SequenceStep[]
}

export interface SequenceStep {
  reaction: Exclude<ReactionDef, SequenceReactionDef>
  /** Seconds to wait before this step fires (relative to the previous step completing). */
  delaySeconds?: number
}

// ── Wait ──────────────────────────────────────────────────────────────────────

/** Pause inside a sequence. Standalone use is a no-op. */
export interface WaitReactionDef {
  kind: 'wait'
  seconds: number
}

// ─── Registry entry ───────────────────────────────────────────────────────────

export interface ReactionEntry {
  /** All conditions must pass for this entry to fire. */
  conditions: ConditionDef[]
  reaction: ReactionDef
  /**
   * Higher priority entries are evaluated first.
   * The first passing entry fires; lower-priority entries are skipped.
   * Set `stopPropagation: false` to allow multiple entries to fire.
   */
  priority?: number
  /** Allow subsequent lower-priority entries to also fire. Default false. */
  stopPropagation?: boolean
}

// ─── Reaction context ─────────────────────────────────────────────────────────

/**
 * Read/write surface provided to the executor and condition evaluator.
 * Injected at ReactionEngine mount time — no direct module references in the executor.
 */
export interface ReactionContext {
  getFlag(key: string): boolean
  setFlag(key: string, value: boolean): void
  phase: GamePhase
  emit(event: string, payload?: unknown): void
  /** Monotonic simulation time in seconds — used for cooldown condition evaluation. */
  now: number
}

// ─── EventBus names ───────────────────────────────────────────────────────────

export const REACTION_EVENTS = {
  /** Inbound: any system emits this to trigger registry lookup. */
  STIMULUS:          'reaction:stimulus',
  /** Outbound: ReactionExecutor starts a dialog sequence. UI subscribes. */
  DIALOG_START:      'reaction:dialog-start',
  /** Outbound: executor advances to the next line. UI subscribes. */
  DIALOG_LINE:       'reaction:dialog-line',
  /** Outbound: last line of a dialog block completed. */
  DIALOG_END:        'reaction:dialog-end',
  /** Inbound: UI or input layer signals player pressed to advance dialog. */
  DIALOG_ADVANCE:    'reaction:dialog-advance',
  /** Outbound: animation reaction dispatched to scene layer. */
  PLAY_ANIMATION:    'reaction:play-animation',
  /** Outbound: a named sequence started. Payload: { entityId?, sequenceId? } */
  SEQUENCE_START:    'reaction:sequence-start',
  /** Outbound: a named sequence completed all steps. */
  SEQUENCE_END:      'reaction:sequence-end',
} as const

export type ReactionEventName = (typeof REACTION_EVENTS)[keyof typeof REACTION_EVENTS]

// ─── Payload shapes for bus events ───────────────────────────────────────────

export interface DialogStartPayload {
  speakerId: string
  lines: DialogLine[]
}

export interface PlayAnimationPayload {
  entityId: string
  clipName?: string
  clipIndex?: number
  loop: boolean
  transient: boolean
}

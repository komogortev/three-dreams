export { ReactionEngine, type ReactionEngineOptions } from './ReactionEngine'
export { ReactionRegistry } from './ReactionRegistry'
export { ReactionExecutor } from './ReactionExecutor'
export {
  evaluateConditions,
  newConditionState,
  recordFired,
  type ConditionState,
} from './ConditionEvaluator'
export {
  REACTION_EVENTS,
  type ReactionEventName,
  type StimulusType,
  type StimulusEvent,
  type ConditionDef,
  type ReactionDef,
  type ReactionEntry,
  type ReactionContext,
  type DialogReactionDef,
  type DialogLine,
  type AnimationReactionDef,
  type SetFlagReactionDef,
  type EmitReactionDef,
  type SequenceReactionDef,
  type SequenceStep,
  type WaitReactionDef,
  type DialogStartPayload,
  type PlayAnimationPayload,
} from './types'

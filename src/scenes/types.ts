import type { GameplaySceneConfig } from '@/modules/GameplaySceneModule'

/**
 * Scene-local gameplay overrides — spread into {@link GameplaySceneModule} constructor.
 *
 * Defined here (not in gameplayPolicy.ts) so scene files can import the type without
 * creating a circular dependency through the registry.
 */
export type SceneGameplayPolicy = Pick<
  GameplaySceneConfig,
  | 'secretDoubleJump'
  | 'maxWalkableSlopeDeg'
  | 'cliffDropCatchThreshold'
  | 'exitZones'
  | 'sunOrb'
  | 'npcStubs'
  | 'fallRespawn'
>

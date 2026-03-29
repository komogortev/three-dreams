import { getSceneEntry } from '@/scenes/registry'

export type { SceneGameplayPolicy } from '@/scenes/types'

/**
 * Returns the scene-local gameplay overrides for a given scene ID.
 * Config is co-located in each scene's index.ts and registered via the scene registry.
 * Spread the result into GameplaySceneModule constructor to activate scene mechanics.
 */
export function getSceneGameplayPolicy(sceneId: string) {
  return getSceneEntry(sceneId)?.gameplay
}

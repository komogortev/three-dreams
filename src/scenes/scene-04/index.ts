import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'
import { dreamWorld } from '@/scenes/atmosphereProfiles'

/**
 * Scene 04 — Roksana (Dream World / structural placeholder).
 *
 * Content is intentionally minimal. This scene requires a dedicated polishing
 * pass before it can be built. Entry/exit contracts are stable — the slot is
 * registered so scene transitions compile cleanly.
 *
 * Placeholder GLBs exist in public/scenes/scene-04/ but are very large
 * (33–57 MB for terrain assets). Performance review required before use.
 * This descriptor uses procedural terrain only until content is approved.
 *
 * Trigger: start building when Roksana polishing pass is complete.
 */
export const scene04: SceneDescriptor = {
  terrain: {
    radius: 60,
    resolution: 64,
    seaLevel: -10,
    baseColor: 0x2a3040,
  },
  atmosphere: dreamWorld,
  character: {
    startPosition: [0, 0],
    modelUrl: encodeURI('/Remy.fbx'),
    modelScale: 1,
    modelFitHeight: 1.78,
    pruneExtraSkinnedMeshes: false,
    rotationY: 0,
    animationClipUrls: [...MIXAMO_FBX_CLIP_URLS],
  },
}

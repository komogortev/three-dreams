import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'
import { dreamWorld } from '@/scenes/atmosphereProfiles'
import type { SceneGameplayPolicy } from '@/scenes/types'

/**
 * Scene 02 — The Cliff (Dream World / Enter Dreams).
 *
 * Visual: procedural heightmap terrain; no GLB yet (cliff asset missing).
 * Atmosphere: dreamWorld — cold, desaturated, dense blue-grey fog.
 * Mechanics: secretDoubleJump — mid-fall second jump exits the scene.
 *
 * No objects — the cliff is stark and intentionally empty.
 * Death trigger (fall → respawn) wired via GameLogicModule in Phase 4A.
 */
export const scene02: SceneDescriptor = {
  terrain: {
    radius: 50,
    resolution: 180,
    seaLevel: -20,
    baseColor: 0x2a3540,
    features: [
      {
        type: 'heightmap',
        url: '/terrains/heatmap-scene-1.png',
        amplitude: 10,
      },
    ],
  },
  atmosphere: dreamWorld,
  character: {
    startPosition: [0, 0],
    modelUrl: encodeURI('/Remy.fbx'),
    modelScale: 1,
    modelFitHeight: 1.78,
    pruneExtraSkinnedMeshes: false,
    rotationY: Math.PI,
    animationClipUrls: [...MIXAMO_FBX_CLIP_URLS],
  },
}

/**
 * Scene 02 gameplay: the secret double-jump mechanic.
 *
 * Player discovers that a mid-fall second jump exits the endless cliff loop.
 * This is the scene's core mechanic and the game's first mechanical statement.
 * Spread into GameplaySceneModule constructor via registry.
 */
export const gameplay: SceneGameplayPolicy = {
  secretDoubleJump: {
    enabled: true,
    activationCenterX: 0,
    activationCenterZ: 0,
    activationRadius: 48,
    requiredDirectionX: 1,
    requiredDirectionZ: 0,
    minDirectionDot: 0.62,
    preFallVyThreshold: -0.2,
    postFallGraceSeconds: 0.34,
    slowmoScale: 0.36,
    slowmoMaxSeconds: 1.5,
  },
}

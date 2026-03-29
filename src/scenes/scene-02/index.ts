import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'
import { dreamWorld } from '@/scenes/atmosphereProfiles'
import type { SceneGameplayPolicy } from '@/scenes/types'

/**
 * Scene 02 — The Cliff (Dream World / Enter Dreams).
 *
 * Visual: procedural heightmap terrain; no cliff GLB yet (asset pending).
 * Atmosphere: dreamWorld — cold, desaturated, dense blue-grey fog.
 * Mechanics: secretDoubleJump — mid-fall second jump exits the endless loop.
 *
 * Objects: editor-sourced scatter forest (lost-in-woods placeholder).
 * Rocks and stone pile anchor the hilltop. Trees populate the western slopes.
 * Fall below Y threshold → respawn at heightmap peak (GameplaySceneModule fallRespawn).
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
  // ── Lost-in-woods placeholder — editor-placed objects from the original
  // scene playground session. Cliff GLB pending; trees give the player
  // something to navigate through during the soft-death loop.
  objects: [
    {
      type: 'scatter',
      primitive: 'tree',
      count: 12,
      centerX: -40.5,
      centerZ: 0,
      innerRadius: 0,
      outerRadius: 12,
      scaleMin: 1.8,
      scaleMax: 2.7,
      seed: 1753081254,
    },
    {
      type: 'scatter',
      primitive: 'tree',
      count: 27,
      centerX: -36,
      centerZ: -26,
      innerRadius: 0,
      outerRadius: 17,
      scaleMin: 1.2,
      scaleMax: 1.85,
      seed: 2054067398,
    },
    {
      type: 'scatter',
      primitive: 'tree',
      count: 39,
      centerX: -38.5,
      centerZ: 19,
      innerRadius: 0,
      outerRadius: 12,
      scaleMin: 1.15,
      scaleMax: 1.9,
      seed: 3573289182,
    },
    {
      type: 'scatter',
      primitive: 'tree',
      count: 37,
      centerX: -26,
      centerZ: 33,
      innerRadius: 0,
      outerRadius: 12,
      scaleMin: 0.95,
      scaleMax: 1.6,
      seed: 43290863,
    },
    { type: 'rock', x: -8,  z: -12, scale: 3.2, rotationY: 0.8 },
    { type: 'rock', x:  6,  z:   8, scale: 2.0, rotationY: 2.1 },
    { type: 'rock', x: -18, z:   6, scale: 4.0, rotationY: 0.3 },
    {
      type: 'gltf',
      url: '/models/dirty_stones_pile.glb',
      x: -0.72,
      z: 8.16,
      scale: 1,
      rotationY: 4.61,
    },
  ],
}

/**
 * Scene 02 gameplay: the secret double-jump mechanic.
 *
 * Player discovers that a mid-fall second jump exits the endless cliff loop.
 * This is the scene's core mechanic and the game's first mechanical statement.
 * Spread into GameplaySceneModule constructor via registry.
 */
export const gameplay: SceneGameplayPolicy = {
  // ── Exit: ring on cliff hill top → lake scene (scene-03). ────────────────
  // Heightmap centre (0,0) is the terrain peak — sampler returns ~Y:10 here.
  // Previous position z:22 was near-edge low terrain, below seaLevel → ring sank.
  exitZones: [
    { x: 10, y: 8.6, z: -0.2, radius: 3, targetSceneId: 'scene-03', ringColor: 0x88ccff },
  ],

  // Void fall — narrative reset to rock top (endless loop until double-jump discovered).
  // mode: 'fixed' — always returns to the same rock; zone respawn is not appropriate here.
  fallRespawn: {
    triggerBelowY: -15,
    mode: 'fixed',
    respawnX: 0,
    respawnZ: 0,
  },

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

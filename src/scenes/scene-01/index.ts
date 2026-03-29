import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'
import { realWorld } from '@/scenes/atmosphereProfiles'
import type { SceneGameplayPolicy } from '@/scenes/types'

/** Mixamo Remy (skin) — path must be `encodeURI` if it contains spaces. */
export const MIXAMO_REMY_FBX = encodeURI('/Remy.fbx')

/** Mixamo clips under `public/fbx/` merged onto Remy (same rig). */
export const MIXAMO_ANIMATION_CLIP_URLS: string[] = [...MIXAMO_FBX_CLIP_URLS]

/**
 * Scene 01 gameplay overrides.
 * High slope limit — the hill is steep and fully explorable off-path.
 * Default PlayerController cap is 35°; 55° covers the full hill face.
 */
export const gameplay: SceneGameplayPolicy = {
  maxWalkableSlopeDeg: 55,
  cliffDropCatchThreshold: 2.6,
}

/**
 * Navigation / collision mesh for scene 01.
 * Extracted from house_on_the_hill.glb in Blender — ground, road, house shell, fences.
 * Same transform as the visual GLB so raycasting aligns to rendered surfaces.
 */
export const navigationMesh = {
  url: '/scenes/scene-01/house_on_the_hill_mesh_ground.glb',
  x: 10.39,
  y: 0,
  z: -21.24,
  scale: 1.7,
  rotationY: -1.43,
} as const

/**
 * Scene 01 — House on the Hill (Real World).
 *
 * Visual: house_on_the_hill.glb overlay; heightmap drives physics ground.
 * Atmosphere: realWorld — amber-ochre fog, cold autumn, static sky.
 * Character: adult Remy, spawns at base of hill.
 *
 * Blender prep target: extract ground mesh from GLB for exact physics.
 * Dead sun: emissive disk mesh — added as NPC/object stub in Phase 4A.
 */
export const scene01: SceneDescriptor = {
  terrain: {
    radius: 90,
    resolution: 128,
    seaLevel: 0,
    baseColor: 0xdcc495,
    baseOpacity: 0,
    waterColor: 0x0a1c38,
    waterOpacity: 0,
    features: [
      {
        type: 'heightmap',
        url: '/terrains/heatmap-scene-02.png',
        amplitude: 10,
        offsetZ: -22,
      },
    ],
  },
  atmosphere: realWorld,
  character: {
    startPosition: [4, 8],
    modelUrl: MIXAMO_REMY_FBX,
    modelScale: 1,
    modelFitHeight: 1.78,
    pruneExtraSkinnedMeshes: false,
    rotationY: Math.PI,
    animationClipUrls: MIXAMO_ANIMATION_CLIP_URLS,
  },
  objects: [
    {
      type: 'gltf',
      url: '/scenes/scene-01/house_on_the_hill.glb',
      x: 10.39,
      z: -21.24,
      scale: 1.7,
      rotationY: -1.43,
      allowBelowSeaLevel: true,
    },
  ],
}

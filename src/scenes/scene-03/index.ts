import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'
import { realWorldWarm } from '@/scenes/atmosphereProfiles'
import type { SceneGameplayPolicy } from '@/scenes/types'

const GLB_SCALE = 1.7

/**
 * Navigation / collision mesh for scene 03.
 * Extracted from house_on_lake.glb in Blender — ground, dock, shore, walkable surfaces.
 *
 * Current size: ~50 KB after Blender cleanup (hidden layers removed, solid objects excluded).
 */
export const navigationMesh = {
  url: '/scenes/scene-03/house_on_the_lake_ground_mesh.glb',
  scale: GLB_SCALE,
} as const

/**
 * Scene 03 gameplay overrides.
 * Gentle lakeside terrain — default 35° slope limit is adequate.
 */
export const gameplay: SceneGameplayPolicy = {
  // ── Exit: circle next to house → return to scene-01 (full loop). ─────────
  // PLACEHOLDER — walk to the house, read x/z from HUD, paste here.
  exitZones: [
    { x: 0.6, y: -0.7, z: -8.5, radius: 3, targetSceneId: 'scene-01', ringColor: 0xffaa44 },
  ],
}

/**
 * Scene 03 — House on the Lake (Real World / Memory).
 *
 * Visual: house_on_lake.glb at 1.7× scale; procedural terrain suppressed (GLB provides ground).
 * Atmosphere: realWorldWarm — warmer summer-autumn palette, lighter fog.
 * Character: child avatar placeholder (Remy at child scale until avatar switching ships).
 * Spawn: shoreside, facing the lake and young dad activity area.
 *
 * Phase 4A: NPC spawn stub for young dad.
 * Phase 4B: photographable moment markers, phone recovery pocket trigger.
 */
export const scene03: SceneDescriptor = {
  terrain: {
    radius: 160,
    resolution: 64,
    seaLevel: -100,
    baseColor: 0x4a6a3a,
    baseOpacity: 0,
    waterColor: 0x2a5a7a,
    waterOpacity: 0,
    features: [],
  },
  atmosphere: realWorldWarm,
  character: {
    startPosition: [0, 55],
    modelUrl: encodeURI('/Remy.fbx'),
    modelScale: 1,
    modelFitHeight: 1.78,
    pruneExtraSkinnedMeshes: false,
    rotationY: Math.PI,
    animationClipUrls: [...MIXAMO_FBX_CLIP_URLS],
  },
  objects: [
    {
      type: 'gltf',
      url: '/scenes/scene-03/house_on_the_lake.glb',
      x: 0,
      z: 0,
      scale: GLB_SCALE,
      rotationY: 0,
      allowBelowSeaLevel: true,
    },
  ],
  swimmableVolumes: [
    {
      bounds: { minX: -41, maxX: 41, minZ: -41, maxZ: 41 },
      surfaceY: 0,
      label: 'lake',
    },
  ],
}

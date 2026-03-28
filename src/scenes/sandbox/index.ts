import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'

const MIXAMO_REMY_FBX = encodeURI('/Remy.fbx')

/**
 * Physics / animation sandbox — 100 × 100 m flat arena.
 *
 *  Landing-tier platforms (X ≈ −28, arrayed north → south):
 *    soft      2 m  | medium  4 m  | hard  7 m  | critical  11 m  | fatal  22 m
 *
 *  Pool (X 15–25, Z −25–25):
 *    River channel 10 m wide × 50 m; floor slopes from Y = 0 (north) to Y = −25 m (south).
 *    SwimmableVolume declared at surfaceY = 0.
 *
 *  Obstacles (X 5 and 9, Z −5):
 *    Knee-height bump (0.5 m) — traversable with 35° slope threshold.
 *    Body-height bump (1.8 m) — triggers wall stumble.
 */
export const sandboxScene: SceneDescriptor = {
  terrain: {
    radius: 50,
    resolution: 100,
    // Low seaLevel prevents the terrain renderer from drawing a global water plane.
    // The pool water surface is rendered explicitly by SandboxSceneModule.
    seaLevel: -100,
    baseColor: 0x222831,
    waterColor: 0x0d2b45,
    waterOpacity: 0.82,
    // All geometry built programmatically by SandboxSceneModule.
  },

  atmosphere: {
    dynamicSky: false,
    fogColor: 0x111827,
    fogDensity: 0.006,
    ambientColor: 0x8899aa,
    ambientIntensity: 1.2,
    hemisphereSkyColor: 0xc4d8f0,
    hemisphereGroundColor: 0x2d3748,
    hemisphereIntensity: 0.7,
    time: { initialPhase: 0.25, phaseSpeed: 0 },
    sunMoon: { sunIntensity: 1.4, moonIntensity: 0 },
  },

  character: {
    // South of all ramp bases (ramps approach from z=20; character faces north).
    startPosition: [0, 30],
    modelUrl: MIXAMO_REMY_FBX,
    modelScale: 1,
    modelFitHeight: 1.78,
    pruneExtraSkinnedMeshes: false,
    rotationY: Math.PI,
    animationClipUrls: [...MIXAMO_FBX_CLIP_URLS],
  },

  swimmableVolumes: [
    { bounds: { minX: 15, maxX: 25, minZ: -25, maxZ: 25 }, surfaceY: 0, label: 'sandbox-pool' },
  ],
}

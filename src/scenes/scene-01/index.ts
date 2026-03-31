import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'
import { realWorld } from '@/scenes/atmosphereProfiles'
import type { SceneGameplayPolicy } from '@/scenes/types'
import { NPC_CHARACTER_URLS } from '@/characters/npcUrls'

/** Mixamo Remy (skin) — path must be `encodeURI` if it contains spaces. */
export const MIXAMO_REMY_FBX = encodeURI('/Remy.fbx')

/** Mixamo clips under `public/fbx/` merged onto Remy (same rig). */
export const MIXAMO_ANIMATION_CLIP_URLS: string[] = [...MIXAMO_FBX_CLIP_URLS]

/** GLB world transform — shared by visual mesh, nav mesh, and derived world positions. */
const GLB_SCALE    = 1.955   // 1.7 × 1.15 (+15 %)
const GLB_X        = 10.39
const GLB_Z        = -21.24
const GLB_ROTATION = -1.43

/**
 * Scene 01 gameplay overrides.
 * High slope limit — the hill is steep and fully explorable off-path.
 * Default PlayerController cap is 35°; 55° covers the full hill face.
 */
export const gameplay: SceneGameplayPolicy = {
  maxWalkableSlopeDeg: 55,
  cliffDropCatchThreshold: 2.6,

  // ── Dead sun — amber disk motionless in the sky above the hill. ──────────
  sunOrb: {
    x: 30,
    y: 70,
    z: -80,
    radius: 14,
    color: 0xff8c00,
  },

  // ── Exit btn: stand on hilltop ring → enter dream world (scene-02). ─────
  // Positions scaled 1.15× outward from GLB origin (10.39, -21.24).
  exitZones: [
    { x: 5, y: 22.8, z: -36, radius: 3, targetSceneId: 'scene-02' },
  ],

  // Dad (old form) — on the ascent path between road spawn and hilltop exit (tune with dev HUD).
  npcStubs: [
    { x: -18, z: -14, color: 0x5c5348, capsuleLength: 0.75, capsuleRadius: 0.26 },
  ],
}

/**
 * Navigation / collision mesh for scene 01.
 * Extracted from house_on_the_hill.glb in Blender — ground, road, house shell, fences.
 * Same transform as the visual GLB so raycasting aligns to rendered surfaces.
 */
export const navigationMesh = {
  url: '/scenes/scene-01/house_on_the_hill_mesh_ground.glb',
  x: GLB_X,
  y: 0,
  z: GLB_Z,
  scale: GLB_SCALE,
  rotationY: GLB_ROTATION,
} as const

/**
 * Scene 01 — House on the Hill (Real World).
 *
 * Visual: house_on_the_hill.glb overlay; heightmap drives physics ground.
 * Atmosphere: realWorld — amber-ochre fog, cold autumn, static sky.
 * Character: adult Remy, spawns on road at base of hill slope.
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
    startPosition: [-52, 9],
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
      url: '/scenes/scene-01/house_on_the_hill_4k.glb',
      x: GLB_X,
      z: GLB_Z,
      scale: GLB_SCALE,
      rotationY: GLB_ROTATION,
      allowBelowSeaLevel: true,
    },
    // ── Father (60yo) on the ascent path. Position matches npcStub fallback. ─
    // Scale / rotationY need visual tuning. No loopClipNameContains → plays clip[0] first.
    {
      type: 'gltf',
      url: NPC_CHARACTER_URLS.father60,
      x: -18,
      z: -14,
      scale: 2.5,
      y: 0,
      rotationY: -Math.PI * (11 / 18), // −110° CW
      playEmbeddedAnimations: true,
      loopClipNameContains: 'look_around',
    },
  ],
}

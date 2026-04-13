import type { SceneDescriptor } from '@base/scene-builder'
import { realWorldWarm } from '@/scenes/atmosphereProfiles'
import type { SceneGameplayPolicy } from '@/scenes/types'
import { NPC_CHARACTER_URLS, NPC_ANIM_URLS, npcAnimPacks, NPC_BASE_ANIM } from '@/characters/npcUrls'

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
  debugClipResolution: true,
  // ── Exit: circle next to house → return to scene-01 (full loop). ─────────
  exitZones: [
    { x: 0.6, y: -0.7, z: -8.5, radius: 3, targetSceneId: 'scene-01', ringColor: 0xffaa44 },
  ],
  // Capsule kept as positional fallback if GLB fails to load.
  npcStubs: [
    { x: 6.5, z: 4.6, y: -0.2, color: 0xc4785c, capsuleLength: 0.72, capsuleRadius: 0.26 },
  ],
}

/**
 * Scene 03 — House on the Lake (Real World / Memory).
 *
 * Visual: house_on_lake.glb at 1.7× scale; procedural terrain suppressed (GLB provides ground).
 * Atmosphere: realWorldWarm — warmer summer-autumn palette, lighter fog.
 * Character: child avatar (`npc-boy-5yo-outdoors.glb`) + shared Mixamo locomotion clips.
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
    startPosition: [8.2, 5.4],
    modelUrl: NPC_CHARACTER_URLS.boy5yOutdoors,
    modelScale: 1,
    /** ~standing height for 5yo vs 1.78m adult Remy — tune with `debugCharacterBounds` if needed. */
    modelFitHeight: 1.12,
    pruneExtraSkinnedMeshes: false,
    terrainFootprintRadius: 0.14,
    rotationY: Math.PI / 2, // 90°
    // GLB character — use shared GLB animation pack, not Mixamo FBX sidecar clips.
    // FBX clips do not retarget to the boy GLB skeleton; the GLB pack does.
    animationClipUrls: [NPC_ANIM_URLS.base],
    // animations_base.glb exports Blender NLA default names ("NlaTrack", "NlaTrack.001" …).
    // Regex patterns in locomotionClipAssignments.ts match Mixamo names only — index overrides
    // are required. Indices verified via NPC animation cycling overlay (2026-04-05).
    locomotionClipIndices: { idleStand: NPC_BASE_ANIM.idle, walkFwdStand: NPC_BASE_ANIM.walk, runFwdStand: NPC_BASE_ANIM.run },
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
    // ── Dad (40yo, outdoors) by the dock.
    {
      type: 'gltf',
      url: NPC_CHARACTER_URLS.man40yOutdoors,
      x: 6.5,
      y: -0.2,
      z: 4.6,
      scale: 1.89,
      rotationY: Math.PI * 0.25,
      allowBelowSeaLevel: true,
      animationPackUrls: npcAnimPacks(),
      loopClipIndex: NPC_BASE_ANIM.idle,
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

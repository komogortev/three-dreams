import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'
import { realWorld } from '@/scenes/atmosphereProfiles'

/**
 * Scene 05 — Return (Real World / House on the Hill, revisited).
 *
 * Reuses scene-01's hill GLB and heightmap — same physical location,
 * different emotional context. The bench and elder NPCs are Phase 4A stubs.
 * Player arrives from a different angle than scene-01 (recognizes the place).
 *
 * Phase 4A: elder NPC spawn stubs (primitive meshes), bench placeholder.
 * Phase 4C: Win A proximity trigger (phone → elders), lose grace period.
 * Phase 4D: Win B discoverable trigger, dad recognition reward.
 */
export const scene05: SceneDescriptor = {
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
    startPosition: [-10, -10],
    modelUrl: encodeURI('/Remy.fbx'),
    modelScale: 1,
    modelFitHeight: 1.78,
    pruneExtraSkinnedMeshes: false,
    rotationY: 0,
    animationClipUrls: [...MIXAMO_FBX_CLIP_URLS],
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

/**
 * Canonical public URLs for shared NPC GLBs (`public/characters/npc/`).
 * Father variants share the same Tripo skeleton (40 vs 60).
 * When a GLB ships **embedded** clips, place it via `SceneDescriptor.objects` `{ type: 'gltf', playEmbeddedAnimations: true, ... }` (see `@base/scene-builder` `GltfObject`).
 */
export const NPC_CHARACTER_URLS = {
  /** Same person ~40 (middle age); use e.g. scene-03 young-dad beat. Replaces legacy `father-40.glb`. */
  father40: '/characters/npc/npc-father-40yo.glb',
  /** Same person ~60 (elder); use e.g. scene-01 / scene-05. */
  father60: '/characters/npc/npc-father-60yo.glb',
} as const

/**
 * Canonical public URLs for shared NPC GLBs (`public/characters/npc/`).
 * Father variants share the same Tripo skeleton (40 vs 60).
 * When a GLB ships **embedded** clips, place it via `SceneDescriptor.objects` `{ type: 'gltf', playEmbeddedAnimations: true, ... }` (see `@base/scene-builder` `GltfObject`).
 */
/**
 * Naming: `npc-<role>-<variant>.glb` (kebab-case) under `public/characters/npc/`.
 * All GLBs are pre-optimized via gltf-transform (WebP textures ≤1024px + meshopt compression).
 * Source Blender exports live outside `public/`; run `scripts/optimize-glb.sh` on new exports.
 */
export const NPC_CHARACTER_URLS = {
  /** Same person ~40 (middle age); scene-03 young dad — outdoor / lake-appropriate outfit. */
  father40: '/characters/npc/npc-father-40yo-outdoor.glb',
  /** Same person ~60 (elder); scene-01 / scene-05. Carries embedded animation clips. */
  father60: '/characters/npc/npc-father-60yo.glb',
  /**
   * Child body for scene-03 memory (player avatar). Tripo export; Mixamo clip retargeting
   * matches the father NPC pipeline (`SceneBuilder.buildCharacter`).
   */
  childBoy5: '/characters/npc/npc-boy-5yo.glb',
  /** Secondary NPC for scene-01; wiring pending (move from scene-01/ completed). */
  oldMan: '/characters/npc/npc-old-man.glb',
} as const

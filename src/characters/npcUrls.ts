/**
 * Canonical public URLs for shared NPC GLBs (`public/characters/npc/`).
 *
 * Naming: `npc-<role>-<variant>.glb` (kebab-case, generic role — not relationship-specific).
 * All GLBs are pre-optimized via gltf-transform (WebP textures ≤1024px + meshopt compression).
 * Source Blender exports live outside `public/`; run `scripts/optimize-glb.sh` on new exports.
 *
 * Animation packs (`animations_base.glb`, `animations_extended.glb`) are separate from meshes.
 * Use `npcAnimPacks()` to get the correct URL list for a given NPC placement.
 */

// ─── Character meshes ─────────────────────────────────────────────────────────

export const NPC_CHARACTER_URLS = {
  /**
   * Man ~60yo, casual winter outfit. Elder form of the dad arc.
   * Scene-01 (path to hilltop) + scene-05 (park bench).
   * Carries **embedded** clips — use `{ playEmbeddedAnimations: true }` on the GltfObject
   * until the shared animation pack pipeline fully replaces embedded clips.
   */
  man60yCasual: '/characters/npc/npc-man-60yo-casual.glb',

  /**
   * Man ~40yo, outdoor / lakeside outfit. Young form of the dad arc.
   * Scene-03 (house on the lake, dock area). No embedded clips — driven by animation pack.
   */
  man40yOutdoors: '/characters/npc/npc-man-40yo-outdoors.glb',

  /**
   * Boy ~5yo, outdoor outfit. Player avatar in scene-03 (childhood memory).
   * No embedded clips — driven by shared Mixamo locomotion pack.
   */
  boy5yOutdoors: '/characters/npc/npc-boy-5yo-outdoors.glb',
} as const

// ─── Animation packs ──────────────────────────────────────────────────────────

/**
 * Shared animation pack URLs. All packs live in `public/characters/npc/`
 * alongside the mesh GLBs so a single CDN path covers both.
 *
 * `base`     — idle + locomotion set; loaded for every animated NPC.
 * `extended` — social emotes, gestures, scene-specific actions; loaded only
 *              when a scene descriptor requests it (`npcAnimPacks({ extended: true })`).
 */
export const NPC_ANIM_URLS = {
  base:     '/characters/npc/animations_base.glb',
  extended: '/characters/npc/animations_extended.glb',
} as const

/**
 * Returns the animation pack URL array for an NPC placement.
 *
 * @example
 * // Default — idle/locomotion only (most NPCs)
 * animationPackUrls: npcAnimPacks()
 *
 * @example
 * // Extended — scene requests social/emote clips (e.g. scene-05 bench conversation)
 * animationPackUrls: npcAnimPacks({ extended: true })
 */
export function npcAnimPacks(opts?: { extended?: boolean }): string[] {
  return opts?.extended
    ? [NPC_ANIM_URLS.base, NPC_ANIM_URLS.extended]
    : [NPC_ANIM_URLS.base]
}

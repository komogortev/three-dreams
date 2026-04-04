/**
 * Phone profile definitions — the three player archetypes presented at the main menu.
 *
 * The selected phone is stored in `useInventoryStore` and persists across sessions.
 * It influences how NPCs and the environment respond to the player (TBD per scene).
 *
 * GLBs live in `public/models/` — pre-optimized via gltf-transform (WebP 1024px + meshopt).
 * Source Blender exports outside `public/`; run `scripts/optimize-glb.sh` on re-exports.
 */

export type PhoneProfileId = 'extreme' | 'pragmatic' | 'comfortable'

export interface PhoneProfile {
  id: PhoneProfileId
  /** Display name shown under the phone in the menu. */
  label: string
  /** Short one-line flavour text. */
  tagline: string
  /** Slightly longer description shown on expand. */
  description: string
  /** Public URL of the compressed GLB. */
  glbUrl: string
  /** Tailwind background class for the panel accent/glow. */
  panelClass: string
  /** Hex accent for glow / border when selected. */
  accentHex: string
}

export const PHONE_PROFILES: readonly PhoneProfile[] = [
  {
    id: 'pragmatic',
    label: 'Pragmatic',
    tagline: 'Function over form',
    description: 'You see what actually matters.',
    glbUrl: '/models/phone_profile_pragmatic.glb',
    panelClass: 'border-sky-500/50 shadow-sky-900/40',
    accentHex: '#38bdf8',
  },
  {
    id: 'comfortable',
    label: 'Comfortable',
    tagline: 'Warm signal',
    description: 'You hold people close.',
    glbUrl: '/models/phone_profile_comfortable.glb',
    panelClass: 'border-amber-400/50 shadow-amber-900/40',
    accentHex: '#fbbf24',
  },
  {
    id: 'extreme',
    label: 'Extreme',
    tagline: 'Sharp edges, no regrets',
    description: 'You move fast and leave marks behind.',
    glbUrl: '/models/phone_profile_extreme.glb',
    panelClass: 'border-red-500/50 shadow-red-900/40',
    accentHex: '#ef4444',
  },
] as const

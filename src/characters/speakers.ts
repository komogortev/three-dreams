/**
 * Speaker metadata registry — maps entity IDs to display names and UI hints.
 *
 * Used by DialogPanel to show human-readable names instead of raw entity IDs.
 */

export interface SpeakerMeta {
  displayName: string
  /** CSS color for the speaker name label. */
  color?: string
}

export const SPEAKERS: Record<string, SpeakerMeta> = {
  'npc-dad-scene-01': { displayName: 'Dad', color: '#a0c4ff' },
  'player':           { displayName: 'You', color: '#caffbf' },
}

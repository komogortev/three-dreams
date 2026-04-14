/**
 * Scene-01 reaction definitions — House on the Hill.
 *
 * Authored data only. No engine imports, no Three.js.
 * Registered into ReactionEngine at scene mount in SceneView.vue.
 */

import type { StimulusType, ReactionEntry } from '@/reaction'
import { NPC_EXTENDED_ANIM } from '@/characters/npcUrls'

export const DAD_SCENE_01_ID = 'npc-dad-scene-01'

export const dadScene01Reactions: Array<{ stimulus: StimulusType; entry: ReactionEntry }> = [
  // ── First proximity approach — look around + opening line ────────────────────
  {
    stimulus: 'proximity_enter',
    entry: {
      priority: 10,
      conditions: [{ kind: 'once' }],
      reaction: {
        kind: 'sequence',
        steps: [
          {
            reaction: {
              kind: 'animation',
              entityId: DAD_SCENE_01_ID,
              clipIndex: NPC_EXTENDED_ANIM.look_around,
              loop: false,
              transient: true,
            },
          },
          {
            delaySeconds: 1.0,
            reaction: {
              kind: 'dialog',
              speakerId: DAD_SCENE_01_ID,
              lines: [
                { text: 'Ah.' },
                { text: 'There you are.' },
              ],
            },
          },
          {
            delaySeconds: 0.1,
            reaction: { kind: 'set_flag', key: 'dad_scene01_greeted', value: true },
          },
        ],
      },
    },
  },

  // ── Repeat proximity — silent idle loop ──────────────────────────────────────
  {
    stimulus: 'proximity_enter',
    entry: {
      priority: 0,
      conditions: [
        { kind: 'flag_is', key: 'dad_scene01_greeted', value: true },
        { kind: 'cooldown', seconds: 20 },
      ],
      reaction: {
        kind: 'animation',
        entityId: DAD_SCENE_01_ID,
        clipIndex: NPC_EXTENDED_ANIM.look_around,
        loop: false,
        transient: true,
      },
    },
  },

  // ── Interact before greeting (shouldn't fire — once blocks proximity first) ──
  {
    stimulus: 'interact',
    entry: {
      priority: 5,
      conditions: [{ kind: 'flag_is', key: 'dad_scene01_greeted', value: false }],
      reaction: {
        kind: 'dialog',
        speakerId: DAD_SCENE_01_ID,
        lines: [{ text: '...' }],
      },
    },
  },

  // ── Interact after greeting — direction hint ─────────────────────────────────
  {
    stimulus: 'interact',
    entry: {
      priority: 10,
      conditions: [
        { kind: 'flag_is', key: 'dad_scene01_greeted', value: true },
        { kind: 'flag_is', key: 'dad_scene01_hint_given', value: false },
      ],
      reaction: {
        kind: 'sequence',
        steps: [
          {
            reaction: {
              kind: 'dialog',
              speakerId: DAD_SCENE_01_ID,
              lines: [
                { text: 'Come.' },
                { text: 'I want to show you something.' },
                { text: 'Up the hill. You\'ll see.' },
              ],
            },
          },
          {
            delaySeconds: 0.1,
            reaction: { kind: 'set_flag', key: 'dad_scene01_hint_given', value: true },
          },
        ],
      },
    },
  },

  // ── Interact repeat — minimal response ───────────────────────────────────────
  {
    stimulus: 'interact',
    entry: {
      priority: 0,
      conditions: [
        { kind: 'flag_is', key: 'dad_scene01_greeted', value: true },
        { kind: 'cooldown', seconds: 8 },
      ],
      reaction: {
        kind: 'dialog',
        speakerId: DAD_SCENE_01_ID,
        lines: [{ text: 'The path is this way.' }],
      },
    },
  },
]

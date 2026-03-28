# Scene 02 — The Cliff (Enter Dreams)

_World Plane: Dream World_
_Source scenario: SCENARIOS/enter dreams_

---

## Identity

| Field | Value |
|---|---|
| World | Dream (realistic rendering — cold, foggy, uncomfortable) |
| Location | A hilltop at a cliff edge. Floating. Enclosed. |
| Player avatar | Same character, dream physics apply |
| NPCs | None |
| Scene position | First dream sequence. Teaches dream-plane physics. |

---

## Visual Register

- Realistic rendering — cold, desaturated, fog-heavy
- The cliff is the scene's boundary and its only exit
- Scale may be dream-distorted — the rock feels larger, the drop longer, than geometry suggests
- [TBD: what is visible below the cliff? Water? Rock? Fog that obscures the bottom?]
- Movement feels slightly underwater — sluggish, endless. Dream physics before the player learns them.

---

## NPCs

None. The player is alone on the cliff.

---

## Core Mechanic — Discovery of Double Jump

**The Endless Loop.** Player arrives on the rock. They can walk, they can circle the edge. The loop is genuinely endless — nothing forces forward progress. This is intentional. The player must choose to try something.

**The False Exit.** Jumping off the cliff kills the character. Crashes into water or rock below. The player has confirmed that normal physics apply to normal jumping.

**The Discovery.** During a jump — after leaving the platform, in the downward arc — the player presses jump again. Instead of a second futile movement, they are transported. Scene transition triggers. The double jump *in the act of falling* is the exit.

**What this teaches:** In the dream world, your second attempt during failure is not futile — it is the mechanism. The mechanic is the theme.

---

## Discoverable Mechanics

The double jump itself is the discoverable mechanic. It is never announced. No prompt appears. The player must discover that:
1. The only way out is to jump
2. Normal jumping fails
3. Jumping again during the fall succeeds

[TBD: Is there any environmental hint — a sound, a visual echo, something in the cliff's geometry — that suggests the mid-fall jump without stating it? The discovery should feel earned but not arbitrary.]

---

## Entry Condition

Completing Scene 1 (witnessing the dead sun from the hilltop).

---

## Scenario

The player arrives on a rocky outcrop at the top of a cliff. The atmosphere is realistic, cold, dream-strange. The rock is small enough to feel like a stage. The player can walk, can circle, can approach the edge.

Jumping off the cliff: the character falls and crashes. The player resets on the rock. The loop continues.

At some point — through curiosity, experimentation, or frustration with the loop — the player jumps and, mid-fall, jumps again. The double jump triggers. The fall becomes a transport. Scene 3 begins.

**Reference:** "Character on a hill at a cliff. Can circle the rock endlessly, like underwater, like in a dream. To exit the scene you need to jump off the cliff. If you jump, the character crashes. If during the jump, as it transitions into a fall, you jump again — you can transfer to the next scene. Or a victory screen."  
_(SCENARIOS/enter dreams/README.md — original dream note)_

**Narrative frame:** This is the Prodigal Son's moment of "coming to himself" — the pause in the endless loop where he decides to try something different. The double jump is the act of trying again during the fall. The son is still falling. He tries again. It works.

---

## Exit Condition

**Win:** Mid-fall double jump → transition to Scene 3.

[TBD: What does the transition look like? Does the fall become something else — a descent that transforms into arrival? A fade? An ascent?]

---

## Design Notes

- The endless loop must feel genuinely optional — not a soft lock. Players who sit on the rock for a long time should not be punished or directed. The patience of the loop is part of the dream.
- The crash on normal jump should feel definitive, not frustrating. It confirms the rule before breaking it.
- This is the game's first mechanical statement: the dream world does not work like the real world. The expected behavior fails. The unexpected behavior succeeds.
- Double jump is a permanent acquisition from this scene — it extends the player's capability in all subsequent dream sequences.

---

## Open Questions / TBD

- [ ] What does the fall + crash look like? Should it be violent, or soft and dreamlike?
- [ ] Does the endless loop have any ambient event that makes it interesting to wait in? (Sound design, sky changes, etc.)
- [ ] What visual/audio cue signals that the double jump was the correct action?
- [ ] What does the transition from mid-fall to Scene 3 look like?
- [ ] Does the "victory screen" option (from original note) exist as an alternate branch, or is it now just Scene 3?

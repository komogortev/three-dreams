# Scene 01 — House on the Hill

_World Plane: Real World_
_Source scenario: SCENARIOS/dead sun_

---

## Identity

| Field | Value |
|---|---|
| World | Real (chibi low-poly, Ghibli-autumn) |
| Location | A house on a hill. Autumn. Cold. Foggy. |
| Player avatar | Adult self — default model |
| NPCs | Dad (old form) — repelling/distant chibi appearance |
| Scene position | Opening scene. First contact with the world and the father. |

---

## Visual Register

- Autumn palette: amber, ochre, grey
- Cold, foggy atmosphere
- The house sits on the hill — visible from a distance
- The hilltop is the scene's focal destination
- The dead sun: a dim amber disk, motionless in the sky, visible only from the hilltop
- [TBD: specific visual design of the dad character's repelling chibi appearance — what makes him off-putting without being cartoonishly villainous? A posture? Worn clothing? Stillness?]

---

## NPCs

**Dad (old form)**
- Appearance: [TBD — repelling/off-putting chibi design. Enough shared visual DNA with his young form in Scene 3 that attentive players can eventually connect them. Not obvious on first encounter.]
- Behavior: Greets the player without fanfare. Does not explain anything. Leads. That is all.
- Dialog: Minimal. [TBD — what does he say, if anything, as he leads? Silence may be more correct than words.]
- Recognition trigger: [TBD — what mechanic or interaction is unlocked for players who later recognize this man as the young dad from Scene 3? Available in Scene 5 only, not here.]

---

## Core Mechanic

**The Ascent.** Player follows the old man up the hill path to the hilltop. The walk is the scene. No puzzle. No obstruction. The journey is the content.

[TBD: Is the ascent purely linear, or can the player explore the area around the house before following? Does something in the house/yard contain a hint toward the dad recognition arc?]

---

## Discoverable Mechanics

**The phone is gone.** The player had the phone on the menu screen — they interacted with it, possibly chose a model. In Scene 1, the phone is missing.

**V1 implementation:** Discovery is immediate — the phone is simply inaccessible from scene start. The player notices the absence when they first try to access it.

**Polishing pass (replaces V1):** Mid-scene discovery — the player reaches for the phone at a specific emotionally charged moment during the ascent and finds nothing. The desire produces the loss. This version is more powerful but requires identifying the right moment and building the reaching gesture/animation. Deferred to post-V1 polish.

No explanation is given. No NPC comments on the absence. The player proceeds without the phone — forced into presence with the old man and the hill.

---

## Entry Condition

Game start. No prerequisites.

---

## Scenario

The player arrives at or near the house on the hill. The setting is autumn — cold, foggy, the world at a threshold. The old man is waiting. He greets the player — [TBD: is the greeting warm, neutral, or awkward?] — and leads them up the hill path without explanation.

At the top, the player and the old man stand together. The dead sun is visible: a dim amber disk, motionless. Neither sets nor rises. The old man says nothing about it. They simply observe.

The scene ends. Transition to dream world.

**Reference:** "A dream of childhood. A conversation with father. He showed a mountain behind the house in Chita. A path to the top where you can pull yourself up and see the dead sun."  
_(SCENARIOS/dead sun/README.md — original dream note)_

**Narrative frame:** This is the Prodigal Son arriving at the edge of home. The father is there, but the son does not yet recognize him. The dead sun is what the father wanted to share — not a problem to solve, not a thing to fear. A thing to witness, together.

---

## Exit Condition

Witnessing the dead sun from the hilltop. Automatic transition to Scene 2.

---

## Design Notes

- The dead sun must be shown without explanation. No dialog references it. No objective marker points to it. The walk up the hill is its own reward; the sun at the top is the scene's only "event."
- Dad's repelling appearance in this scene should be consistent with chibi aesthetic — not grotesque, but cold, closed, unfamiliar. The player should not feel warmly toward him yet. The warmth comes only after the lake memory.
- The "critical star" condition of the dead sun is intentional: the sun is at its last phase. So is the father, in some sense. So is the player character, for all they know. The scene holds this awareness without stating it.
- Autumn setting supports the Ghibli direction confirmed by the user. The GLB base for this scene is a prototype hill/house environment already created.

---

## Open Questions / TBD

- [ ] What does the dad say (if anything) when he greets the player?
- [ ] Can the player enter the house before following, or is the path forward immediately the hill?
- [ ] What specific visual elements in dad's old form subtly echo his young form from Scene 3?
- [ ] Are there any discoverable environmental details that reward a second playthrough?
- [ ] What is the camera behavior during the ascent? Fixed follow, free orbit, or cinematic?
- [ ] V1: confirm the specific interaction that surfaces the phone-is-gone state at scene start
- [ ] Polish pass: identify the exact mid-ascent moment for the reaching gesture (emotionally charged beat — dad says something? the sun comes into view?)

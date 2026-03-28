# Three Dreams — Game Design Document

_Last updated: 2026-03-28_

---

## Narrative Spine

**Three Dreams** is a personal retelling of the Prodigal Son parable (Возвращение блудного сына).

The player is a son who has been away from home — lost in adult life, alienated, displaced. The game is the journey of return: through memory, through dream, back to the father waiting on the bench. The player may not recognize the father at first. That recognition, when it comes, is a reward only earned through attention.

The game's emotional thesis, drawn from "Есть только миг" (Lyube):

> "There is only a moment between past and future — that is what is called life."

The entire game is a meditation on that moment. The son returns not to a past that can be recovered, but to a present that can finally be inhabited. The father waited. The memories were real. That is enough.

---

## The Two-Plane Framework

The game's world is split across two planes. Both are "real." Both are inhabited by the same character. The dissonance between them is the game's argument.

| | **Real World** | **Dream World** |
|---|---|---|
| Physics | Standard | Standard + extensions (double jump, etc.) |
| Visual style | Low-poly chibi / Ghibli-inspired | Realistic — cold, foggy, uncomfortable |
| Atmosphere | Autumn. Cold. Fog. Intimate. | Abstract. Strange. Adult. |
| Time | Present day / flashback memory | Non-linear, dream logic |
| Relation to arc | Where the father is. Where memories live. | Where the son's adult self was trapped. |

**The dissonance is intentional and layered:**

- **Real world looks wrong** — serious themes (mortality, loss, separation from family) wearing a chibi Ghibli skin. Like how childhood was: it looked simple, but it never was.
- **Dream world looks "real"** — photorealistic rendering but impossible physics. Like how adult anxieties feel: viscerally solid even when they are constructions.

**The two planes are not visually connected by direct causation.** The parallel is felt, not stated. This is another dissonance layer: the player brings their own interpretation to why the worlds look the way they do.

---

## Art Direction

**Real World (all scenes):**
- Low-poly chibi style, Ghibli aesthetic influence
- Autumn palette: amber, grey, muted ochre
- Atmosphere: cold, foggy, the world at its threshold — the sun at end-of-life state
- The sky holds a dim, motionless amber disk — the dead sun — visible from elevated points only
- The dead sun is never explained by any character or text. It is witnessed.

**Dream World (Scenes 2, 4):**
- Realistic rendering — but cold, desaturated, fog-heavy
- Not photorealistic perfection — the fog and coldness are intentional coding economy and aesthetic
- Strange geometry, dream-logic scale
- Physically possible-looking but behaviorally wrong (double jump, endless loops)

---

## The Dead Sun

The sun in the real world is at critical phase. A dim amber disk, motionless. It neither sets nor rises. It has always been at this moment.

**What it represents** is deliberately left ambiguous for the player to complete:
- The father's vitality at threshold
- The player character's life at a possible last moment — every moment could be his last, making the calibration of what matters urgent
- The universe at its final phase — the cosmological frame that governs the game's ending
- The son's spiritual deadness before return

**Execution rule:** The dead sun is shown, not explained. No NPC comments on it. The old man walks the player to the hilltop specifically to see it. They stand. They observe. The scene ends. The player carries whatever meaning they assign.

---

## Discovery Mechanics Philosophy

**Discovery is the primary progression mechanism.** No tutorial prompts. No objective markers. Curious players are rewarded. Players who proceed without exploring still complete the game but miss layers.

All major scene mechanics follow this rule: they exist in the world before the player knows they need them.

---

## Dissonance Budget

Each scene is permitted **one** reality-breaking detail maximum. Accumulating dissonance elements reduces their impact and muddies the world's internal logic. Every scene doc should identify its one dissonance element (if any) explicitly.

| Scene | Dissonance element |
|---|---|
| Scene 1 | Dead sun (literal amber disk — reality is at its threshold) |
| Scene 2 | Dream physics: double jump, endless loop (inherent to dream plane) |
| Scene 3 | The phone appears in a childhood memory (anachronistic — belongs to the present) |
| Scene 4 | [TBD after Roksana polishing pass] |
| Scene 5 | [TBD — possibly none; this is the return to "normal"] |

---

## The Phone — Core Object and Loss Mechanic

The phone is the game's central object. It serves simultaneously as the snapshot tool, the loss mechanic, and the meta-layer bridge to the player's reality.

### Lifecycle

**Menu screen:** The player sees and interacts with the phone before entering the game. They may choose a model (see below). The phone is safe, familiar, theirs.

**Scene 1 (House on the Hill):** The phone is gone. The player arrives at the father's house and discovers — through reaching for it, or through the absence of its presence — that the phone is not there. No explanation is given. The player must be present without it.

**Scene 2 (Cliff):** No phone. Dream world. Pure physics, pure presence.

**Scene 3 (Lake Memory):** The phone reappears — in the player's pocket, during a childhood memory, before smartphones existed. This is memory/dream logic: the device belonging to the player's present self appears anachronistically in the past. It becomes the tool for preserving that moment. The player discovers it by reaching into the pocket — not announced, not prompted.

**Scene 5 (Return):** The player uses the phone — or its output (a photograph) — to share the memory with the father and elders. The object that was lost and recovered is now the bridge between the son and the father.

### The Emotional Inversion

The phone was lost when the father was physically present (Scene 1). It was found when the father is only a memory (Scene 3). The player couldn't be present with the phone in hand when they had the chance. They use it to capture what remains.

**This is the loss mechanic identified as TBD.** The player formed attachment to the phone on the menu — especially if they chose it. Its absence in Scene 1 violates what they expected to have. That violation is what makes the loss land.

### Phone Model Selection

At the menu, the player selects a phone model from a small set. Options should span a meaningful range — [TBD: specific models — old Nokia/candybar, a current smartphone style, a disposable camera aesthetic, etc.]. The choice is quick and visual, not a lengthy flow.

**Why it matters:** Personalization deepens the loss. A player who chose a specific model will reach for *that specific phone* and find nothing.

**Mobile platform advantage:** On mobile, the player is physically holding a phone while playing. Their in-game phone disappears while the real one remains in their hands. Taking in-game photos mirrors the real gesture of taking photos. The meta-layer: *the phone is in your hands the whole time — you just weren't using it for this.*

The game ends. The player is holding their actual phone. Some will call their father. This is not designed — it is an emergent consequence of the design, and it is correct.

### Confirmed Discoverable Mechanics

1. **The phone in the pocket (Scene 3)** — Player reaches into pocket during the lake memory and finds the phone. Not announced. Recovery is the discovery.
2. **The alternative win condition (Scene 5)** — A physical situation somewhere on the Scene 5 map triggers an involuntary fall or moment of stillness that becomes laughter. Present but unmarked. Discoverable by curious players only. [Details TBD at scene build time]

---

## Win / Lose Conditions

### Win Condition A — The Archivist
Player arrives at Scene 5 with memory snapshots. Shares them with the father and elders through a player-discovered mechanic (cinematic camera, sharing animation). Elders laugh. The father recognizes the moments. The son has returned with evidence that life had value.

### Win Condition B — The Present
Player arrives at Scene 5 without snapshots (or ignores them). A physical fall, a moment of involuntary stillness while observing the world, breaks the formal register. The character stops. Looks at nature. Bursts into laughter without reason. The elders respond. The threshold of appreciation is crossed without an archive.

*Both win conditions lead to the same ending sequence: the dead sun explodes — a supernova — spectacular, destroying, seeding. The player and the elders witness it together. The game's final image is not catastrophe but the beginning implied by the end. The player feels: "whatever comes, I am ready for it."*

*Cosmological frame (win): the universe expands into frozen stillness — this moment is forever preserved in frozen atoms. It was real. It mattered. The son came home.*

### Lose Condition — The Missed Moment (Soft Exit)
Player reaches Scene 5 and neither shares memories nor discovers the alternative path. The elders still laugh — they have their own memories. The player watches from outside. The sun dims further. No explosion. A slow fade. A sequence of snapshot-shaped frames shows what the player passed through but did not preserve — the moments that were available. The score is muted. The game ends quietly.

*Cosmological frame (lose): the universe collapses and restarts — the cycle renders without meaning. Another will begin. This one was not inhabited.*

**Hard lose condition (if implemented later):** Consequences in the real world. Details TBD after Roksana polishing pass — the cost of the lose must be the inverse of what Roksana costs.

---

## The Dad Recognition Arc

**Scene 1:** The old man (father/dad NPC) has a repelling, off-putting chibi appearance. Cold. Distant. Possibly unkempt. He greets the player and leads them to the hilltop. The player may not warm to him.

**Scene 3:** Memories of the lake. A younger man — warm, energetic, present — shares activities with the player-as-child. Fishing. Kayaking. This man is recognizable as someone deeply good.

**The discovery:** The player, through attention, recognizes that the repelling old man from Scene 1 is the young warm man from Scene 3. These are the same person across time.

**How recognizable should the young version be?** Intentionally subtle — not a direct copy. Enough shared visual elements (a gesture, a silhouette, a characteristic item of clothing, a way of standing) that attentive players connect the dots. The recognition should feel *earned*, not *given*.

**The reward:** Dialog options or interaction mechanics only available to players who have connected the two appearances. The son who recognizes the father gets access to a layer of the reunion that others do not.

---

## The Snapshot System

The phone is the snapshot device. The player discovers it in their pocket during Scene 3 — not told, not prompted. The act of taking a snapshot is intentional attention: the player chooses to preserve a moment rather than let it pass.

**Properties:**
- Each memory scene holds multiple possible photographable moments
- One snapshot accessible per playthrough per scene (possibly sequential — first unlocked before second)
- Replayability: discovering all available moments across multiple playthroughs
- Snapshots are carried to Scene 5 as the inventory for Win Condition A

**Sharing in Scene 5:** Player-discovered mechanic. The phone (or a photo output from it) exists in the world. The player brings it near the father and elders — proximity, gesture, or specific interaction [TBD]. A sharing animation triggers. Cinematic camera. The elders lean in. They laugh.

---

## Memory Scene Structure

Scene 3 (House on the Lake) is the template for all memory scenes.

Each memory scene:
- Player inhabits a child's body
- Dad appears in younger form
- A specific activity is shared (fishing, kayaking, [TBD: others])
- Multiple distinct moments are hidden in the scene
- Player discovers the camera and can photograph one moment per playthrough
- The "real" memory plays out to its natural end
- Transition to dream world follows

**The design goal:** High contrast between the warmth of the memory and the strangeness of the dream world that follows. The memory's comfort makes the dream world's coldness land harder, and vice versa.

**Scope note:** Additional memory scenes with different settings are a planned expansion avenue. V1 ships with Scene 3 as the primary memory scene. [Second scene TBD — different setting/activity, locked or sequential unlock.]

---

## Game Flow

```
[REAL]  Scene 1 — House on the Hill
        Dead sun scenario. Old man (dad, unrecognized) greets player.
        Ascent to hilltop. Witness the dead sun together.
        → transition to dream
             ↓
[DREAM] Scene 2 — The Cliff (Enter Dreams)
        Endless circling. Discovery of double jump via mid-fall attempt.
        Win: clear the cliff. Lose: crash.
             ↓
[REAL]  Scene 3 — House on the Lake
        Flashback. Player as child. Dad in young form.
        Discover camera. Take a snapshot. Memory plays out.
        → transition to dream
             ↓
[DREAM] Scene 4 — [Adult Life Struggle]
        PLACEHOLDER: Roksana scenario (flagged for replacement).
        Adult life, alienation, displacement — the "far country" of the Prodigal Son.
        Leads back toward home.
        [Optional: return to Scene 3 for second memory before Scene 5]
             ↓
[REAL]  Scene 5 — House on the Hill (Return)
        Dad + elders on the bench, waiting.
        WIN A: Share snapshots → cinematic → elders laugh → supernova
        WIN B: Fall into laughter → present moment → elders respond → supernova
        LOSE:  Neither path taken → elders laugh without player → slow fade → missed frames
```

---

## Loss Mechanic — Projected Grief

**Resolved: the phone is the loss mechanic.**

The player interacted with the phone on the menu. They may have chosen its model. They expected to have it. Scene 1 takes it without explanation. The player proceeds without it — forced into presence, stripped of their archive device.

The loss is felt in the body: reaching for something that isn't there. The absence is not explained. No NPC comments on it. It is simply gone.

The phone's return in Scene 3 (discovered in a pocket, in a childhood memory) is the unexpected recovery — more powerful because the expectation had already been abandoned.

---

---

## Post-Production Notes (Do Not Scope In)

Ideas confirmed as correct in direction but explicitly out of scope until the core game loop ships. Log here to not lose them.

### Real-World Leakage
- Using the device's actual camera to take in-game photos (the player's real phone captures a real moment alongside the game moment)
- Requesting access to contacts to identify numbers associated with "dad", "father", "papa", or similar — surfacing subtle hints or prompts throughout the game loop encouraging the player to call
- Propagating the game's emotional theme into the real phone layer — the game loop reaches outside the screen
- **Target:** post-launch, opt-in, requires platform permissions handling and consent design

---

## Scene 4 — Working Placeholder Note

Scene 4 is currently occupied by the Roksana scenario (adult life struggle, sci-fi political frame). This is a structural placeholder — the right adult-life-struggle scenario will emerge from other recorded dreams and experiences. When a better-fitted scenario is identified:

1. The Roksana scenario extracts to its own standalone project
2. The new scenario replaces Scene 4 in Three Dreams
3. The entry/exit contracts of Scene 4 remain identical — only the content changes

**Roksana scenario:** requires a dedicated polishing pass to redact and correctly express the original intent. Do not interpret the current scenario file as final.

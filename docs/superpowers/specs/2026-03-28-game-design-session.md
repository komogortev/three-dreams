# Three Dreams — Game Design Session Checkpoint

_Date: 2026-03-28_  
_Status: Design complete. Ready for Phase 4A implementation._

---

## What Was Decided This Session

### Narrative Spine
The game is a personal retelling of the **Prodigal Son** (Возвращение блудного сына). "Spirin" in early notes was a typo for "in spirit of." The thematic anchor is **"Есть только миг"** (Lyube) — there is only a moment between past and future; that is what is called life.

### The Two-Plane Framework (locked)
- **Real world:** Low-poly chibi / Ghibli-inspired. Autumn, cold, fog. Serious themes wearing a cartoon skin.
- **Dream world:** Realistic rendering — cold, desaturated, fog-heavy. Strange physics. Adult anxieties that feel viscerally solid.
- The two planes are **not visually causally connected** — the dissonance is intentional and unlabeled.

### The Dead Sun (locked)
A literal amber disk, motionless in the real-world sky. Never sets, never rises. Presented without explanation. Player assigns meaning. Cosmological frame: the universe at its final phase. Win ending: supernova. Lose ending: slow fade.

### The Phone — Core Object (locked)
- **Menu:** Player sees and selects a phone model (3–5 variants). Attachment is established.
- **Scene 1:** Phone is gone. No explanation. Loss by expectation violation.
- **Scene 3:** Phone reappears in pocket during childhood memory (anachronistic — Scene 3's one dissonance element). Player discovers it without prompt.
- **Scene 5:** Player uses phone to share snapshots with elders (Win A) or finds another path (Win B).

### Win / Lose (locked)
- **Win A (Archivist):** Player shares snapshot with elders → cinematic → laughter → supernova.
- **Win B (Present):** Player discovers physical trigger in Scene 5 → involuntary laughter → elders respond → supernova.
- **Lose (Soft Exit):** Elders laugh without player → missed-moments slideshow → slow fade. Elegiac, not accusatory.
- **Hard lose:** TBD after Roksana polishing pass.

### Discovery as Primary Mechanic (locked)
No tutorial prompts. No objective markers. Phone discovery, Win B path, scene transitions — all discoverable by attention. This governs every mechanical design decision.

### Dad Recognition Arc (locked)
Old man (Scene 1): repelling, cold, distant chibi. Young man (Scene 3): warm, energetic, present. Same character across time. Player discovers the link without being told. Recognition unlocks a richer interaction layer in Scene 5. Visual DNA: shared but subtle.

### Dissonance Budget (locked)
One reality-breaking element per scene maximum. See GDD for scene-by-scene table.

### Scene 4 — Placeholder (locked)
Roksana scenario is a structural placeholder. Entry/exit contracts stable; content modular and replaceable. Will extract to its own project when a better adult-life-struggle scenario is found from other recorded dreams.

### Post-Production Notes (out of scope, logged)
Real-world phone integration: real camera, contacts access to suggest calling dad, in-game loop propagating to real world. Logged in GDD, explicitly out of scope until post-launch.

---

## What Was Created

| File | Description |
|---|---|
| `docs/game-design/GDD.md` | Master game design document |
| `docs/game-design/scenes/scene-01-house-on-hill.md` | Scene 01 spec with TBDs |
| `docs/game-design/scenes/scene-02-enter-dreams.md` | Scene 02 spec with TBDs |
| `docs/game-design/scenes/scene-03-house-on-lake.md` | Scene 03 spec with TBDs |
| `docs/game-design/scenes/scene-04-roksana.md` | Scene 04 placeholder spec |
| `docs/game-design/scenes/scene-05-return.md` | Scene 05 spec with TBDs |
| `docs/roadmap.md` | Full roadmap rebuilt: systems audit, content asset audit, Phase 4A–4E |
| `PROJECT.md` | Narrative spine, architectural decisions added |
| `STATE.md` | Unblocked, next session target set |

---

## Critical Discovery — Asset Mismatch

The existing code scene numbering does not match game design order:
- `src/scenes/scene-02` holds `house_on_the_hill.glb` (= Game Scene 01)
- `src/scenes/scene-01` is an unrelated heightmap terrain
- `public/scenes/scene-03/house_on_lake.glb` exists, no code descriptor
- `public/scenes/scene-04/` holds Roksana GLBs, no code descriptor

**First task of Phase 4A:** reconcile numbering before writing any scene content.

---

## Open TBDs (fill in during scene authoring)

- Dad's old-form visual design — what specific chibi elements make him repelling without being grotesque?
- Young dad visual DNA link to old dad — which shared element (posture, item, silhouette)?
- Win B trigger in Scene 5 — what physical object/zone causes the fall-into-laughter?
- Dad recognition reward mechanic — what specifically unlocks for players who connect the two appearances?
- Phone discovery trigger in Scene 3 — what player action reveals it in the pocket?
- Phone loss awareness in Scene 1 — at what moment does the player realize it's gone?
- Number of photographable moments in Scene 03 (V1)

---

## Next Session Start Point

Phase 4A — scene reconciliation. See `STATE.md` Next Session for the exact task list.

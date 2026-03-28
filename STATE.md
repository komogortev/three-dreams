# STATE.md — three-dreams

## Status

_Last updated: 2026-03-28_

**What's working:** Scene registry, session transition types, and `gameplayPolicy` wired. Sandbox and scene-01/scene-02 registered. `GameLogicModule` scaffolded with game store integration. `SandboxSceneModule` mirrors the engine-dev harness (ramps, pool, time controls). Third-person orbit camera inherited from harness. Swimming v1 transferred: water mode activates at shoulder depth, tread/swim animations load. **Game design now fully documented** — narrative spine (Prodigal Son), all 5 scenes with structured specs, GDD written. Roadmap rebuilt with full systems audit and content asset inventory.

**What's broken / incomplete:** Scene numbering in code does not match game design order — `src/scenes/scene-02` currently holds house-on-hill content which should be scene-01. Must be reconciled before Phase 4A proceeds. Scene-03 through scene-05 have no code descriptors. All NPC and child character models missing. `GameLogicModule` has no win/fail conditions. HUD is a stub.

## Active Work

- Phase 4A not yet started — game design complete, scene reconciliation is the entry point
- Receiving swimming + uphill fixes from `threejs-engine-dev` harness as they ship

## Blockers & Open Questions

- **[2026-03-28]** Scene numbering mismatch: `src/scenes/scene-02` holds house-on-hill (= Game Scene 01). Must reconcile before any scene descriptor work. See roadmap Content Asset Audit section.
- **[2026-03-28]** All NPC character models missing (old man, young dad, elders, child player). P1 — blocks NPC system validation in Phase 4A. Must source in parallel with code.
- **[2026-03-28]** `threejs-engine-dev` Phase 3d (camera strategy switching) must land before cinematic camera decisions are locked in Phase 4C.
- **[2026-03-28]** Scene 4 (Roksana) requires dedicated polishing pass before it can be built. Structural placeholder contracts are stable.
- **[2026-03-28]** Multiple TBD items in scene specs — Win B trigger, recognition reward, dad visual design. Resolve during each scene's authoring pass.

## Next Session

> **Phase 4A — Step 1: Scene reconciliation + registry extension.**
>
> 1. Reconcile scene numbering: rename/remap descriptors so scene-01 = house on hill, scene-02 = cliff (dream), scene-03 = lake, scene-04 = Roksana placeholder, scene-05 = return. Move `house_on_the_hill.glb` reference from scene-02 descriptor to scene-01.
> 2. Extend `registry.ts` and `gameplayPolicy.ts` to include scene-03, scene-04, scene-05 with correct transition edges (01→02→03→04→05).
> 3. Author Scene 01 descriptor against GDD spec: hill terrain using existing GLB, `realWorld` atmosphere profile (amber fog, autumn palette, static sky — no dynamic sky), dead sun as emissive plane in sky, old man NPC spawn stub (primitive mesh acceptable), ascent path, hilltop exit zone.
>
> Reference: `docs/game-design/scenes/scene-01-house-on-hill.md`. Also begin sourcing P1 character assets (child model, NPC models) in parallel — these will block Phase 4A exit criteria.

## Decision Log

<!-- Append-only. One line per decision, newest first. -->

- **2026-03-28** — Phone as central object: menu → lost in Scene 1 → recovered in Scene 3 → shared in Scene 5. Serves as loss mechanic, snapshot tool, and mobile meta-layer simultaneously. Phone model selection at menu personalizes the loss.
- **2026-03-28** — Win conditions: two paths (Archivist = snapshots shared; Present = fall into laughter). Both end in supernova. Lose = slow fade + missed-moments slideshow. No hard game-over in V1.
- **2026-03-28** — Dead sun is literal (amber disk, motionless in sky) and ambiguous (no explanation given). Player assigns meaning. Supernova is the win ending visual.
- **2026-03-28** — Discovery as primary progression: no prompts, no tutorials. Camera in pocket, win-B path, scene exits — all discoverable.
- **2026-03-28** — Dad recognition arc confirmed: same character across Scene 1 (old/cold) and Scene 3 (young/warm). Visual DNA is shared, not obvious. Unlocks extra layer in Scene 5.
- **2026-03-28** — Scene 4 structural placeholder confirmed (Roksana). Contracts stable; content modular. Will extract to own project when replaced.
- **2026-03-28** — Narrative spine confirmed: Prodigal Son frame. Entire scene sequence maps to the parable.
- **2026-03-28** — Scene registry pattern (`scenes/registry.ts`) adopted over inline scene IDs. Registry makes legal transitions explicit and auditable for QA.
- **2026-03-28** — Mirrors engine-dev SandboxSceneModule exactly. Keeps calibration tools accessible in game context without duplicating logic.
- **2026-03-28** — Game fork tracks harness branch checkpoints. Game-specific divergence starts only after Phase 3d is signed off.

## Deferred

- **Scene 4 polishing pass (Roksana):** Content incorrect as written. Requires deliberate redaction session before scene can be built.
- **Second memory scene (Scene 3b):** Different setting/activity from the lake. Replayability expansion. Deferred to post-V1 or late V1 depending on scope assessment.
- **Hard lose condition:** Dire real-world consequence. Depends on Roksana polishing pass to know what the adult-life cost is. Deferred.
- **Dad recognition reward mechanic:** TBD — what specifically unlocks for players who connect old dad (Scene 1) to young dad (Scene 3). Deferred to scene build time.
- **Win Condition B trigger (Scene 5):** Specific physical/environmental mechanic for the fall-into-laughter path. TBD at scene build time.
- **Loss mechanic (projected grief):** Item or ability the player expects to have but finds gone. Scene TBD, details TBD.
- **HUD:** Stub renders. Full HUD requires locked game mechanics.
- **Save/load persistence:** Architecture placeholder in `useGameStore`. Implement when game has content worth saving.
- **Audio soundscape:** `AudioModule` mounted, no tracks assigned. Deferred pending scene content lock.
- **Phase 5 Electron build:** Out of scope until Phase 4 game loop is complete and validated.

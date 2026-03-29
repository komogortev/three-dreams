# STATE.md — three-dreams

## Status

_Last updated: 2026-03-28_

**What's working:** Scene registry extended to all 5 scenes. Scene numbering reconciled — code now matches game design order (scene-01 = house on hill, scene-02 = cliff/dream). Atmosphere profile system added (`realWorld`, `realWorldWarm`, `dreamWorld`). Gameplay policy co-located in scene files (not a central policy file). All 5 scene descriptors exist and compile. GLB paths corrected (house_on_hill.glb now from `/scenes/scene-01/`). Scene-03 includes lake swimmable volume. Menu correctly stages `scene-01` as game entry point.

**What's broken / incomplete:** Scene-01 and scene-05 use approximate heightmap physics (not GLB ground mesh) — Blender extraction pending. Scene-02 (cliff) has no GLB yet. Scenes 03–05 are structural stubs — no NPCs, no game mechanics, no exit conditions wired. Child character model missing (scene-03 avatar switch). All NPC models missing. `GameLogicModule` has no win/fail conditions. HUD is a stub.

## Active Work

- Phase 4A step 1 complete — scene reconciliation + registry extension
- Next: scene authoring passes (dead sun, NPC stubs, exit conditions) pending asset sourcing
- Blender extraction of ground meshes from house_on_hill.glb and house_on_lake.glb — user-driven parallel track

## Blockers & Open Questions

- ~~**[2026-03-28]** Scene numbering mismatch~~ — **resolved 2026-03-28**. Code now matches game design order.
- **[2026-03-28]** All NPC character models missing (old man, young dad, elders, child player). P1 — blocks NPC system validation in Phase 4A. Must source in parallel with code.
- **[2026-03-28]** `threejs-engine-dev` Phase 3d (camera strategy switching) must land before cinematic camera decisions are locked in Phase 4C.
- **[2026-03-28]** Scene 4 (Roksana) requires dedicated polishing pass before it can be built. Structural placeholder contracts are stable.
- **[2026-03-28]** Multiple TBD items in scene specs — Win B trigger, recognition reward, dad visual design. Resolve during each scene's authoring pass.

## Next Session

> **Phase 4A — Step 2: Scene authoring + exit conditions.**
>
> 1. **Blender extraction** (user-driven, high-impact): open `house_on_the_hill.glb` in Blender → check Outliner for mesh layers → extract ground mesh → export as `scene-01-ground.glb` → update scene-01 terrain to use extracted mesh for exact physics. Repeat for `house_on_lake.glb`.
> 2. **Scene 01 authoring**: add dead sun emissive disk mesh to scene-01 objects (Three.js PlaneGeometry + emissive material, positioned in sky above hilltop). Add old man NPC stub (primitive capsule at known spawn point).
> 3. **Scene exit conditions**: scene-01 hilltop trigger → `game:scene-changed` to scene-02. Scene-02 death reset (fall → respawn on rock) — requires `GameLogicModule` wiring.
> 4. **Source P1 assets in parallel**: child model (Mixamo or Quaternius), old man NPC, young dad NPC, elder NPCs.

## Decision Log

<!-- Append-only. One line per decision, newest first. -->
- **2026-03-28** — Scene-specific gameplay config co-located in each scene's `index.ts` (exports `gameplay: SceneGameplayPolicy`). Central `gameplayPolicy.ts` becomes a thin lookup delegate. Adding a new scene no longer requires touching a parallel config file.
- **2026-03-28** — `SceneGameplayPolicy` type moved to `src/scenes/types.ts` to prevent circular dependency: `gameplayPolicy.ts → registry.ts → scene-02 → gameplayPolicy.ts`. Clean dependency chain: `types.ts → GameplaySceneModule` only.
- **2026-03-28** — Atmosphere profiles (`realWorld`, `realWorldWarm`, `dreamWorld`) extracted to `atmosphereProfiles.ts`. Scenes spread profile + override. Two named profiles match roadmap spec; `realWorldWarm` added for scene-03 warm contrast.

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

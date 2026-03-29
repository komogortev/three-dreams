# STATE.md — three-dreams

## Status

_Last updated: 2026-03-29_

**What's working:**
- Scene registry covers all 5 scenes in GDD order. Atmosphere profiles in place (`realWorld`, `realWorldWarm`, `dreamWorld`).
- Scene-01: mesh nav GLB, steep slope tuning (55°/2.6m), dead sun orb in sky, exit ring on hilltop (→ scene-02). Spawn on road at hill slope start.
- Scene-02: cliff procedural terrain, dreamWorld atmosphere. Lost-in-woods forest (4 scatter fields ~115 trees + rocks + stone pile). Exit ring at hilltop (x:10, y:8.6, z:-0.2 → scene-03). secretDoubleJump wired.
- Scene-03: mesh nav GLB aligned, lake walkable, exit ring near house (x:0.6, y:-0.7, z:-8.5 → scene-01). Full 01→02→03→01 loop wired and position-tuned.
- Phase 4A Step 3: `npcStubs` on `SceneGameplayPolicy` — capsule placeholders for old dad (scene-01) and young dad (scene-03); `fallRespawn` on scene-02 (Y < -15 → origin peak).
- Exit zone system: glowing ring + 1.2s dwell trigger + `game:request-scene-change` → SceneView navigates cleanly.
- Dev HUD: player X/Z/Y position readout (bottom-right, dev builds only).
- Nav mesh `debugVisible` flag for Blender alignment sessions.
- TypeScript build: all CI errors resolved (`snap.mode` → `snap.grounded`, `TerrainSampler` → `TerrainSurfaceSampler`, registry optional-field helpers).

**What's broken / incomplete:** Scene-02 has no cliff GLB (forest is placeholder). Scenes 04–05 are structural stubs. NPCs are primitive capsules only — character models still missing. Child avatar switch missing. GameLogicModule has no win/fail conditions. HUD is a stub.

## Active Work

- Phase 4A Step 3 complete — NPC capsule stubs + scene-02 void fall respawn
- Next: tune stub X/Z/Y with dev HUD if misaligned; scene-05 elder stubs or Phase 4B phone / photo markers

## Blockers & Open Questions

- ~~**[2026-03-28]** Scene numbering mismatch~~ — **resolved 2026-03-28**. Code now matches game design order.
- **[2026-03-28]** All NPC character models missing (old man, young dad, elders, child player). P1 — blocks NPC system validation in Phase 4A. Must source in parallel with code.
- **[2026-03-28]** `threejs-engine-dev` Phase 3d (camera strategy switching) must land before cinematic camera decisions are locked in Phase 4C.
- **[2026-03-28]** Scene 4 (Roksana) requires dedicated polishing pass before it can be built. Structural placeholder contracts are stable.
- **[2026-03-28]** Multiple TBD items in scene specs — Win B trigger, recognition reward, dad visual design. Resolve during each scene's authoring pass.

## Next Session

> **Phase 4A — Step 4 pick one:** (a) Walk scene-01 and scene-03, read player position vs capsule stubs from dev HUD, adjust `npcStubs` in each scene's `gameplay` export. (b) Add scene-05 elder `npcStubs` + bench placeholder follow-through. (c) Begin Phase 4B — photographable markers or phone recovery trigger on scene-03 per GDD. Continue sourcing P1 character models in parallel.

## Decision Log

<!-- Append-only. One line per decision, newest first. -->
- **2026-03-29** — `npcStubs` and `fallRespawn` on `GameplaySceneConfig` / `SceneGameplayPolicy`: placeholder capsules spawned at mount; scene-02 soft-death teleport at `GameplaySceneModule` tick (keeps `GameLogicModule` free of movement hooks).
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

# STATE.md — three-dreams

## Status

_Last updated: 2026-03-29_

**What's working:**
- Scene registry covers all 5 scenes in GDD order. Atmosphere profiles in place (`realWorld`, `realWorldWarm`, `dreamWorld`).
- Scene-01: mesh nav GLB, steep slope tuning (55°/2.6m), dead sun orb in sky, exit ring on hilltop (→ scene-02). Old dad capsule stub at (-18, -14). Spawn on road at hill slope start.
- Scene-02: cliff procedural terrain, dreamWorld atmosphere. Lost-in-woods forest (4 scatter fields ~115 trees + rocks + stone pile). Exit ring (x:10, y:8.6, z:-0.2 → scene-03). secretDoubleJump wired. Fall below Y:-15 → respawn fixed at rock top (0, 0).
- Scene-03: mesh nav GLB aligned, lake walkable, exit ring near house (→ scene-01). Young dad capsule stub at (6.5, 4.6, y:-0.2). Player spawns at (8.2, 5.4). Full 01→02→03→01 loop wired and position-tuned.
- `npcStubs` + `fallRespawn` on `SceneGameplayPolicy`: capsule spawning extracted to `mountNpcStubs(ctx)`. `fallRespawn` is a discriminated union (`mode: 'fixed' | 'zone'`).
- `classic_park_bench_1k/2k.glb` present in `public/models/` — ready to wire in scene-05.
- `npc_old_man.glb` present in `public/scenes/scene-01/` — not yet wired; Stage 2 target.
- Exit zone system: glowing ring + 1.2s dwell trigger + `game:request-scene-change` → SceneView navigates cleanly.
- Dev HUD: player X/Z/Y position readout (bottom-right, dev builds only).
- TypeScript build: all CI errors resolved.

**What's broken / incomplete:** Scene-02 has no cliff GLB (procedural heightmap placeholder). Scenes 04–05 are structural stubs. NPCs are capsule stubs — real character models not yet wired. Child avatar missing. `GameLogicModule` has no win/fail conditions. HUD is a stub. `npc_old_man.glb` sits in scenes/ folder — needs to move to `characters/npc/` per agreed structure.

## Active Work

- Phase 4A complete — scene loop, exit zones, NPC stubs, fallRespawn system
- branch `feat/phase-4a-scene-reconciliation` pushed; PR open against `main`

## Blockers & Open Questions

## Blockers & Open Questions

- ~~**[2026-03-28]** Scene numbering mismatch~~ — **resolved 2026-03-28**. Code now matches game design order.
- **[2026-03-28]** NPC models partially sourced: `npc_old_man.glb` present (scene-01 old dad). Missing: young dad, child avatar, elders ×2-3. P1 — young dad blocks scene-03 visual completeness; child avatar blocks scene-03 player perspective.
- **[2026-03-28]** `threejs-engine-dev` Phase 3d (camera strategy switching) must land before cinematic camera decisions are locked in Phase 4C.
- **[2026-03-28]** Scene 4 (Roksana) requires dedicated polishing pass before it can be built. Structural placeholder contracts are stable.
- **[2026-03-28]** Multiple TBD items in scene specs — Win B trigger, recognition reward, dad visual design. Resolve during each scene's authoring pass.

## Next Session

> **Phase 4B start:** Wire `npc_old_man.glb` as a static `SceneDescriptor.objects` entry in scene-01 (remove capsule stub). Move `npc_old_man.glb` → `public/characters/npc/old-dad.glb` and `Remy.fbx` → `public/characters/player/remy.fbx` per agreed folder structure. Then add scene-05 bench (`classic_park_bench_1k.glb`) + elder `npcStubs`. Source young-dad model in parallel.

## Decision Log

<!-- Append-only. One line per decision, newest first. -->
- **2026-03-29** — `fallRespawn` extended to discriminated union (`mode: 'fixed' | 'zone'`). `'fixed'` = deterministic anchor (scene-02 rock loop). `'zone'` = uniform random point in one of N scatter zones (future lose-state respawn). Zone picker uses square-root distribution to avoid centre clustering.
- **2026-03-29** — NPC stub lifecycle path decided: `npcStubs` config (capsule, now) → `SceneDescriptor.objects gltf` (static GLB, Stage 2) → `NpcModule` with behaviour (Stage 3). Each stage is a drop-in replacement with no module interface changes.
- **2026-03-29** — Character assets folder structure agreed: `public/characters/player/` and `public/characters/npc/`. NPCs not scene-scoped — old dad appears in scene-01 and scene-05 (recognition arc); shared path is semantically correct.
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

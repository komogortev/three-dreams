# STATE.md — three-dreams

## SNAPSHOT
Phase: 4B | Last: 2026-04-05 | Stack: Vue 3 + @base fork (pwa-shell)
Working: Scenes 01–03, NPC animation packs fully wired (scene-01 extended/wait, scene-03 base/idle), NPC_BASE_ANIM + NPC_EXTENDED_ANIM index maps registered, phone profiler menu
Broken: Scene-03 player in T-pose (FBX clips do not retarget to boy GLB — needs GLB migration), scenes 04–05 stubs, HUD stub, no audio
Blocker: Phase 3d (camera) must land before Phase 4C cinematic decisions
Next: Migrate player character to GLB + fix animation assignment (T-pose); plan + implement dialog system and NPC guidance system

---

## Status

_Last updated: 2026-04-02_

**What's working:**
- Scene registry covers all 5 scenes in GDD order. Atmosphere profiles in place (`realWorld`, `realWorldWarm`, `dreamWorld`).
- Scene-01: mesh nav GLB, steep slope tuning (55°/2.6m), dead sun orb in sky, exit ring on hilltop (→ scene-02). **Man-60yo** (`npc-man-60yo-casual.glb`) placed at (-18, -14, y:0), looping `look_around` via embedded clips. Capsule stub suppressed when GLB loads.
- Scene-02: cliff procedural terrain, dreamWorld atmosphere. Lost-in-woods forest (4 scatter fields ~115 trees + rocks + stone pile). Exit ring (x:10, y:8.6, z:-0.2 → scene-03). secretDoubleJump wired. Fall below Y:-15 → respawn fixed at rock top (0, 0).
- Scene-03: mesh nav GLB aligned, lake walkable, exit ring near house (→ scene-01). **Man-40yo** (`npc-man-40yo-outdoors.glb`) at (6.5, -0.2, 4.6). **Player** uses `npc-boy-5yo-outdoors.glb` at (8.2, 5.4) facing lake (Math.PI/2).
- `npcStubs` + `fallRespawn` on `SceneGameplayPolicy`: capsule spawning in `mountNpcStubs(ctx)`. Stubs suppressed at positions where GltfObject loaded successfully.
- `classic_park_bench_1k/2k.glb` present in `public/models/` — ready to wire in scene-05.
- **Man-60yo** GLB carries **embedded** clips (`playEmbeddedAnimations` on scene-01). **Man-40yo** and **boy** are mesh + rig only — ready to receive `animationPackUrls`.
- All NPC GLBs optimized via gltf-transform (WebP 1024px + meshopt): 5 files, ~4.8MB total. `npc-man-40yo-outdoors.glb` compressed this session (6.56MB → 1.56MB).
- `animations_base.glb` (728KB) + `animations_extended.glb` (1.56MB) in `public/characters/npc/`.
- `@base/scene-builder` now supports `GltfObject.animationPackUrls` — loads + retargets clips to NPC rig, drives mixer via existing `embeddedGltfMixers` tick.
- Scene-01 house GLBs optimized: total 4.5MB (was ~38MB including deleted 8k orphan).
- `scripts/optimize-glb.sh` — standard pipeline for all incoming Blender exports.
- Exit zone system, dev HUD, TypeScript build: unchanged, working.

**What's broken / incomplete:** Scene-02 has no cliff GLB (procedural heightmap placeholder). Scenes 04–05 are structural stubs. `GameLogicModule` has no win/fail conditions. HUD is a stub. Man-40yo and boy have no `animationPackUrls` wired yet (engine supports it, scene descriptors not yet updated). Clip names in `animations_base.glb` unverified — need to inspect + match against `loopClipNameContains`.

## Active Work

- Phase 4B in progress — NPC animation packs wired and clip index maps registered; player GLB migration pending

## Blockers & Open Questions

- ~~**[2026-03-28]** Scene numbering mismatch~~ — **resolved 2026-03-28**. Code now matches game design order.
- **[2026-04-02]** ~~`npc_old_man.glb` scene-01 legacy path~~ — resolved. Moved + optimized to `public/characters/npc/npc-old-man.glb`, added to `NPC_CHARACTER_URLS.oldMan`. Wiring in scene-01 still pending.
- **[2026-03-28]** NPC models: 4 models in `public/characters/npc/`, all optimized. Still missing: elders ×2–3 for scene-05.
- **[2026-03-28]** `threejs-engine-dev` Phase 3d (camera strategy switching) must land before cinematic camera decisions are locked in Phase 4C.
- **[2026-03-28]** Scene 4 (Roksana) requires dedicated polishing pass before it can be built. Structural placeholder contracts are stable.
- **[2026-03-28]** Multiple TBD items in scene specs — Win B trigger, recognition reward, dad visual design. Resolve during each scene's authoring pass.

## Next Session

> **Phase 4B continued:**
> 1. **Player GLB migration** — replace Remy FBX (scene-01) and confirm boy GLB (scene-03) as the player model; fix T-pose by switching `animationClipUrls` to GLB packs (`NPC_ANIM_URLS.base`) — FBX clips do not retarget to GLB skeletons. Use `debugClipResolution: true` on scene-03 to confirm slot assignments post-fix.
> 2. **Dialog system** — design and implement NPC interaction trigger + dialog UI (speech bubble or overlay). Pairs with NPC guidance system (contextual hints / scene objectives surfaced through NPC dialogue).
> 3. **NPC guidance system** — NPCs surface scene context/objectives through dialogue rather than HUD prompts. Design data model for dialog trees keyed to scene + NPC ID.
> 4. Add scene-05 bench (`classic_park_bench_1k.glb`) + elder NPC stubs.
> 5. Install KTX-Software to upgrade texture compression WebP → KTX2.

## Decision Log

<!-- Append-only. One line per decision, newest first. -->
- **2026-04-05** — `NPC_BASE_ANIM` (8 clips) and `NPC_EXTENDED_ANIM` (14 clips) index maps registered in `npcUrls.ts` — verified by visual inspection via DEV animation cycling overlay. Both packs now have named constants; all NPC placements use `loopClipIndex: NPC_*_ANIM.<name>` instead of magic numbers.
- **2026-04-05** — Scene-01 NPC (man-60yo) migrated from embedded clips to extended pack (`[NPC_ANIM_URLS.extended]`), default `wait`. Scene-03 NPC (man-40yo) wired to base pack (`npcAnimPacks()`), default `idle`. Both player characters given `NPC_ANIM_URLS.base` in `animationClipUrls` for idle slot coverage.
- **2026-04-05** — Player T-pose root cause identified: scene-03 uses boy GLB as player model; Mixamo FBX clips do not retarget to GLB skeleton. Fix deferred to next session (player GLB migration track).
- **2026-04-05** — `SceneBuilder` now exposes `npcGltfEntries: NpcGltfEntry[]` on `SceneBuilderResult` — mixer + retargeted clips per NPC pack object. `GameplaySceneModule.getNpcGltfEntries()` surfaces these for tooling. `loopClipIndex` added to `GltfObject` (SceneDescriptor) to complement `loopClipNameContains`.
- **2026-04-05** — Movement debug logging (`[PlayerController.move]`) flipped to opt-in: `localStorage.debugPlayerMove='1'` or `?debugMove=1`. Default was on; now off. Reduces console noise during animation debugging.
- **2026-04-05** — `debugClipResolution` added to `SceneGameplayPolicy` pick so individual scenes can opt in to clip resolution logging without touching the shared module config.
- **2026-04-03** — Phone profiler menu: `PhoneSelector` accordion replaces Play button. Three phone GLBs (`extreme/pragmatic/comfortable`) compressed (4.83MB → 693KB total). `useInventoryStore` (Pinia, persisted) stores `phoneProfileId` + NPC item slots. Phone selection always enters scene-01 as a fresh run. `PhoneViewer` uses standalone Three.js (no full engine context); centers model via Box3 to compensate for Blender origin offset.
- **2026-04-03** — NPC model naming convention changed to generic role + variant (e.g. `npc-man-40yo-outdoors.glb`) instead of relationship-based (`npc-father-40yo.glb`). Allows reuse across scenes without implying the player-NPC relationship in the filename. `NPC_CHARACTER_URLS` keys updated to match: `man60yCasual`, `man40yOutdoors`, `boy5yOutdoors`.
- **2026-04-03** — `GltfObject.animationPackUrls` added to `@base/scene-builder` `SceneDescriptor`. `SceneBuilder.placeGltf` loads packs in parallel, retargets clips to the NPC's SkinnedMesh rig, drives mixer via existing `embeddedGltfMixers` tick. `npcAnimPacks()` helper in `npcUrls.ts` returns `[base]` by default, `[base, extended]` when `{ extended: true }`. Default = base; scene opt-in = extended.
- **2026-04-03** — `npc-man-40yo-outdoors.glb` compressed (Blender re-fabrication → 6.56MB, post-optimize → 1.56MB, 76% reduction). Both animation packs now colocated in `public/characters/npc/` alongside mesh GLBs.
- **2026-04-02** — Animation architecture decided: shared packs in `public/characters/animations/` — `locomotion.glb` (player, always loaded) + `npc-social.glb` (NPCs, lazy on viewport entry). Extract from father-60yo on next Blender re-export; current embedded clips remain until then.
- **2026-04-02** — GLB naming convention: no resolution tags in filenames. Source Blender exports stored outside `public/`; only gltf-transform–optimized GLBs committed.
- **2026-04-02** — `scripts/optimize-glb.sh` established as mandatory pipeline for all Blender GLB exports. Settings: meshopt + WebP 1024px + `--join false --simplify false --flatten false` (preserves skinned-mesh hierarchy). KTX2 deferred pending KTX-Software install.
- **2026-04-02** — Web + Electron single asset set confirmed. 1024px WebP + meshopt covers both at typical third-person camera distances. Two-set pipeline unjustified at current game style and character count.
- **2026-03-30** — `SceneBuilder.placeGltf` switched to `SkeletonUtils.clone` (imported as `cloneSkinnedRoot`). `gltf.scene.clone(true)` leaves `SkinnedMesh` referencing original bones; mixer animates invisible original, clone stays in T-pose.
- **2026-03-30** — `GameplaySceneModule.resetFacing` reads `descriptor.character.rotationY` directly. `character.rotation.y` reads the root Group which is always 0; SceneBuilder applies yaw to the child FBX mesh for AABB alignment.
- **2026-03-30** — `mountNpcStubs` receives `loadedGltfXZ: ReadonlyArray<readonly [number, number]>` from `SceneBuilderResult`. Stubs within 0.5 units of a successfully loaded GltfObject are suppressed — graceful degradation without removing the fallback stub from the descriptor.
- **2026-03-30** — Embedded animation names verified visually per model (not assumed from Blender NlaTrack order). Father-40yo and father-60yo share the same 8 semantic clip names but in different index order.
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

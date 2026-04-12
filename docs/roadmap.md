# Three Dreams — Game Roadmap

> **Repo:** [github.com/komogortev/three-dreams](https://github.com/komogortev/three-dreams)  
> **Narrative spine:** Prodigal Son (Возвращение блудного сына)  
> **Design doc:** [`docs/game-design/GDD.md`](./game-design/GDD.md)  
> **Master roadmap:** [`docs/roadmap/00-master-roadmap.md`](../../docs/roadmap/00-master-roadmap.md)

---

## Architecture Principles

1. **Game logic stays game-local.** Scene mechanics, NPC behavior, phone/snapshot system, win/lose — all live in `three-dreams`. Extract to `SHARED` only when a second game needs the same pattern.
2. **Engine contracts stay stable.** `@base/*` packages are not modified for game-specific needs. Game modules consume them via EventBus.
3. **Discovery mechanics are never in code comments.** If a mechanic is discoverable, it is present in the world — not announced. Build it that way.
4. **Vertical slice first.** Scenes 1 → 2 → 3 → 5 before Scene 4. Get the full loop playable before polishing any individual scene.
5. **Content assets are tracked like code.** Every model and GLB has a phase it is needed by. Content lead time is often longer than code lead time — track it early.

---

## Current State (2026-04-11)

**Live detail:** [`../STATE.md`](../STATE.md) **SNAPSHOT** + **Decision log** — read first for orientation.

| Area | Status |
|---|---|
| Engine stack | `ThreeModule` → `InputModule`, `AudioModule` — mounted ✅ |
| Player + animation | `@base/player-three` `PlayerController` + `CharacterAnimationRig` — locomotion, jump, crouch, swim v1 ✅ |
| Double jump | `secretDoubleJump` policy in `ThirdPersonSceneModule` — wired, emits `game:report-outcome` on mid-fall second jump ✅ |
| Scene registry | `scenes/registry.ts` — typed, legal transitions auditable ✅ |
| Session FSM | `GameLogicModule` — phases: booting → playing → paused → won/lost ✅ |
| Game store | `useGameStore` — phase, sceneId, lastOutcome, persistence ✅ |
| Save/continue | `PlatformAdapter.storage` + `first-game-save-v1` ✅ |
| Camera | `@base/camera-three` — third-person follow, first-person, presets ✅ |
| Sandbox scene | `SandboxSceneModule` — dev calibration, mirrors harness ✅ |
| Phase 3d | Camera strategy switching in editor — pending (harness blocker for **4C** cinematic architecture) |
| Game content | **Scenes 01–03** authored mesh / atmosphere / exits / NPC placements; **04–05** stubs. Asset pipeline (`optimize-glb`, packs) active |
| Phase / mechanics | **Phase 4B** — NPC `animationPackUrls`, pack index maps, scene-01/scene-03 NPC loops; **phone profiler menu** + persisted phone selection. **Open:** player GLB + clip retarget (scene-03 T-pose), dialog / guidance, snapshots / viewfinder / phone FSM, win/lose |

---

## Systems Audit — What Three Dreams Needs

### Already exists — no new work

| System | Source |
|---|---|
| Player locomotion (walk, run, jump, crouch, swim) | `@base/player-three` |
| Double jump mechanic | `ThirdPersonSceneModule.secretDoubleJump` |
| Player animation rig | `CharacterAnimationRig` |
| Camera (third-person, first-person) | `@base/camera-three` |
| Input (keyboard, gamepad, touch) | `@base/input` |
| Audio (music, sfx, spatial) | `@base/audio` |
| Scene builder + descriptors | `@base/scene-builder` |
| Session FSM + EventBus | `GameLogicModule` + `engine-core` |
| Game store + persistence | `useGameStore` |

### Must build — game-local (three-dreams only)

| System | Phase | Notes |
|---|---|---|
| **Menu / phone interface screen** | 4A | Menu IS the phone. Model selection. Phone interaction enters the game. Replaces generic pwa-shell menu. |
| Scene descriptors (1, 2, 3, 4, 5) | 4A | Terrain GLB, atmosphere config, spawn, exit zones per scene |
| Atmosphere profile system | 4A | Per-plane configs: `realWorld` (chibi fog, amber sky, autumn) and `dreamWorld` (realistic cold fog). Separate from per-scene configs. |
| World plane transition | 4A | Crossfade/dissolve between real ↔ dream atmosphere profiles on scene change |
| Scene exit condition wiring | 4A | Each scene emits `game:scene-changed` or `game:report-outcome` at correct trigger |
| Dead sun asset + atmosphere | 4A | Amber disk mesh, motionless. Static — no day/night cycle. `dynamicSky` config. |
| Avatar switching system | 4A | Adult ↔ child model swap on scene load. Child: smaller scale, adjusted camera height. |
| NPC system v1 | 4A | `NpcEntity`: follow-path (Scene 1), idle/seated (Scene 5), activity-scripted (Scene 3). Animation state contract per NPC (see below). |
| NPC animation state contract | 4A | Old man: `walk-lead`, `idle-stand`, `point`. Young dad: `activity`, `laugh`. Elders: `idle-seated`, `lean-in`, `laugh`. Player: `laugh` (Win B). All states must be sourced before NPC system can be validated. |
| NPC proximity interaction trigger | 4A | Player within range → `game:npc-interact-available` |
| Scene 2 death/reset | 4A | Player falls off cliff → death trigger at base → respawn at rock top. No death screen. Dreamlike reset. |
| Cinematic camera controller (stub) | 4A | Interface only: `CinematicCamera.play(sequence)` → interrupts player camera → plays sequence → returns control. Consumed in 4C. |
| Phone entity + model selection | 4B | Menu: choose from 3–5 models. Phone entity in world carries selected model. |
| Phone state machine | 4B | States: `present` (menu) → `lost` (Scene 1) → `recovered` (Scene 3) → `shared` (Scene 5). Owned by game store. Persisted. |
| Phone loss (Scene 1) | 4B | V1: inaccessible from scene start. Polish (4E): mid-ascent reaching gesture. |
| Phone recovery (Scene 3) | 4B | Pocket discovery — player finds phone in child avatar's pocket. Not announced. |
| Viewfinder UI overlay | 4B | When phone is raised to take a photo: fullscreen or partial viewfinder frame. Capture gesture/button. Minimal UI — consistent with discovery-mechanic philosophy. |
| Photo taking mechanic | 4B | Aim phone at photographable moment marker → snapshot captured. |
| Snapshot inventory | 4B | In game store: array of snapshot metadata. Carries to Scene 5. |
| Photographable moment markers | 4B | Tagged positions in Scene 3 descriptor. V1: one accessible per playthrough. |
| Missed-moments tracker | 4B | Game store records every photographable moment the player was *near* but did not capture. Required for lose condition slideshow in 4C. |
| Sequential memory unlock | 4B | Playthrough counter per scene. Second moment unlocks after first is taken (may be across separate runs). |
| Win A mechanic (snapshot sharing) | 4C | Player brings phone/snapshot near elders. Proximity triggers sharing — discoverable, no prompt. Emits to cinematic camera. `game:report-outcome { kind: 'win', path: 'archivist' }`. |
| Cinematic camera controller (implementation) | 4C | Full implementation: sequence definitions, camera path playback, return to player control. Used for Win A sharing sequence. |
| Laughter + sharing animation sequences | 4C | NPC elders: `lean-in` → `laugh`. Dad: recognition response. Player: `laugh` (Win B path). These are authored animation sequences triggered by game events. |
| Lose mechanic (soft exit) | 4C | Grace period in Scene 5. If Win A or Win B not triggered → `game:report-outcome { kind: 'lose' }`. |
| Missed-moments slideshow | 4C | UI sequencer: reads missed-moments tracker, renders snapshot-shaped frames of scenes/moments the player passed through without capturing. Muted score. Fade. |
| Supernova VFX — dead sun mesh | 4C | Static amber disk in Scene 1 sky. Also used as the exploding body in the ending. Shared asset. |
| Supernova VFX — explosion sequence | 4C | Three.js particle burst + expanding point light + bloom (if feasible without `@base/postfx`). Spectacular. Not chaotic. Plays on Win A + Win B. |
| Slow fade ending (Lose) | 4C | Dead sun dims. Ambient light falls. Fade to black. Missed-moments slideshow plays over fade. |
| Post-outcome UI | 4C | Win screen vs lose screen. Return to menu. Credits placeholder. |
| `game:report-outcome` fully wired | 4C | All outcome paths emit correctly. `GameLogicModule` handles `won` / `lost` transitions. |
| Win B mechanic — discoverable trigger | 4D | Specific physical object or zone on Scene 5 map. Unmarked. Player encounters it → character stumbles or pauses → laughter sequence → elders respond → supernova. `game:report-outcome { kind: 'win', path: 'present' }`. |
| Win B zone — design spec | 4D | TBD at scene 5 authoring: what is the physical object/zone? Where on the map? How does it trigger? This must be resolved before 4D code work begins. |
| Dad recognition tracker | 4D | Game store flag: player has seen old dad (Scene 1) AND young dad (Scene 3) in same playthrough → `dadRecognized: true`. |
| Recognition reward mechanic (Scene 5) | 4D | If `dadRecognized`, specific interaction unlocks near the father. [TBD: private snapshot moment? unique dialog? physical gesture?] |
| Discovery audit | 4D | Review all discoverable mechanics: phone pocket, Win B trigger, recognition reward. Confirm none have visible prompts or UI hints. |
| Scene 4 authoring | 4E | After Roksana polishing pass. Entry/exit contracts already stable. |
| Second memory moment (Scene 3) | 4E | Sequential unlock — second photographable beat. |
| Audio soundscape | 4E | Tracks assigned per scene. Autumn ambience (1, 5). Dream ambient (2, 4). Lake sounds (3). Score for ending sequences. |
| Phone mid-scene loss (polish) | 4E | Replace V1 immediate inaccessibility with mid-ascent reaching gesture. Player reaches for phone at emotionally charged moment during ascent — finds nothing. |
| Shadows | 4E | `renderer.shadowMap` enabled. Dead sun as caster. Character and terrain receive/cast. Per atmosphere profile. |
| HUD finalization | 4E | Minimal. Phone-absent state: subtle (no blinking icon — absence is the message). No snapshot counter. |
| Mobile PWA validation | 4E | Touch controls. Phone model selection on mobile screen. Meta-layer confirmed: player holds real phone while playing. |

### May extract to @base — when a second consumer exists

| System | Candidate package | Extraction trigger |
|---|---|---|
| NPC path-following | `@base/npc-three` | Second game needs NPCs |
| Proximity interaction trigger | `@base/interaction` | Second game needs item pickup / NPC talk |
| Snapshot/collectible inventory | `@base/inventory` | Second game has collectibles with state |
| Cinematic camera controller | `@base/camera-three` extension | Second game needs scripted camera sequences |
| VFX / particle system | `@base/vfx` | Second game needs authored visual effects |

---

## Content Asset Audit

Content assets are tracked here with actual inventory vs. design requirements. Content has long lead time — track early, source in parallel with code.

> Last audited: 2026-03-28

### Scene Numbering — Critical Mismatch

The existing code scene numbering does not match the game design scene order. **Must be reconciled at the start of Phase 4A** before any scene descriptor work proceeds.

| Game Design | Content | Code Before Reconciliation | Action |
|---|---|---|---|
| Scene 01 — House on Hill (real) | `house_on_the_hill.glb` lives in `public/scenes/scene-02/` | `src/scenes/scene-02/index.ts` loads it | Move or remap to scene-01 |
| Scene 02 — Cliff (dream) | No GLB yet | `src/scenes/scene-01/index.ts` is an unrelated heightmap terrain | Replace with cliff descriptor |
| Scene 03 — House on Lake (real) | `house_on_lake.glb` in `public/scenes/scene-03/` | No descriptor exists | Write scene-03 descriptor |
| Scene 04 — Roksana (dream, placeholder) | Multiple GLBs in `public/scenes/scene-04/` | No descriptor exists | Write scene-04 placeholder descriptor |
| Scene 05 — Return (real) | Reuses `house_on_the_hill.glb` + needs bench | No descriptor, no code slot | Add scene-05 to registry + descriptor |

### Scene Environment Assets

| Asset | File | Status | Needed by | Notes |
|---|---|---|---|---|
| Hill terrain GLB | `public/scenes/scene-02/house_on_the_hill.glb` (13.3 MB) | ✅ Exists | Scene 01 + 05 | Currently mapped to wrong scene slot. Needs autumn atmosphere config pass. |
| Hill heightmap | `public/terrains/heatmap-scene-1.png` | ✅ Exists | Scene 01 | Used in current scene-01 descriptor (which will become scene-02 or be replaced). |
| Scene-02 heightmap | `public/terrains/heatmap-scene-02.png` | ✅ Exists | Unclear | Currently used in scene-02 descriptor. Reassignment TBD during reconciliation. |
| Lake terrain GLB | `public/scenes/scene-03/house_on_lake.glb` (11.5 MB) | ✅ Exists | Scene 03 | No code descriptor yet. |
| Cliff GLB | — | ⬜ Missing | Scene 02 | Dream world cliff + endless loop platform. Strange scale. Fog-heavy. |
| Bench prop | — | ⬜ Missing | Scene 05 | Bench for dad + elders. Could be a simple model or primitive. |
| Roksana — archaeological terrain | `public/scenes/scene-04/complejo_arqueologico_*.glb` (×3, 33–57 MB each) | ✅ Exists (placeholder) | Scene 04 | Placeholder content. Very large files — performance review needed before use. |
| Roksana — army helicopter | `public/scenes/scene-04/army_helicopter.glb` (1.1 MB) | ✅ Exists (placeholder) | Scene 04 | Placeholder. |
| Roksana — ER2 train (1k) | `public/scenes/scene-04/er2_trainset 1k.glb` (9.3 MB) | ✅ Exists (placeholder) | Scene 04 | Placeholder. |
| Roksana — ER2 train (4k) | `public/scenes/scene-04/er2_trainset 4k.glb` (12.5 MB) | ✅ Exists (placeholder) | Scene 04 | Placeholder — prefer 1k for perf. |
| Roksana — Kamaz truck | `public/scenes/scene-04/kamaz-4310.glb` (3.3 MB) | ✅ Exists (placeholder) | Scene 04 | Placeholder. |
| Roksana — railway diorama | `public/scenes/scene-04/railway_test_diorama_2.glb` (4.4 MB) | ✅ Exists (placeholder) | Scene 04 | Placeholder. |
| Prop — dirty stones pile | `public/models/dirty_stones_pile.glb` (9.8 MB) | ✅ Exists | Scene 01 | Currently placed in scene-01 descriptor. |

### Character + NPC Assets

| Asset | File | Status | Needed by | Notes |
|---|---|---|---|---|
| Adult player character | `public/Remy.fbx` (27 MB) | ✅ Exists | Scenes 01, 02, 04, 05 | Mixamo Remy. Used as default character across all adult scenes. |
| Child player character | — | ⬜ Missing | Scene 03 | Smaller scale. Same rig contract as Remy (Mixamo skeleton). Blocks avatar switching in 4A. |
| Old man (dad) — chibi NPC | — | ⬜ Missing | Scenes 01, 05 | Repelling/distant appearance. Must carry subtle visual DNA matching young dad. |
| Young man (dad) — chibi NPC | — | ⬜ Missing | Scene 03 | Warm, energetic. Visual DNA links to old man. Activity-scripted behavior. |
| Elders (2–3 NPCs) — chibi | — | ⬜ Missing | Scene 05 | Seated/bench. Laugh animations required. |

### Phone Models

| Asset | Status | Needed by | Notes |
|---|---|---|---|
| Phone model variants (3–5) | ⬜ Missing | Phase 4B | Nokia-style candybar, current smartphone, [TBD]. Small chibi-scale props. |

### Special / VFX Assets

| Asset | Status | Needed by | Notes |
|---|---|---|---|
| Dead sun mesh | ⬜ Missing | Phase 4A (Scene 01 sky), Phase 4C (supernova) | Static amber disk. Built in Three.js geometry or as a simple GLB. Can be a PlaneGeometry with emissive material — does not require a sourced asset. |
| Supernova particle system | ⬜ Not started | Phase 4C | Built in Three.js — not a sourced asset. Code deliverable. |

### Animation Clips

| Asset | Status | Needed by | Notes |
|---|---|---|---|
| Mixamo locomotion clips | ✅ Exists (via `@base/player-three`) | All scenes | Walk, run, jump, crouch, swim — wired. |
| NPC walk-lead clip | ⬜ Missing | Phase 4A (Scene 01 NPC) | Old man leading player up hill. Can use Mixamo walk as placeholder. |
| NPC idle-stand clip | ⬜ Missing | Phase 4A | Can use Mixamo idle as placeholder. |
| NPC idle-seated clip | ⬜ Missing | Phase 4A (Scene 05 elders) | Seated idle. No direct Mixamo equivalent — may need custom clip. |
| NPC laugh clip | ⬜ Missing | Phase 4C | Elders + young dad laugh. Mixamo has laugh animations. |
| NPC lean-in clip | ⬜ Missing | Phase 4C | Elders leaning to look at photo. |
| Player laugh clip | ⬜ Missing | Phase 4C | Used in Win B sequence. Mixamo available. |
| NPC activity clip | ⬜ Missing | Phase 4A (Scene 03 young dad) | Fishing or kayaking activity. Mixamo has variants. |

### Audio Assets

| Asset | Status | Needed by | Notes |
|---|---|---|---|
| Autumn ambience | ⬜ Missing | Phase 4E | Scenes 1, 5. Wind, leaves, cold quiet. |
| Dream ambient | ⬜ Missing | Phase 4E | Scenes 2, 4. Strange, underwater feel. |
| Lake sounds | ⬜ Missing | Phase 4E | Scene 3. Water, activity, warmth. |
| Win score | ⬜ Missing | Phase 4E | Supernova moment. |
| Lose score (muted, elegiac) | ⬜ Missing | Phase 4E | Missed-moments slideshow. |

### Asset Acquisition Priority

| Priority | Asset | Blocks |
|---|---|---|
| 🔴 P1 — Phase 4A blocked | Child player character | Avatar switching system |
| 🔴 P1 — Phase 4A blocked | Old man NPC model | NPC system v1 validation |
| 🔴 P1 — Phase 4A blocked | Young man NPC model | NPC system v1 validation |
| 🔴 P1 — Phase 4A blocked | Elder NPC models (×2–3) | NPC system v1 validation |
| 🟡 P2 — Phase 4B blocked | Phone models (×3–5) | Phone entity + model selection |
| 🟡 P2 — Phase 4C blocked | NPC laugh + lean-in clips | Laughter sequences |
| 🟡 P2 — Phase 4C blocked | Player laugh clip | Win B sequence |
| 🟢 P3 — Phase 4E only | All audio | Audio soundscape |
| 🟢 P3 — code-only | Dead sun mesh | Built in Three.js — no asset needed |
| 🟢 P3 — code-only | Supernova VFX | Built in Three.js — no asset needed |

---

## Phase 4A — Scene Infrastructure + Core Loop

**Goal:** Player can walk through all 5 scenes in sequence. Placeholder art, no game mechanics. The loop is playable start to finish.

**Estimated scope:** Large. This is the foundation everything else builds on.

**Content asset requirement:** Adult player + child models needed. NPC placeholder meshes (can be primitives) for validation. Hill GLB prototype for Scene 1. Other scenes can use primitives initially.

### Deliverables

- [ ] **Menu screen redesigned as phone interface** — The main menu is presented through / alongside the phone. Phone model selection (3–5 options). Phone interaction (tap/click) enters the game. Replaces generic pwa-shell menu. Must feel like the phone is the entry point, not just a UI element.
- [ ] **Atmosphere profile system** — Two named profiles: `realWorld` (chibi fog, amber sky, autumn palette, cold light) and `dreamWorld` (realistic cold fog, desaturated, grey-blue tones). Each scene tagged with its plane. Profile drives fog density, sky config, ambient light color, and shadow color.
- [ ] **World plane transition** — On scene change between planes: crossfade or dissolve between atmosphere profiles. The transition is not explained — it simply happens. Duration and effect TBD at authoring time.
- [ ] **Scene registry extended to 5 scenes** — `scene-01` through `scene-05` registered with correct transition edges.
- [ ] **Scene 1 descriptor** — Hill terrain (GLB prototype), `realWorld` atmosphere, dead sun sky config (amber disk, motionless — static mesh in sky), old man NPC spawn, ascent path, exit zone at hilltop.
- [ ] **Scene 2 descriptor** — Cliff geometry (`dreamWorld` atmosphere), endless loop zone, death trigger at base, respawn point at rock top. Double-jump-to-scene-exit already wired via `secretDoubleJump`.
- [ ] **Scene 2 death/reset** — Player falls → death trigger fires → dreamlike respawn on rock. No death screen. No score penalty. Silent loop continuation.
- [ ] **Scene 3 descriptor** — Lake terrain, dock, `realWorld` atmosphere (warm variant), child avatar spawn, young dad NPC spawn, activity area, photographable moment zones (stubs — content TBD).
- [ ] **Scene 5 descriptor** — Same hill GLB as Scene 1 (shared asset), bench placement, `realWorld` atmosphere, elder NPC spawns (3), interaction zone near bench.
- [ ] **Avatar switching system** — `AvatarController` or flag in `ThirdPersonSceneModule`: swap between adult and child model on scene load. Child: smaller scale, adjusted camera height. Transition on scene change — not visible to player.
- [ ] **NPC system v1** — `NpcEntity` class with three behavior modes: `follow-path` (old man leads in Scene 1), `activity-scripted` (young dad in Scene 3), `idle-seated` (elders in Scene 5). Proximity trigger: player within range → `game:npc-interact-available`. Animation states stubbed — placeholder clips acceptable for 4A.
- [ ] **NPC animation state contract locked** — Before NPC system is built, define and document the exact animation states required per NPC. This is the contract Mixamo clip sourcing must satisfy. States: old man (`walk-lead`, `idle-stand`, `point`), young dad (`activity`, `laugh`), elders (`idle-seated`, `lean-in`, `laugh`), player (`laugh`).
- [ ] **Scene exit conditions** — Scene 1: `game:scene-changed` on hilltop arrival. Scene 2: already wired. Scene 3: memory plays out → `game:scene-changed`. Scene 5: awaits 4C outcome events.
- [ ] **Scene 4 structural slot** — Placeholder scene registered. Entry/exit contracts identical. Content blocked until Roksana polishing pass.
- [ ] **Cinematic camera controller — interface stub** — `CinematicCamera` class with `play(sequence: CinematicSequence)` API. Interrupts player camera. Returns control after sequence. No sequences authored yet — consumed in 4C.

### Exit criteria

A person can start the game from the phone-interface menu, choose a phone model, walk through Scene 1 (follow old man up hill), enter Scene 2 (discover double jump via falling, respawn on crash, clear cliff on mid-fall jump), arrive at Scene 3 (as child, with young dad visible), and proceed to Scene 5 (bench, elders present). No game mechanics work. Placeholder art acceptable. The loop runs start to finish.

---

## Phase 4B — Phone + Snapshot System

**Goal:** The phone mechanic is fully functional. Player loses it in Scene 1, discovers it in Scene 3, takes a photo, and carries it to Scene 5. The missed-moments tracker begins populating.

**Depends on:** Phase 4A complete.

**Content asset requirement:** Phone models (3–5) needed before this phase can be validated.

### Deliverables

- [ ] **Phone model rendering** — The selected phone model renders correctly at menu scale and as a world entity in Scene 3. Model follows selected variant.
- [ ] **Phone state machine in game store** — States: `present` (menu) → `lost` (Scene 1) → `recovered` (Scene 3) → `shared` (Scene 5). Persisted across scene transitions.
- [ ] **Phone loss (Scene 1, V1)** — Phone is inaccessible from Scene 1 start. Player cannot access it. No explanation. UI: no phone button/icon visible.
- [ ] **Phone recovery (Scene 3)** — Pocket discovery mechanic: player interaction (near a photographable moment, or explicit pocket-check) reveals the phone. Phone state → `recovered`. Not announced.
- [ ] **Viewfinder UI overlay** — When phone is raised: minimal viewfinder frame appears (fullscreen or partial). Capture gesture/button. No instruction text — the viewfinder IS the instruction.
- [ ] **Photo taking mechanic** — Player aims phone at a photographable moment marker → hold or tap → snapshot created (scene ID + moment ID + thumbnail if feasible). Simple and responsive.
- [ ] **Photographable moment markers** — Scene 3 descriptor includes 2+ tagged positions with scene-specific metadata. V1: only first is accessible per playthrough. Positions chosen at authoring time (TBD during Scene 3 content work).
- [ ] **Missed-moments tracker** — Game store records every photographable moment the player enters proximity of. Proximity entry alone (without capture) logs the moment as "available but missed." Required input for the 4C lose-condition slideshow.
- [ ] **Snapshot inventory in game store** — Array of captured snapshot metadata. Persisted. Carried to Scene 5.
- [ ] **Sequential unlock tracking** — Per-scene playthrough counter. Second photographable moment unlocks after first is captured (may be across separate runs). Persisted in `PlatformAdapter.storage`.

### Exit criteria

Player selects a phone model on the menu. In Scene 1, phone is inaccessible. In Scene 3, player discovers phone in pocket and photographs a moment with young dad. The snapshot is in inventory when they reach Scene 5. The missed-moments tracker has logged what the player was near but did not capture.

---

## Phase 4C — Win / Lose + Endings

**Goal:** All three outcomes are functional. The game has a real ending. Both win paths end in supernova. The lose path ends in the missed-moments slideshow.

**Depends on:** Phase 4B complete. Dead sun mesh asset needed.

### Deliverables

- [ ] **Cinematic camera controller — implementation** — Full implementation against the 4A stub. `CinematicSequence` type: array of `{ target, position, duration, easing }`. Sequence playback. Return to player control. Used for Win A sharing sequence, potentially for other moments.
- [ ] **Laughter + sharing animation sequences** — NPC animation states wired to laughter triggers: elders `lean-in` → `laugh` sequence. Young dad `laugh`. Player character `laugh`. These are animation clips sourced in parallel with 4C code work.
- [ ] **Win A mechanic (snapshot sharing)** — Player brings phone/snapshot near elders in Scene 5. Proximity trigger fires (discoverable — no prompt). `CinematicCamera` sequence plays: camera moves to show the sharing. NPCs react (lean-in → laugh). `game:report-outcome { kind: 'win', path: 'archivist' }` emitted.
- [ ] **Lose mechanic (soft exit)** — Scene 5 grace period timer or specific player idle state. If Win A or Win B not triggered within conditions → `game:report-outcome { kind: 'lose' }`. Elders continue laughing. Player watches from outside.
- [ ] **Missed-moments slideshow** — UI sequencer for lose condition: reads missed-moments tracker from game store, renders snapshot-shaped frames (empty frames with scene silhouettes, or blurred moment previews) with muted ambient audio, slow fade. Elegiac, not accusatory.
- [ ] **Dead sun mesh — Scene 1** — Static amber disk in sky. Visible from hilltop. Not animated. Placed in Scene 1 descriptor. Also used as the origin point of the supernova in endings.
- [ ] **Supernova VFX — explosion sequence** — Three.js particle system: expanding ring of particles from dead sun position, point light color ramp (amber → white → dim), duration ~5–8 seconds. Bloom via post-processing if feasible without `@base/postfx`; otherwise accept without. Plays for Win A + Win B.
- [ ] **Slow fade ending (Lose)** — Dead sun dims (animate opacity/intensity of dead sun light over ~10s). Ambient light falls. Fade to black. Missed-moments slideshow plays over fade.
- [ ] **Post-outcome UI** — Win screen (minimal — perhaps just the fading supernova light with "return to menu"). Lose screen (after slideshow ends, quiet "return to menu"). Credits placeholder.
- [ ] **`game:report-outcome` fully wired** — All three outcome paths emit correctly. `GameLogicModule` transitions to `won` / `lost`. HUD reflects state.

### Exit criteria

Full loop is winnable (Win A: bring snapshot to elders → supernova) and losable (do nothing in Scene 5 → slideshow → fade). Both endings play out visually with the correct audio register. Player can return to menu from either outcome.

---

## Phase 4D — Discovery + Recognition

**Goal:** The game's discoverable layers are functional. Players who explore are rewarded in ways players who don't will never know exist.

**Depends on:** Phase 4C complete.

**Pre-work required:** Win B physical trigger (object/zone in Scene 5) must be designed before code work begins. This is a design decision, not a code decision. Resolve during Scene 5 content authoring.

### Deliverables

- [ ] **Win B zone — design spec resolved** — Document: what physical object or zone exists in Scene 5 that triggers Win B? Where on the map? What does the player do / what happens to them? How does it lead to the laughter sequence? This must be in `scene-05-house-on-hill.md` before code starts.
- [ ] **Win B mechanic — discoverable trigger** — Physical object or zone present but unmarked on Scene 5 map. Player encounters it → character stumble/pause/stillness animation → involuntary laughter sequence (player `laugh` clip) → elders respond → cinematic sequence → supernova. `game:report-outcome { kind: 'win', path: 'present' }`.
- [ ] **Dad recognition tracker** — Game store flag: `dadRecognized: boolean`. Set to `true` when player has seen both old dad (proximity in Scene 1) and young dad (proximity in Scene 3) in the same playthrough.
- [ ] **Recognition reward mechanic (Scene 5)** — If `dadRecognized`, a specific interaction near the father unlocks. [TBD: resolved in `scene-05-house-on-hill.md` before code starts.] Players without `dadRecognized` see nothing different.
- [ ] **Discovery audit** — All discoverable mechanics reviewed: phone pocket recovery, Win B trigger, recognition reward. Confirm: no UI prompt, no map marker, no tooltip points to any of them. A curious player finds them; a linear player does not.

### Exit criteria

A player who explores carefully in Scene 5 can trigger Win B without ever being told it exists. A player who recognizes the father across scenes gets access to an interaction layer no one else sees. A player who plays linearly encounters neither.

---

## Phase 4E — Content + Polish

**Goal:** The game feels intentional throughout. Scene 4 is authored. Audio is in. Polish passes applied. Mobile validated.

**Depends on:** Phase 4D complete. Roksana polishing pass complete (for Scene 4).

### Deliverables

- [ ] **Scene 4 authoring** — Replace placeholder with correctly expressed adult-life-struggle dream sequence. Roksana polishing pass precedes this. Entry/exit contracts already stable.
- [ ] **Second memory moment (Scene 3)** — Sequential unlock: second photographable beat becomes accessible after first is taken. Different angle or beat within the same activity.
- [ ] **Audio soundscape** — Tracks assigned per scene. Autumn ambience (Scenes 1, 5). Dream ambient (Scenes 2, 4). Lake sounds (Scene 3). Win score (supernova). Lose score (muted, elegiac). All assets must exist before this deliverable.
- [ ] **Phone mid-scene loss (polish pass)** — Replace V1 immediate inaccessibility with mid-ascent reaching gesture in Scene 1. Player reaches for phone at emotionally charged beat during ascent — finds nothing. Requires authoring: what is that specific beat? (Dad says something? The dead sun comes into view?)
- [ ] **Shadows** — `renderer.shadowMap` enabled. Dead sun as shadow caster. Character and terrain receive/cast shadows. Per atmosphere profile config.
- [ ] **HUD finalization** — Minimal. Phone-absent state is communicated subtly (or not at all — the player simply cannot access the phone). No snapshot counter. No objective markers.
- [ ] **Content asset quality pass** — All models reviewed against the chibi/Ghibli direction. NPC visual DNA check (old man ↔ young dad recognizable but not obvious). Phone models at correct chibi scale.
- [ ] **Mobile PWA validation** — Game plays on mobile. Touch controls functional. Phone model selection works on mobile screen sizes. Meta-layer (player holds real phone while playing) informally confirmed during internal testing.

### Exit criteria

A complete stranger can pick up the game on mobile, play from the phone-interface menu to any one of the three endings, and the experience feels coherent and intentional from first scene to final frame.

---

## Open Decisions — Resolved by Game Design

| Decision | Resolution |
|---|---|
| Game genre | Narrative / exploration. No combat. No score. |
| Physics engine (Rapier vs raycasting) | Three.js raycasting — sufficient for this game type. No Rapier. |
| ECS depth | Light — no component scheduling needed. `ThreeEntityManager` as-is. |
| Scene format | GLB + descriptor — already in use, continue. |
| NPC AI | None in V1. Simple scripted behaviors only (follow path, idle, activity). |
| Multiplayer | Out of scope. |
| `@base/postfx` (EffectComposer) | Defer. Supernova effect built with Three.js particles first. Revisit if visual bar requires bloom. |
| Win / lose | Two win paths (archivist, present). One soft lose (missed-moments slideshow). No hard game-over in V1. |
| Phone model selection | Quick, visual, menu screen. 3–5 models. Not a lengthy flow. |

---

## @base Dependencies (what three-dreams needs from Phase 3)

| Need | Status |
|---|---|
| Phase 3d (camera strategy switching in editor) | Pending — not a blocker for 4A game content, but needed before cinematic camera decisions are finalized |
| `@base/player-three` uphill fix + jump calibration | In progress — pull when shipped |
| `@base/scene-builder` SwimmableVolume | Needed for Scene 3 lake if swimming crossing is included |

---

## Deferred / Post-Production

See also: `docs/game-design/GDD.md` — Post-Production Notes section.

| Item | Trigger |
|---|---|
| Real-world phone integration (contacts access, real camera) | Post-launch, opt-in, requires platform permissions design and consent |
| Hard lose condition (dire real-world consequence) | After Roksana polishing pass — cost of lose must be inverse of what Scene 4 costs |
| Additional memory scenes (new settings beyond lake) | After V1 ships — expansion path, sequential unlock system already designed for it |
| `@base/npc-three` extraction | When a second game needs NPC path-following |
| `@base/interaction` extraction | When a second game needs proximity triggers / item pickup |
| `@base/vfx` extraction | When a second game needs authored visual effects |
| `@base/camera-three` cinematic extension | When a second game needs scripted camera sequences |
| Steam build (Phase 5–6) | After Phase 4E complete |
| Electron desktop build | After Phase 4E complete |

---

## Related Docs

- [GDD — Master Design Document](./game-design/GDD.md)
- [Scene 01 — House on the Hill](./game-design/scenes/scene-01-house-on-hill.md)
- [Scene 02 — Enter Dreams](./game-design/scenes/scene-02-enter-dreams.md)
- [Scene 03 — House on the Lake](./game-design/scenes/scene-03-house-on-lake.md)
- [Scene 04 — Roksana (placeholder)](./game-design/scenes/scene-04-roksana.md)
- [Scene 05 — Return](./game-design/scenes/scene-05-return.md)
- [Game State System](./game-state-system.md)
- [Master Roadmap](../../docs/roadmap/00-master-roadmap.md)

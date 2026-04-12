# PROJECT.md — three-dreams

## Identity

- **Module:** `three-dreams` (Phase 4 game fork)
- **Role:** The first game experience built on the @base platform. Consumes `@base/threejs-engine`, `@base/player-three`, `@base/scene-builder`, `@base/camera-three`, `@base/input`, and `@base/audio` to deliver a playable narrative/exploration game.
- **Fork of:** `BASE/pwa-shell`
- **Extracts to:** Game-specific logic stays in this repo. Reusable patterns may graduate to SHARED if proven across forks.

## Narrative Spine

A personal retelling of the Prodigal Son (Возвращение блудного сына). A son returns home to the father after adult life's struggle and displacement. Through memory, dream, and discovery he recovers what was real — and comes home with it.

Thematic anchor: "Есть только миг между прошлым и будущим — именно он называется жизнь." (Lyube)

## North Star

A complete, shippable first game loop: a player explores a Three.js world through multiple scenes, reaches an end state, and the experience feels intentional from main menu to credits.

## Current Milestone

**Phase 4B/4C — Narrative, Exploration & Cinematic Camera**

Content track active. Phase 4C (cinematic camera) is now unblocked — harness Phase 3d signed off 2026-04-12. Camera architecture reviewed; cinematic mode is purely additive. See `SHARED/packages/camera-three/ARCHITECTURE.md`.

## Harmonized Plan (2026-04-12)

Work is organized in three tracks. Content track runs independently; infrastructure track improves shared quality; cinematic track opens when the harness gate closes.

### Content Track (independent, active now)

| # | Target | Est. | Status |
|---|--------|------|--------|
| 1 | Player GLB migration — fix T-pose, switch FBX→GLB animation pipeline | 1 session | Pending |
| 2 | Dialog system design + implementation — NPC interaction trigger + dialog UI | 1-2 sessions | Pending |
| 3 | NPC guidance system — contextual hints via dialogue, not HUD | 1 session | Pending |
| 4 | Reaction engine features — interact-key stimulus, cooldowns, branching dialog | 1-2 sessions | Pending |
| 5 | Scene-01 narrative flow — beginning → middle → end, env reactions | Ongoing | Pending |
| 6 | Sound effects for reactions | 1 session | Pending |
| 7 | Scene-05 bench + elder NPC stubs | 1 session | Pending |

### Infrastructure Track (parallel with harness, not blocking)

| # | Target | Est. | Status |
|---|--------|------|--------|
| 8 | GameplaySceneModule refactor (game side) — clean up legacy overrides | 1 session | Pending |
| 9 | Input settings page (shared component from harness) | 1 session | Pending |
| 10 | KTX2 texture compression (needs ktx binary install) | Setup task | Deferred |

### Cinematic Track (blocked on harness Phase 3d)

| # | Target | Status |
|---|--------|--------|
| 11 | Phase 4C — Cinematic camera transitions | **Unblocked** |
| 12 | Camera rail system for scripted sequences | **Unblocked** |
| 13 | Smooth blend between camera modes | **Unblocked** |

### Scene-02 (asset-blocked)

| # | Target | Status |
|---|--------|--------|
| 14 | Scene-02 cliff GLB (replace procedural heightmap) | Waiting on asset |
| 15 | Scene-02 gameplay polish | Waiting on 14 |

### Sequencing Principle

Steady progress building a solid foundation. Content work and infrastructure quality improvements run in parallel. No rushing toward ship — the game ships when every layer is right.

## V1 Scope

**In scope:**
- Full engine stack mounted: `ThreeModule` → `InputModule`, `AudioModule`, `ThirdPersonSceneModule`
- `GameLogicModule` — game rules, session state machine, scene transitions
- Scene registry + session transition system (`sessionTypes.ts`, `sessionTransitions.ts`)
- `GameplayPolicy` — which scenes are accessible and in what order
- 5 scenes: sandbox, scene-01 through scene-05 (04 structural placeholder)
- Pinia `useGameStore` — player state, current scene, save data skeleton
- Shell UI: main menu, phone profiler, HUD placeholder, pause menu
- Dialog system + NPC guidance through dialogue
- Reaction engine (stimulus-response) for NPC interactions + env reactions

**Out of scope for v1:**
- Steam / Electron packaging (Phase 5–6)
- Multiplayer, NPCs with AI dialogue
- Save/load persistence (placeholder architecture only)
- Full audio soundscape (deferred — game scene content not locked yet)
- Camera mode switching as player feature (adopt Phase 3d patterns when ready)

## Stack (beyond base fork)

- `@base/threejs-engine`: Three.js renderer, ThreeContext, ECS
- `@base/player-three`: PlayerController + CharacterAnimationRig (mirrors engine-dev harness)
- `@base/scene-builder`: SceneDescriptor, SceneBuilder, SwimmableVolume, TerrainSampler
- `@base/camera-three`: GameplayCameraController, third-person presets
- `@base/input`: abstract input actions
- `@base/audio`: AudioManager, MusicLayer
- Scene registry pattern (`scenes/registry.ts`) — maps scene IDs to descriptors and module constructors

## Architectural Decisions

<!-- Append-only. Date each entry. Never remove old decisions. -->

- **2026-03-28** — Scene management via explicit registry (`scenes/registry.ts`) + session transition type system, not imperative scene ID strings inline. Makes scene dependencies and legal transitions auditable.
- **2026-03-28** — `GameLogicModule` owns game state (session, player health, save) — engine modules own only rendering + physics. Clean boundary; engine never references game rules.
- **2026-03-28** — Mirrors `threejs-engine-dev` SandboxSceneModule for calibration. Keeps the harness and game fork in sync during Phase 3–4 transition.
- **2026-03-28** — Narrative spine confirmed: Prodigal Son parable (Возвращение блудного сына). All scene design decisions derive from this frame.
- **2026-03-28** — Two-plane art direction locked: real world = low-poly chibi Ghibli-inspired (autumn, cold, fog); dream world = realistic but cold/foggy (not photorealistic — atmosphere provides cover). Planes are not visually causally connected — dissonance is intentional.
- **2026-03-28** — Dead sun: literal amber disk in sky, motionless. Shown without explanation. Player assigns meaning. Cosmological frame governs win (supernova) and lose (slow fade) endings.
- **2026-03-28** — Discovery is the primary progression mechanic. No tutorial prompts. Camera in pocket, alternative win path, and scene transitions are all discoverable not announced.
- **2026-03-28** — Scene 4 (adult life struggle) is a structural placeholder (Roksana). Contracts stable; content replaceable when a better-fitted scenario is identified from other recorded dreams.
- **2026-03-28** — Memory scenes support multiple photographable moments per scene. One per playthrough; sequential unlock opens replayability. V1 ships with Scene 3 as primary memory scene.
- **2026-03-28** — Dad recognition arc: old man (Scene 1) and young man (Scene 3) are the same character. Recognition is player-discovered, not announced. Unlocks a richer interaction layer in Scene 5.

# PROJECT.md — three-dreams

## Identity

- **Module:** `three-dreams` (Phase 4 game fork)
- **Role:** The first game experience built on the @base platform. Consumes `@base/threejs-engine`, `@base/player-three`, `@base/scene-builder`, `@base/camera-three`, `@base/input`, and `@base/audio` to deliver a playable narrative/exploration game.
- **Fork of:** `BASE/pwa-shell`
- **Extracts to:** Game-specific logic stays in this repo. Reusable patterns may graduate to SHARED if proven across forks.

## North Star

A complete, shippable first game loop: a player explores a Three.js world through multiple scenes, reaches an end state, and the experience feels intentional from main menu to credits.

## Current Milestone

**Phase 4 bootstrap** — Wire the full engine stack into the game fork, establish scene registry + transition system, and validate that `threejs-engine-dev` harness work transfers cleanly into the game context.

## V1 Scope

**In scope:**
- Full engine stack mounted: `ThreeModule` → `InputModule`, `AudioModule`, `ThirdPersonSceneModule`
- `GameLogicModule` — game rules, session state machine, scene transitions
- Scene registry + session transition system (`sessionTypes.ts`, `sessionTransitions.ts`)
- `GameplayPolicy` — which scenes are accessible and in what order
- Multiple scenes: sandbox, scene-01, scene-02 (at minimum)
- Pinia `useGameStore` — player state, current scene, save data skeleton
- Shell UI: main menu, HUD placeholder, pause menu
- Swimming crossing in scene water volumes (inherits from engine harness work)

**Out of scope for v1:**
- Steam / Electron packaging (Phase 5–6)
- Multiplayer, NPCs with AI
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

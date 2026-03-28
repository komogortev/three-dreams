# STATE.md — three-dreams

## Status

_Last updated: 2026-03-28_

**What's working:** Scene registry, session transition types, and `gameplayPolicy` wired. Sandbox and scene-01/scene-02 registered. `GameLogicModule` scaffolded with game store integration. `SandboxSceneModule` mirrors the engine-dev harness (ramps, pool, time controls). Third-person orbit camera inherited from harness. Swimming v1 transferred: water mode activates at shoulder depth, tread/swim animations load.

**What's broken / incomplete:** Swimming animations not visually confirmed in-game context (same clip-name resolution question as harness). Scene-01 and scene-02 are placeholder descriptors — game content not authored. `GameLogicModule` has no win/fail conditions yet. HUD is a stub. Save/load not wired.

## Active Work

- Receiving swimming + uphill fixes from `threejs-engine-dev` harness as they ship
- No new game-specific code until Phase 3d camera work lands in harness

## Blockers & Open Questions

- **[2026-03-28]** `threejs-engine-dev` Phase 3d (camera strategy switching) must land before game camera decisions are locked in. Blocked on harness completion.
- **[2026-03-28]** Game content (what the player actually does in scene-01/scene-02) undefined. Placeholder scenes only. Need game design decision before Phase 4 progresses beyond infrastructure.

## Next Session

> After `threejs-engine-dev` ships the uphill fix + jump calibration, pull updated `@base/player-three` into this fork and smoke-test the sandbox scene. Then author the first intentional game scene: replace scene-01 placeholder descriptor with a real terrain + water crossing that tests the full movement stack.

## Decision Log

<!-- Append-only. One line per decision, newest first. -->

- **2026-03-28** — Scene registry pattern (`scenes/registry.ts`) adopted over inline scene IDs. Registry makes legal transitions explicit and auditable for QA.
- **2026-03-28** — Mirrors engine-dev SandboxSceneModule exactly. Keeps calibration tools accessible in game context without duplicating logic.
- **2026-03-28** — Game fork tracks harness branch checkpoints. Game-specific divergence starts only after Phase 3d is signed off.

## Deferred

- **Game content (scene-01, scene-02):** Placeholder descriptors only. Needs game design decision on what the player does. Pick up after Phase 3d.
- **HUD:** Stub renders. Full HUD requires locked game mechanics to know what to surface.
- **Save/load persistence:** Architecture placeholder in `useGameStore`. Implement when game has content worth saving.
- **Audio soundscape:** `AudioModule` mounted, no tracks assigned. Deferred pending scene content lock.
- **Phase 5 Electron build:** Out of scope until Phase 4 game loop is complete and validated.

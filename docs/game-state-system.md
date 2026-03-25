# Game state system — plan

> **Scope:** `first-game` Phase 4 — how run lifecycle, phases, and persistence fit together.  
> **Stack:** Pinia, shell `EventBus` (`useShellContext`), `GameLogicModule`, `ThreeModule` children.

---

## Goals

- **Single source of truth** for “what phase is this play session in?” while `/game` is mounted.
- **Clear split** between engine-side rules (module) and UI + disk (Vue / Pinia).
- **Stable contracts** via named bus events so overlays, HUD, and menus do not duplicate logic.
- **Clean teardown** when leaving `/game` (no leaked listeners).

---

## Two layers

### 1. Session / runtime state (authoritative during play)

**Owner:** `GameLogicModule` (plus small imported helpers).

**Driven by:** `engine:frame`, `input:action` / `input:axis`, and domain events you add (e.g. `game:request-*` from UI).

**Should incorporate:**

| Concern | Notes |
|--------|--------|
| **Top-level phase** | Finite machine: e.g. `booting` → `playing` → `paused` → `resolving` → `won` \| `lost` → `exiting`. One active top phase; nested substates (dialogue, cinematic) can come later. |
| **Run identity** | `runId` or monotonic counter so UI and saves can distinguish this run from the previous one. |
| **Scene / level pointer** | `sceneId` (string or enum). Later: coordinate load/unload with scene modules and `mountChild`. |
| **Mechanic flags** | Minimal rule memory: e.g. objective bits, cooldowns, “air jump used” — only what mechanics need, not duplicate UI state. |
| **Subscriptions** | Register in `onMount`, tear down in `onUnmount`: pause, interact, outcomes, etc. |

**Responsibilities:**

- Decide **when** transitions are allowed (e.g. pause only from `playing`).
- **Emit** on `context.eventBus`: e.g. `game:phase-changed`, `game:scene-changed`, `game:outcome` `{ kind: 'win' \| 'lose', reason?: string }`.
- Trigger **engine-side behaviour** tied to phase (e.g. ignore move intent while paused — here or via events consumed by the scene module).
- **Do not** own mesh/scene graph, camera maths, or raw key bindings.

### 2. Presentation + persistence (Vue / Pinia)

**Owner:** `useGameStore` (to be added) and thin composables if needed.

**Should incorporate:**

| Concern | Notes |
|--------|--------|
| **UI mirror** | `phase`, `sceneId`, `lastOutcome`, `canContinue` — updated from bus listeners (single bridge in `GameView` or `App`). |
| **Persistence** | Save/load via `PlatformAdapter.storage`: versioned JSON, small schema (`lastSceneId`, flags, settings). |
| **Menu commands** | New game / continue **emit** `game:request-new-run` / `game:request-continue` (or similar) so `GameLogicModule` remains authoritative. |

**Responsibilities:**

- Drive **overlays** (pause, win/lose, loading).
- **Serialize** snapshots on exit or checkpoint; **hydrate** for Continue.
- **Avoid** being the only place that encodes transition rules — sync **from** runtime events, not parallel truth.

---

## Bridge contract (module ↔ UI)

| Direction | Mechanism |
|-----------|-----------|
| Module → UI | `context.eventBus.emit('game:…', payload)` |
| UI → Module | `context.eventBus.emit('game:request-…', payload)` |
| Hard leave play | `navigate('/'` or `router.push` when the product should tear down the engine route entirely |

**Preference:** Do **not** import Pinia inside `GameLogicModule` — keeps the module testable and host-agnostic.

---

## Out of scope for “game state”

- **Locomotion** — `@base/player-three` / scene module.
- **Camera rigs** — `@base/camera-three`; game state may *request* a mode via events.
- **Input binding** — `@base/input`; game logic consumes `input:*`, not keyboard codes.
- **Scene authoring data** — `SceneDescriptor` / `SceneBuilder` live in harness or shared packages; game state holds **which** scene is active and **outcomes**, not how geometry is built.

---

## Suggested implementation order

1. **Types + event names** — `GamePhase`, central list of `game:*` event strings (and payload types).
2. **`useGameStore`** — fields + reducers; one place subscribes to the bus and updates the store.
3. **`GameLogicModule`** — internal phase, `onMount` subscriptions, emit `game:phase-changed` on transitions.
4. **Pause UI** — overlay bound to store, `input` for pause from module → store.
5. **Save / continue** — minimal blob + version field; Continue emits load request with hydrated payload.

---

## Exit criteria (for this subsystem)

- While `/game` is active, **one** authoritative phase for the run (the module).
- Vue **reflects** phase/outcome via bus → store; no copy-pasted phase checks across unrelated components.
- Leaving `/game` **unsubscribes** all `GameLogicModule` listeners.
- Persisted data includes **`schemaVersion`** (or equivalent) for future migrations.

---

## Related

- Shell store today: `src/stores/shell.ts` (locale, `activeModuleId`) — orthogonal to run phase; keep separate from `useGameStore`.
- Ecosystem phases: `docs/roadmap/00-master-roadmap.md` (repo root) — Phase 4 deliverables.

# first-game

Phase 4 **game fork** for the `@base` ecosystem: Vue 3 PWA shell + **`ThreeModule`** with **`InputModule`**, **`AudioModule`**, and stub **`GameLogicModule`**.

Forked from `BASE/pwa-shell`. Sibling harness for scene authoring: `threejs-engine-dev/`.

## Layout (this monorepo checkout)

```text
e:/Projects/
  SHARED/packages/     # pnpm build packages you link (engine-core, threejs-engine, input, audio, …)
  first-game/          # this app — link:../SHARED/packages/*
```

## Setup

```bash
cd SHARED && pnpm install && pnpm -r build
cd ../first-game && pnpm install && pnpm dev
```

- **Menu** → **Play** mounts the engine stack on `/game`.
- `GameLogicModule` emits `game:logic-ready` once; add rules and `registerSystem` subscriptions there.

## Documentation

- [Game state system — plan](./docs/game-state-system.md) — session runtime (layer 1), bus contract, planned Pinia mirror.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `pnpm dev`     | Vite dev server          |
| `pnpm build`   | Production build         |
| `pnpm typecheck` | `vue-tsc --noEmit`     |

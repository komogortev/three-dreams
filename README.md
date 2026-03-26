# Three Dreams

Vue 3 PWA built on the **@base** stack (`engine-core`, `threejs-engine`, `input`, `audio`, `player-three`, `camera-three`, `scene-builder`). **Scene 1** is the first playable level: third-person locomotion on authored **cliff** terrain (`scene01`), default **first-person** camera at **eye height** (Tab to toggle).

**Repository:** [github.com/komogortev/three-dreams](https://github.com/komogortev/three-dreams)

**GitHub Pages (production build):** [komogortev.github.io/three-dreams/](https://komogortev.github.io/three-dreams/)

Pages deploys via **Actions** (`.github/workflows/deploy-github-pages.yml`): CI checks out [vue-three-base-packages](https://github.com/komogortev/vue-three-base-packages), builds linked `@base/*` packages, then builds this app with `VITE_BASE_PATH=/three-dreams/` so assets resolve under the project path.

## Local layout (ecosystem checkout)

```text
e:/Projects/
  SHARED/packages/     # pnpm install && pnpm build — packages linked as link:../SHARED/packages/*
  first-game/          # this repo (folder name may still be first-game locally; package name is three-dreams)
```

## Setup

```bash
cd SHARED && pnpm install && pnpm build
cd ../first-game && pnpm install && pnpm dev
```

Adjust the second path if your clone lives in `three-dreams/`.

## App routes

| Route     | Purpose |
|-----------|---------|
| `/`       | Menu — **Play** / **Continue** / **Settings**; **Scene editor** appears in dev only |
| `/game`   | Scene 1 (cliff) — `ThreeModule` + `GameLogicModule` + `ThirdPersonSceneModule` (`scene01`) |
| `/editor` | Scene editor (dev only in production builds; menu button gated by `import.meta.env.DEV`) |

## Scene content layout

Authoring lives under **`src/scenes/`**; large binaries stay under **`public/`** (Vite serves them by URL, they are not bundled).

```text
src/scenes/
  registry.ts           # SCENE_REGISTRY — ids, labels, export symbols, descriptors (editor + tooling)
  shared/               # cross-scene helpers (e.g. Mixamo clip URL list)
  scene-01/index.ts     # scene01 — cliff + heightmap + scatter
  scene-02/index.ts     # scene02 — references /scenes/scene-02/*.glb

public/scenes/scene-02/
  house_on_the_hill.glb
```

**Adding a new scene:** copy `scene-02` as a template, add assets under `public/scenes/<id>/`, register a row in **`registry.ts`**, then use **Working scene** in the editor to switch without leaving `/editor`.

**Scene 2 + GLB terrain:** Locomotion samples **descriptor terrain only**, not GLB triangles. A hill modeled *inside* the GLB is visual-only for foot placement unless you add matching **`terrain.features`** (e.g. heightmap) or change how Y is resolved (mesh pick — future work).

## Documentation

- [Fork roadmap (Phase 4)](./docs/roadmap.md) — current state, checklist, next gameplay milestone, editor heatmap research note
- [Game state system](./docs/game-state-system.md) — session phases, event bus, save key `first-game-save-v1`, Continue flow

## Scripts

| Command          | Description        |
|------------------|--------------------|
| `pnpm dev`       | Vite dev server    |
| `pnpm build`     | Production build   |
| `pnpm typecheck` | `vue-tsc --noEmit` |

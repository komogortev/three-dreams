# Three Dreams

A browser-based narrative exploration game prototype, written in Vue 3 and Three.js on the
[`@base` packages](https://github.com/komogortev/vue-three-base-packages). It is a personal retelling of the
Prodigal Son parable: a son travels back to the father waiting on the bench, through memory and dream. The
design is in [`docs/game-design/GDD.md`](./docs/game-design/GDD.md).

> **Status:** prototype. Scenes 01 to 03 are built (house on the hill, the cliff, house on the lake); scenes 04
> and 05 are placeholders, the HUD is a stub and there is no audio yet.

## What is in it

- **Third-person and first-person play** on authored terrain and GLB scenes, with Mixamo character animation:
  walk, run, crouch, jump, landing and swimming. Tab toggles the camera.
- **NPCs with dialog:** walk up to a character and press E. Scene 01 has a father figure with authored lines.
- **Phone profile menu:** the opening screen where you pick one of three phone profiles before starting a run.
- **Rebindable controls:** keyboard bindings, four ability slots and mouse buttons, on the settings page.
- **Scene registry:** each scene is a descriptor plus a gameplay policy under `src/scenes/`, built by
  `@base/scene-builder`.
- **Dev-only tools:** a scene editor and a waypoint editor, available only in the dev server.

## Run it locally

The app links the `@base/*` packages from a sibling checkout (`link:../SHARED/packages/...`), so the two
repositories must sit side by side. Needs Node 20 or newer and pnpm 9 or newer.

```bash
mkdir workspace && cd workspace
git clone https://github.com/komogortev/vue-three-base-packages SHARED
git clone https://github.com/komogortev/three-dreams
cd SHARED && pnpm install && pnpm build    # builds the @base/* packages
cd ../three-dreams && pnpm install && pnpm dev
```

## Routes

| Route | What it is |
|-------|------------|
| `/` | Menu: choose a phone, then **Play** or **Continue**; **Settings** |
| `/game` | The game, starting in scene 01 |
| `/settings` | Input bindings |
| `/editor`, `/scene-editor`, `/waypoints`, `/sandbox` | Dev tools; the production build redirects them to `/` |

## Controls

W A S D to move, Shift to sprint, Ctrl to crouch, Space to jump, Tab to switch camera, E to talk. In first
person, click the canvas to capture the mouse and Esc to release it. Bindings can be changed on the settings page.

## Scripts

| Command | What it does |
|--------|--------------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Type-check (`vue-tsc -b`) and production build |
| `pnpm preview` | Preview the production build |
| `pnpm typecheck` | `vue-tsc -b` |

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy-github-pages.yml`) checks out `vue-three-base-packages`,
builds the linked packages, then builds this app with `VITE_BASE_PATH=/three-dreams/` and publishes it to
GitHub Pages.

## Project docs

- [Game design document](./docs/game-design/GDD.md) and per-scene notes in `docs/game-design/scenes/`
- [Roadmap](./docs/roadmap.md)
- [Game state system](./docs/game-state-system.md): session phases, event bus, save and Continue flow

## License

The source code is [MIT](./LICENSE) licensed. Third-party assets bundled under `public/` (including the Mixamo
character and animations, the NPC and scene models, and the Draco decoder) keep their own terms and are not
covered by it.

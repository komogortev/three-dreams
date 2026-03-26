# Three Dreams — fork roadmap (Phase 4)

> **Repo:** [github.com/komogortev/three-dreams](https://github.com/komogortev/three-dreams) · package name `three-dreams`  
> **Ecosystem:** [Master roadmap](../../docs/roadmap/00-master-roadmap.md) (relative to a checkout where `first-game` and `docs` sit under the same parent, e.g. `Projects/`)

Phase **4** for this fork is **in progress**: stack, menu, play, two scenes, save/continue, and editor integration are live; **game fiction** (objectives, win/lose) is the next milestone.

---

## Current state (snapshot)

| Area | Status |
|------|--------|
| Engine stack | `ThreeModule`, `InputModule`, `AudioModule`, `GameLogicModule`, `ThirdPersonSceneModule` |
| Play route | `/game` — FPV default, Tab 3p/1p, `SCENE_REGISTRY` + bootstrap scene id (`Continue`, dev “Play scene 2”) |
| Content | `scene-01` (cliff + heightmap), `scene-02` (heatmap + env GLB + tuned terrain material) |
| Persistence | `useGameStore`, `first-game-save-v1`, `PlatformAdapter.storage` |
| `@base/*` | Linked `SHARED/packages/*` locally; CI builds packages for [GitHub Pages](https://komogortev.github.io/three-dreams/) |
| Editor | `/editor` (dev): working scene, walk mode, descriptor export; see app README |

---

## Phase 4 checklist (this fork)

- [x] Fork-style app on `@base/*` (not necessarily a literal `pwa-shell` git fork)
- [x] Session FSM + bus (`game:*` events)
- [x] Menu → play → return; Continue
- [x] Authored scenes + registry
- [ ] **Objective + outcome** — player understands a goal; run ends in **win** or **lose**
- [ ] **`game:report-outcome`** wired to **real triggers** (volume enter, timer, flag / collectible count, etc.)
- [ ] Post-outcome UI and return to menu (may already partially mirror phase transitions — needs design pass)
- [ ] Optional: mid-run scene change via `mountChild` / remount (currently boot-time scene id only)

---

## Next session goal (when you ask to continue gameplay work)

**Implement the first complete *meaningful* loop:**

1. Define one minimal **objective** (e.g. reach a zone, hold a timer, collect one thing).
2. Add **triggers** in the scene or module layer (axis-aligned volume, timer, or simple state).
3. Emit **`game:report-outcome`** with `kind: 'win' | 'lose'` and optional `reason`.
4. Ensure **`GameLogicModule`** transitions to `won` / `lost`, store/UI reflect it, and the player can **return to menu** cleanly.

Keep scenario logic in the **game repo**; promote reusable pieces (e.g. generic trigger volume + bus event) to **`SHARED`** only when a second consumer exists.

---

## Research / feasibility (assess before building)

### Heatmap authoring in the editor (brush / sculpt)

**Idea:** Paint or **push/pull terrain height** in the editor by **mouse drag** on the terrain mesh (or a dedicated plane), then **export** a grayscale PNG compatible with `TerrainDescriptor` heightmaps (`/terrains/*.png`).

**Why:** Align heightmap **precisely** to placed GLB ground without round-tripping Blender for every tweak.

**Feasibility angles to evaluate:**

- **Data flow:** Editor already has `TerrainSampler` + displaced mesh; need either (a) edit **heightmap image** in memory and re-sample, or (b) edit **vertex displacements** then **bake** to a grid image (resolution vs terrain `resolution`).
- **UX:** Raycast to terrain, brush radius/strength, optional symmetry; undo stack.
- **Export:** Rasterize world XZ → PNG with correct **orientation** (see `HeightmapFeature` docs: top → −Z, etc.) and **worldWidth/Depth** / offsets to match the descriptor.
- **Performance:** Rebuild terrain mesh on stroke end vs every frame; debounce `SceneBuilder`-style rebuild vs partial geometry update.

**Outcome of assessment:** Either a **small MVP** (e.g. click-drag raises/lowers samples on a low-res grid + export PNG) or **defer** in favor of external tools (Photoshop, Blender) until scene count justifies the engineering.

---

## Related docs

- [Game state system](./game-state-system.md) — session layers, save key (note: some paths may still say `GameView`; play uses `SceneView`)
- [README](../README.md) — routes, scene layout, Pages build

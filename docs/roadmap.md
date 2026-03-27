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

## Checkpoint — Target 1 (double jump + secret window)

**Landed this session**

- `@base/player-three` now supports configurable airborne extra jumps with semantic movement events (`jump_started`, `extra_jump_used`, `landed`) and default-off behavior for non-consumers.
- `CharacterAnimationRig` now accepts a second-jump trigger intent with fallback to existing jump clips when a dedicated double-jump clip is absent.
- `ThirdPersonSceneModule` now includes a scene-local `secretDoubleJump` policy:
  - one-off gated second jump,
  - directional + activation-zone checks,
  - pre/post-fall secret window,
  - optional short slowmo while the window is active.
- Successful in-window second jump now emits `game:report-outcome` with `kind: 'win'` and reason `secret-double-jump-landing` on landing.

**Still open (next branch)**

- Tune scene-01 policy constants (zone center/radius, required direction, thresholds, window length) against actual cliff route.
- Add outcome UI pass and explicit post-win beat in HUD/menu flow.
- Implement the broader traversal/fall matrix (wall-upstep, catch-self, injury ladders, relocation-as-lostness) on top of the new contract.

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

---

## Asset pipeline note — scene object set extraction

### Goal

Build a reproducible pipeline to extract environment objects (trees, cars, props, etc.) from complete scene GLBs into **modular per-object GLBs** grouped as a versioned **asset set** that the editor and runtime can consume without breaking scene descriptors.

### Why now

- Current authored scenes mix bespoke GLB content and scatter primitives.
- We need style-swappable packs (e.g. realistic vs stylized) while preserving editor contracts and placement data.

### Planned work (large task)

1. Define an **asset-set contract** (ids, categories, scale metadata, pivot/orientation conventions, optional tags).
2. Define an on-disk structure under a stable root (e.g. `public/asset-sets/<set-id>/<category>/<asset-id>.glb` + manifest).
3. Build extraction tooling (semi-automated first, then automated):
   - split full GLB scene into object GLBs,
   - normalize pivots, transforms, naming,
   - generate manifest JSON compatible with editor pickers.
4. Update editor to source placeable entries from manifests (not hardcoded object lists).
5. Add compatibility rules so replacing one asset set with another does not break scene descriptors.

### Deliverable checkpoint

One reference asset set generated from current scene content + documented repeatable pipeline + editor integration on manifest-driven object palette.

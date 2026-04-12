<!--
  WaypointEditorPage — scene-01 waypoint authoring (dev-only).

  Loads scene-01's floor as the raycast target. Click the road stripe to place
  navigation waypoints along the hill path. "Copy TypeScript" generates a
  ready-to-paste ROAD_WAYPOINTS array for src/scenes/scene-01/navPath.ts.

  Route guard in router/index.ts prevents access in production builds.
  Waypoints persist to localStorage under "waypoints:scene-01".
-->
<template>
  <div class="page-wrap">
    <WaypointEditorView
      floor-glb-url="/scenes/scene-01/house_on_the_hill_mesh_ground.glb"
      :context-glb-urls="['/scenes/scene-01/house_on_the_hill_4k.glb']"
      storage-key="waypoints:scene-01"
      export-name="ROAD_WAYPOINTS"
    />

    <button class="back-btn" @click="router.push('/')">← Menu</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WaypointEditorView } from '@base/ui'

const router = useRouter()
</script>

<style scoped>
.page-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.back-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.65);
  color: #777;
  border: 1px solid #2a2a2a;
  font-family: monospace;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.12s;
}
.back-btn:hover { color: #ccc; border-color: #555; }
</style>

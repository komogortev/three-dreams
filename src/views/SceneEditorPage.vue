<!--
  SceneEditorPage — three-dreams scene editor (dev-only).

  Maps the project's SCENE_REGISTRY to SceneEditorEntry[] and passes them to
  SceneEditorView from @base/ui. Sandbox is first so it loads by default.

  Access: /#/scene-editor (dev only, guarded in router/index.ts).
-->
<template>
  <div class="page">
    <SceneEditorView :scenes="sceneEntries" />
    <button class="back-btn" @click="router.push('/')">← Back</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { SceneEditorView } from '@base/ui'
import type { SceneEditorEntry, EditorNpcEntry, EditorZoneEntry } from '@base/ui'
import { SCENE_REGISTRY, getSceneGameplayPolicy, getSceneNavigationMesh } from '@/scenes/registry'
import type { SceneRegistryEntry } from '@/scenes/registry'

const router = useRouter()

// ─── Sandbox entry ────────────────────────────────────────────────────────────
// No floor GLB — viewport falls back to invisible flat plane for raycasting.

const sandboxEntry: SceneEditorEntry = {
  id: '__sandbox__',
  label: 'Sandbox',
  config: {
    storageKeyPrefix: 'scene-editor:sandbox',
    exportNamePrefix: 'SANDBOX',
    npcs: [],
    zones: [],
  },
}

// ─── Registry → SceneEditorEntry mapping ──────────────────────────────────────

function toEditorEntry(entry: SceneRegistryEntry): SceneEditorEntry {
  const nav = getSceneNavigationMesh(entry.id)
  const policy = getSceneGameplayPolicy(entry.id)
  const glbObjects = (entry.descriptor.objects ?? []).filter(o => o.type === 'gltf')

  const npcs: EditorNpcEntry[] = (policy?.npcEntries ?? []).map(n => ({
    entityId: n.entityId,
    x: n.x,
    z: n.z,
    proximityRadius: n.proximityRadius,
  }))

  const zones: EditorZoneEntry[] = (policy?.exitZones ?? []).map((z, i) => ({
    id: `exit-${i}`,
    type: 'exit' as const,
    label: `Exit → ${z.targetSceneId ?? '?'}`,
    x: z.x,
    z: z.z,
    radius: z.radius ?? 3,
    targetSceneId: z.targetSceneId,
    color: 0xffdd44,
  }))

  const startPos = entry.descriptor.character?.startPosition
  const spawnPoint = startPos ? { x: startPos[0], z: startPos[1] } : undefined

  return {
    id: entry.id,
    label: entry.label,
    config: {
      floorGlbUrl: nav?.url,
      contextGlbUrls: glbObjects.map(o => o.url),
      storageKeyPrefix: `scene-editor:${entry.id}`,
      exportNamePrefix: entry.id.replace(/-/g, '_').toUpperCase(),
      npcs,
      zones,
      spawnPoint,
    },
  }
}

const sceneEntries: SceneEditorEntry[] = [
  sandboxEntry,
  ...SCENE_REGISTRY.map(toEditorEntry),
]
</script>

<style scoped>
.page {
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
  color: #666;
  border: 1px solid #222;
  font-family: monospace;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.1s;
}
.back-btn:hover { color: #bbb; }
</style>

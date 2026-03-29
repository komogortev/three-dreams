import type { SceneDescriptor } from '@base/scene-builder'
import { scene01, navigationMesh as scene01NavMesh, gameplay as scene01gameplay } from '@/scenes/scene-01'
import { scene02, gameplay as scene02gameplay } from '@/scenes/scene-02'
import { scene03, navigationMesh as scene03NavMesh } from '@/scenes/scene-03'
import { scene04 } from '@/scenes/scene-04'
import { scene05 } from '@/scenes/scene-05'

/**
 * Canonical scene registry. Order matches game sequence.
 *
 * Each entry optionally carries a `gameplay` field — scene-local overrides
 * spread into GameplaySceneModule. Co-located in the scene's own index.ts
 * so adding a new scene doesn't require touching this file for the config data.
 */
export const SCENE_REGISTRY = [
  {
    id: 'scene-01',
    label: 'Scene 01 — House on the Hill',
    exportSymbol: 'scene01',
    descriptor: scene01,
    navigationMesh: scene01NavMesh,
    gameplay: scene01gameplay,
  },
  {
    id: 'scene-02',
    label: 'Scene 02 — The Cliff (Enter Dreams)',
    exportSymbol: 'scene02',
    descriptor: scene02,
    gameplay: scene02gameplay,
  },
  {
    id: 'scene-03',
    label: 'Scene 03 — House on the Lake',
    exportSymbol: 'scene03',
    descriptor: scene03,
    navigationMesh: scene03NavMesh,
  },
  {
    id: 'scene-04',
    label: 'Scene 04 — Roksana (placeholder)',
    exportSymbol: 'scene04',
    descriptor: scene04,
  },
  {
    id: 'scene-05',
    label: 'Scene 05 — Return',
    exportSymbol: 'scene05',
    descriptor: scene05,
  },
] as const

export type SceneRegistryId = (typeof SCENE_REGISTRY)[number]['id']

export type SceneRegistryEntry = (typeof SCENE_REGISTRY)[number]

export function getSceneEntry(id: string): SceneRegistryEntry | undefined {
  return SCENE_REGISTRY.find((e) => e.id === id)
}

export function getSceneDescriptor(id: string): SceneDescriptor | undefined {
  return getSceneEntry(id)?.descriptor
}

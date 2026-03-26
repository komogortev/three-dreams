import type { SceneDescriptor } from '@base/scene-builder'
import { scene01 } from '@/scenes/scene-01'
import { scene02 } from '@/scenes/scene-02'

/** Canonical list for the scene editor and tooling. Order = menu order. */
export const SCENE_REGISTRY = [
  {
    id: 'scene-01',
    label: 'Scene 1 — cliff',
    /** Variable name suggested when copying TypeScript descriptor export */
    exportSymbol: 'scene01',
    descriptor: scene01,
  },
  {
    id: 'scene-02',
    label: 'Scene 2 — house on the hill',
    exportSymbol: 'scene02',
    descriptor: scene02,
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

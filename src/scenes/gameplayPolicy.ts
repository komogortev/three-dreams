import type { ThirdPersonSceneConfig } from '@/modules/ThirdPersonSceneModule'

export type SceneGameplayPolicy = Pick<ThirdPersonSceneConfig, 'secretDoubleJump'>

const SCENE_GAMEPLAY_POLICIES: Record<string, SceneGameplayPolicy> = {
  'scene-01': {
    secretDoubleJump: {
      enabled: true,
      activationCenterX: 0,
      activationCenterZ: 0,
      activationRadius: 48,
      requiredDirectionX: 1,
      requiredDirectionZ: 0,
      minDirectionDot: 0.62,
      preFallVyThreshold: -0.2,
      postFallGraceSeconds: 0.34,
      slowmoScale: 0.36,
      slowmoMaxSeconds: 1.5,
    },
  },
}

export function getSceneGameplayPolicy(sceneId: string): SceneGameplayPolicy | undefined {
  return SCENE_GAMEPLAY_POLICIES[sceneId]
}

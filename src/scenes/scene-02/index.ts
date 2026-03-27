import type { SceneDescriptor } from '@base/scene-builder'
import { MIXAMO_FBX_CLIP_URLS } from '@base/player-three'

export const scene02: SceneDescriptor = {
  terrain: {
    radius: 90,
    resolution: 128,
    seaLevel: 0,
    baseColor: 0xdcc495,
    baseOpacity: 0.55,
    waterColor: 0x0a1c38,
    waterOpacity: 0.72,
    features: [
      {
        type: 'heightmap',
        url: '/terrains/heatmap-scene-02.png',
        amplitude: 10,
        offsetZ: -22,
      },
    ],
  },
  atmosphere: {
    dynamicSky: true,
    fogColor: 0x1a2838,
    fogDensity: 0.014,
    ambientColor: 0x445566,
    ambientIntensity: 0.95,
    hemisphereSkyColor: 0xb8c8e8,
    hemisphereGroundColor: 0x354030,
    hemisphereIntensity: 0.5,
    time: {
      initialPhase: 0.9426,
      phaseSpeed: 0.004,
    },
    sky: {
      model: 'physical',
    },
    sunMoon: {
      sunIntensity: 1.1,
      moonIntensity: 0.24,
    },
    clouds: {
      enabled: true,
      height: 130,
      scale: 820,
      windX: 0.25,
      windZ: 0.08,
      scrollSpeed: 0.03,
      opacity: 0.6,
      visibleFrom: 0,
      visibleTo: 1,
      densityAtNight: 0.35,
      densityAtNoon: 1,
    },
  },
  character: {
    startPosition: [4, 8],
    modelUrl: '/Remy.fbx',
    modelScale: 1,
    modelFitHeight: 1.78,
    pruneExtraSkinnedMeshes: false,
    rotationY: 3.1416,
    animationClipUrls: [...MIXAMO_FBX_CLIP_URLS],
  },
  objects: [
    {
      type: 'gltf',
      url: '/scenes/scene-02/house_on_the_hill.glb',
      x: 10.39,
      z: -21.24,
      scale: 1.7,
      rotationY: -1.43,
      /** Heightmap can sample below seaLevel at this XZ; still place the environment mesh. */
      allowBelowSeaLevel: true,
    },
  ],
}
import type { AtmosphereDescriptor } from '@base/scene-builder'

/**
 * realWorld — chibi / Ghibli autumn palette.
 * Amber-ochre fog, cold static lighting, no dynamic sky.
 * Used in scenes 01 (hill), 05 (return).
 */
export const realWorld: AtmosphereDescriptor = {
  fogColor: 0xb87a40,
  fogDensity: 0.022,
  ambientColor: 0x7a5530,
  ambientIntensity: 0.75,
  hemisphereSkyColor: 0xd4945a,
  hemisphereGroundColor: 0x3d2e1a,
  hemisphereIntensity: 0.55,
}

/**
 * realWorldWarm — chibi / Ghibli summer-autumn palette.
 * Warmer tones, reduced fog — the lake memory feels lighter than the hill.
 * Used in scene 03 (lake).
 */
export const realWorldWarm: AtmosphereDescriptor = {
  fogColor: 0xc9a870,
  fogDensity: 0.012,
  ambientColor: 0x9a7840,
  ambientIntensity: 0.95,
  hemisphereSkyColor: 0xe8c87a,
  hemisphereGroundColor: 0x4a3a20,
  hemisphereIntensity: 0.65,
}

/**
 * dreamWorld — cold, desaturated, grey-blue.
 * Dense fog, realistic aesthetic, slightly sluggish feeling.
 * Used in scenes 02 (cliff), 04 (Roksana placeholder).
 */
export const dreamWorld: AtmosphereDescriptor = {
  fogColor: 0x4a5566,
  fogDensity: 0.035,
  ambientColor: 0x334455,
  ambientIntensity: 0.7,
  hemisphereSkyColor: 0x6a7a8a,
  hemisphereGroundColor: 0x1a2030,
  hemisphereIntensity: 0.45,
}

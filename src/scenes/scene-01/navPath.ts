import * as THREE from 'three'

/**
 * Scene-01 road waypoints — dad's walking path triggered after dialog completion.
 *
 * Direction: from dad's starting position (−18, 0, −14) up the hill road
 * toward the hilltop exit zone (≈ 5, 22, −36).
 *
 * Y values are approximate terrain samples — the locomotion controller will
 * clamp to actual terrain height at runtime.
 *
 * Refine by opening the Scene Editor in threejs-engine-dev (menu → Scene Editor),
 * selecting the dad NPC, opening the Path tab, placing waypoints on the road,
 * then clicking "Copy TypeScript" and pasting here.
 */
export const ROAD_WAYPOINTS: THREE.Vector3[] = [
  new THREE.Vector3(-18.0,  0.0, -14.0),  // start — matches npcEntries position
  new THREE.Vector3(-13.5,  1.5, -17.5),
  new THREE.Vector3( -9.0,  3.8, -21.5),
  new THREE.Vector3( -4.5,  7.2, -25.5),
  new THREE.Vector3( -0.5, 12.0, -29.5),
  new THREE.Vector3(  3.5, 17.5, -33.5),  // near hilltop exit zone
]

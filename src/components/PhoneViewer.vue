<script setup lang="ts">
/**
 * PhoneViewer — minimal Three.js GLB viewer for a single phone model.
 *
 * Standalone: does NOT use the full ThreeContext / engine.
 * Wires GLTFLoader with MeshoptDecoder (matches optimize-glb.sh output).
 * Centers loaded model to its geometry bounding box so origin offset
 * from Blender does not affect display.
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const props = defineProps<{
  glbUrl: string
  /** Accent color hex (#rrggbb) used for the point light tint. */
  accentHex: string
  /** Slower auto-rotate when the panel is not focused. */
  dimmed: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let modelRoot: THREE.Group | null = null
let rafId = 0
let ro: ResizeObserver | null = null

// ── Loader (shared instance, stateless) ──────────────────────────────────────

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.setMeshoptDecoder(MeshoptDecoder)

// ── Lifecycle ────────────────────────────────────────────────────────────────

function buildScene(canvas: HTMLCanvasElement): void {
  const w = canvas.clientWidth  || 200
  const h = canvas.clientHeight || 400

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setSize(w, h, false)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(38, w / h, 0.01, 200)
  camera.position.set(0, 0.1, 0.5) // will be adjusted on model load

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const key = new THREE.DirectionalLight(0xffffff, 1.4)
  key.position.set(1.5, 3, 2)
  scene.add(key)
  const accent = new THREE.PointLight(new THREE.Color(props.accentHex), 0.8, 6)
  accent.position.set(-1, 1, 1)
  scene.add(accent)

  // Load GLB
  gltfLoader.load(
    props.glbUrl,
    (gltf) => {
      const model = gltf.scene
      // Center model — robust to Blender origin offset
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size   = box.getSize(new THREE.Vector3())
      model.position.sub(center)

      modelRoot = new THREE.Group()
      modelRoot.add(model)
      scene!.add(modelRoot)

      // Frame camera to bounding sphere
      const maxDim = Math.max(size.x, size.y, size.z)
      const fovRad = (camera!.fov * Math.PI) / 180
      const dist   = (maxDim / 2 / Math.tan(fovRad / 2)) * 1.5
      camera!.position.set(0, size.y * 0.05, dist)
      camera!.lookAt(0, 0, 0)
      camera!.near = dist * 0.01
      camera!.far  = dist * 10
      camera!.updateProjectionMatrix()
    },
    undefined,
    (err) => {
      console.warn('[PhoneViewer] GLB load failed:', props.glbUrl, err)
    },
  )

  // Resize observer
  ro = new ResizeObserver(() => syncSize())
  ro.observe(canvas.parentElement ?? canvas)

  tick()
}

function syncSize(): void {
  const canvas = canvasRef.value
  if (!renderer || !camera || !canvas) return
  const w = canvas.clientWidth  || 1
  const h = canvas.clientHeight || 1
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

function tick(): void {
  rafId = requestAnimationFrame(tick)
  if (modelRoot) {
    const speed = props.dimmed ? 0.003 : 0.008
    modelRoot.rotation.y += speed
  }
  renderer?.render(scene!, camera!)
}

function teardown(): void {
  cancelAnimationFrame(rafId)
  ro?.disconnect()
  renderer?.dispose()
  renderer = null
  scene    = null
  camera   = null
  modelRoot = null
}

onMounted(() => {
  if (canvasRef.value) buildScene(canvasRef.value)
})

onUnmounted(teardown)

// Reload GLB if URL prop changes (defensive)
watch(() => props.glbUrl, () => {
  teardown()
  if (canvasRef.value) buildScene(canvasRef.value)
})
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full block" />
</template>

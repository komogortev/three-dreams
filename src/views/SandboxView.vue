<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ThreeModule } from '@base/threejs-engine'
import { InputModule } from '@base/input'
import { SandboxSceneModule } from '@/modules/SandboxSceneModule'
import { sandboxScene } from '@/scenes/sandbox'
import { useShellContext } from '@/composables/useShellContext'

const router  = useRouter()
const context = useShellContext()
const container = ref<HTMLElement>()

const engine      = new ThreeModule()
const inputModule = new InputModule(undefined, { enablePointerLook: true })
const sceneModule = new SandboxSceneModule({
  descriptor: sandboxScene,
  cameraPreset: 'close-follow',
})

// ── Time control ─────────────────────────────────────────────────────────────
const timeScale = ref(1.0)
const paused    = computed(() => timeScale.value === 0)

function setScale(s: number): void {
  timeScale.value = s
  sceneModule.setTimeScale(s)
}

function togglePause(): void {
  setScale(paused.value ? 1.0 : 0.0)
}

function stepFrame(): void {
  if (!paused.value) setScale(0)
  sceneModule.stepOneFrame()
}

const worldReady = ref(false)
const showHint   = ref(true)
let hintTimer: ReturnType<typeof setTimeout>

function onKeyDown(e: KeyboardEvent): void {
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  switch (e.code) {
    case 'KeyP':
    case 'Pause':
      e.preventDefault()
      togglePause()
      break
    case 'KeyF':
      e.preventDefault()
      stepFrame()
      break
    case 'KeyR':
      if (paused.value) { e.preventDefault(); setScale(1.0) }
      break
    case 'BracketLeft':
      e.preventDefault()
      setScale(Math.max(0.125, timeScale.value / 2))
      break
    case 'BracketRight':
      e.preventDefault()
      setScale(Math.min(4, timeScale.value * 2))
      break
  }
}

onMounted(async () => {
  if (!container.value) return
  worldReady.value = false
  await engine.mount(container.value, context)
  await engine.mountChild('input', inputModule)
  await engine.mountChild('scene', sceneModule)
  worldReady.value = true
  container.value.focus()

  const offAxis = context.eventBus.on('input:axis', (raw) => {
    const e = raw as { axis: string; value: { x: number; y: number } }
    if (e.axis === 'move' && (Math.abs(e.value.x) > 0.1 || Math.abs(e.value.y) > 0.1)) {
      clearTimeout(hintTimer)
      showHint.value = false
      offAxis()
    }
  })
  hintTimer = setTimeout(() => { showHint.value = false }, 5000)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(async () => {
  window.removeEventListener('keydown', onKeyDown)
  clearTimeout(hintTimer)
  await engine.unmount()
})
</script>

<template>
  <div class="relative w-screen h-screen bg-black overflow-hidden">

    <div
      ref="container"
      class="absolute inset-0 outline-none transition-opacity duration-200"
      :class="worldReady ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      tabindex="0"
    />

    <div
      v-if="!worldReady"
      class="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black text-white/45 text-sm"
      aria-busy="true" aria-live="polite"
    >
      <span class="inline-block size-8 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
      <span>Building sandbox…</span>
    </div>

    <div class="absolute top-4 left-4 z-40">
      <button
        class="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 text-white/70 hover:text-white text-xs font-medium rounded-lg backdrop-blur-sm border border-white/10 transition-all"
        @click="router.push('/')"
      >
        ← Menu
      </button>
    </div>

    <!-- Time control HUD -->
    <div v-if="worldReady" class="absolute top-4 right-4 z-40 flex flex-col gap-1.5 items-end">
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold tracking-wider"
        :class="paused
          ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
          : 'bg-black/50 border-white/10 text-white/60'"
      >
        <span class="inline-block size-2 rounded-full" :class="paused ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'" />
        {{ paused ? 'PAUSED' : `×${timeScale.toFixed(timeScale % 1 === 0 ? 0 : 2)}` }}
      </div>
      <div class="flex gap-1">
        <button class="hud-btn" title="[[] ½×" @click="setScale(Math.max(0.125, timeScale / 2))">½×</button>
        <button
          class="hud-btn"
          :class="paused ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30' : ''"
          title="[P] Pause"
          @click="togglePause"
        >{{ paused ? '▶' : '⏸' }}</button>
        <button class="hud-btn" title="[F] Step frame" @click="stepFrame">⏭</button>
        <button class="hud-btn" title="[]] 2×" @click="setScale(Math.min(4, timeScale * 2))">2×</button>
      </div>
    </div>

    <!-- WASD hint -->
    <Transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-700"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showHint && worldReady"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div class="flex flex-col items-center gap-1">
          <div class="flex justify-center"><kbd class="key">W</kbd></div>
          <div class="flex gap-1"><kbd class="key">A</kbd><kbd class="key">S</kbd><kbd class="key">D</kbd></div>
        </div>
        <p class="text-white/30 text-[11px] tracking-widest uppercase">move · Shift sprint · Space jump</p>
        <p class="text-white/20 text-[10px] tracking-wider">Time: P pause · F step · R resume · [ ] slow/fast</p>
      </div>
    </Transition>

    <!-- Legend -->
    <div v-if="worldReady" class="absolute bottom-4 left-4 z-40 bg-black/50 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
      <p class="text-white/30 text-[9px] font-mono uppercase tracking-widest mb-1">Landing tiers (X ≈ −28)</p>
      <div v-for="item in [
        { label: 'soft     ~2 m', color: '#22d3ee' },
        { label: 'medium   ~4 m', color: '#84cc16' },
        { label: 'hard     ~7 m', color: '#fbbf24' },
        { label: 'critical ~11 m', color: '#f97316' },
        { label: 'fatal    ~22 m', color: '#ef4444' },
      ]" :key="item.label" class="flex items-center gap-2">
        <span class="inline-block size-2 rounded-full" :style="{ background: item.color }" />
        <span class="text-[9px] font-mono text-white/50">{{ item.label }}</span>
      </div>
      <div class="mt-1 border-t border-white/10 pt-1">
        <p class="text-white/30 text-[9px] font-mono">Pool: X 15–25 · Z −25–25 · depth 0→−25 m</p>
        <p class="text-white/30 text-[9px] font-mono">Obstacles: knee 0.5 m · body 1.8 m (X 5, 9)</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.key {
  display: flex; align-items: center; justify-content: center;
  width: 2rem; height: 2rem; border-radius: 6px;
  border: 1px solid rgb(255 255 255 / 0.2);
  background: rgb(255 255 255 / 0.06);
  backdrop-filter: blur(4px);
  color: rgb(255 255 255 / 0.5);
  font-size: 0.7rem; font-weight: 600; font-family: ui-monospace, monospace;
}
.hud-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
  font-family: ui-monospace, monospace;
  border-radius: 0.25rem;
  background: rgb(0 0 0 / 0.5);
  border: 1px solid rgb(255 255 255 / 0.1);
  color: rgb(255 255 255 / 0.5);
  cursor: pointer;
  transition: all 0.1s;
}
.hud-btn:hover { color: white; background: rgb(255 255 255 / 0.1); }
</style>

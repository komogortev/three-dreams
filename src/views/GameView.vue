<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ThreeModule } from '@base/threejs-engine'
import { InputModule } from '@base/input'
import { AudioModule } from '@base/audio'
import { GameLogicModule } from '@/modules/GameLogicModule'
import { GAME_EVENTS } from '@/game/sessionTypes'
import { useShellContext } from '@/composables/useShellContext'
import { useShellStore } from '@/stores/shell'

const router = useRouter()
const context = useShellContext()
const shell = useShellStore()

const container = ref<HTMLElement>()
const engine = new ThreeModule()
const inputModule = new InputModule()
const audioModule = new AudioModule()
const gameLogic = new GameLogicModule()

onMounted(async () => {
  if (!container.value) return

  shell.setActiveModule(engine.id)

  await engine.mount(container.value, context)
  await engine.mountChild('input', inputModule)
  await engine.mountChild('audio', audioModule)
  await engine.mountChild('game-logic', gameLogic)
})

onUnmounted(async () => {
  await engine.unmount()
  shell.setActiveModule(null)
})

function goToMenu(): void {
  context.eventBus.emit(GAME_EVENTS.REQUEST_EXIT)
  void router.push('/')
}
</script>

<template>
  <div class="relative w-screen h-screen bg-black overflow-hidden">
    <div ref="container" class="absolute inset-0" />

    <button
      class="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white text-xs font-medium rounded-lg backdrop-blur-sm border border-white/10 transition-colors"
      type="button"
      @click="goToMenu"
    >
      ← Menu
    </button>

    <p
      class="absolute bottom-4 left-4 z-10 text-[10px] font-mono text-white/35 uppercase tracking-widest pointer-events-none"
    >
      Phase 4 foundation · ThreeModule → input · audio · game-logic
    </p>
  </div>
</template>

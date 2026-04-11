<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useInventoryStore } from '@/stores/inventory'
import { SCENE_REGISTRY } from '@/scenes/registry'
import PhoneSelector from '@/components/PhoneSelector.vue'
import type { PhoneProfileId } from '@/characters/phoneProfiles'

const router = useRouter()
const gameStore = useGameStore()
const inventoryStore = useInventoryStore()
const isDev = import.meta.env.DEV

onMounted(async () => {
  await Promise.all([
    gameStore.refreshCanContinue(),
    inventoryStore.hydrate(),
  ])
})

/** Phone selected at the profiler — always enters scene-01 as a fresh run. */
function onPhoneSelected(id: PhoneProfileId): void {
  inventoryStore.selectPhone(id)
  gameStore.discardPendingContinue()
  gameStore.stageInitialSceneForNextPlay('scene-01')
  void router.push('/game')
}

function jumpToScene(sceneId: string): void {
  gameStore.stageInitialSceneForNextPlay(sceneId)
  void router.push('/game')
}

async function continueGame(): Promise<void> {
  const ok = await gameStore.loadContinueBootstrap()
  if (!ok) {
    await gameStore.refreshCanContinue()
    return
  }
  void router.push('/game')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-zinc-950 select-none px-6 py-10 gap-8">

    <!-- Title -->
    <div class="flex flex-col items-center gap-2">
      <h1 class="text-5xl font-bold tracking-tight text-white">Three Dreams</h1>
      <p class="text-xs font-medium tracking-[0.3em] uppercase text-zinc-500">Three Dreams · @base</p>
    </div>

    <!-- Phone profiler accordion -->
    <div class="w-full max-w-xl flex flex-col gap-3">
      <p class="text-zinc-400 text-xs font-medium tracking-[0.2em] uppercase text-center">
        Choose your phone
      </p>

      <!-- Accordion: 300px tall, full width up to max-w-xl -->
      <div class="h-72">
        <PhoneSelector @select="onPhoneSelected" />
      </div>

      <p class="text-zinc-600 text-[10px] text-center leading-relaxed">
        Your phone shapes how the world responds to you.
      </p>
    </div>

    <!-- Secondary actions -->
    <div class="flex flex-col gap-3 w-52">
      <button
        class="w-full px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        :class="
          gameStore.canContinue
            ? 'bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-emerald-100'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        "
        type="button"
        :disabled="!gameStore.canContinue"
        @click="continueGame"
      >
        Continue
      </button>

      <template v-if="isDev">
        <div class="flex flex-col gap-1 pt-1">
          <p class="text-[10px] font-mono uppercase tracking-widest text-zinc-500 text-center">Scenes</p>
          <button
            v-for="entry in SCENE_REGISTRY"
            :key="entry.id"
            class="w-full px-4 py-2 bg-amber-900/60 hover:bg-amber-800/80 active:bg-amber-900 text-amber-200 text-xs font-medium rounded-lg transition-colors text-left"
            type="button"
            @click="jumpToScene(entry.id)"
          >
            {{ entry.label }}
          </button>
        </div>
      </template>

      <button
        v-if="isDev"
        class="w-full px-6 py-3 bg-teal-800 hover:bg-teal-700 active:bg-teal-900 text-white text-sm font-semibold rounded-xl transition-colors"
        type="button"
        @click="router.push('/sandbox')"
      >
        Sandbox
      </button>
      <button
        v-if="isDev"
        class="w-full px-6 py-3 bg-violet-700 hover:bg-violet-600 active:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-colors"
        type="button"
        @click="router.push('/editor')"
      >
        Scene editor
      </button>
      <button
        v-if="isDev"
        class="w-full px-6 py-3 bg-amber-900 hover:bg-amber-800 active:bg-amber-950 text-amber-200 text-sm font-semibold rounded-xl transition-colors"
        type="button"
        @click="router.push('/waypoints')"
      >
        Waypoint Editor
      </button>
      <button
        class="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-white text-sm font-semibold rounded-xl transition-colors"
        type="button"
        @click="router.push('/settings')"
      >
        Settings
      </button>
    </div>

    <p class="text-zinc-600 text-[10px] font-mono text-center max-w-xs px-4">
      Continue appears after a session reaches play (autosave) or when you return to the menu from the game.
    </p>
  </div>
</template>

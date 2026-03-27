<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()
const isDev = import.meta.env.DEV

onMounted(() => {
  void gameStore.refreshCanContinue()
})

function playNew(): void {
  gameStore.discardPendingContinue()
  void router.push('/game')
}

/** Dev / test: FPV in scene 2 without using the editor working-scene switch. */
function playScene2Test(): void {
  gameStore.stageInitialSceneForNextPlay('scene-02')
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
  <div class="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4 select-none">
    <div class="flex flex-col items-center gap-2 mb-8">
      <h1 class="text-5xl font-bold tracking-tight text-white">Three Dreams</h1>
      <p class="text-xs font-medium tracking-[0.3em] uppercase text-zinc-500">Scene 1 · cliff · @base</p>
    </div>

    <div class="flex flex-col gap-3 w-52">
      <button
        class="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        type="button"
        @click="playNew"
      >
        Play
      </button>
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
      <button
        v-if="isDev"
        class="w-full px-6 py-3 bg-amber-700/90 hover:bg-amber-600 active:bg-amber-800 text-white text-sm font-semibold rounded-xl transition-colors"
        type="button"
        @click="playScene2Test"
      >
        Play scene 2 (test)
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

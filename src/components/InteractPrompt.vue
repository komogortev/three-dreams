<script setup lang="ts">
/**
 * InteractPrompt — floating "Press E" hint when player is near an interactable NPC.
 *
 * Subscribes to reaction:stimulus events for proximity_enter / proximity_exit
 * and hides while dialog is active.
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useShellContext } from '@/composables/useShellContext'
import { REACTION_EVENTS, type StimulusEvent } from '@/reaction'
import { SPEAKERS } from '@/characters/speakers'

const context = useShellContext()

const nearEntityId = ref<string | null>(null)
const dialogActive = ref(false)

const visible = ref(false)

function update(): void {
  visible.value = nearEntityId.value !== null && !dialogActive.value
}

let offStimulus: (() => void) | undefined
let offDialogStart: (() => void) | undefined
let offDialogEnd: (() => void) | undefined

onMounted(() => {
  offStimulus = context.eventBus.on(REACTION_EVENTS.STIMULUS, (raw) => {
    const e = raw as StimulusEvent
    if (e.type === 'proximity_enter') {
      nearEntityId.value = e.entityId
      update()
    } else if (e.type === 'proximity_exit') {
      if (nearEntityId.value === e.entityId) {
        nearEntityId.value = null
        update()
      }
    }
  })

  offDialogStart = context.eventBus.on(REACTION_EVENTS.DIALOG_START, () => {
    dialogActive.value = true
    update()
  })

  offDialogEnd = context.eventBus.on(REACTION_EVENTS.DIALOG_END, () => {
    dialogActive.value = false
    update()
  })
})

onUnmounted(() => {
  offStimulus?.()
  offDialogStart?.()
  offDialogEnd?.()
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    leave-active-class="transition-all duration-150 ease-in"
    enter-from-class="opacity-0 translate-y-1"
    leave-to-class="opacity-0 translate-y-1"
  >
    <div
      v-if="visible"
      class="absolute bottom-36 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
    >
      <div
        class="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm px-3 py-1.5"
      >
        <kbd
          class="inline-flex items-center justify-center size-6 rounded border border-white/20 bg-white/10 text-[11px] font-semibold font-mono text-white/70"
        >E</kbd>
        <span class="text-xs text-white/50 tracking-wide">Talk</span>
      </div>
    </div>
  </Transition>
</template>

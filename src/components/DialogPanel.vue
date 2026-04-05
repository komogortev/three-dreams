<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useShellContext } from '@/composables/useShellContext'
import {
  REACTION_EVENTS,
  type DialogStartPayload,
  type DialogLine,
} from '@/reaction'
import type { InputActionEvent } from '@base/input'

const context = useShellContext()

const visible    = ref(false)
const speakerId  = ref('')
const lineText   = ref('')
const canAdvance = ref(false)   // false while auto-advance timer is running

let pendingLines: DialogLine[] = []
let lineIndex = 0
let autoTimer: ReturnType<typeof setTimeout> | undefined

// ─── Line progression ────────────────────────────────────────────────────────

function showNextLine(): void {
  clearTimeout(autoTimer)
  if (lineIndex >= pendingLines.length) {
    endDialog()
    return
  }

  const line = pendingLines[lineIndex++]!
  lineText.value  = line.text
  canAdvance.value = true

  if (line.autoAdvanceSeconds && line.autoAdvanceSeconds > 0) {
    canAdvance.value = false
    autoTimer = setTimeout(showNextLine, line.autoAdvanceSeconds * 1000)
  }
}

function advance(): void {
  if (!visible.value || !canAdvance.value) return
  showNextLine()
}

function endDialog(): void {
  clearTimeout(autoTimer)
  visible.value    = false
  lineText.value   = ''
  canAdvance.value = false
  context.eventBus.emit(REACTION_EVENTS.DIALOG_END, {})
}

// ─── Bus subscriptions ───────────────────────────────────────────────────────

let offStart:   (() => void) | undefined
let offAdvance: (() => void) | undefined
let offAction:  (() => void) | undefined

onMounted(() => {
  offStart = context.eventBus.on(REACTION_EVENTS.DIALOG_START, (raw) => {
    const p = raw as DialogStartPayload
    pendingLines     = p.lines
    lineIndex        = 0
    speakerId.value  = p.speakerId
    visible.value    = true
    showNextLine()
  })

  // Executor-driven advance (from sequence steps or other modules)
  offAdvance = context.eventBus.on(REACTION_EVENTS.DIALOG_ADVANCE, () => {
    advance()
  })

  // Player input — interact or confirm advances dialog
  offAction = context.eventBus.on('input:action', (raw) => {
    const e = raw as InputActionEvent
    if (e.type !== 'pressed') return
    if (e.action === 'interact' || e.action === 'confirm') {
      advance()
    }
  })
})

onUnmounted(() => {
  offStart?.()
  offAdvance?.()
  offAction?.()
  clearTimeout(autoTimer)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    leave-active-class="transition-all duration-150 ease-in"
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0 translate-y-1"
  >
    <div
      v-if="visible"
      class="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-none"
    >
      <div
        class="rounded-xl border border-white/10 bg-black/70 backdrop-blur-md px-6 py-4 shadow-xl"
      >
        <!-- Speaker label -->
        <p
          v-if="speakerId && speakerId !== 'player'"
          class="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40"
        >
          {{ speakerId.replace(/^npc-/, '').replace(/-/g, ' ') }}
        </p>

        <!-- Dialog text -->
        <p class="text-sm leading-relaxed text-white/90 min-h-[2.5rem]">
          {{ lineText }}
        </p>

        <!-- Advance hint -->
        <p
          v-if="canAdvance"
          class="mt-2 text-right text-[10px] text-white/30 tracking-wider"
        >
          E / Enter
        </p>
      </div>
    </div>
  </Transition>
</template>

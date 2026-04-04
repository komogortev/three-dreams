<script setup lang="ts">
/**
 * PhoneSelector — horizontal accordion of three phone profiles.
 *
 * Hovering a panel expands it. Clicking selects the profile and emits `select`.
 * The active (expanded) panel shows the phone label, tagline, and CTA.
 *
 * Layout contract:
 *   - Parent must give this component a fixed height (e.g. h-72 / h-80).
 *   - The panels flex horizontally; collapsed panels show just enough to tease
 *     the model and accent edge.
 */
import { ref } from 'vue'
import PhoneViewer from './PhoneViewer.vue'
import { PHONE_PROFILES, type PhoneProfileId } from '@/characters/phoneProfiles'

const emit = defineEmits<{
  select: [id: PhoneProfileId]
}>()

const hoveredId = ref<PhoneProfileId | null>(null)

function isExpanded(id: PhoneProfileId): boolean {
  // If nothing is hovered, expand the middle card (comfortable) by default
  return hoveredId.value ? hoveredId.value === id : id === 'comfortable'
}
</script>

<template>
  <!--
    Three panels in a flex row.
    Collapsed:  flex-[1]  ~90px
    Expanded:   flex-[4]  ~300px
    Transition drives the accordion feel.
  -->
  <div class="flex gap-2 w-full h-full">
    <button
      v-for="profile in PHONE_PROFILES"
      :key="profile.id"
      type="button"
      class="relative flex flex-col overflow-hidden rounded-2xl border bg-zinc-900 transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer select-none"
      :class="[
        profile.panelClass,
        isExpanded(profile.id) ? 'flex-[4]' : 'flex-[1]',
      ]"
      :style="{ boxShadow: isExpanded(profile.id) ? `0 0 32px 4px ${profile.accentHex}22` : 'none' }"
      @mouseenter="hoveredId = profile.id"
      @mouseleave="hoveredId = null"
      @focus="hoveredId = profile.id"
      @blur="hoveredId = null"
      @click="emit('select', profile.id)"
    >
      <!-- Three.js phone canvas — fills the panel -->
      <div class="flex-1 min-h-0 w-full">
        <PhoneViewer
          :glb-url="profile.glbUrl"
          :accent-hex="profile.accentHex"
          :dimmed="!isExpanded(profile.id)"
        />
      </div>

      <!-- Label block — slides up from bottom when expanded -->
      <div
        class="w-full px-4 pb-4 pt-2 flex flex-col gap-0.5 transition-opacity duration-200"
        :class="isExpanded(profile.id) ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      >
        <p class="text-white text-sm font-bold tracking-wide truncate">{{ profile.label }}</p>
        <p class="text-zinc-400 text-xs leading-tight truncate">{{ profile.tagline }}</p>
        <span
          class="mt-2 inline-block text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border self-start"
          :style="{ color: profile.accentHex, borderColor: profile.accentHex + '66' }"
        >
          Choose
        </span>
      </div>

      <!-- Collapsed accent stripe — visible only when collapsed -->
      <div
        class="absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-opacity duration-200"
        :class="isExpanded(profile.id) ? 'opacity-0' : 'opacity-60'"
        :style="{ backgroundColor: profile.accentHex }"
      />
    </button>
  </div>
</template>

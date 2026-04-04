import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePlatformAdapter } from '@/composables/usePlatformAdapter'
import type { PhoneProfileId } from '@/characters/phoneProfiles'

/** localStorage / electron-store key for inventory persistence. */
export const INVENTORY_STORAGE_KEY = 'first-game-inventory-v1'

export interface InventoryV1 {
  schemaVersion: 1
  phoneProfileId: PhoneProfileId | null
  /**
   * NPC item slots — keyed by NPC id (e.g. 'man60yCasual').
   * Value is an array of item ids the NPC holds.
   * Reserved for future use; kept sparse (only populated NPCs appear).
   */
  npcSlots: Record<string, string[]>
}

function isInventoryV1(x: unknown): x is InventoryV1 {
  if (x === null || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    o.schemaVersion === 1 &&
    (o.phoneProfileId === null || typeof o.phoneProfileId === 'string') &&
    typeof o.npcSlots === 'object' &&
    o.npcSlots !== null
  )
}

function emptyInventory(): InventoryV1 {
  return { schemaVersion: 1, phoneProfileId: null, npcSlots: {} }
}

/**
 * Player and NPC inventory — persisted across sessions.
 *
 * Player slot:
 *   `phoneProfileId` — the phone chosen at the main menu; drives profile-aware
 *   scene responses (TBD per scene).
 *
 * NPC slots:
 *   Sparse map of npcId → string[]. Populated by scene logic as NPCs give or
 *   receive items. Not rendered in UI yet.
 */
export const useInventoryStore = defineStore('inventory', () => {
  const phoneProfileId = ref<PhoneProfileId | null>(null)
  const npcSlots = ref<Record<string, string[]>>({})

  // ── Persistence ─────────────────────────────────────────────────────────────

  async function persist(): Promise<void> {
    const payload: InventoryV1 = {
      schemaVersion: 1,
      phoneProfileId: phoneProfileId.value,
      npcSlots: npcSlots.value,
    }
    await usePlatformAdapter().storage.set(INVENTORY_STORAGE_KEY, payload)
  }

  async function hydrate(): Promise<void> {
    try {
      const raw = await usePlatformAdapter().storage.get(INVENTORY_STORAGE_KEY)
      if (!isInventoryV1(raw)) return
      phoneProfileId.value = raw.phoneProfileId
      npcSlots.value = raw.npcSlots ?? {}
    } catch {
      // Fresh install or corrupt data — start empty
    }
  }

  // ── Player actions ──────────────────────────────────────────────────────────

  /** Select the phone profile at the main menu. Persists immediately. */
  function selectPhone(id: PhoneProfileId): void {
    phoneProfileId.value = id
    void persist()
  }

  // ── NPC actions (future scene use) ─────────────────────────────────────────

  /** Give an item to an NPC (scene logic). */
  function giveNpcItem(npcId: string, itemId: string): void {
    if (!npcSlots.value[npcId]) npcSlots.value[npcId] = []
    if (!npcSlots.value[npcId]!.includes(itemId)) {
      npcSlots.value[npcId]!.push(itemId)
      void persist()
    }
  }

  /** Remove an item from an NPC slot (e.g. player picks it up). */
  function takeNpcItem(npcId: string, itemId: string): void {
    const slot = npcSlots.value[npcId]
    if (!slot) return
    const idx = slot.indexOf(itemId)
    if (idx !== -1) {
      slot.splice(idx, 1)
      void persist()
    }
  }

  /** True if the NPC currently holds a given item. */
  function npcHasItem(npcId: string, itemId: string): boolean {
    return npcSlots.value[npcId]?.includes(itemId) ?? false
  }

  async function clearInventory(): Promise<void> {
    const blank = emptyInventory()
    phoneProfileId.value = blank.phoneProfileId
    npcSlots.value = blank.npcSlots
    await usePlatformAdapter().storage.remove(INVENTORY_STORAGE_KEY)
  }

  return {
    // State
    phoneProfileId,
    npcSlots,
    // Player
    selectPhone,
    // NPC
    giveNpcItem,
    takeNpcItem,
    npcHasItem,
    // Lifecycle
    hydrate,
    clearInventory,
  }
})

/**
 * ReactionRegistry — maps (entityId × StimulusType) → ReactionEntry[].
 *
 * Entries are sorted by priority (descending) at registration time so
 * the evaluator can short-circuit after the first passing entry without
 * scanning the full list on every stimulus.
 */

import type { StimulusType, ReactionEntry } from './types'

type RegistryKey = `${string}::${StimulusType}`

export class ReactionRegistry {
  private entries = new Map<RegistryKey, ReactionEntry[]>()

  /**
   * Register a reaction entry for a given entity and stimulus.
   * Multiple entries may be registered for the same (entityId, stimulus) pair;
   * they will be evaluated in descending priority order.
   */
  register(entityId: string, stimulus: StimulusType, entry: ReactionEntry): void {
    const key = this.toKey(entityId, stimulus)
    if (!this.entries.has(key)) this.entries.set(key, [])
    const bucket = this.entries.get(key)!
    bucket.push(entry)
    bucket.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
  }

  /**
   * Remove all entries for a given entity and stimulus.
   * Call on NPC/entity teardown.
   */
  unregister(entityId: string, stimulus: StimulusType): void {
    this.entries.delete(this.toKey(entityId, stimulus))
  }

  /** Remove all registrations for an entity across all stimulus types. */
  unregisterAll(entityId: string): void {
    for (const key of this.entries.keys()) {
      if (key.startsWith(`${entityId}::`)) this.entries.delete(key)
    }
  }

  /**
   * Look up entries for a given entity and stimulus.
   * Returns an empty array (not undefined) when no entries are registered.
   */
  lookup(entityId: string, stimulus: StimulusType): ReactionEntry[] {
    return this.entries.get(this.toKey(entityId, stimulus)) ?? []
  }

  /** Remove all registrations. Call on scene unload or engine unmount. */
  clear(): void {
    this.entries.clear()
  }

  private toKey(entityId: string, stimulus: StimulusType): RegistryKey {
    return `${entityId}::${stimulus}`
  }
}

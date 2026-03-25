import { BaseModule } from '@base/engine-core'
import type { EngineContext } from '@base/engine-core'

/**
 * Phase 4 game layer — rules, state machine, scene flow.
 * Mounted as a child of {@link ThreeModule} so `context` includes `registerSystem`, `scene`, etc.
 *
 * Stub: emits once on mount; subscribe to `input:*` / `engine:frame` here as mechanics land.
 */
export class GameLogicModule extends BaseModule {
  readonly id = 'game-logic'

  protected async onMount(_container: HTMLElement, context: EngineContext): Promise<void> {
    context.eventBus.emit('game:logic-ready', { moduleId: this.id })
  }

  protected async onUnmount(): Promise<void> {
    /* tear down subscriptions / systems when rules are added */
  }
}

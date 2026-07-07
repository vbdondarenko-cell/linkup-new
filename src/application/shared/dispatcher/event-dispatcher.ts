import { DomainEvent, EventHandler } from '../../domain/shared/events/domain-event';

export interface EventSubscription {
  eventType: string;
  handler: EventHandler;
  priority?: number;
}

export interface IEventDispatcher {
  dispatch(event: DomainEvent): Promise<void>;
  subscribe(subscription: EventSubscription): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
  clear(): void;
}

export class EventDispatcher implements IEventDispatcher {
  private subscriptions = new Map<string, EventSubscription[]>();

  async dispatch(event: DomainEvent): Promise<void> {
    const eventType = event.eventType;
    const handlers = this.subscriptions.get(eventType) || [];

    // Sort by priority
    handlers.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    for (const subscription of handlers) {
      try {
        await subscription.handler(event);
      } catch (error) {
        console.error(`Error handling event ${eventType}:`, error);
        // Continue with other handlers
      }
    }
  }

  subscribe(subscription: EventSubscription): void {
    const { eventType, handler, priority } = subscription;

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    this.subscriptions.get(eventType)!.push({ eventType, handler, priority });
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.subscriptions.get(eventType);
    if (handlers) {
      const index = handlers.findIndex(h => h.handler === handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  clear(): void {
    this.subscriptions.clear();
  }
}

export class EventDispatcherRegistry {
  private dispatchers = new Map<string, IEventDispatcher>();

  register(name: string, dispatcher: IEventDispatcher): void {
    this.dispatchers.set(name, dispatcher);
  }

  get(name: string): IEventDispatcher | undefined {
    return this.dispatchers.get(name);
  }

  dispatchAll(event: DomainEvent): Promise<void[]> {
    return Promise.all(
      Array.from(this.dispatchers.values()).map(d => d.dispatch(event))
    );
  }
}

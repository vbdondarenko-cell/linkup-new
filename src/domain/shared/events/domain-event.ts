export interface DomainEvent {
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly aggregateId: string;
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventType: string;

  constructor(
    eventType: string,
    public readonly aggregateId: string
  ) {
    this.occurredAt = new Date();
    this.eventType = eventType;
  }

  toJSON(): Record<string, unknown> {
    return {
      eventType: this.eventType,
      occurredAt: this.occurredAt.toISOString(),
      aggregateId: this.aggregateId,
    };
  }
}

export type EventHandler<T extends DomainEvent = DomainEvent> = (
  event: T
) => void | Promise<void>;

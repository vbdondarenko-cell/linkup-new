import { EntityId } from '../../shared/types';

export type AnalyticsEventType =
  | 'page_view'
  | 'event_view'
  | 'event_join'
  | 'event_leave'
  | 'event_start'
  | 'event_finish'
  | 'event_cancel'
  | 'profile_view'
  | 'search'
  | 'notification_open'
  | 'message_sent'
  | 'button_click'
  | 'form_submit';

export interface AnalyticsEventProps {
  type: AnalyticsEventType;
  userId?: EntityId;
  sessionId?: string;
  targetId?: EntityId;
  targetType?: string;
  properties: Record<string, unknown>;
  metadata: {
    userAgent?: string;
    ip?: string;
    timestamp: Date;
    duration?: number;
  };
}

export class AnalyticsEvent {
  private constructor(
    public readonly id: string,
    public readonly type: AnalyticsEventType,
    public readonly userId: string | undefined,
    public readonly sessionId: string | undefined,
    public readonly targetId: string | undefined,
    public readonly targetType: string | undefined,
    public readonly properties: Record<string, unknown>,
    public readonly metadata: AnalyticsEventProps['metadata']
  ) {}

  static create(props: AnalyticsEventProps): AnalyticsEvent {
    return new AnalyticsEvent(
      `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      props.type,
      props.userId,
      props.sessionId,
      props.targetId,
      props.targetType,
      props.properties,
      {
        ...props.metadata,
        timestamp: new Date(props.metadata.timestamp),
      }
    );
  }

  isUserEvent(): boolean {
    return !!this.userId;
  }

  isConversion(): boolean {
    return ['event_join', 'form_submit', 'notification_open'].includes(this.type);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      userId: this.userId,
      sessionId: this.sessionId,
      targetId: this.targetId,
      targetType: this.targetType,
      properties: { ...this.properties },
      metadata: { ...this.metadata },
    };
  }
}

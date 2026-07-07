import { EntityId, PaginationParams } from '../../shared/types';
import { AnalyticsEvent, AnalyticsEventType } from '../entities/analytics-event';

export interface EventAggregation {
  type: AnalyticsEventType;
  count: number;
  uniqueUsers: number;
}

export interface IAnalyticsRepository {
  saveEvent(event: AnalyticsEvent): Promise<void>;
  getEvents(filters: {
    type?: AnalyticsEventType[];
    userId?: EntityId;
    targetId?: EntityId;
    dateRange?: { start: Date; end: Date };
  }, pagination: PaginationParams): Promise<AnalyticsEvent[]>;
  aggregateByType(dateRange: { start: Date; end: Date }): Promise<EventAggregation[]>;
  getUniqueUsers(dateRange: { start: Date; end: Date }): Promise<number>;
  getDailyStats(date: Date): Promise<{
    pageViews: number;
    eventViews: number;
    joins: number;
    signups: number;
  }>;
}

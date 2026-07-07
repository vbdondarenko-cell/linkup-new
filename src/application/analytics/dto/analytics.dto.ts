export interface TrackEventRequest {
  type: string;
  userId?: string;
  sessionId?: string;
  targetId?: string;
  targetType?: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsQueryRequest {
  startDate: string;
  endDate: string;
  eventType?: string;
  groupBy?: string;
}

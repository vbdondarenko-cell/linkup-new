export interface EventAnalytics {
  eventId: string;
  views: number;
  uniqueViewers: number;
  joins: number;
  leaves: number;
  attendees: number;
  noShows: number;
  completionRate: number;
  peakConcurrentViewers: number;
}

export interface UserAnalytics {
  userId: string;
  totalEventsAttended: number;
  totalEventsOrganized: number;
  averageEventRating: number;
  totalXP: number;
  level: number;
  badges: number;
  engagementScore: number;
  retentionRate: number;
  favoriteCategories: string[];
}

export interface CohortData {
  cohortDate: string;
  cohortSize: number;
  retentionByWeek: number[];
}

export interface FunnelStep {
  name: string;
  count: number;
  dropoffRate: number;
}

export interface FunnelAnalysis {
  steps: FunnelStep[];
  totalConversions: number;
  overallConversionRate: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface TimeSeriesAnalysis {
  metric: string;
  data: TimeSeriesDataPoint[];
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

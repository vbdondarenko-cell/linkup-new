import { AnalyticsEvent, AnalyticsEventType } from '../entities/analytics-event';
import { EventAnalytics, UserAnalytics, FunnelAnalysis, TimeSeriesAnalysis, FunnelStep } from '../entities/analytics-report';
import { EntityId } from '../../shared/types';

export interface TrackEventInput {
  type: AnalyticsEventType;
  userId?: EntityId;
  sessionId?: string;
  targetId?: EntityId;
  targetType?: string;
  properties?: Record<string, unknown>;
  metadata?: {
    userAgent?: string;
    ip?: string;
    duration?: number;
  };
}

export class AnalyticsService {
  trackEvent(input: TrackEventInput): AnalyticsEvent {
    return AnalyticsEvent.create({
      type: input.type,
      userId: input.userId,
      sessionId: input.sessionId,
      targetId: input.targetId,
      targetType: input.targetType,
      properties: input.properties || {},
      metadata: {
        timestamp: new Date(),
        userAgent: input.metadata?.userAgent,
        ip: input.metadata?.ip,
        duration: input.metadata?.duration,
      },
    });
  }

  calculateEventAnalytics(stats: {
    views: number;
    uniqueViewers: Set<string>;
    joins: number;
    leaves: number;
    attendees: number;
    noShows: number;
    maxConcurrent: number;
    capacity: number;
  }): EventAnalytics {
    return {
      eventId: '',
      views: stats.views,
      uniqueViewers: stats.uniqueViewers.size,
      joins: stats.joins,
      leaves: stats.leaves,
      attendees: stats.attendees,
      noShows: stats.noShows,
      completionRate: stats.joins > 0 ? Math.round((stats.attendees / stats.joins) * 100) : 0,
      peakConcurrentViewers: stats.maxConcurrent,
    };
  }

  calculateFunnelConversion(steps: FunnelStep[]): FunnelAnalysis {
    if (steps.length === 0) {
      return {
        steps: [],
        totalConversions: 0,
        overallConversionRate: 0,
      };
    }

    const firstStepCount = steps[0].count;
    const lastStepCount = steps[steps.length - 1].count;
    const totalConversions = lastStepCount;

    const enrichedSteps = steps.map((step, index) => ({
      ...step,
      dropoffRate: index === 0 ? 0 : Math.round(((steps[index - 1].count - step.count) / steps[index - 1].count) * 100),
    }));

    return {
      steps: enrichedSteps,
      totalConversions,
      overallConversionRate: firstStepCount > 0 ? Math.round((totalConversions / firstStepCount) * 100) : 0,
    };
  }

  calculateRetentionRate(currentActive: number, previousActive: number): number {
    if (previousActive === 0) return 0;
    return Math.round((currentActive / previousActive) * 100);
  }

  calculateTimeSeriesTrend(data: Array<{ value: number }>): 'up' | 'down' | 'stable' {
    if (data.length < 2) return 'stable';

    const recent = data.slice(-7);
    const older = data.slice(-14, -7);

    if (older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.value, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  }
}

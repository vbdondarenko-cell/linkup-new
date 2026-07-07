import { Organizer } from '../entities/organizer';

export interface OrganizerStatistics {
  organizerId: string;
  totalEvents: number;
  successfulEvents: number;
  canceledEvents: number;
  totalParticipants: number;
  averageParticipantsPerEvent: number;
  successRate: number;
  averageRating: number;
  totalRevenue?: number;
  periodStart: Date;
  periodEnd: Date;
}

export class OrganizerStatisticsService {
  calculateStatistics(
    organizer: Organizer,
    eventStats: {
      canceledCount: number;
      totalParticipants: number;
      averageParticipants: number;
      totalRevenue?: number;
    },
    period: { start: Date; end: Date }
  ): OrganizerStatistics {
    return {
      organizerId: organizer.id,
      totalEvents: organizer.totalEvents,
      successfulEvents: organizer.successfulEvents,
      canceledEvents: eventStats.canceledCount,
      totalParticipants: eventStats.totalParticipants,
      averageParticipantsPerEvent: Math.round(eventStats.averageParticipants),
      successRate: organizer.successRate,
      averageRating: organizer.averageRating,
      totalRevenue: eventStats.totalRevenue,
      periodStart: period.start,
      periodEnd: period.end,
    };
  }

  getGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  }
}

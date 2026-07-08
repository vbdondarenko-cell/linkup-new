import { EntityId } from '../../shared/types';
import { OrganizerMetrics } from '../types';

export interface OrganizerMetricsData {
  organizerId: EntityId;
  totalEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalAttendees: number;
  avgAttendanceRate: number;
  ratings: Array<{ score: number; aspect?: string; createdAt: Date }>;
  repeatAttendees: number;
  newAttendees: number;
  eventHistory: Array<{ createdAt: Date; attendeeCount: number; capacity: number }>;
}

export interface OrganizerQualityScore {
  organizerId: EntityId;
  overallScore: number;
  attendanceRate: number;
  satisfactionScore: number;
  growthRate: number;
  consistencyScore: number;
  trustTrend: number;
  qualityScore: number;
  recommendationWeight: number;
  badges: OrganizerBadge[];
}

export type OrganizerBadge = 
  | 'top_organizer'
  | 'rising_star'
  | 'consistent'
  | 'community_favorite'
  | 'trusted_host'
  | 'new_organizer';

export class OrganizerIntelligenceService {
  private readonly BADGE_THRESHOLDS = {
    TOP_ORGANIZER_SCORE: 85,
    RISING_STAR_GROWTH: 30,
    CONSISTENT_EVENTS: 10,
    COMMUNITY_FAVORITE_REPEAT: 50,
    TRUSTED_HOST_TRUST: 90,
  };

  calculateOrganizerMetrics(data: OrganizerMetricsData): OrganizerMetrics {
    const attendanceRate = data.completedEvents > 0
      ? (data.totalAttendees / data.completedEvents / this.getAverageCapacity(data)) * 100
      : 0;

    const recentRatings = data.ratings.filter(r => {
      const daysSince = (Date.now() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 90;
    });
    const satisfactionScore = recentRatings.length > 0
      ? (recentRatings.reduce((sum, r) => sum + r.score, 0) / recentRatings.length) * 20
      : 0;

    return {
      organizerId: data.organizerId,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      satisfactionScore: Math.round(satisfactionScore * 100) / 100,
      growthRate: this.calculateGrowthRate(data),
      consistencyScore: this.calculateConsistencyScore(data),
      trustTrend: this.calculateTrustTrend(data),
      repeatParticipants: data.repeatAttendees,
      totalEvents: data.totalEvents,
      qualityScore: 0, // Calculated separately
    };
  }

  calculateQualityScore(metrics: OrganizerMetrics): OrganizerQualityScore {
    const {
      attendanceRate,
      satisfactionScore,
      growthRate,
      consistencyScore,
      trustTrend,
      totalEvents,
      repeatParticipants,
    } = metrics;

    // Weighted scoring
    const weights = {
      satisfaction: 0.35,
      attendance: 0.25,
      consistency: 0.15,
      growth: 0.15,
      trust: 0.10,
    };

    const overallScore = Math.round(
      satisfactionScore * weights.satisfaction +
      attendanceRate * weights.attendance +
      consistencyScore * weights.consistency +
      growthRate * weights.growth +
      trustTrend * weights.trust
    );

    // Calculate recommendation weight (how much this organizer should be promoted)
    const recommendationWeight = Math.min(1, overallScore / 100) * 0.3 + 
      Math.min(1, repeatParticipants / 50) * 0.2 +
      Math.min(1, totalEvents / 20) * 0.1;

    // Determine badges
    const badges = this.determineBadges({
      overallScore,
      growthRate,
      consistencyScore,
      trustTrend,
      repeatParticipants,
      totalEvents,
    });

    return {
      organizerId: metrics.organizerId,
      overallScore,
      attendanceRate,
      satisfactionScore,
      growthRate,
      consistencyScore,
      trustTrend,
      qualityScore: overallScore,
      recommendationWeight: Math.min(1, recommendationWeight),
      badges,
    };
  }

  private getAverageCapacity(data: OrganizerMetricsData): number {
    if (data.eventHistory.length === 0) return 20; // Default capacity
    const totalCapacity = data.eventHistory.reduce((sum, e) => sum + e.capacity, 0);
    return totalCapacity / data.eventHistory.length;
  }

  private calculateGrowthRate(data: OrganizerMetricsData): number {
    if (data.eventHistory.length < 2) return 50; // Default for new organizers

    // Compare first half vs second half attendance
    const midPoint = Math.floor(data.eventHistory.length / 2);
    const firstHalf = data.eventHistory.slice(0, midPoint);
    const secondHalf = data.eventHistory.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, e) => sum + e.attendeeCount, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, e) => sum + e.attendeeCount, 0) / secondHalf.length;

    if (firstHalfAvg === 0) return secondHalfAvg > 0 ? 100 : 50;
    
    const growth = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    return Math.max(0, Math.min(100, 50 + growth));
  }

  private calculateConsistencyScore(data: OrganizerMetricsData): number {
    if (data.eventHistory.length < 3) return 50; // Not enough data

    // Calculate coefficient of variation for attendance
    const attendances = data.eventHistory.map(e => e.attendeeCount);
    const mean = attendances.reduce((a, b) => a + b, 0) / attendances.length;
    const variance = attendances.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / attendances.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;

    // Lower CV = more consistent = higher score
    return Math.max(0, Math.min(100, 100 - cv));
  }

  private calculateTrustTrend(data: OrganizerMetricsData): number {
    const recentRatings = data.ratings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
    
    if (recentRatings.length < 2) return 50;

    const recentAvg = recentRatings.slice(0, 5).reduce((sum, r) => sum + r.score, 0) / Math.min(5, recentRatings.length);
    const olderAvg = recentRatings.slice(5).reduce((sum, r) => sum + r.score, 0) / Math.max(1, recentRatings.length - 5);

    if (olderAvg === 0) return recentAvg > 0 ? 75 : 50;
    
    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    return Math.max(0, Math.min(100, 50 + trend * 5));
  }

  private determineBadges(data: {
    overallScore: number;
    growthRate: number;
    consistencyScore: number;
    trustTrend: number;
    repeatParticipants: number;
    totalEvents: number;
  }): OrganizerBadge[] {
    const badges: OrganizerBadge[] = [];

    if (data.overallScore >= this.BADGE_THRESHOLDS.TOP_ORGANIZER_SCORE) {
      badges.push('top_organizer');
    }

    if (data.growthRate >= this.BADGE_THRESHOLDS.RISING_STAR_GROWTH && data.totalEvents >= 3) {
      badges.push('rising_star');
    }

    if (data.overallScore >= 70 && data.totalEvents >= this.BADGE_THRESHOLDS.CONSISTENT_EVENTS) {
      badges.push('consistent');
    }

    if (data.repeatParticipants >= this.BADGE_THRESHOLDS.COMMUNITY_FAVORITE_REPEAT) {
      badges.push('community_favorite');
    }

    if (data.trustTrend >= 80) {
      badges.push('trusted_host');
    }

    if (data.totalEvents <= 3 && data.overallScore >= 50) {
      badges.push('new_organizer');
    }

    return badges;
  }

  // Get user-friendly explanation for organizer quality
  getQualityExplanation(score: OrganizerQualityScore): string[] {
    const explanations: string[] = [];

    if (score.badges.includes('top_organizer')) {
      explanations.push('Top-rated organizer');
    }

    if (score.satisfactionScore >= 80) {
      explanations.push('Excellent participant satisfaction');
    }

    if (score.attendanceRate >= 80) {
      explanations.push('High attendance rate');
    }

    if (score.growthRate >= 70) {
      explanations.push('Growing community');
    }

    if (score.consistencyScore >= 80) {
      explanations.push('Consistently delivers great events');
    }

    if (score.badges.includes('trusted_host')) {
      explanations.push('Trusted by the community');
    }

    if (explanations.length === 0) {
      explanations.push('Active organizer');
    }

    return explanations;
  }
}

import { EntityId } from '../../shared/types';
import { BusinessMetrics } from '../types';

export interface BusinessMetricsData {
  businessId: EntityId;
  totalEvents: number;
  completedEvents: number;
  totalAttendees: number;
  reviews: Array<{ score: number; quality: number; createdAt: Date }>;
  repeatVisitors: number;
  newVisitors: number;
  eventHistory: Array<{ createdAt: Date; attendeeCount: number; rating?: number }>;
  checkIns: number;
}

export interface BusinessHealthScore {
  businessId: EntityId;
  overallHealth: number;
  attendanceRate: number;
  reviewQuality: number;
  eventSuccessRate: number;
  repeatVisitorRate: number;
  growthRate: number;
  trustTrend: number;
  healthScore: number;
  status: BusinessHealthStatus;
  recommendations: string[];
}

export type BusinessHealthStatus = 'excellent' | 'good' | 'fair' | 'concerning' | 'critical';

export class BusinessIntelligenceService {
  calculateBusinessMetrics(data: BusinessMetricsData): BusinessMetrics {
    const attendanceRate = data.completedEvents > 0
      ? (data.totalAttendees / data.completedEvents) * 10
      : 0;

    const recentReviews = data.reviews.filter(r => {
      const daysSince = (Date.now() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 90;
    });

    const reviewQuality = recentReviews.length > 0
      ? (recentReviews.reduce((sum, r) => sum + r.score, 0) / recentReviews.length) * 20
      : 0;

    const eventSuccessRate = data.totalEvents > 0
      ? (data.completedEvents / data.totalEvents) * 100
      : 0;

    return {
      businessId: data.businessId,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      reviewQuality: Math.round(reviewQuality * 100) / 100,
      eventSuccessRate: Math.round(eventSuccessRate * 100) / 100,
      repeatVisitors: data.repeatVisitors,
      growthRate: this.calculateGrowthRate(data),
      trustTrend: this.calculateTrustTrend(data),
      healthScore: 0, // Calculated separately
    };
  }

  calculateHealthScore(metrics: BusinessMetrics, data: BusinessMetricsData): BusinessHealthScore {
    const {
      attendanceRate,
      reviewQuality,
      eventSuccessRate,
      repeatVisitors,
      growthRate,
      trustTrend,
    } = metrics;

    const repeatVisitorRate = data.totalAttendees > 0
      ? (repeatVisitors / data.totalAttendees) * 100
      : 0;

    // Weighted scoring for health
    const weights = {
      reviewQuality: 0.30,
      eventSuccess: 0.25,
      attendance: 0.20,
      repeatVisitor: 0.15,
      growth: 0.10,
    };

    const healthScore = Math.round(
      reviewQuality * weights.reviewQuality +
      eventSuccessRate * weights.eventSuccess +
      attendanceRate * weights.attendance +
      repeatVisitorRate * weights.repeatVisitor +
      growthRate * weights.growth
    );

    const status = this.determineStatus(healthScore, eventSuccessRate, reviewQuality);
    const recommendations = this.generateRecommendations(healthScore, metrics, data);

    return {
      businessId: metrics.businessId,
      overallHealth: healthScore,
      attendanceRate,
      reviewQuality,
      eventSuccessRate,
      repeatVisitorRate: Math.round(repeatVisitorRate * 100) / 100,
      growthRate,
      trustTrend,
      healthScore,
      status,
      recommendations,
    };
  }

  private calculateGrowthRate(data: BusinessMetricsData): number {
    if (data.eventHistory.length < 2) return 50;

    const midPoint = Math.floor(data.eventHistory.length / 2);
    const firstHalf = data.eventHistory.slice(0, midPoint);
    const secondHalf = data.eventHistory.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, e) => sum + e.attendeeCount, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, e) => sum + e.attendeeCount, 0) / secondHalf.length;

    if (firstHalfAvg === 0) return secondHalfAvg > 0 ? 100 : 50;

    const growth = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    return Math.max(0, Math.min(100, 50 + growth));
  }

  private calculateTrustTrend(data: BusinessMetricsData): number {
    const recentReviews = data.reviews
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    if (recentReviews.length < 2) return 50;

    const recentAvg = recentReviews.slice(0, 5).reduce((sum, r) => sum + r.score, 0) / Math.min(5, recentReviews.length);
    const olderAvg = recentReviews.slice(5).reduce((sum, r) => sum + r.score, 0) / Math.max(1, recentReviews.length - 5);

    if (olderAvg === 0) return recentAvg > 0 ? 75 : 50;

    const trend = ((recentAvg - olderAvg) / olderAvg) * 100;
    return Math.max(0, Math.min(100, 50 + trend * 5));
  }

  private determineStatus(
    healthScore: number,
    eventSuccessRate: number,
    reviewQuality: number
  ): BusinessHealthStatus {
    if (healthScore >= 85 && eventSuccessRate >= 80) return 'excellent';
    if (healthScore >= 70 && reviewQuality >= 70) return 'good';
    if (healthScore >= 50) return 'fair';
    if (healthScore >= 30 || eventSuccessRate < 50) return 'concerning';
    return 'critical';
  }

  private generateRecommendations(
    healthScore: number,
    metrics: BusinessMetrics,
    data: BusinessMetricsData
  ): string[] {
    const recommendations: string[] = [];

    if (healthScore < 70) {
      if (metrics.reviewQuality < 60) {
        recommendations.push('Focus on improving event quality to get better reviews');
      }
      if (metrics.eventSuccessRate < 70) {
        recommendations.push('Work on event promotion to increase attendance');
      }
      if (data.repeatVisitors < 10) {
        recommendations.push('Build customer loyalty with repeat visit incentives');
      }
    }

    if (metrics.growthRate < 30) {
      recommendations.push('Consider new event types to attract different audiences');
    }

    if (recommendations.length === 0 && healthScore >= 80) {
      recommendations.push('Great work! Keep delivering excellent events');
    }

    return recommendations;
  }

  // Calculate business recommendation weight for event discovery
  getBusinessRecommendationWeight(healthScore: BusinessHealthScore): number {
    // Higher health = higher visibility
    const baseWeight = healthScore.overallHealth / 100;

    // Boost for excellent status
    const statusBoost = healthScore.status === 'excellent' ? 0.2 :
                       healthScore.status === 'good' ? 0.1 : 0;

    // Slight reduction for concerning/critical
    const statusPenalty = healthScore.status === 'concerning' ? -0.2 :
                         healthScore.status === 'critical' ? -0.4 : 0;

    return Math.max(0, Math.min(1, baseWeight + statusBoost + statusPenalty));
  }
}

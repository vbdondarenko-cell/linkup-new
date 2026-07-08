import { EntityId } from '../../shared/types';
import { TrustScoreEntity } from '../entities/trust-score';
import { TrustLevel, TrustSignals, TrustScore, TrustFactors } from '../types';
import { ITrustRepository } from '../repositories/i-trust-repository';
import { TrustIntelligenceError } from '../errors/ai-errors';

export interface TrustRepository {
  findByUserId(userId: EntityId): Promise<TrustScoreEntity | null>;
  save(trustScore: TrustScoreEntity): Promise<void>;
  deleteByUserId(userId: EntityId): Promise<void>;
}

export interface EventAttendance {
  eventId: EntityId;
  status: 'attended' | 'cancelled' | 'no_show';
  joinedAt: Date;
  completedAt?: Date;
}

export interface UserTrustData {
  userId: EntityId;
  accountCreatedAt: Date;
  ratingsReceived: Array<{ score: number; createdAt: Date }>;
  eventsAttended: EventAttendance[];
  eventsOrganized: number;
  reportsReceived: number;
  reportsFiled: number;
  verificationLevel: number;
  socialConnections: number;
}

export class TrustIntelligenceService {
  private readonly MIN_SCORE = 0;
  private readonly MAX_SCORE = 100;
  private readonly SIGNAL_WEIGHTS = {
    attendanceRate: 0.25,
    completionRate: 0.20,
    averageRating: 0.25,
    accountAge: 0.10,
    verification: 0.10,
    community: 0.10,
  };

  constructor(private readonly trustRepository: TrustRepository) {}

  async getTrustScore(userId: EntityId): Promise<TrustScoreEntity> {
    const existing = await this.trustRepository.findByUserId(userId);
    
    if (existing && !existing.isExpired) {
      return existing;
    }

    throw new TrustIntelligenceError(`Trust score not found or expired for user: ${userId}`);
  }

  async calculateTrustScore(userData: UserTrustData): Promise<TrustScoreEntity> {
    const signals = this.extractSignals(userData);
    const score = this.computeScore(signals);
    const factors = this.computeFactors(signals);
    const level = this.determineLevel(score);

    const trustScore = TrustScoreEntity.create({
      userId: userData.userId,
      score,
      level,
      factors,
      signals,
      lastUpdated: new Date(),
    });

    await this.trustRepository.save(trustScore);
    return trustScore;
  }

  async updateTrustScore(userId: EntityId, userData: UserTrustData): Promise<TrustScoreEntity> {
    const existing = await this.trustRepository.findByUserId(userId);
    
    const signals = this.extractSignals(userData);
    const score = this.computeScore(signals);
    const factors = this.computeFactors(signals);
    const level = this.determineLevel(score);

    if (existing) {
      existing.updateScore(score, signals);
      await this.trustRepository.save(existing);
      return existing;
    }

    return this.calculateTrustScore(userData);
  }

  async refreshTrustScore(userId: EntityId): Promise<TrustScoreEntity> {
    await this.trustRepository.deleteByUserId(userId);
    throw new TrustIntelligenceError('User data required to refresh trust score. Call calculateTrustScore with user data.');
  }

  async batchUpdateTrustScores(userIds: EntityId[]): Promise<void> {
    // This should be called by background jobs
    // Implementation depends on data access layer
    console.log(`Batch updating trust scores for ${userIds.length} users`);
  }

  private extractSignals(userData: UserTrustData): TrustSignals {
    const now = new Date();
    const accountAgeDays = (now.getTime() - userData.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24);

    // Calculate attendance rate
    const totalJoined = userData.eventsAttended.length;
    const attended = userData.eventsAttended.filter(e => e.status === 'attended').length;
    const attendanceRate = totalJoined > 0 ? (attended / totalJoined) * 100 : 100;

    // Calculate completion rate
    const withCompletion = userData.eventsAttended.filter(e => e.completedAt);
    const completed = withCompletion.filter(e => {
      if (!e.completedAt) return false;
      const hoursToComplete = (e.completedAt.getTime() - e.joinedAt.getTime()) / (1000 * 60 * 60);
      return hoursToComplete >= 1; // At least 1 hour attendance
    }).length;
    const completionRate = totalJoined > 0 ? (completed / totalJoined) * 100 : 100;

    // Calculate average rating (only recent ratings)
    const recentRatings = userData.ratingsReceived.filter(r => {
      const daysSince = (now.getTime() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 90; // Last 90 days
    });
    const averageRating = recentRatings.length > 0
      ? (recentRatings.reduce((sum, r) => sum + r.score, 0) / recentRatings.length) * 20
      : 50;

    // Successful meetups
    const successfulMeetups = userData.eventsAttended.filter(e => e.status === 'attended').length;

    return {
      userId: userData.userId,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      averageRating: Math.round(averageRating * 100) / 100,
      totalEvents: totalJoined,
      successfulMeetups,
      reportsReceived: userData.reportsReceived,
      reportsFiled: userData.reportsFiled,
      accountAge: Math.round(accountAgeDays),
      verificationLevel: userData.verificationLevel,
      socialConnections: userData.socialConnections,
    };
  }

  private computeScore(signals: TrustSignals): number {
    let score = 0;

    score += signals.attendanceRate * this.SIGNAL_WEIGHTS.attendanceRate;
    score += signals.completionRate * this.SIGNAL_WEIGHTS.completionRate;
    score += signals.averageRating * this.SIGNAL_WEIGHTS.averageRating;
    score += Math.min(100, signals.accountAge / 365 * 100) * this.SIGNAL_WEIGHTS.accountAge;
    score += signals.verificationLevel * 10 * this.SIGNAL_WEIGHTS.verification;
    score += Math.min(100, signals.socialConnections / 50 * 100) * this.SIGNAL_WEIGHTS.community;

    // Penalties for negative signals
    score -= Math.min(30, signals.reportsReceived * 5);

    return Math.max(this.MIN_SCORE, Math.min(this.MAX_SCORE, Math.round(score * 100) / 100));
  }

  private computeFactors(signals: TrustSignals): TrustFactors {
    return {
      reliability: Math.round(signals.attendanceRate * 100) / 100,
      consistency: Math.round(Math.min(100, signals.accountAge / 365 * 100) * 100) / 100,
      reputation: Math.round(signals.averageRating * 100) / 100,
      verification: Math.round(signals.verificationLevel * 20 * 100) / 100,
      community: Math.round(Math.min(100, signals.socialConnections / 50 * 100) * 100) / 100,
    };
  }

  private determineLevel(score: number): TrustLevel {
    if (score >= 90) return 'verified';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'untrusted';
  }

  getTrustLevelDescription(level: TrustLevel): string {
    const descriptions: Record<TrustLevel, string> = {
      verified: 'Verified user with excellent track record',
      high: 'Trusted user with consistent positive history',
      medium: 'Active user with average participation',
      low: 'New or inactive user',
      untrusted: 'User with concerning behavior patterns',
    };
    return descriptions[level];
  }

  getTrustRecommendations(score: TrustScore): string[] {
    const recommendations: string[] = [];

    if (score.factors.reliability < 50) {
      recommendations.push('Attend more events to improve your attendance rate');
    }

    if (score.factors.consistency < 30) {
      recommendations.push('Stay active to build consistency');
    }

    if (score.factors.reputation < 50) {
      recommendations.push('Rate events and organizers to build reputation');
    }

    if (score.factors.verification < 50) {
      recommendations.push('Complete verification steps to increase trust');
    }

    if (score.factors.community < 30) {
      recommendations.push('Engage with the community to build connections');
    }

    return recommendations;
  }
}

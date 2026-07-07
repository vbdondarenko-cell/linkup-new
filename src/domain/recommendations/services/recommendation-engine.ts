import { Recommendation } from '../entities/recommendation';
import { IRecommendationRepository } from '../repositories/i-recommendation-repository';
import { EntityId, PaginationParams } from '../../shared/types';

export interface UserProfile {
  interests: string[];
  location?: { latitude: number; longitude: number };
  pastEvents: string[];
  followedOrganizers: string[];
}

export interface ScoringFactors {
  interestMatch: number;
  locationProximity: number;
  popularity: number;
  recency: number;
  socialProof: number;
}

export class RecommendationEngine {
  private readonly WEIGHTS: Record<keyof ScoringFactors, number> = {
    interestMatch: 0.35,
    locationProximity: 0.25,
    popularity: 0.15,
    recency: 0.15,
    socialProof: 0.10,
  };

  constructor(private readonly recommendationRepository: IRecommendationRepository) {}

  async generateRecommendations(
    userId: EntityId,
    userProfile: UserProfile,
    candidateEvents: Array<{ id: EntityId; interests: string[]; location?: { latitude: number; longitude: number }; participantCount: number; startDate: Date }>,
    limit = 20
  ): Promise<Recommendation[]> {
    const scoredEvents = candidateEvents.map(event => {
      const factors = this.calculateFactors(event, userProfile);
      const score = this.computeScore(factors);
      const reasons = this.generateReasons(factors, event);

      return Recommendation.create({
        userId,
        type: 'event',
        targetId: event.id,
        targetType: 'event',
        score,
        reasons,
        ttlDays: 7,
      });
    });

    scoredEvents.sort((a, b) => b.score - a.score);
    const topRecommendations = scoredEvents.slice(0, limit);

    for (const rec of topRecommendations) {
      await this.recommendationRepository.save(rec);
    }

    return topRecommendations;
  }

  calculateFactors(
    event: { id: EntityId; interests: string[]; location?: { latitude: number; longitude: number }; participantCount: number; startDate: Date },
    userProfile: UserProfile
  ): ScoringFactors {
    const interestMatch = this.calculateInterestMatch(event.interests, userProfile.interests);
    const locationProximity = this.calculateLocationProximity(event.location, userProfile.location);
    const popularity = this.calculatePopularity(event.participantCount);
    const recency = this.calculateRecency(event.startDate);
    const socialProof = this.calculateSocialProof(event.id, userProfile.pastEvents);

    return { interestMatch, locationProximity, popularity, recency, socialProof };
  }

  private calculateInterestMatch(eventInterests: string[], userInterests: string[]): number {
    if (userInterests.length === 0) return 0;
    const matches = eventInterests.filter(i => userInterests.includes(i)).length;
    return Math.min(100, (matches / userInterests.length) * 100);
  }

  private calculateLocationProximity(
    eventLocation?: { latitude: number; longitude: number },
    userLocation?: { latitude: number; longitude: number }
  ): number {
    if (!eventLocation || !userLocation) return 50; // Default middle score

    const distance = this.haversineDistance(
      userLocation.latitude, userLocation.longitude,
      eventLocation.latitude, eventLocation.longitude
    );

    if (distance <= 5) return 100;
    if (distance <= 20) return 80;
    if (distance <= 50) return 50;
    if (distance <= 100) return 30;
    return 10;
  }

  private calculatePopularity(participantCount: number): number {
    if (participantCount >= 50) return 100;
    return Math.min(100, participantCount * 2);
  }

  private calculateRecency(startDate: Date): number {
    const now = new Date();
    const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 1) return 100;
    if (daysUntil <= 3) return 80;
    if (daysUntil <= 7) return 60;
    if (daysUntil <= 14) return 40;
    if (daysUntil <= 30) return 20;
    return 10;
  }

  private calculateSocialProof(eventId: EntityId, pastEvents: string[]): number {
    return pastEvents.includes(eventId) ? 100 : 0;
  }

  private computeScore(factors: ScoringFactors): number {
    let score = 0;
    for (const [key, weight] of Object.entries(this.WEIGHTS)) {
      score += factors[key as keyof ScoringFactors] * weight;
    }
    return Math.round(score * 100) / 100;
  }

  private generateReasons(factors: ScoringFactors, event: { interests: string[] }): string[] {
    const reasons: string[] = [];

    if (factors.interestMatch >= 80) {
      reasons.push('Perfect interest match');
    } else if (factors.interestMatch >= 50) {
      reasons.push('Good interest match');
    }

    if (factors.locationProximity >= 80) {
      reasons.push('Very close to you');
    } else if (factors.locationProximity >= 50) {
      reasons.push('Nearby location');
    }

    if (factors.popularity >= 80) {
      reasons.push('Popular event');
    }

    if (factors.recency >= 80) {
      reasons.push('Happening soon');
    }

    return reasons;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  async getRecommendationsForUser(
    userId: EntityId,
    pagination: PaginationParams
  ): Promise<Recommendation[]> {
    const recommendations = await this.recommendationRepository.findActiveByUserId(userId);
    return recommendations
      .filter(r => !r.isExpired)
      .sort((a, b) => b.score - a.score)
      .slice(pagination.offset, pagination.offset + pagination.limit);
  }

  async refreshRecommendations(userId: EntityId): Promise<void> {
    await this.recommendationRepository.deleteByUserId(userId);
  }
}

import { EntityId } from '../../shared/types';
import { Recommendation } from '../../recommendations/entities/recommendation';
import { TrustLevel } from '../types';

export interface UserProfile {
  userId: EntityId;
  interests: string[];
  location?: { latitude: number; longitude: number };
  radius: number; // km
  preferredTime?: string;
  preferredDays?: number[];
  language?: string;
  pastEvents: string[];
  hostedEvents: string[];
  ignoredEvents: string[];
  savedEvents: string[];
  favoriteCategories: string[];
  trustLevel: TrustLevel;
  trustScore: number;
}

export interface EventData {
  eventId: EntityId;
  organizerId: EntityId;
  organizerTrustScore: number;
  organizerTrustLevel: TrustLevel;
  businessId?: EntityId;
  businessHealth?: number;
  title: string;
  description: string;
  interests: string[];
  location?: { latitude: number; longitude: number; address?: string };
  startDate: Date;
  endDate: Date;
  capacity?: number;
  attendeeCount: number;
  category: string;
  isPremium: boolean;
  rating?: number;
  reviewCount?: number;
  language?: string;
}

export interface RecommendationFactors {
  interestMatch: number;
  locationProximity: number;
  timeAvailability: number;
  trustScore: number;
  popularity: number;
  recency: number;
  organizerQuality: number;
  businessQuality: number;
  languageMatch: number;
  diversity: number;
}

export interface ExplainableRecommendation {
  eventId: EntityId;
  score: number;
  reasons: string[];
  reasonsKey: string[];
}

export class RecommendationAIService {
  private readonly BASE_WEIGHTS: Record<keyof RecommendationFactors, number> = {
    interestMatch: 0.25,
    locationProximity: 0.20,
    timeAvailability: 0.10,
    trustScore: 0.10,
    popularity: 0.08,
    recency: 0.08,
    organizerQuality: 0.10,
    businessQuality: 0.04,
    languageMatch: 0.03,
    diversity: 0.02,
  };

  generateRecommendations(
    userProfile: UserProfile,
    candidateEvents: EventData[],
    limit = 20
  ): ExplainableRecommendation[] {
    // Filter and score events
    const scoredEvents = candidateEvents
      .filter(event => this.passesFilters(userProfile, event))
      .map(event => this.scoreEvent(userProfile, event))
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scoredEvents;
  }

  generateDiscoveryCategories(userProfile: UserProfile, candidateEvents: EventData[]): Map<string, ExplainableRecommendation[]> {
    const categories = new Map<string, ExplainableRecommendation[]>();

    // Recommended Today
    const today = new Date();
    const todayEvents = candidateEvents.filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate.toDateString() === today.toDateString();
    });
    categories.set('recommended_today', this.generateRecommendations(userProfile, todayEvents, 10));

    // Perfect For You (based on interests)
    categories.set('perfect_for_you', this.generateRecommendations(userProfile, candidateEvents, 10));

    // Starting Soon
    const soonEvents = candidateEvents.filter(e => {
      const hoursUntil = (new Date(e.startDate).getTime() - Date.now()) / (1000 * 60 * 60);
      return hoursUntil > 0 && hoursUntil <= 24;
    });
    categories.set('starting_soon', this.generateRecommendations(userProfile, soonEvents, 5));

    // Hidden Gems (low attendance but high quality)
    const hiddenGems = candidateEvents.filter(e => 
      e.attendeeCount < 10 && e.rating && e.rating >= 4
    );
    categories.set('hidden_gems', this.generateRecommendations(userProfile, hiddenGems, 5));

    // Trending Nearby (popular in user's area)
    const trending = candidateEvents
      .filter(e => e.attendeeCount >= 20)
      .sort((a, b) => b.attendeeCount - a.attendeeCount);
    categories.set('trending_nearby', this.generateRecommendations(userProfile, trending, 5));

    // Weekend Ideas
    const weekendEvents = candidateEvents.filter(e => {
      const date = new Date(e.startDate);
      const day = date.getDay();
      return day === 0 || day === 6; // Saturday or Sunday
    });
    categories.set('weekend_ideas', this.generateRecommendations(userProfile, weekendEvents, 5));

    // After Work
    const afterWorkEvents = candidateEvents.filter(e => {
      const date = new Date(e.startDate);
      const hour = date.getHours();
      return hour >= 17 && hour <= 21;
    });
    categories.set('after_work', this.generateRecommendations(userProfile, afterWorkEvents, 5));

    // New Organizers (recently active)
    // This would require organizer creation date
    categories.set('new_organizers', this.generateRecommendations(userProfile, candidateEvents, 5));

    return categories;
  }

  private passesFilters(userProfile: UserProfile, event: EventData): boolean {
    // Check location
    if (userProfile.location && event.location) {
      const distance = this.calculateDistance(
        userProfile.location.latitude, userProfile.location.longitude,
        event.location.latitude, event.location.longitude
      );
      if (distance > userProfile.radius) return false;
    }

    // Check if ignored
    if (userProfile.ignoredEvents.includes(event.eventId)) return false;

    // Check language
    if (userProfile.language && event.language && userProfile.language !== event.language) {
      // Allow if no language preference on event
    }

    // Check capacity
    if (event.capacity && event.attendeeCount >= event.capacity) return false;

    // Check if already joined
    if (userProfile.pastEvents.includes(event.eventId)) return false;

    return true;
  }

  private scoreEvent(userProfile: UserProfile, event: EventData): ExplainableRecommendation {
    const weights = this.getAdjustedWeights(userProfile);
    const factors = this.calculateFactors(userProfile, event);
    const reasons: string[] = [];
    const reasonsKey: string[] = [];

    let score = 0;
    for (const [key, weight] of Object.entries(weights)) {
      score += factors[key as keyof RecommendationFactors] * weight;
    }

    // Generate explainable reasons
    if (factors.interestMatch >= 80) {
      reasons.push('Perfect interest match');
      reasonsKey.push('shared_interests');
    } else if (factors.interestMatch >= 50) {
      reasons.push('Good interest match');
      reasonsKey.push('shared_interests');
    }

    if (factors.locationProximity >= 90) {
      reasons.push('Very close to you');
      reasonsKey.push('nearby');
    } else if (factors.locationProximity >= 60) {
      reasons.push('Nearby location');
      reasonsKey.push('nearby');
    }

    const hoursUntil = (new Date(event.startDate).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil <= 3 && hoursUntil > 0) {
      reasons.push('Starting soon');
      reasonsKey.push('starting_soon');
    } else if (hoursUntil <= 24 && hoursUntil > 0) {
      reasons.push('Happening today');
      reasonsKey.push('today');
    }

    if (factors.organizerQuality >= 80) {
      reasons.push('Trusted organizer');
      reasonsKey.push('trusted_organizer');
    }

    if (factors.popularity >= 80) {
      reasons.push('Popular event');
      reasonsKey.push('popular');
    }

    if (factors.trustScore >= 70) {
      reasons.push('Highly rated');
      reasonsKey.push('highly_rated');
    }

    return {
      eventId: event.eventId,
      score: Math.round(score * 100) / 100,
      reasons,
      reasonsKey,
    };
  }

  private getAdjustedWeights(userProfile: UserProfile): Record<keyof RecommendationFactors, number> {
    const weights = { ...this.BASE_WEIGHTS };

    // Adjust based on trust level
    if (userProfile.trustLevel === 'verified' || userProfile.trustLevel === 'high') {
      // Verified users can explore more
      weights.diversity += 0.05;
      weights.locationProximity -= 0.05;
    }

    // Adjust based on radius preference
    if (userProfile.radius < 10) {
      weights.locationProximity += 0.05;
    } else if (userProfile.radius > 50) {
      weights.locationProximity -= 0.05;
      weights.interestMatch += 0.05;
    }

    return weights;
  }

  private calculateFactors(userProfile: UserProfile, event: EventData): RecommendationFactors {
    return {
      interestMatch: this.calculateInterestMatch(userProfile.interests, event.interests),
      locationProximity: this.calculateLocationProximity(userProfile.location, event.location, userProfile.radius),
      timeAvailability: this.calculateTimeAvailability(event.startDate, userProfile.preferredTime),
      trustScore: event.rating ? event.rating * 20 : 50,
      popularity: this.calculatePopularity(event.attendeeCount, event.capacity),
      recency: this.calculateRecency(event.startDate),
      organizerQuality: event.organizerTrustScore,
      businessQuality: event.businessHealth || 50,
      languageMatch: this.calculateLanguageMatch(userProfile.language, event.language),
      diversity: this.calculateDiversityScore(userProfile, event),
    };
  }

  private calculateInterestMatch(userInterests: string[], eventInterests: string[]): number {
    if (userInterests.length === 0 || eventInterests.length === 0) return 50;
    const matches = eventInterests.filter(i => userInterests.includes(i)).length;
    return Math.min(100, (matches / Math.max(userInterests.length, eventInterests.length)) * 100);
  }

  private calculateLocationProximity(
    userLocation?: { latitude: number; longitude: number },
    eventLocation?: { latitude: number; longitude: number },
    radius?: number
  ): number {
    if (!userLocation || !eventLocation) return 50;

    const distance = this.calculateDistance(
      userLocation.latitude, userLocation.longitude,
      eventLocation.latitude, eventLocation.longitude
    );

    const effectiveRadius = radius || 50;

    if (distance <= effectiveRadius * 0.2) return 100;
    if (distance <= effectiveRadius * 0.5) return 80;
    if (distance <= effectiveRadius) return 60;
    if (distance <= effectiveRadius * 2) return 30;
    return 10;
  }

  private calculateTimeAvailability(startDate: Date, preferredTime?: string): number {
    const hoursUntil = (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60);

    // Prefer events within 1-7 days
    if (hoursUntil >= 24 && hoursUntil <= 168) return 100;
    if (hoursUntil > 0 && hoursUntil < 24) return 80;
    if (hoursUntil > 168 && hoursUntil <= 336) return 60; // 1-2 weeks
    if (hoursUntil > 336) return 40;
    return 0; // Past events
  }

  private calculatePopularity(attendeeCount: number, capacity?: number): number {
    if (capacity) {
      const fillRate = attendeeCount / capacity;
      if (fillRate >= 0.9) return 100;
      if (fillRate >= 0.7) return 80;
      if (fillRate >= 0.5) return 60;
      if (fillRate >= 0.2) return 40;
      return 20;
    }

    // No capacity limit
    if (attendeeCount >= 50) return 100;
    if (attendeeCount >= 20) return 70;
    if (attendeeCount >= 10) return 50;
    return 30;
  }

  private calculateRecency(startDate: Date): number {
    const now = new Date();
    const daysUntil = Math.ceil((new Date(startDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 1) return 100;
    if (daysUntil <= 3) return 80;
    if (daysUntil <= 7) return 60;
    if (daysUntil <= 14) return 40;
    if (daysUntil <= 30) return 20;
    return 10;
  }

  private calculateLanguageMatch(userLang?: string, eventLang?: string): number {
    if (!userLang || !eventLang) return 80; // Neutral if not specified
    return userLang === eventLang ? 100 : 30;
  }

  private calculateDiversityScore(userProfile: UserProfile, event: EventData): number {
    // Check if this category is over-represented in user's history
    const categoryCount = userProfile.pastEvents.filter(e => 
      userProfile.favoriteCategories.includes(event.category)
    ).length;

    // More events in same category = less diversity
    if (categoryCount >= 10) return 20;
    if (categoryCount >= 5) return 50;
    return 80;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

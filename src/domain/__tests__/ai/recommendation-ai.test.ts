import { RecommendationAIService } from '../../ai/services/recommendation-ai';

describe('RecommendationAIService', () => {
  let recommendationAI: RecommendationAIService;

  beforeEach(() => {
    recommendationAI = new RecommendationAIService();
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations for user', async () => {
      const userId = 'user_123';
      const events = [
        {
          id: 'event_1',
          title: 'Tech Meetup',
          description: 'Tech networking event',
          category: 'tech',
          interests: ['tech', 'networking'],
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          organizerTrustScore: 80,
          attendeeCount: 25,
          distance: 5,
        },
        {
          id: 'event_2',
          title: 'Social Party',
          description: 'Fun party',
          category: 'social',
          interests: ['social', 'party'],
          startDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
          organizerTrustScore: 90,
          attendeeCount: 50,
          distance: 10,
        },
      ];

      const result = await recommendationAI.generateRecommendations(userId, events);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.categories).toBeDefined();
      expect(result.generatedAt).toBeDefined();
    });

    it('should generate category recommendations', async () => {
      const userId = 'user_123';
      const interests = ['tech', 'networking', 'social'];
      const events = [
        {
          id: 'event_1',
          title: 'Tech Meetup',
          interests: ['tech'],
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          organizerTrustScore: 80,
          attendeeCount: 25,
          distance: 5,
        },
        {
          id: 'event_2',
          title: 'Social Party',
          interests: ['social'],
          startDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
          organizerTrustScore: 90,
          attendeeCount: 50,
          distance: 10,
        },
      ];

      const result = await recommendationAI.generateRecommendations(userId, events);

      // Check categories are generated
      expect(Object.keys(result.categories).length).toBeGreaterThan(0);
    });

    it('should calculate relevance scores', async () => {
      const userId = 'user_123';
      const interests = ['tech', 'networking'];
      const events = [
        {
          id: 'event_1',
          title: 'Tech Conference',
          interests: ['tech', 'networking'],
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          organizerTrustScore: 90,
          attendeeCount: 100,
          distance: 10,
        },
        {
          id: 'event_2',
          title: 'Art Exhibition',
          interests: ['art'],
          startDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
          organizerTrustScore: 50,
          attendeeCount: 10,
          distance: 50,
        },
      ];

      const result = await recommendationAI.generateRecommendations(userId, events);

      // Tech event should be more relevant based on interests
      const techEvent = result.categories.perfectForYou?.find(e => e.id === 'event_1');
      expect(techEvent).toBeDefined();
    });
  });

  describe('calculateScore', () => {
    it('should calculate recommendation score', () => {
      const score = recommendationAI.calculateScore({
        interestMatch: 0.9,
        distance: 5,
        timeRelevance: 0.8,
        trustScore: 85,
        popularity: 50,
        organizerQuality: 90,
        businessQuality: 80,
      });

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should weight factors correctly', () => {
      // Perfect match should give high score
      const perfectScore = recommendationAI.calculateScore({
        interestMatch: 1.0,
        distance: 0,
        timeRelevance: 1.0,
        trustScore: 100,
        popularity: 100,
        organizerQuality: 100,
        businessQuality: 100,
      });

      // Poor match should give low score
      const poorScore = recommendationAI.calculateScore({
        interestMatch: 0,
        distance: 100,
        timeRelevance: 0,
        trustScore: 0,
        popularity: 0,
        organizerQuality: 0,
        businessQuality: 0,
      });

      expect(perfectScore).toBeGreaterThan(poorScore);
    });
  });

  describe('generateReasons', () => {
    it('should generate reasons for recommendation', () => {
      const reasons = recommendationAI.generateReasons({
        interestMatch: true,
        nearby: true,
        startingSoon: false,
        trustedOrganizer: true,
        popular: false,
        highlyRated: true,
      });

      expect(reasons).toContain('Based on your interests');
      expect(reasons).toContain('Close to you');
      expect(reasons).toContain('Trusted organizer');
      expect(reasons).toContain('Highly rated');
    });

    it('should include diversity reasons', () => {
      const reasons = recommendationAI.generateReasons({
        interestMatch: false,
        nearby: false,
        startingSoon: false,
        trustedOrganizer: false,
        popular: false,
        highlyRated: false,
        hiddenGem: true,
      });

      expect(reasons).toContain('Hidden gem');
    });
  });

  describe('diversity', () => {
    it('should avoid showing same category events consecutively', async () => {
      const userId = 'user_123';
      const sameCategoryEvents = Array(10).fill(null).map((_, i) => ({
        id: `event_${i}`,
        title: `Tech Event ${i}`,
        category: 'tech',
        interests: ['tech'],
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        organizerTrustScore: 80,
        attendeeCount: 25,
        distance: 5,
      }));

      const result = await recommendationAI.generateRecommendations(userId, sameCategoryEvents);

      // Should still have categories with variety
      expect(Object.keys(result.categories).length).toBeGreaterThan(0);
    });
  });
});

describe('RecommendationAIService Configuration', () => {
  it('should use custom configuration', () => {
    const customAI = new RecommendationAIService({
      maxEventsPerCategory: 3,
      minScoreThreshold: 30,
    });

    expect(customAI['config'].maxEventsPerCategory).toBe(3);
    expect(customAI['config'].minScoreThreshold).toBe(30);
  });

  it('should use default configuration', () => {
    const ai = new RecommendationAIService();
    expect(ai['config'].maxEventsPerCategory).toBe(5);
    expect(ai['config'].minScoreThreshold).toBe(20);
  });
});

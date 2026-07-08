import { TrustScoreEntity } from '../../ai/entities/trust-score';
import { TrustIntelligenceService, UserTrustData } from '../../ai/services/trust-intelligence';
import { TrustLevel } from '../../ai/types';

describe('TrustIntelligence', () => {
  describe('TrustScoreEntity', () => {
    it('should create trust score with initial values', () => {
      const trustScore = TrustScoreEntity.create({
        userId: 'user_123',
        score: 75,
        level: 'high',
        factors: {
          reliability: 80,
          consistency: 70,
          reputation: 75,
          verification: 60,
          community: 70,
        },
        signals: {
          userId: 'user_123',
          attendanceRate: 90,
          completionRate: 95,
          averageRating: 80,
          totalEvents: 20,
          successfulMeetups: 18,
          reportsReceived: 1,
          reportsFiled: 5,
          accountAge: 180,
          verificationLevel: 3,
          socialConnections: 30,
        },
        lastUpdated: new Date(),
      });

      expect(trustScore.userId).toBe('user_123');
      expect(trustScore.score).toBe(75);
      expect(trustScore.level).toBe('high');
    });

    it('should calculate correct trust level based on score', () => {
      const trustScore = TrustScoreEntity.create({
        userId: 'user_123',
        score: 95,
        level: 'verified',
        factors: {
          reliability: 95,
          consistency: 90,
          reputation: 95,
          verification: 100,
          community: 80,
        },
        signals: {
          userId: 'user_123',
          attendanceRate: 100,
          completionRate: 100,
          averageRating: 95,
          totalEvents: 50,
          successfulMeetups: 50,
          reportsReceived: 0,
          reportsFiled: 20,
          accountAge: 365,
          verificationLevel: 5,
          socialConnections: 100,
        },
        lastUpdated: new Date(),
      });

      expect(trustScore.calculateLevel(95)).toBe('verified');
      expect(trustScore.calculateLevel(75)).toBe('high');
      expect(trustScore.calculateLevel(50)).toBe('medium');
      expect(trustScore.calculateLevel(15)).toBe('low');
      expect(trustScore.calculateLevel(5)).toBe('untrusted');
    });

    it('should detect expired trust scores', () => {
      const oldDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      
      const trustScore = TrustScoreEntity.create({
        userId: 'user_123',
        score: 50,
        level: 'medium',
        factors: {
          reliability: 50,
          consistency: 50,
          reputation: 50,
          verification: 50,
          community: 50,
        },
        signals: {
          userId: 'user_123',
          attendanceRate: 50,
          completionRate: 50,
          averageRating: 50,
          totalEvents: 5,
          successfulMeetups: 4,
          reportsReceived: 1,
          reportsFiled: 2,
          accountAge: 30,
          verificationLevel: 2,
          socialConnections: 10,
        },
        lastUpdated: oldDate,
      });

      expect(trustScore.isExpired).toBe(true);
    });
  });

  describe('TrustIntelligenceService', () => {
    it('should calculate trust score from user data', () => {
      // Mock repository
      const mockRepository = {
        findByUserId: jest.fn().mockResolvedValue(null),
        save: jest.fn().mockResolvedValue(undefined),
        deleteByUserId: jest.fn().mockResolvedValue(undefined),
      };

      const service = new TrustIntelligenceService(mockRepository);

      const userData: UserTrustData = {
        userId: 'user_123',
        accountCreatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
        ratingsReceived: [
          { score: 4, createdAt: new Date() },
          { score: 5, createdAt: new Date() },
          { score: 4, createdAt: new Date() },
        ],
        eventsAttended: [
          { eventId: 'event_1', status: 'attended', joinedAt: new Date(), completedAt: new Date() },
          { eventId: 'event_2', status: 'attended', joinedAt: new Date(), completedAt: new Date() },
          { eventId: 'event_3', status: 'attended', joinedAt: new Date(), completedAt: new Date() },
        ],
        eventsOrganized: 5,
        reportsReceived: 1,
        reportsFiled: 5,
        verificationLevel: 3,
        socialConnections: 30,
      };

      const result = service.calculateTrustScore(userData);
      
      expect(result.userId).toBe('user_123');
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should generate appropriate recommendations based on factors', () => {
      const mockRepository = {
        findByUserId: jest.fn().mockResolvedValue(null),
        save: jest.fn().mockResolvedValue(undefined),
        deleteByUserId: jest.fn().mockResolvedValue(undefined),
      };

      const service = new TrustIntelligenceService(mockRepository);

      const trustScore = {
        userId: 'user_123',
        score: 45,
        level: 'medium' as TrustLevel,
        factors: {
          reliability: 40,
          consistency: 30,
          reputation: 50,
          verification: 20,
          community: 40,
        },
      };

      const recommendations = service.getTrustRecommendations(trustScore);
      
      expect(recommendations).toContain('Stay active to build consistency');
      expect(recommendations).toContain('Complete verification steps to increase trust');
    });
  });
});

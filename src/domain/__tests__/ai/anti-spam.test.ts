import { SpamAssessmentEntity } from '../../ai/entities/spam-assessment';
import { SpamSignals } from '../../ai/types';

describe('AntiSpam', () => {
  describe('SpamAssessmentEntity', () => {
    it('should create spam assessment with signals', () => {
      const signals: SpamSignals = {
        eventFlooding: true,
        messageSpam: false,
        joinSpam: false,
        notificationSpam: false,
        repeatedReports: false,
        massAccountCreation: false,
        rateLimitViolations: 2,
      };

      const assessment = SpamAssessmentEntity.create({
        entityId: 'user_123',
        isSpam: false,
        spamScore: 30,
        signals,
        violations: [],
        action: 'allow',
        createdAt: new Date(),
      });

      expect(assessment.entityId).toBe('user_123');
      expect(assessment.signals.eventFlooding).toBe(true);
      expect(assessment.action).toBe('allow');
    });

    it('should calculate spam score from signals', () => {
      const heavySpamSignals: SpamSignals = {
        eventFlooding: true,
        messageSpam: true,
        joinSpam: true,
        notificationSpam: false,
        repeatedReports: true,
        massAccountCreation: false,
        rateLimitViolations: 5,
      };

      const score = SpamAssessmentEntity.calculateSpamScore(heavySpamSignals);
      expect(score).toBeGreaterThanOrEqual(50);
    });

    it('should determine correct action based on score', () => {
      expect(SpamAssessmentEntity.determineAction(85)).toBe('block');
      expect(SpamAssessmentEntity.determineAction(65)).toBe('limit');
      expect(SpamAssessmentEntity.determineAction(45)).toBe('warn');
      expect(SpamAssessmentEntity.determineAction(20)).toBe('allow');
    });

    it('should add violations and update score', () => {
      const assessment = SpamAssessmentEntity.create({
        entityId: 'user_123',
        isSpam: false,
        spamScore: 20,
        signals: {
          eventFlooding: false,
          messageSpam: false,
          joinSpam: false,
          notificationSpam: false,
          repeatedReports: false,
          massAccountCreation: false,
          rateLimitViolations: 0,
        },
        violations: [],
        action: 'allow',
        createdAt: new Date(),
      });

      assessment.addViolation({
        type: 'event_flooding',
        count: 5,
        firstOccurrence: new Date(),
        lastOccurrence: new Date(),
        severity: 30,
      });

      expect(assessment.violations).toHaveLength(1);
      expect(assessment.spamScore).toBe(50);
      expect(assessment.isSpam).toBe(true);
    });

    it('should set expiration for limited/blocked accounts', () => {
      const assessment = SpamAssessmentEntity.create({
        entityId: 'user_123',
        isSpam: true,
        spamScore: 70,
        signals: {
          eventFlooding: true,
          messageSpam: false,
          joinSpam: false,
          notificationSpam: false,
          repeatedReports: false,
          massAccountCreation: false,
          rateLimitViolations: 3,
        },
        violations: [],
        action: 'limit',
        createdAt: new Date(),
      });

      assessment.setExpiration(2); // 2 hours

      expect(assessment.expiresAt).toBeDefined();
      expect(assessment.isExpired).toBe(false);
    });

    it('should detect expired assessments', () => {
      const assessment = SpamAssessmentEntity.create({
        entityId: 'user_123',
        isSpam: true,
        spamScore: 60,
        signals: {
          eventFlooding: false,
          messageSpam: false,
          joinSpam: false,
          notificationSpam: false,
          repeatedReports: false,
          massAccountCreation: false,
          rateLimitViolations: 0,
        },
        violations: [],
        action: 'limit',
        createdAt: new Date(),
      });

      assessment.setExpiration(1); // 1 hour
      
      // Manually set expired for testing
      const expiredDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
      (assessment as any)._expiresAt = expiredDate;

      expect(assessment.isExpired).toBe(true);
    });
  });

  describe('AntiSpamService', () => {
    it('should detect event flooding', () => {
      const spamSignals: SpamSignals = {
        eventFlooding: true,
        messageSpam: false,
        joinSpam: false,
        notificationSpam: false,
        repeatedReports: false,
        massAccountCreation: false,
        rateLimitViolations: 0,
      };

      const score = SpamAssessmentEntity.calculateSpamScore(spamSignals);
      expect(score).toBe(30);
    });

    it('should calculate higher score for multiple violations', () => {
      const multipleViolations: SpamSignals = {
        eventFlooding: true,
        messageSpam: true,
        joinSpam: true,
        notificationSpam: true,
        repeatedReports: true,
        massAccountCreation: false,
        rateLimitViolations: 3,
      };

      const score = SpamAssessmentEntity.calculateSpamScore(multipleViolations);
      expect(score).toBeGreaterThan(100); // Will be capped at 100
    });
  });
});

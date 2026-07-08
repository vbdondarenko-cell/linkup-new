import { ModerationResultEntity, ViolationFactory } from '../../ai/entities/moderation-result';

describe('ContentModeration', () => {
  describe('ModerationResultEntity', () => {
    it('should create moderation result', () => {
      const result = ModerationResultEntity.create({
        contentId: 'content_123',
        contentType: 'event_title',
        result: 'approved',
        violations: [],
        confidence: 0.95,
        requiresHumanReview: false,
        reviewedAt: new Date(),
      });

      expect(result.contentId).toBe('content_123');
      expect(result.contentType).toBe('event_title');
      expect(result.result).toBe('approved');
      expect(result.isApproved).toBe(true);
    });

    it('should detect violations', () => {
      const result = ModerationResultEntity.create({
        contentId: 'content_123',
        contentType: 'event_description',
        result: 'approved',
        violations: [
          ViolationFactory.spam(),
        ],
        confidence: 0.85,
        requiresHumanReview: false,
        reviewedAt: new Date(),
      });

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].type).toBe('spam');
    });

    it('should require human review based on confidence', () => {
      const lowConfidence = ModerationResultEntity.shouldRequireHumanReview(0.5, []);
      expect(lowConfidence).toBe(true);

      const highConfidence = ModerationResultEntity.shouldRequireHumanReview(0.9, []);
      expect(highConfidence).toBe(false);
    });

    it('should require human review for high severity violations', () => {
      const highSeverity = ModerationResultEntity.shouldRequireHumanReview(
        0.85,
        [{ type: 'nsfw', severity: 90, confidence: 0.9, details: '' }]
      );
      expect(highSeverity).toBe(true);
    });

    it('should approve content without violations', () => {
      const result = ModerationResultEntity.create({
        contentId: 'content_123',
        contentType: 'event_title',
        result: 'approved',
        violations: [],
        confidence: 0.95,
        requiresHumanReview: false,
        reviewedAt: new Date(),
      });

      expect(result.isApproved).toBe(true);
      expect(result.isRejected).toBe(false);
    });

    it('should reject content with high severity violations', () => {
      const result = ModerationResultEntity.create({
        contentId: 'content_123',
        contentType: 'event_description',
        result: 'rejected',
        violations: [
          ViolationFactory.scam('Money transfer request detected'),
        ],
        confidence: 0.9,
        requiresHumanReview: false,
        reviewedAt: new Date(),
      });

      expect(result.isRejected).toBe(true);
      expect(result.mostSevereViolation?.type).toBe('scam');
    });

    it('should approve after human review', () => {
      const result = ModerationResultEntity.create({
        contentId: 'content_123',
        contentType: 'event_description',
        result: 'pending_review',
        violations: [],
        confidence: 0.6,
        requiresHumanReview: true,
        reviewedAt: new Date(),
      });

      expect(result.isPendingReview).toBe(true);

      result.approve();
      expect(result.result).toBe('approved');
      expect(result.isApproved).toBe(true);
      expect(result.requiresHumanReview).toBe(false);
    });
  });

  describe('ViolationFactory', () => {
    it('should create profanity violation', () => {
      const violation = ViolationFactory.profanity('badword', { start: 0, end: 7 });
      
      expect(violation.type).toBe('profanity');
      expect(violation.severity).toBe(70);
      expect(violation.confidence).toBe(0.95);
      expect(violation.location).toEqual({ start: 0, end: 7 });
    });

    it('should create scam violation with high severity', () => {
      const violation = ViolationFactory.scam('Bitcoin investment opportunity');
      
      expect(violation.type).toBe('scam');
      expect(violation.severity).toBe(100);
      expect(violation.confidence).toBe(0.9);
    });

    it('should create harassment violation', () => {
      const violation = ViolationFactory.harassment('another_user');
      
      expect(violation.type).toBe('harassment');
      expect(violation.severity).toBe(90);
      expect(violation.details).toContain('another_user');
    });

    it('should create illegal content violation', () => {
      const violation = ViolationFactory.illegal('Drug distribution');
      
      expect(violation.type).toBe('illegal');
      expect(violation.severity).toBe(100);
    });

    it('should create NSFW violation', () => {
      const violation = ViolationFactory.nsfw();
      
      expect(violation.type).toBe('nsfw');
      expect(violation.severity).toBe(95);
    });

    it('should clamp severity values', () => {
      const violation = ViolationFactory.create('spam', 150, 1.5, 'Test');
      
      expect(violation.severity).toBe(100);
      expect(violation.confidence).toBe(1);
    });
  });
});

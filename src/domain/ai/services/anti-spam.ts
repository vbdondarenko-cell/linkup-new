import { EntityId } from '../../shared/types';
import { SpamAssessmentEntity } from '../entities/spam-assessment';
import { SpamSignals, SpamViolationType, SpamViolation, SpamAction } from '../types';
import { ISpamRepository } from '../repositories/i-spam-repository';
import { AntiSpamError } from '../errors/ai-errors';

export interface SpamRepository {
  findByEntityId(entityId: EntityId): Promise<SpamAssessmentEntity | null>;
  findActive(limit?: number): Promise<SpamAssessmentEntity[]>;
  save(assessment: SpamAssessmentEntity): Promise<void>;
  deleteByEntityId(entityId: EntityId): Promise<void>;
}

export interface SpamCheckData {
  entityId: EntityId;
  entityType: 'user' | 'organizer';
  eventsCreated24h: number;
  eventsCreated7d: number;
  messagesSent1h: number;
  messagesSent24h: number;
  joinAttempts1h: number;
  joinAttempts24h: number;
  reportsFiled1h: number;
  reportsFiled24h: number;
  accountsCreated24h?: number; // For organizer check
  rateLimitViolations: number;
}

export interface RateLimitConfig {
  eventsPerHour: number;
  eventsPerDay: number;
  messagesPerHour: number;
  messagesPerDay: number;
  joinsPerHour: number;
  joinsPerDay: number;
  reportsPerHour: number;
  reportsPerDay: number;
}

export class AntiSpamService {
  private readonly DEFAULT_RATE_LIMITS: RateLimitConfig = {
    eventsPerHour: 3,
    eventsPerDay: 10,
    messagesPerHour: 30,
    messagesPerDay: 200,
    joinsPerHour: 20,
    joinsPerDay: 50,
    reportsPerHour: 5,
    reportsPerDay: 20,
  };

  private rateLimitConfig: RateLimitConfig;

  constructor(
    private readonly spamRepository: SpamRepository,
    config?: Partial<RateLimitConfig>
  ) {
    this.rateLimitConfig = { ...this.DEFAULT_RATE_LIMITS, ...config };
  }

  async assessSpamRisk(data: SpamCheckData): Promise<SpamAssessmentEntity> {
    const signals = this.extractSignals(data);
    const violations = this.detectViolations(signals, data);
    const spamScore = SpamAssessmentEntity.calculateSpamScore(signals);
    const action = SpamAssessmentEntity.determineAction(spamScore);

    const assessment = SpamAssessmentEntity.create({
      entityId: data.entityId,
      isSpam: spamScore >= 50,
      spamScore,
      signals,
      violations,
      action,
      createdAt: new Date(),
    });

    // Set expiration based on action
    if (action === 'limit') {
      assessment.setExpiration(1); // 1 hour
    } else if (action === 'block') {
      assessment.setExpiration(24); // 24 hours
    }

    await this.spamRepository.save(assessment);
    return assessment;
  }

  async checkRateLimit(entityId: EntityId, action: 'event' | 'message' | 'join' | 'report'): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt?: Date;
  }> {
    const assessment = await this.spamRepository.findByEntityId(entityId);
    
    if (!assessment || assessment.isExpired || assessment.action === 'allow') {
      return { allowed: true, remaining: -1 }; // No limits
    }

    if (assessment.action === 'block') {
      return {
        allowed: false,
        remaining: 0,
        resetAt: assessment.expiresAt,
      };
    }

    // For limited accounts, calculate remaining based on violation severity
    const remaining = Math.max(0, 10 - assessment.violations.length);
    return {
      allowed: remaining > 0,
      remaining,
      resetAt: assessment.expiresAt,
    };
  }

  async recordAction(entityId: EntityId, actionType: 'event' | 'message' | 'join' | 'report'): Promise<SpamAssessmentEntity> {
    let assessment = await this.spamRepository.findByEntityId(entityId);

    if (!assessment) {
      assessment = SpamAssessmentEntity.create({
        entityId,
        isSpam: false,
        spamScore: 0,
        signals: this.getEmptySignals(),
        violations: [],
        action: 'allow',
        createdAt: new Date(),
      });
    }

    // Add violation for exceeding rate limit
    const violationType = this.actionToViolationType(actionType);
    const existingViolation = assessment.violations.find(v => v.type === violationType);

    if (existingViolation) {
      existingViolation.count++;
      existingViolation.lastOccurrence = new Date();
    } else {
      assessment.addViolation({
        type: violationType,
        count: 1,
        firstOccurrence: new Date(),
        lastOccurrence: new Date(),
        severity: this.calculateViolationSeverity(actionType),
      });
    }

    // Recalculate spam score
    assessment.updateRiskLevel();

    await this.spamRepository.save(assessment);
    return assessment;
  }

  async clearSpamRecord(entityId: EntityId): Promise<void> {
    await this.spamRepository.deleteByEntityId(entityId);
  }

  async getActiveSpamCases(limit = 100): Promise<SpamAssessmentEntity[]> {
    return this.spamRepository.findActive(limit);
  }

  private extractSignals(data: SpamCheckData): SpamSignals {
    return {
      eventFlooding: data.eventsCreated24h > this.rateLimitConfig.eventsPerHour ||
                     data.eventsCreated7d > this.rateLimitConfig.eventsPerDay * 3,
      messageSpam: data.messagesSent1h > this.rateLimitConfig.messagesPerHour ||
                   data.messagesSent24h > this.rateLimitConfig.messagesPerDay,
      joinSpam: data.joinAttempts1h > this.rateLimitConfig.joinsPerHour ||
                data.joinAttempts24h > this.rateLimitConfig.joinsPerDay,
      notificationSpam: false, // Would need notification-specific data
      repeatedReports: data.reportsFiled1h > this.rateLimitConfig.reportsPerHour ||
                      data.reportsFiled24h > this.rateLimitConfig.reportsPerDay,
      massAccountCreation: (data.accountsCreated24h || 0) > 5,
      rateLimitViolations: data.rateLimitViolations,
    };
  }

  private getEmptySignals(): SpamSignals {
    return {
      eventFlooding: false,
      messageSpam: false,
      joinSpam: false,
      notificationSpam: false,
      repeatedReports: false,
      massAccountCreation: false,
      rateLimitViolations: 0,
    };
  }

  private detectViolations(signals: SpamSignals, data: SpamCheckData): SpamViolation[] {
    const violations: SpamViolation[] = [];
    const now = new Date();

    if (signals.eventFlooding) {
      violations.push({
        type: 'event_flooding',
        count: data.eventsCreated24h,
        firstOccurrence: now,
        lastOccurrence: now,
        severity: Math.min(100, data.eventsCreated24h * 10),
      });
    }

    if (signals.messageSpam) {
      violations.push({
        type: 'message_spam',
        count: data.messagesSent1h,
        firstOccurrence: now,
        lastOccurrence: now,
        severity: Math.min(100, data.messagesSent1h * 5),
      });
    }

    if (signals.joinSpam) {
      violations.push({
        type: 'join_spam',
        count: data.joinAttempts1h,
        firstOccurrence: now,
        lastOccurrence: now,
        severity: Math.min(100, data.joinAttempts1h * 5),
      });
    }

    if (signals.repeatedReports) {
      violations.push({
        type: 'repeated_reports',
        count: data.reportsFiled1h,
        firstOccurrence: now,
        lastOccurrence: now,
        severity: Math.min(100, data.reportsFiled1h * 15),
      });
    }

    if (signals.massAccountCreation) {
      violations.push({
        type: 'mass_account_creation',
        count: data.accountsCreated24h || 0,
        firstOccurrence: now,
        lastOccurrence: now,
        severity: 80,
      });
    }

    return violations;
  }

  private actionToViolationType(action: 'event' | 'message' | 'join' | 'report'): SpamViolationType {
    const mapping: Record<typeof action, SpamViolationType> = {
      event: 'event_flooding',
      message: 'message_spam',
      join: 'join_spam',
      report: 'repeated_reports',
    };
    return mapping[action];
  }

  private calculateViolationSeverity(action: 'event' | 'message' | 'join' | 'report'): number {
    const severities: Record<typeof action, number> = {
      event: 30,
      message: 20,
      join: 15,
      report: 40,
    };
    return severities[action];
  }

  // Rate limit exceeded check
  checkRateLimitExceeded(data: SpamCheckData): {
    exceeded: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    if (data.eventsCreated24h > this.rateLimitConfig.eventsPerDay) {
      violations.push(`Daily event limit exceeded (${data.eventsCreated24h}/${this.rateLimitConfig.eventsPerDay})`);
    }

    if (data.messagesSent24h > this.rateLimitConfig.messagesPerDay) {
      violations.push(`Daily message limit exceeded (${data.messagesSent24h}/${this.rateLimitConfig.messagesPerDay})`);
    }

    if (data.joinAttempts24h > this.rateLimitConfig.joinsPerDay) {
      violations.push(`Daily join limit exceeded (${data.joinAttempts24h}/${this.rateLimitConfig.joinsPerDay})`);
    }

    return {
      exceeded: violations.length > 0,
      violations,
    };
  }

  // Adaptive rate limiting based on trust score
  getAdaptiveLimits(trustLevel: number): RateLimitConfig {
    // Higher trust = higher limits
    const multiplier = 1 + (trustLevel / 100) * 2; // Up to 3x for verified users

    return {
      eventsPerHour: Math.round(this.DEFAULT_RATE_LIMITS.eventsPerHour * multiplier),
      eventsPerDay: Math.round(this.DEFAULT_RATE_LIMITS.eventsPerDay * multiplier),
      messagesPerHour: Math.round(this.DEFAULT_RATE_LIMITS.messagesPerHour * multiplier),
      messagesPerDay: Math.round(this.DEFAULT_RATE_LIMITS.messagesPerDay * multiplier),
      joinsPerHour: Math.round(this.DEFAULT_RATE_LIMITS.joinsPerHour * multiplier),
      joinsPerDay: Math.round(this.DEFAULT_RATE_LIMITS.joinsPerDay * multiplier),
      reportsPerHour: this.DEFAULT_RATE_LIMITS.reportsPerHour, // Don't increase for reports
      reportsPerDay: this.DEFAULT_RATE_LIMITS.reportsPerDay,
    };
  }
}

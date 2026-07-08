import { EntityId } from '../../shared/types';
import { RiskAssessmentEntity, RiskEntityType } from '../entities/risk-assessment';
import { FraudSignals, RiskLevel, RiskFlag, RiskFlagType } from '../types';
import { IFraudRepository } from '../repositories/i-risk-repository';
import { FraudDetectionError } from '../errors/ai-errors';

export interface FraudRepository {
  findByEntityId(entityId: EntityId): Promise<RiskAssessmentEntity | null>;
  findByEntityType(entityType: RiskEntityType, limit?: number): Promise<RiskAssessmentEntity[]>;
  save(assessment: RiskAssessmentEntity): Promise<void>;
  deleteByEntityId(entityId: EntityId): Promise<void>;
}

export interface UserFraudData {
  userId: EntityId;
  accountCreatedAt: Date;
  eventsCreated: number;
  eventsJoined: number;
  messagesSent: number;
  reportsReceived: number;
  reportsFiled: number;
  locationChanges: number;
  devices: string[];
  ipAddresses: string[];
  avgSessionDuration: number;
  loginFrequency: number;
}

export interface EventFraudData {
  eventId: EntityId;
  organizerId: EntityId;
  createdAt: Date;
  attendeeCount: number;
  capacity: number;
  titleFingerprint?: string;
  descriptionFingerprint?: string;
  location: { latitude: number; longitude: number };
}

export class FraudDetectionService {
  private readonly THRESHOLDS = {
    CRITICAL: 80,
    HIGH: 60,
    MEDIUM: 30,
    NEW_ACCOUNT_DAYS: 7,
    HIGH_EVENT_RATE: 10,
    HIGH_JOIN_RATE: 50,
    HIGH_MESSAGE_RATE: 100,
    HIGH_LOCATION_CHANGES: 10,
    HIGH_DEVICE_COUNT: 5,
    HIGH_IP_VARIETY: 10,
  };

  constructor(private readonly fraudRepository: FraudRepository) {}

  async assessUserRisk(userData: UserFraudData): Promise<RiskAssessmentEntity> {
    const signals = this.extractUserSignals(userData);
    const riskScore = RiskAssessmentEntity.calculateRiskScore(signals);
    const flags = this.detectFlags(signals);
    const recommendations = this.generateRecommendations(riskScore, flags);
    const confidence = this.calculateConfidence(signals);

    const assessment = RiskAssessmentEntity.create({
      entityId: userData.userId,
      entityType: 'user',
      riskScore,
      riskLevel: RiskAssessmentEntity.calculateRiskLevel(riskScore),
      signals,
      flags,
      recommendations,
      confidence,
      createdAt: new Date(),
    });

    await this.fraudRepository.save(assessment);
    return assessment;
  }

  async assessEventRisk(eventData: EventFraudData): Promise<RiskAssessmentEntity> {
    const signals = this.extractEventSignals(eventData);
    const riskScore = this.calculateEventRiskScore(signals, eventData);
    const flags = this.detectEventFlags(signals, eventData);
    const recommendations = this.generateEventRecommendations(riskScore, flags);
    const confidence = 0.8; // Base confidence for event assessment

    const assessment = RiskAssessmentEntity.create({
      entityId: eventData.eventId,
      entityType: 'event',
      riskScore,
      riskLevel: RiskAssessmentEntity.calculateRiskLevel(riskScore),
      signals: {
        accountAge: 0,
        eventCreationRate: 0,
        joinRate: 0,
        messageRate: 0,
        reportRate: 0,
        locationChanges: 0,
        deviceCount: 0,
        ipVariety: 0,
        suspiciousPatterns: [],
        ...signals,
      } as FraudSignals,
      flags,
      recommendations,
      confidence,
      createdAt: new Date(),
    });

    await this.fraudRepository.save(assessment);
    return assessment;
  }

  async getRiskAssessment(entityId: EntityId): Promise<RiskAssessmentEntity | null> {
    return this.fraudRepository.findByEntityId(entityId);
  }

  async getHighRiskEntities(entityType: RiskEntityType, limit = 100): Promise<RiskAssessmentEntity[]> {
    const assessments = await this.fraudRepository.findByEntityType(entityType, limit * 2);
    return assessments
      .filter(a => a.riskLevel !== 'low')
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, limit);
  }

  private extractUserSignals(userData: UserFraudData): FraudSignals {
    const now = new Date();
    const accountAge = (now.getTime() - userData.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24);

    // Calculate rates per day
    const daysActive = Math.max(1, accountAge);
    const eventCreationRate = userData.eventsCreated / daysActive;
    const joinRate = userData.eventsJoined / daysActive;
    const messageRate = userData.messagesSent / daysActive;
    const reportRate = userData.reportsReceived / daysActive;

    // Unique counts
    const uniqueDevices = new Set(userData.devices).size;
    const uniqueIPs = new Set(userData.ipAddresses).size;

    // Detect suspicious patterns
    const suspiciousPatterns: string[] = [];

    if (uniqueDevices > this.THRESHOLDS.HIGH_DEVICE_COUNT) {
      suspiciousPatterns.push('unusual_device_count');
    }

    if (uniqueIPs > this.THRESHOLDS.HIGH_IP_VARIETY) {
      suspiciousPatterns.push('unusual_ip_variety');
    }

    if (userData.locationChanges > this.THRESHOLDS.HIGH_LOCATION_CHANGES) {
      suspiciousPatterns.push('rapid_location_changes');
    }

    if (userData.avgSessionDuration < 30 && userData.loginFrequency > 50) {
      suspiciousPatterns.push('brief_sessions_high_frequency');
    }

    return {
      accountAge: Math.round(accountAge),
      eventCreationRate: Math.round(eventCreationRate * 100) / 100,
      joinRate: Math.round(joinRate * 100) / 100,
      messageRate: Math.round(messageRate * 100) / 100,
      reportRate: Math.round(reportRate * 100) / 100,
      locationChanges: userData.locationChanges,
      deviceCount: uniqueDevices,
      ipVariety: uniqueIPs,
      suspiciousPatterns,
    };
  }

  private extractEventSignals(eventData: EventFraudData): Record<string, unknown> {
    return {
      organizerId: eventData.organizerId,
      createdAt: eventData.createdAt,
      attendeeCount: eventData.attendeeCount,
      capacity: eventData.capacity,
      hasTitleFingerprint: !!eventData.titleFingerprint,
      hasDescriptionFingerprint: !!eventData.descriptionFingerprint,
    };
  }

  private detectFlags(signals: FraudSignals): RiskFlag[] {
    const flags: RiskFlag[] = [];

    // New account
    if (signals.accountAge < this.THRESHOLDS.NEW_ACCOUNT_DAYS) {
      flags.push(this.createFlag('fake_account', 30, 'Account is less than 7 days old', {
        accountAge: signals.accountAge,
      }));
    }

    // High event creation rate
    if (signals.eventCreationRate > this.THRESHOLDS.HIGH_EVENT_RATE) {
      flags.push(this.createFlag('fake_event', 40, 'Unusually high event creation rate', {
        eventRate: signals.eventCreationRate,
      }));
    }

    // High join rate (potential bot joining)
    if (signals.joinRate > this.THRESHOLDS.HIGH_JOIN_RATE) {
      flags.push(this.createFlag('bot_behavior', 35, 'Unusually high event join rate', {
        joinRate: signals.joinRate,
      }));
    }

    // High message rate
    if (signals.messageRate > this.THRESHOLDS.HIGH_MESSAGE_RATE) {
      flags.push(this.createFlag('bot_behavior', 25, 'Unusually high message rate', {
        messageRate: signals.messageRate,
      }));
    }

    // Many reports
    if (signals.reportRate > 0.5) {
      flags.push(this.createFlag('spam_organizer', 40, 'High report rate', {
        reportRate: signals.reportRate,
      }));
    }

    // Location spoofing detection
    if (signals.locationChanges > this.THRESHOLDS.HIGH_LOCATION_CHANGES) {
      flags.push(this.createFlag('location_spoofing', 50, 'Unusual location change frequency', {
        locationChanges: signals.locationChanges,
      }));
    }

    // Device farm detection
    if (signals.deviceCount > this.THRESHOLDS.HIGH_DEVICE_COUNT) {
      flags.push(this.createFlag('device_farm', 45, 'Account used on many devices', {
        deviceCount: signals.deviceCount,
      }));
    }

    // Duplicate accounts pattern
    if (signals.ipVariety > this.THRESHOLDS.HIGH_IP_VARIETY) {
      flags.push(this.createFlag('duplicate_account', 30, 'Account from many IP addresses', {
        ipVariety: signals.ipVariety,
      }));
    }

    // Suspicious patterns
    for (const pattern of signals.suspiciousPatterns) {
      flags.push(this.createFlag('bot_behavior', 20, `Suspicious pattern: ${pattern}`, {
        pattern,
      }));
    }

    return flags;
  }

  private detectEventFlags(_signals: Record<string, unknown>, eventData: EventFraudData): RiskFlag[] {
    const flags: RiskFlag[] = [];

    // Check for duplicate-like event titles (placeholder for embedding comparison)
    if (eventData.titleFingerprint) {
      flags.push(this.createFlag('fake_event', 25, 'Event title matches known patterns', {
        fingerprint: eventData.titleFingerprint,
      }));
    }

    // Very high capacity with no attendees (suspicious)
    if (eventData.capacity > 100 && eventData.attendeeCount === 0) {
      flags.push(this.createFlag('fake_event', 35, 'High capacity event with no attendees', {
        capacity: eventData.capacity,
        attendeeCount: eventData.attendeeCount,
      }));
    }

    return flags;
  }

  private createFlag(type: RiskFlagType, severity: number, description: string, evidence: Record<string, unknown>): RiskFlag {
    return {
      type,
      severity,
      description,
      evidence,
    };
  }

  private calculateEventRiskScore(signals: Record<string, unknown>, eventData: EventFraudData): number {
    let score = 0;

    // Empty event
    if (eventData.capacity > 100 && eventData.attendeeCount === 0) {
      score += 30;
    }

    // Suspicious patterns
    if (signals.hasTitleFingerprint) score += 25;

    return Math.min(100, score);
  }

  private generateRecommendations(riskScore: number, flags: RiskFlag[]): string[] {
    const recommendations: string[] = [];

    if (riskScore >= this.THRESHOLDS.CRITICAL) {
      recommendations.push('Immediate review required');
      recommendations.push('Consider temporary suspension');
    } else if (riskScore >= this.THRESHOLDS.HIGH) {
      recommendations.push('Manual review recommended');
      recommendations.push('Monitor for additional suspicious activity');
    }

    // Specific recommendations based on flags
    const flagTypes = flags.map(f => f.type);
    
    if (flagTypes.includes('fake_account')) {
      recommendations.push('Verify account ownership');
    }
    
    if (flagTypes.includes('bot_behavior')) {
      recommendations.push('Implement additional captcha or verification');
    }
    
    if (flagTypes.includes('location_spoofing')) {
      recommendations.push('Require location verification');
    }
    
    if (flagTypes.includes('device_farm')) {
      recommendations.push('Review device management policy');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private generateEventRecommendations(_riskScore: number, flags: RiskFlag[]): string[] {
    const recommendations: string[] = [];

    if (flags.some(f => f.type === 'fake_event')) {
      recommendations.push('Review event content manually');
      recommendations.push('Consider hiding event until verified');
    }

    return recommendations;
  }

  private calculateConfidence(signals: FraudSignals): number {
    let confidence = 0.7; // Base confidence

    // More data = higher confidence
    const totalActivity = signals.eventCreationRate + signals.joinRate + signals.messageRate;
    if (totalActivity > 100) confidence += 0.1;
    if (totalActivity > 500) confidence += 0.1;

    // Longer account age = higher confidence
    if (signals.accountAge > 30) confidence += 0.05;
    if (signals.accountAge > 180) confidence += 0.05;

    return Math.min(0.99, confidence);
  }

  getRiskLevelActions(riskLevel: RiskLevel): string[] {
    const actions: Record<RiskLevel, string[]> = {
      low: ['allow', 'log'],
      medium: ['allow_with_monitoring', 'log', 'flag'],
      high: ['allow_with_limits', 'flag', 'review'],
      critical: ['block', 'review', 'investigate'],
    };
    return actions[riskLevel];
  }
}

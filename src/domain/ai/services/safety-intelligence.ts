import { EntityId } from '../../shared/types';
import { SafetySignalEntity } from '../entities/safety-signal';
import { SafetySignalType } from '../types';

export interface SafetyRepository {
  findByEntityId(entityId: EntityId): Promise<SafetySignalEntity[]>;
  findByType(type: SafetySignalType, limit?: number): Promise<SafetySignalEntity[]>;
  findUnresolved(limit?: number): Promise<SafetySignalEntity[]>;
  save(signal: SafetySignalEntity): Promise<void>;
  deleteByEntityId(entityId: EntityId): Promise<void>;
}

export interface SafetyCheckData {
  entityId: EntityId;
  entityType: 'user' | 'organizer' | 'business';
  reports24h: number;
  reports7d: number;
  noShows: number;
  totalEvents: number;
  lastMinuteCancellations: number;
  recentEvents: number;
  blocksReceived: number;
  totalInteractions: number;
  locationChanges30d: number;
  rapidLocationChange: boolean;
}

export interface SafetyAssessment {
  entityId: EntityId;
  overallRisk: number;
  signals: SafetySignalEntity[];
  recommendations: string[];
  shouldReduceVisibility: boolean;
  shouldRequireVerification: boolean;
  requiresReview: boolean;
}

export class SafetyIntelligenceService {
  private readonly VISIBILITY_REDUCTION_THRESHOLD = 60;
  private readonly VERIFICATION_REQUIRED_THRESHOLD = 75;
  private readonly REVIEW_THRESHOLD = 80;

  constructor(private readonly safetyRepository: SafetyRepository) {}

  async analyzeSafety(data: SafetyCheckData): Promise<SafetyAssessment> {
    const signals: SafetySignalEntity[] = [];
    const recommendations: string[] = [];
    let totalRisk = 0;

    // Multiple reports analysis
    if (data.reports24h >= 3 || data.reports7d >= 10) {
      const signal = SafetySignalEntity.createMultipleReports(
        data.entityId,
        data.entityType,
        data.reports7d,
        168 // 7 days in hours
      );
      signals.push(signal);
      await this.safetyRepository.save(signal);
      totalRisk += signal.severity;
      recommendations.push('Review recent reports and take appropriate action');
    }

    // No-show analysis
    if (data.noShows > 0 && data.totalEvents > 0) {
      const noShowRate = data.noShows / data.totalEvents;
      if (noShowRate > 0.3) {
        const signal = SafetySignalEntity.createRepeatedNoShows(
          data.entityId,
          data.entityType,
          data.noShows,
          data.totalEvents
        );
        signals.push(signal);
        await this.safetyRepository.save(signal);
        totalRisk += signal.severity;
        recommendations.push('Consider requiring confirmation for event attendance');
      }
    }

    // Last-minute cancellations
    if (data.lastMinuteCancellations >= 3 && data.recentEvents > 0) {
      const signal = SafetySignalEntity.createLastMinuteCancellations(
        data.entityId,
        data.entityType,
        data.lastMinuteCancellations,
        data.recentEvents
      );
      signals.push(signal);
      await this.safetyRepository.save(signal);
      totalRisk += signal.severity;
      recommendations.push('Monitor cancellation patterns closely');
    }

    // High block rate
    if (data.blocksReceived > 0 && data.totalInteractions > 0) {
      const blockRate = data.blocksReceived / data.totalInteractions;
      if (blockRate > 0.1) {
        const signal = SafetySignalEntity.createHighBlockRate(
          data.entityId,
          data.entityType,
          data.blocksReceived,
          data.totalInteractions
        );
        signals.push(signal);
        await this.safetyRepository.save(signal);
        totalRisk += signal.severity;
        recommendations.push('Review user interactions and consider mediation');
      }
    }

    // Location manipulation
    if (data.locationChanges30d > 20 || data.rapidLocationChange) {
      const signal = SafetySignalEntity.createLocationManipulation(
        data.entityId,
        data.locationChanges30d,
        data.rapidLocationChange
      );
      signals.push(signal);
      await this.safetyRepository.save(signal);
      totalRisk += signal.severity;
      recommendations.push('Verify user location authenticity');
    }

    // Organizer-specific checks
    if (data.entityType === 'organizer') {
      const eventCreationRisk = this.analyzeEventCreationPattern(data.entityId, data.recentEvents);
      if (eventCreationRisk > 0) {
        signals.push(eventCreationRisk);
        await this.safetyRepository.save(eventCreationRisk);
        totalRisk += eventCreationRisk.severity;
        recommendations.push('Review organizer event creation patterns');
      }
    }

    // Calculate final risk
    const overallRisk = Math.min(100, totalRisk);

    return {
      entityId: data.entityId,
      overallRisk,
      signals,
      recommendations: [...new Set(recommendations)],
      shouldReduceVisibility: overallRisk >= this.VISIBILITY_REDUCTION_THRESHOLD,
      shouldRequireVerification: overallRisk >= this.VERIFICATION_REQUIRED_THRESHOLD,
      requiresReview: overallRisk >= this.REVIEW_THRESHOLD,
    };
  }

  private analyzeEventCreationPattern(entityId: EntityId, eventsInPeriod: number): SafetySignalEntity | null {
    // Flag if more than 10 events created in short period
    if (eventsInPeriod > 10) {
      return SafetySignalEntity.createSuspiciousEventCreation(entityId, eventsInPeriod, 24);
    }
    return null;
  }

  async getActiveSafetySignals(entityId: EntityId): Promise<SafetySignalEntity[]> {
    const signals = await this.safetyRepository.findByEntityId(entityId);
    return signals.filter(s => !s.isResolved && !s.isExpired);
  }

  async resolveSignal(signalId: EntityId): Promise<void> {
    const signals = await this.safetyRepository.findUnresolved();
    const signal = signals.find(s => s.id === signalId);
    
    if (signal) {
      signal.resolve();
      await this.safetyRepository.save(signal);
    }
  }

  async getHighRiskEntities(): Promise<SafetyAssessment[]> {
    const signals = await this.safetyRepository.findUnresolved(100);
    
    // Group by entity
    const entitySignals = new Map<string, SafetySignalEntity[]>();
    for (const signal of signals) {
      const existing = entitySignals.get(signal.entityId) || [];
      existing.push(signal);
      entitySignals.set(signal.entityId, existing);
    }

    const assessments: SafetyAssessment[] = [];
    
    for (const [entityId, entitySignalList] of entitySignals) {
      if (entitySignalList.length === 0) continue;
      
      const entityType = entitySignalList[0].entityType;
      const totalRisk = entitySignalList.reduce((sum, s) => sum + s.severity, 0);
      const unresolvedSignals = entitySignalList.filter(s => !s.isResolved);

      if (unresolvedSignals.length > 0) {
        assessments.push({
          entityId,
          overallRisk: Math.min(100, totalRisk),
          signals: unresolvedSignals,
          recommendations: [],
          shouldReduceVisibility: totalRisk >= this.VISIBILITY_REDUCTION_THRESHOLD,
          shouldRequireVerification: totalRisk >= this.VERIFICATION_REQUIRED_THRESHOLD,
          requiresReview: totalRisk >= this.REVIEW_THRESHOLD,
        });
      }
    }

    return assessments.sort((a, b) => b.overallRisk - a.overallRisk);
  }

  // Apply safety measures based on assessment
  applySafetyMeasures(assessment: SafetyAssessment): {
    canCreateEvents: boolean;
    canJoinEvents: boolean;
    canMessage: boolean;
    visibilityMultiplier: number;
    requiresCaptcha: boolean;
  } {
    const risk = assessment.overallRisk;

    if (risk >= 90) {
      return {
        canCreateEvents: false,
        canJoinEvents: true,
        canMessage: false,
        visibilityMultiplier: 0,
        requiresCaptcha: true,
      };
    }

    if (risk >= 75) {
      return {
        canCreateEvents: true,
        canJoinEvents: true,
        canMessage: true,
        visibilityMultiplier: 0.5,
        requiresCaptcha: true,
      };
    }

    if (risk >= 50) {
      return {
        canCreateEvents: true,
        canJoinEvents: true,
        canMessage: true,
        visibilityMultiplier: 0.75,
        requiresCaptcha: false,
      };
    }

    return {
      canCreateEvents: true,
      canJoinEvents: true,
      canMessage: true,
      visibilityMultiplier: 1,
      requiresCaptcha: false,
    };
  }
}

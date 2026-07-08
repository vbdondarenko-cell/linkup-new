import { EntityId } from '../../shared/types';
import { BackgroundJob, BackgroundJobType } from '../types';
import { TrustIntelligenceService } from './trust-intelligence';
import { FraudDetectionService } from './fraud-detection';
import { AntiSpamService } from './anti-spam';
import { ContentModerationService } from './content-moderation';
import { DeviceIntelligenceService } from './device-intelligence';
import { SafetyIntelligenceService } from './safety-intelligence';
import { OrganizerIntelligenceService } from './organizer-intelligence';
import { BusinessIntelligenceService } from './business-intelligence';
import { RecommendationAIService } from './recommendation-ai';

export interface BackgroundJobRepository {
  findPending(type?: BackgroundJobType, limit?: number): Promise<BackgroundJob[]>;
  save(job: BackgroundJob): Promise<void>;
  updateStatus(jobId: EntityId, status: BackgroundJob['status'], error?: string): Promise<void>;
}

export interface AIOrchestratorConfig {
  recommendationRefreshHours: number;
  trustRefreshHours: number;
  fraudCheckHours: number;
  spamCheckMinutes: number;
}

export class AIOrchestrator {
  private readonly DEFAULT_CONFIG: AIOrchestratorConfig = {
    recommendationRefreshHours: 24,
    trustRefreshHours: 6,
    fraudCheckHours: 1,
    spamCheckMinutes: 15,
  };

  constructor(
    private readonly trustService: TrustIntelligenceService,
    private readonly fraudService: FraudDetectionService,
    private readonly spamService: AntiSpamService,
    private readonly moderationService: ContentModerationService,
    private readonly deviceService: DeviceIntelligenceService,
    private readonly safetyService: SafetyIntelligenceService,
    private readonly organizerService: OrganizerIntelligenceService,
    private readonly businessService: BusinessIntelligenceService,
    private readonly recommendationService: RecommendationAIService,
    private readonly jobRepository?: BackgroundJobRepository,
    private readonly config: AIOrchestratorConfig = this.DEFAULT_CONFIG
  ) {}

  // Pre-action checks
  async checkUserSafety(userId: EntityId): Promise<{
    canProceed: boolean;
    warnings: string[];
    restrictions: string[];
  }> {
    const warnings: string[] = [];
    const restrictions: string[] = [];

    // Check spam status
    const spamStatus = await this.spamService.checkRateLimit(userId, 'event');
    if (!spamStatus.allowed) {
      restrictions.push('Rate limited. Please wait before creating more events.');
    } else if (spamStatus.remaining < 5) {
      warnings.push(`Low rate limit remaining (${spamStatus.remaining})`);
    }

    // Check device risk
    // Would need device ID from session

    // Check for active safety signals
    const safetySignals = await this.safetyService.getActiveSafetySignals(userId);
    for (const signal of safetySignals) {
      warnings.push(`Safety flag: ${signal.description}`);
      if (signal.isUrgent) {
        restrictions.push('Account under review. Some features may be limited.');
      }
    }

    return {
      canProceed: restrictions.length === 0,
      warnings,
      restrictions,
    };
  }

  async checkContentSafety(contentId: EntityId, content: string, contentType: string): Promise<{
    canPublish: boolean;
    needsReview: boolean;
    violations: string[];
  }> {
    const result = await this.moderationService.moderateContent({
      contentId,
      contentType: contentType as any,
      content,
    });

    return {
      canPublish: result.isApproved,
      needsReview: result.isPendingReview,
      violations: this.moderationService.getUserFriendlyReason(result.violations),
    };
  }

  async checkEventCreation(organizerId: EntityId): Promise<{
    allowed: boolean;
    maxEventsToday: number;
    currentEventsToday: number;
    warnings: string[];
  }> {
    // Check spam first
    const spamCheck = await this.spamService.checkRateLimit(organizerId, 'event');
    
    const warnings: string[] = [];
    let maxEvents = 10; // Default
    let currentEvents = 0;

    if (!spamCheck.allowed) {
      return {
        allowed: false,
        maxEventsToday: 0,
        currentEventsToday: 0,
        warnings: ['Rate limit exceeded. Please wait.'],
      };
    }

    if (spamCheck.remaining < 5) {
      warnings.push(`Low event creation quota remaining`);
      maxEvents = spamCheck.remaining;
    }

    return {
      allowed: true,
      maxEventsToday: maxEvents,
      currentEventsToday: currentEvents,
      warnings,
    };
  }

  // Background job management
  async scheduleBackgroundJob(type: BackgroundJobType, targetId?: EntityId): Promise<void> {
    if (!this.jobRepository) return;

    const job: BackgroundJob = {
      id: `job_${type}_${targetId || 'all'}_${Date.now()}`,
      type,
      targetId,
      status: 'pending',
      scheduledAt: new Date(),
      retryCount: 0,
    };

    await this.jobRepository.save(job);
  }

  async processBackgroundJobs(): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    errors: string[];
  }> {
    if (!this.jobRepository) {
      return { processed: 0, succeeded: 0, failed: 0, errors: [] };
    }

    const jobs = await this.jobRepository.findPending(50);
    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const job of jobs) {
      results.processed++;
      
      try {
        await this.jobRepository.updateStatus(job.id, 'processing');
        await this.executeJob(job);
        await this.jobRepository.updateStatus(job.id, 'completed');
        results.succeeded++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`Job ${job.id}: ${errorMsg}`);
        results.failed++;

        if (job.retryCount < 3) {
          // Requeue for retry
          await this.jobRepository.updateStatus(job.id, 'pending');
          job.retryCount++;
        } else {
          await this.jobRepository.updateStatus(job.id, 'failed', errorMsg);
        }
      }
    }

    return results;
  }

  private async executeJob(job: BackgroundJob): Promise<void> {
    switch (job.type) {
      case 'refresh_recommendations':
        // Would iterate through active users and refresh recommendations
        console.log('Refreshing recommendations...');
        break;

      case 'update_trust_scores':
        // Would batch update trust scores
        console.log('Updating trust scores...');
        break;

      case 'recalculate_risk':
        // Would recalculate risk scores for flagged entities
        console.log('Recalculating risk scores...');
        break;

      case 'detect_spam':
        // Would check for new spam patterns
        console.log('Detecting spam...');
        break;

      case 'recalculate_rankings':
        // Would recalculate event/organizer rankings
        console.log('Recalculating rankings...');
        break;

      case 'generate_suggestions':
        // Would generate new suggestions for users
        console.log('Generating suggestions...');
        break;

      case 'analyze_reports':
        // Would analyze pending reports
        console.log('Analyzing reports...');
        break;

      case 'clean_old_signals':
        // Would clean up old safety signals
        console.log('Cleaning old signals...');
        break;
    }
  }

  // Get AI health metrics
  async getAIHealthMetrics(): Promise<{
    spamActiveCases: number;
    pendingModeration: number;
    highRiskEntities: number;
    unresolvedSafetySignals: number;
    avgProcessingTimeMs: number;
  }> {
    const spamCases = await this.spamService.getActiveSpamCases();
    const pendingMod = await this.moderationService.getPendingReviews();
    const highRisk = await this.safetyService.getHighRiskEntities();
    const safetySignals = await this.safetyService.getActiveSafetySignals('' as EntityId);

    return {
      spamActiveCases: spamCases.length,
      pendingModeration: pendingMod.length,
      highRiskEntities: highRisk.length,
      unresolvedSafetySignals: safetySignals.length,
      avgProcessingTimeMs: 50, // Would track actual metrics
    };
  }

  // Rate limiting helper
  isRateLimited(entityId: EntityId, action: 'event' | 'message' | 'join' | 'report'): boolean {
    // This would check actual rate limits
    return false;
  }
}

// Event for AI processing hooks
export interface AIProcessingEvent {
  type: 'trust_updated' | 'spam_detected' | 'fraud_detected' | 'content_flagged' | 'safety_signal';
  entityId: EntityId;
  entityType: string;
  severity?: number;
  data?: Record<string, unknown>;
}

export type AIEventHandler = (event: AIProcessingEvent) => Promise<void>;

export class AIEventBus {
  private handlers: Map<string, AIEventHandler[]> = new Map();

  subscribe(eventType: AIProcessingEvent['type'], handler: AIEventHandler): void {
    const existing = this.handlers.get(eventType) || [];
    existing.push(handler);
    this.handlers.set(eventType, existing);
  }

  async publish(event: AIProcessingEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error in AI event handler for ${event.type}:`, error);
      }
    }
  }
}

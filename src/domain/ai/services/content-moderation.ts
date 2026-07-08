import { EntityId } from '../../shared/types';
import { ModerationResultEntity, ViolationFactory } from '../entities/moderation-result';
import { ContentType, ViolationType, ModerationResult, Violation } from '../types';
import { IModerationRepository } from '../repositories/i-moderation-repository';
import { ContentModerationError } from '../errors/ai-errors';

// Content patterns for detection (simplified - would use ML in production)
const PROFANITY_PATTERNS = [
  /\b(badword1|badword2)\b/gi, // Placeholder - would be populated with actual patterns
];

const SCAM_PATTERNS = [
  /free\s*money/i,
  /click\s*here\s*now/i,
  /urgent\s*action\s*required/i,
  /your\s*account\s*will\s*be\s*(closed|terminated)/i,
  /wire\s*transfer/i,
  /bitcoin\s*investment/i,
  /guaranteed\s*income/i,
];

const HARASSMENT_PATTERNS = [
  /i\s*will\s*find\s*you/i,
  /your\s*address\s*is/i,
  /stop\s*talking\s*to\s*me/i,
  /you\s*deserve\s*to\s*die/i,
];

const SPAM_PATTERNS = [
  /buy\s*now/i,
  /limited\s*time\s*offer/i,
  /click\s*here/i,
  /subscribe\s*now/i,
  /act\s*fast/i,
  /don't\s*miss\s*out/i,
  /http[s]?:\/\/[^\s]+/gi, // URLs
];

export interface ContentModerationRepository {
  findByContentId(contentId: EntityId): Promise<ModerationResultEntity | null>;
  findPendingReview(limit?: number): Promise<ModerationResultEntity[]>;
  save(result: ModerationResultEntity): Promise<void>;
  deleteByContentId(contentId: EntityId): Promise<void>;
}

export interface ContentToModerate {
  contentId: EntityId;
  contentType: ContentType;
  content: string;
  userId?: EntityId;
  context?: Record<string, unknown>;
}

export interface ImageModerationResult {
  isSafe: boolean;
  categories: Array<{ name: string; confidence: number }>;
  rejected: boolean;
  reason?: string;
}

export class ContentModerationService {
  private readonly CONFIDENCE_THRESHOLD = 0.75;
  private readonly HUMAN_REVIEW_THRESHOLD = 0.6;

  constructor(private readonly moderationRepository: ContentModerationRepository) {}

  async moderateContent(content: ContentToModerate): Promise<ModerationResultEntity> {
    // Check for cached result
    const existing = await this.moderationRepository.findByContentId(content.contentId);
    if (existing) {
      return existing;
    }

    const violations: Violation[] = [];
    let overallConfidence = 0.9;

    // Text moderation
    if (this.isTextContent(content.contentType)) {
      const textViolations = this.moderateText(content.content);
      violations.push(...textViolations.violations);
      overallConfidence *= textViolations.confidence;
    }

    // Calculate result
    const result = this.calculateResult(violations, overallConfidence);
    const requiresHumanReview = ModerationResultEntity.shouldRequireHumanReview(overallConfidence, violations);

    const moderationResult = ModerationResultEntity.create({
      contentId: content.contentId,
      contentType: content.contentType,
      result,
      violations,
      confidence: overallConfidence,
      requiresHumanReview,
      reviewedAt: new Date(),
    });

    await this.moderationRepository.save(moderationResult);
    return moderationResult;
  }

  async moderateImage(_imageUrl: string): Promise<ImageModerationResult> {
    // In production, this would call an image moderation API
    // For now, return a placeholder
    return {
      isSafe: true,
      categories: [],
      rejected: false,
    };
  }

  async getPendingReviews(limit = 50): Promise<ModerationResultEntity[]> {
    return this.moderationRepository.findPendingReview(limit);
  }

  async approveContent(contentId: EntityId, reviewerId: EntityId, notes?: string): Promise<void> {
    const result = await this.moderationRepository.findByContentId(contentId);
    if (!result) {
      throw new ContentModerationError(`Moderation result not found for content: ${contentId}`);
    }

    result.approve();
    if (reviewerId) {
      (result as any)._reviewerId = reviewerId;
    }
    if (notes) {
      result.flagForReview(notes);
    }

    await this.moderationRepository.save(result);
  }

  async rejectContent(contentId: EntityId, reviewerId: EntityId, reason: string): Promise<void> {
    const result = await this.moderationRepository.findByContentId(contentId);
    if (!result) {
      throw new ContentModerationError(`Moderation result not found for content: ${contentId}`);
    }

    result.reject(reason);
    (result as any)._reviewerId = reviewerId;

    await this.moderationRepository.save(result);
  }

  private moderateText(content: string): { violations: Violation[]; confidence: number } {
    const violations: Violation[] = [];
    let confidence = 0.95;

    // Check for profanity (simplified)
    const profanityMatches = this.checkProfanity(content);
    if (profanityMatches.length > 0) {
      violations.push(ViolationFactory.profanity(profanityMatches.join(', ')));
      confidence *= 0.9;
    }

    // Check for scam patterns
    const scamMatches = this.checkPatterns(content, SCAM_PATTERNS);
    if (scamMatches.length > 0) {
      violations.push(ViolationFactory.scam(scamMatches.join('; ')));
      confidence *= 0.85;
    }

    // Check for harassment
    const harassmentMatches = this.checkPatterns(content, HARASSMENT_PATTERNS);
    if (harassmentMatches.length > 0) {
      violations.push(ViolationFactory.harassment());
      confidence *= 0.8;
    }

    // Check for spam patterns
    const spamMatches = this.checkPatterns(content, SPAM_PATTERNS);
    if (spamMatches.length > 3) {
      violations.push(ViolationFactory.spam());
      confidence *= 0.9;
    }

    // Check for hate speech (would use ML model in production)
    const hateSpeechScore = this.detectHateSpeech(content);
    if (hateSpeechScore > 0.7) {
      violations.push(ViolationFactory.hateSpeech());
      confidence *= 0.75;
    }

    // Check for violence
    const violenceScore = this.detectViolence(content);
    if (violenceScore > 0.7) {
      violations.push(ViolationFactory.violence());
      confidence *= 0.8;
    }

    // Check for illegal content
    const illegalPatterns = [
      /illicit/i,
      /illegal\s*(activity|content)/i,
      /drugs\s*for\s*sale/i,
    ];
    const illegalMatches = this.checkPatterns(content, illegalPatterns);
    if (illegalMatches.length > 0) {
      violations.push(ViolationFactory.illegal(illegalMatches.join('; ')));
      confidence *= 0.9;
    }

    return { violations, confidence };
  }

  private checkProfanity(content: string): string[] {
    const matches: string[] = [];
    for (const pattern of PROFANITY_PATTERNS) {
      const found = content.match(pattern);
      if (found) {
        matches.push(...found);
      }
    }
    return [...new Set(matches)];
  }

  private checkPatterns(content: string, patterns: RegExp[]): string[] {
    const matches: string[] = [];
    for (const pattern of patterns) {
      const found = content.match(pattern);
      if (found) {
        matches.push(...found);
      }
    }
    return [...new Set(matches)];
  }

  private detectHateSpeech(content: string): number {
    // Simplified detection - would use ML model in production
    const hateKeywords = [
      'hate', 'kill', 'die', 'attack', 'violence',
    ];
    
    const words = content.toLowerCase().split(/\s+/);
    const hateCount = words.filter(w => hateKeywords.includes(w)).length;
    
    return Math.min(1, hateCount / 5);
  }

  private detectViolence(content: string): number {
    // Simplified detection
    const violenceKeywords = [
      'fight', 'weapon', 'gun', 'knife', 'attack', 'hurt',
      'beat', 'punch', 'threat',
    ];
    
    const words = content.toLowerCase().split(/\s+/);
    const violenceCount = words.filter(w => violenceKeywords.includes(w)).length;
    
    return Math.min(1, violenceCount / 5);
  }

  private calculateResult(violations: Violation[], confidence: number): ModerationResult {
    if (violations.length === 0) {
      return 'approved';
    }

    // High severity violations
    const hasHighSeverity = violations.some(v => v.severity >= 80);
    if (hasHighSeverity) {
      return 'rejected';
    }

    // Medium severity with high confidence
    const mediumViolations = violations.filter(v => v.severity >= 50);
    if (mediumViolations.length >= 2 && confidence > this.CONFIDENCE_THRESHOLD) {
      return 'rejected';
    }

    // Low confidence = needs human review
    if (confidence < this.HUMAN_REVIEW_THRESHOLD) {
      return 'pending_review';
    }

    // Some violations but not severe
    if (violations.length >= 1) {
      return 'flagged';
    }

    return 'approved';
  }

  private isTextContent(contentType: ContentType): boolean {
    return ['event_title', 'event_description', 'profile', 'business_profile', 'message'].includes(contentType);
  }

  // Explainable AI - user-friendly reasons
  getUserFriendlyReason(violations: Violation[]): string[] {
    const reasons: string[] = [];

    for (const violation of violations) {
      switch (violation.type) {
        case 'profanity':
          reasons.push('Content contains inappropriate language');
          break;
        case 'scam':
          reasons.push('Content may be attempting to deceive');
          break;
        case 'harassment':
          reasons.push('Content may be harassment');
          break;
        case 'hate_speech':
          reasons.push('Content may contain hate speech');
          break;
        case 'violence':
          reasons.push('Content may contain violence');
          break;
        case 'illegal':
          reasons.push('Content may violate our guidelines');
          break;
        case 'nsfw':
          reasons.push('Content is not appropriate');
          break;
        case 'spam':
          reasons.push('Content appears to be spam');
          break;
      }
    }

    return [...new Set(reasons)];
  }

  // Statistics for moderation dashboard
  async getModerationStats(): Promise<{
    totalReviewed: number;
    approved: number;
    rejected: number;
    flagged: number;
    pendingReview: number;
    avgConfidence: number;
  }> {
    const pending = await this.moderationRepository.findPendingReview(1000);
    
    return {
      totalReviewed: 0, // Would query database
      approved: 0,
      rejected: 0,
      flagged: 0,
      pendingReview: pending.length,
      avgConfidence: 0,
    };
  }
}

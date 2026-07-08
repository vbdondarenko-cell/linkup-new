import { EntityId } from '../../shared/types';
import { ContentModerationService } from '../../domain/ai/services/content-moderation';
import { ModerationResultEntity } from '../../domain/ai/entities/moderation-result';
import { ContentModerationRequestDTO, ContentModerationResultDTO } from '../dto/ai.dto';
import { ContentType } from '../../domain/ai/types';

export class ModerationHandler {
  constructor(private readonly moderationService: ContentModerationService) {}

  async moderateContent(data: ContentModerationRequestDTO): Promise<ModerationResultEntity> {
    return this.moderationService.moderateContent({
      contentId: data.contentId,
      contentType: data.contentType,
      content: data.content,
      userId: data.userId,
    });
  }

  async moderateBatch(contents: ContentModerationRequestDTO[]): Promise<ModerationResultEntity[]> {
    const results: ModerationResultEntity[] = [];
    
    for (const content of contents) {
      try {
        const result = await this.moderateContent(content);
        results.push(result);
      } catch (error) {
        console.error(`Failed to moderate content ${content.contentId}:`, error);
      }
    }
    
    return results;
  }

  async approveContent(contentId: EntityId, reviewerId: EntityId, notes?: string): Promise<void> {
    await this.moderationService.approveContent(contentId, reviewerId, notes);
  }

  async rejectContent(contentId: EntityId, reviewerId: EntityId, reason: string): Promise<void> {
    await this.moderationService.rejectContent(contentId, reviewerId, reason);
  }

  async getPendingReviews(limit = 50): Promise<ModerationResultEntity[]> {
    return this.moderationService.getPendingReviews(limit);
  }

  toDTO(result: ModerationResultEntity): ContentModerationResultDTO {
    return {
      contentId: result.contentId,
      result: result.result,
      violations: result.violations.map(v => ({
        type: v.type,
        severity: v.severity,
        details: v.details,
      })),
      confidence: result.confidence,
      requiresHumanReview: result.requiresHumanReview,
      reviewedAt: result.reviewedAt.toISOString(),
    };
  }

  // Get content type display name
  getContentTypeName(type: ContentType): string {
    const names: Record<ContentType, string> = {
      event_title: 'Event Title',
      event_description: 'Event Description',
      profile: 'User Profile',
      business_profile: 'Business Profile',
      message: 'Message',
      image: 'Image',
    };
    return names[type] || type;
  }
}

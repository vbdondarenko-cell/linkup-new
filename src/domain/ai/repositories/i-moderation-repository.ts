import { EntityId } from '../../shared/types';
import { ModerationResultEntity } from '../entities/moderation-result';

export interface IModerationRepository {
  findByContentId(contentId: EntityId): Promise<ModerationResultEntity | null>;
  findByContentType(contentType: string, limit?: number): Promise<ModerationResultEntity[]>;
  findPendingReview(limit?: number): Promise<ModerationResultEntity[]>;
  save(result: ModerationResultEntity): Promise<void>;
  deleteByContentId(contentId: EntityId): Promise<void>;
}

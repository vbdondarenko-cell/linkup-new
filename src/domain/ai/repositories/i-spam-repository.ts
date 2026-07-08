import { EntityId } from '../../shared/types';
import { SpamAssessmentEntity } from '../entities/spam-assessment';

export interface ISpamRepository {
  findByEntityId(entityId: EntityId): Promise<SpamAssessmentEntity | null>;
  findActive(limit?: number): Promise<SpamAssessmentEntity[]>;
  findByAction(action: string, limit?: number): Promise<SpamAssessmentEntity[]>;
  save(assessment: SpamAssessmentEntity): Promise<void>;
  deleteByEntityId(entityId: EntityId): Promise<void>;
}

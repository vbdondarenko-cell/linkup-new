import { EntityId } from '../../shared/types';
import { RiskAssessmentEntity, RiskEntityType } from '../entities/risk-assessment';

export interface IFraudRepository {
  findByEntityId(entityId: EntityId): Promise<RiskAssessmentEntity | null>;
  findByEntityType(entityType: RiskEntityType, limit?: number): Promise<RiskAssessmentEntity[]>;
  findByRiskLevel(level: string, limit?: number): Promise<RiskAssessmentEntity[]>;
  save(assessment: RiskAssessmentEntity): Promise<void>;
  deleteByEntityId(entityId: EntityId): Promise<void>;
}

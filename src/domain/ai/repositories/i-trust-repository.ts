import { EntityId } from '../../shared/types';
import { TrustScoreEntity } from '../entities/trust-score';

export interface ITrustRepository {
  findByUserId(userId: EntityId): Promise<TrustScoreEntity | null>;
  findAll(limit?: number): Promise<TrustScoreEntity[]>;
  save(trustScore: TrustScoreEntity): Promise<void>;
  deleteByUserId(userId: EntityId): Promise<void>;
}

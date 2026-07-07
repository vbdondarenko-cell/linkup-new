import { EntityId, PaginationParams } from '../../shared/types';
import { Recommendation, RecommendationType } from '../entities/recommendation';

export interface IRecommendationRepository {
  findById(id: EntityId): Promise<Recommendation | null>;
  findByUserId(userId: EntityId, pagination: PaginationParams): Promise<Recommendation[]>;
  findByType(userId: EntityId, type: RecommendationType, pagination: PaginationParams): Promise<Recommendation[]>;
  findActiveByUserId(userId: EntityId): Promise<Recommendation[]>;
  save(recommendation: Recommendation): Promise<void>;
  delete(id: EntityId): Promise<void>;
  deleteExpired(): Promise<void>;
  deleteByUserId(userId: EntityId): Promise<void>;
}

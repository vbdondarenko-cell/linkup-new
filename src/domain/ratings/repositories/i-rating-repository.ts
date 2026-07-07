import { EntityId, PaginationParams } from '../../shared/types';
import { Rating, RatingCategory } from '../entities/rating';

export interface RatingStats {
  targetId: EntityId;
  averageScore: number;
  totalRatings: number;
  scoreDistribution: Record<number, number>;
  aspectAverages?: {
    organization?: number;
    communication?: number;
    punctuality?: number;
    value?: number;
    atmosphere?: number;
  };
}

export interface IRatingRepository {
  findById(id: EntityId): Promise<Rating | null>;
  findByTargetId(targetId: EntityId, pagination: PaginationParams): Promise<Rating[]>;
  findByUserId(userId: EntityId, pagination: PaginationParams): Promise<Rating[]>;
  findUserRatingForTarget(userId: EntityId, targetId: EntityId): Promise<Rating | null>;
  getStats(targetId: EntityId): Promise<RatingStats | null>;
  save(rating: Rating): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

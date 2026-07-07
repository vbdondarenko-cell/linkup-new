import { EntityId, PaginationParams } from '../../shared/types';
import { UserBadge, BadgeType } from '../entities/badge';

export interface IBadgeRepository {
  findById(id: EntityId): Promise<UserBadge | null>;
  findByUserId(userId: EntityId): Promise<UserBadge[]>;
  findByType(userId: EntityId, type: BadgeType): Promise<UserBadge | null>;
  hasBadge(userId: EntityId, type: BadgeType): Promise<boolean>;
  save(badge: UserBadge): Promise<void>;
  delete(id: EntityId): Promise<void>;
}
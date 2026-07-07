import { EntityId } from '../../shared/types';
import { PremiumSubscription, PremiumTier } from '../entities/premium-subscription';

export interface IPremiumRepository {
  findById(id: EntityId): Promise<PremiumSubscription | null>;
  findActiveByUserId(userId: EntityId): Promise<PremiumSubscription | null>;
  findByUserId(userId: EntityId): Promise<PremiumSubscription[]>;
  findExpiringSoon(days: number): Promise<PremiumSubscription[]>;
  save(subscription: PremiumSubscription): Promise<void>;
  delete(id: EntityId): Promise<void>;
}
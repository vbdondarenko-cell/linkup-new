import { EntityId, PaginationParams } from '../../shared/types';
import { Reputation } from '../entities/reputation';

export interface IReputationRepository {
  findById(id: EntityId): Promise<Reputation | null>;
  findByUserId(userId: EntityId): Promise<Reputation | null>;
  findTop(pagination: PaginationParams): Promise<Reputation[]>;
  save(reputation: Reputation): Promise<void>;
  delete(id: EntityId): Promise<void>;
}
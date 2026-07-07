import { EntityId, PaginationParams } from '../../shared/types';
import { XPRecord, XPAction } from '../entities/xp';

export interface IXPRepository {
  findById(id: EntityId): Promise<XPRecord | null>;
  findByUserId(userId: EntityId, pagination: PaginationParams): Promise<XPRecord[]>;
  getTotalXP(userId: EntityId): Promise<number>;
  getXPByAction(userId: EntityId, action: XPAction): Promise<number>;
  save(record: XPRecord): Promise<void>;
  delete(id: EntityId): Promise<void>;
}
import { EntityId, PaginationParams } from '../../shared/types';
import { Business, BusinessVerificationStatus } from '../entities/business';

export interface BusinessSearchFilters {
  status?: Business['status'][];
  verificationStatus?: BusinessVerificationStatus[];
  categoryId?: string;
  ownerId?: EntityId;
  isActive?: boolean;
}

export interface IBusinessRepository {
  findById(id: EntityId): Promise<Business | null>;
  findByOwnerId(ownerId: EntityId): Promise<Business | null>;
  findByEmail(email: string): Promise<Business | null>;
  findVerified(pagination: PaginationParams): Promise<Business[]>;
  search(filters: BusinessSearchFilters, pagination: PaginationParams): Promise<Business[]>;
  save(business: Business): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

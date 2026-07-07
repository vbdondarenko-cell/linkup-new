import { EntityId, PaginationParams } from '../../shared/types';
import { Profile } from '../entities/profile';

export interface IProfileRepository {
  findById(id: EntityId): Promise<Profile | null>;
  findByUserId(userId: EntityId): Promise<Profile | null>;
  findByUsername(username: string): Promise<Profile | null>;
  findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
    pagination: PaginationParams
  ): Promise<Profile[]>;
  findByInterests(
    interestIds: string[],
    pagination: PaginationParams
  ): Promise<Profile[]>;
  save(profile: Profile): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

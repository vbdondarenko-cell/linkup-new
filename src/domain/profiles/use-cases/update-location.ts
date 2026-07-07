import { Profile } from '../entities/profile';
import { IProfileRepository } from '../repositories/i-profile-repository';
import { Location, Coordinates } from '../value-objects';
import { ProfileNotFoundError } from '../errors/profile-errors';
import { EntityId, AsyncResult } from '../../shared/types';

export interface UpdateLocationInput {
  profileId: EntityId;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export class UpdateLocationUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(input: UpdateLocationInput): AsyncResult<void> {
    try {
      const profile = await this.profileRepository.findById(input.profileId);
      if (!profile) {
        return { success: false, error: new ProfileNotFoundError(input.profileId) };
      }

      const coordinates = Coordinates.create(input.latitude, input.longitude);
      const location = Location.create(coordinates, input.address, input.city, input.country);
      profile.updateLocation(location);
      await this.profileRepository.save(profile);

      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

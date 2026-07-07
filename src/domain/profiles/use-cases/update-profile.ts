import { Profile } from '../entities/profile';
import { IProfileRepository } from '../repositories/i-profile-repository';
import { Language, Radius, Location } from '../value-objects';
import { ProfileNotFoundError, UsernameTakenError, InvalidUsernameError } from '../errors/profile-errors';
import { EntityId, AsyncResult } from '../../shared/types';

export interface UpdateProfileInput {
  profileId: EntityId;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(input: UpdateProfileInput): AsyncResult<void> {
    try {
      const profile = await this.profileRepository.findById(input.profileId);
      if (!profile) {
        return { success: false, error: new ProfileNotFoundError(input.profileId) };
      }

      if (input.username !== undefined) {
        if (!USERNAME_REGEX.test(input.username)) {
          return { 
            success: false, 
            error: new InvalidUsernameError('Username must be 3-30 characters and contain only letters, numbers, and underscores') 
          };
        }
        const existingUsername = await this.profileRepository.findByUsername(input.username);
        if (existingUsername && existingUsername.id !== profile.id) {
          return { success: false, error: new UsernameTakenError(input.username) };
        }
        profile.updateUsername(input.username);
      }

      if (input.bio !== undefined) {
        profile.updateBio(input.bio);
      }

      if (input.avatarUrl !== undefined) {
        profile.updateAvatar(input.avatarUrl);
      }

      await this.profileRepository.save(profile);

      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

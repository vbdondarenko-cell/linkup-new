import { Profile } from '../entities/profile';
import { IProfileRepository } from '../repositories/i-profile-repository';
import { Language, Radius, Location } from '../value-objects';
import { ProfileNotFoundError, UsernameTakenError, InvalidUsernameError } from '../errors/profile-errors';
import { EntityId, AsyncResult } from '../../shared/types';
import { Username } from '../../shared/value-objects/username';

export interface CreateProfileInput {
  userId: EntityId;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  language?: string;
  radius?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
  };
  interests?: string[];
}

export interface CreateProfileOutput {
  profileId: EntityId;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export class CreateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(input: CreateProfileInput): AsyncResult<CreateProfileOutput> {
    try {
      const existingProfile = await this.profileRepository.findByUserId(input.userId);
      if (existingProfile) {
        return { success: false, error: new ProfileError('Profile already exists for this user') };
      }

      if (input.username) {
        if (!USERNAME_REGEX.test(input.username)) {
          return { 
            success: false, 
            error: new InvalidUsernameError('Username must be 3-30 characters and contain only letters, numbers, and underscores') 
          };
        }
        const existingUsername = await this.profileRepository.findByUsername(input.username);
        if (existingUsername) {
          return { success: false, error: new UsernameTakenError(input.username) };
        }
      }

      const profile = Profile.create({
        userId: input.userId,
        username: input.username,
        bio: input.bio,
        avatarUrl: input.avatarUrl,
        language: input.language ? Language.create(input.language) : Language.default(),
        radius: input.radius ? Radius.create(input.radius) : Radius.default(),
        location: input.location 
          ? Location.create(
              { latitude: input.location.latitude, longitude: input.location.longitude },
              input.location.address,
              input.location.city,
              input.location.country
            )
          : undefined,
        interests: input.interests || [],
        isPublic: true,
      });

      await this.profileRepository.save(profile);

      return { success: true, data: { profileId: profile.id } };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

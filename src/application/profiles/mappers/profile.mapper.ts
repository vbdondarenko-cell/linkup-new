import { Profile } from '../../../domain/profiles/entities/profile';
import { ProfileResponse, CreateProfileRequest, UpdateProfileRequest } from '../dto/profile.dto';

export class ProfileMapper {
  static toDTO(profile: Profile): ProfileResponse {
    return {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      language: profile.language.value,
      radius: profile.radius.value,
      location: profile.location ? {
        latitude: profile.location.coordinates.latitude,
        longitude: profile.location.coordinates.longitude,
        address: profile.location.address,
        city: profile.location.city,
        country: profile.location.country,
      } : undefined,
      interests: profile.interests,
      isPublic: profile.isPublic,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static toDTOList(profiles: Profile[]): ProfileResponse[] {
    return profiles.map(p => ProfileMapper.toDTO(p));
  }

  static toDomainCreate(request: CreateProfileRequest): {
    userId: string;
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
  } {
    return {
      userId: request.userId,
      username: request.username,
      bio: request.bio,
      avatarUrl: request.avatarUrl,
      language: request.language,
      radius: request.radius,
      location: request.location,
      interests: request.interests,
    };
  }

  static toDomainUpdate(request: UpdateProfileRequest): {
    profileId: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
  } {
    return {
      profileId: request.profileId,
      username: request.username,
      bio: request.bio,
      avatarUrl: request.avatarUrl,
    };
  }
}

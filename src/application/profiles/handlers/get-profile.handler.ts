import { GetProfileQuery, GetProfileByUserIdQuery } from '../queries/get-profile.query';
import { IProfileRepository } from '../../../domain/profiles/repositories/i-profile-repository';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileResponse } from '../dto/profile.dto';
import { NotFoundApplicationError } from '../../shared/errors/application-errors';

export class GetProfileHandler {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async handleById(query: GetProfileQuery): Promise<ProfileResponse> {
    const profile = await this.profileRepository.findById(query.profileId);

    if (!profile) {
      throw new NotFoundApplicationError('Profile', query.profileId);
    }

    // Check if profile is public or requester is the owner
    if (!profile.isPublic && profile.userId !== query.requestingUserId) {
      throw new NotFoundApplicationError('Profile', query.profileId);
    }

    return ProfileMapper.toDTO(profile);
  }

  async handleByUserId(query: GetProfileByUserIdQuery): Promise<ProfileResponse | null> {
    const profile = await this.profileRepository.findByUserId(query.userId);

    if (!profile) {
      return null;
    }

    return ProfileMapper.toDTO(profile);
  }
}

import { UpdateProfileCommand } from '../commands/update-profile.command';
import { UpdateProfileUseCase } from '../../../domain/profiles/use-cases/update-profile';
import { IProfileRepository } from '../../../domain/profiles/repositories/i-profile-repository';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileResponse } from '../dto/profile.dto';
import { Result } from '../../../domain/shared/types';

export class UpdateProfileHandler {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async handle(command: UpdateProfileCommand): Promise<Result<ProfileResponse>> {
    const useCase = new UpdateProfileUseCase(this.profileRepository);

    const domainInput = ProfileMapper.toDomainUpdate(command.request);

    const result = await useCase.execute(domainInput);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const profile = await this.profileRepository.findById(command.request.profileId);

    if (!profile) {
      return { success: false, error: new Error('Profile not found after update') };
    }

    return {
      success: true,
      data: ProfileMapper.toDTO(profile),
    };
  }
}

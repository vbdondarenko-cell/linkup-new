import { CreateProfileCommand } from '../commands/create-profile.command';
import { CreateProfileUseCase } from '../../../domain/profiles/use-cases/create-profile';
import { IProfileRepository } from '../../../domain/profiles/repositories/i-profile-repository';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileResponse } from '../dto/profile.dto';
import { Result } from '../../../domain/shared/types';

export class CreateProfileHandler {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async handle(command: CreateProfileCommand): Promise<Result<ProfileResponse>> {
    const useCase = new CreateProfileUseCase(this.profileRepository);

    const domainInput = ProfileMapper.toDomainCreate(command.request);

    const result = await useCase.execute(domainInput);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const profile = await this.profileRepository.findById(result.data.profileId);

    if (!profile) {
      return { success: false, error: new Error('Profile not found after creation') };
    }

    return {
      success: true,
      data: ProfileMapper.toDTO(profile),
    };
  }
}

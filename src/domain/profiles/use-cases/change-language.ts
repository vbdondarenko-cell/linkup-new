import { Profile } from '../entities/profile';
import { IProfileRepository } from '../repositories/i-profile-repository';
import { Language } from '../value-objects';
import { ProfileNotFoundError } from '../errors/profile-errors';
import { EntityId, AsyncResult } from '../../shared/types';

export class ChangeLanguageUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(profileId: EntityId, language: string): AsyncResult<void> {
    try {
      const profile = await this.profileRepository.findById(profileId);
      if (!profile) {
        return { success: false, error: new ProfileNotFoundError(profileId) };
      }

      const languageVO = Language.create(language);
      profile.changeLanguage(languageVO);
      await this.profileRepository.save(profile);

      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

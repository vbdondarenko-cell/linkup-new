import { ChangeLanguageCommand } from '../commands/change-language.command';
import { ChangeLanguageUseCase } from '../../../domain/profiles/use-cases/change-language';
import { IProfileRepository } from '../../../domain/profiles/repositories/i-profile-repository';
import { Result } from '../../../domain/shared/types';

export class ChangeLanguageHandler {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async handle(command: ChangeLanguageCommand): Promise<Result<void>> {
    const useCase = new ChangeLanguageUseCase(this.profileRepository);

    return await useCase.execute(command.request.profileId, command.request.language);
  }
}

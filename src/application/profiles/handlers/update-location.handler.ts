import { UpdateLocationCommand } from '../commands/update-location.command';
import { UpdateLocationUseCase } from '../../../domain/profiles/use-cases/update-location';
import { IProfileRepository } from '../../../domain/profiles/repositories/i-profile-repository';
import { Result } from '../../../domain/shared/types';

export class UpdateLocationHandler {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async handle(command: UpdateLocationCommand): Promise<Result<void>> {
    const useCase = new UpdateLocationUseCase(this.profileRepository);

    return await useCase.execute({
      profileId: command.request.profileId,
      latitude: command.request.latitude,
      longitude: command.request.longitude,
      address: command.request.address,
      city: command.request.city,
      country: command.request.country,
    });
  }
}

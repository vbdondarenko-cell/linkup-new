import { LogoutCommand } from '../commands/logout.command';
import { LogoutUseCase } from '../../../domain/auth/use-cases/logout';
import { ISessionRepository } from '../../../domain/auth/repositories/i-session-repository';
import { Result } from '../../../domain/shared/types';

export class LogoutHandler {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async handle(command: LogoutCommand): Promise<Result<void>> {
    const useCase = new LogoutUseCase(this.sessionRepository);

    return await useCase.execute(command.request.sessionId);
  }
}
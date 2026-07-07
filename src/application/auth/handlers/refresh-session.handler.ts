import { RefreshSessionCommand } from '../commands/refresh-session.command';
import { RefreshSessionResponse } from '../dto/auth.dto';
import { RefreshSessionUseCase } from '../../../domain/auth/use-cases/refresh-session';
import { ISessionRepository } from '../../../domain/auth/repositories/i-session-repository';
import { Result } from '../../../domain/shared/types';

export class RefreshSessionHandler {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async handle(command: RefreshSessionCommand): Promise<Result<RefreshSessionResponse>> {
    const useCase = new RefreshSessionUseCase(this.sessionRepository);

    const result = await useCase.execute({
      sessionId: command.request.sessionId,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      data: {
        sessionId: result.data.sessionId,
        expiresAt: result.data.expiresAt.toISOString(),
      },
    };
  }
}
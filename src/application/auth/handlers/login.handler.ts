import { LoginCommand } from '../commands/login.command';
import { LoginResponse } from '../dto/auth.dto';
import { LoginWithTelegramUseCase } from '../../../domain/auth/use-cases/login-with-telegram';
import { ISessionRepository } from '../../../domain/auth/repositories/i-session-repository';
import { IUserRepository } from '../../../domain/auth/use-cases/login-with-telegram';
import { Result } from '../../../domain/shared/types';

export class LoginHandler {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async handle(command: LoginCommand): Promise<Result<LoginResponse>> {
    const useCase = new LoginWithTelegramUseCase(
      this.sessionRepository,
      this.userRepository
    );

    const result = await useCase.execute({
      telegramInitData: command.request.telegramInitData,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const session = await this.sessionRepository.findById(result.data.sessionId);

    return {
      success: true,
      data: {
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        isNewUser: result.data.isNewUser,
        expiresAt: session?.expiresAt.toISOString() || new Date().toISOString(),
      },
    };
  }
}
import { TelegramInitDataVO } from '../value-objects/telegram-init-data';
import { Session } from '../entities/session';
import { ISessionRepository } from '../repositories/i-session-repository';
import { InvalidTelegramDataError, SessionNotFoundError } from '../errors/auth-errors';
import { EntityId, AsyncResult, Result } from '../../shared/types';
import { User, UserProps } from '../../users/entities/user';

export interface LoginWithTelegramInput {
  telegramInitData: TelegramInitData;
}

export interface LoginWithTelegramOutput {
  userId: EntityId;
  sessionId: EntityId;
  isNewUser: boolean;
}

export interface IUserRepository {
  findByTelegramId(telegramId: string): Promise<User | null>;
  findById(id: EntityId): Promise<User | null>;
  save(user: User): Promise<void>;
}

export class LoginWithTelegramUseCase {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: LoginWithTelegramInput): AsyncResult<LoginWithTelegramOutput> {
    try {
      const initData = TelegramInitDataVO.create(input.telegramInitData);

      if (!initData.isRecent) {
        return { success: false, error: new InvalidTelegramDataError('Data is too old') };
      }

      let user = await this.userRepository.findByTelegramId(initData.telegramId);
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        user = User.create({
          telegramId: initData.telegramId,
          firstName: initData.user.firstName,
          lastName: initData.user.lastName,
          username: initData.user.username,
          isPremium: initData.isPremium,
        });
        await this.userRepository.save(user);
      }

      const existingSession = await this.sessionRepository.findByTelegramId(initData.telegramId);
      if (existingSession) {
        await this.sessionRepository.delete(existingSession.id);
      }

      const session = Session.create({
        userId: user.id,
        telegramId: initData.telegramId,
      });

      await this.sessionRepository.save(session);

      return {
        success: true,
        data: {
          userId: user.id,
          sessionId: session.id,
          isNewUser,
        },
      };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

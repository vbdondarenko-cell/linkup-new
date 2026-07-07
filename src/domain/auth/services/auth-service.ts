import { ISessionRepository } from '../repositories/i-session-repository';
import { EntityId } from '../../shared/types';

export interface AuthContext {
  userId: EntityId;
  sessionId: EntityId;
  telegramId?: string;
  isPremium: boolean;
}

export class AuthService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async validateSession(sessionId: EntityId): Promise<AuthContext | null> {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session || !session.isValid) {
      return null;
    }

    return {
      userId: session.userId,
      sessionId: session.id,
      telegramId: session.telegramId,
      isPremium: false, // Will be populated from user profile
    };
  }

  async getUserSessions(userId: EntityId): Promise<number> {
    const sessions = await this.sessionRepository.findByUserId(userId);
    return sessions.filter(s => s.isValid).length;
  }

  async revokeAllSessions(userId: EntityId): Promise<void> {
    const sessions = await this.sessionRepository.findByUserId(userId);
    for (const session of sessions) {
      if (session.isValid) {
        session.revoke();
        await this.sessionRepository.save(session);
      }
    }
  }
}

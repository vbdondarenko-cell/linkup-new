import { ISessionRepository } from '../repositories/i-session-repository';
import { Session } from '../entities/session';
import { AsyncResult, EntityId } from '../../shared/types';
import { SessionNotFoundError, SessionExpiredError } from '../errors/auth-errors';

export interface RefreshSessionInput {
  sessionId: EntityId;
}

export interface RefreshSessionOutput {
  sessionId: EntityId;
  expiresAt: Date;
}

export class RefreshSessionUseCase {
  private readonly SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: RefreshSessionInput): AsyncResult<RefreshSessionOutput> {
    try {
      const session = await this.sessionRepository.findById(input.sessionId);

      if (!session) {
        return { success: false, error: new SessionNotFoundError(input.sessionId) };
      }

      if (session.isExpired) {
        return { success: false, error: new SessionExpiredError() };
      }

      const newExpiresAt = new Date(Date.now() + this.SESSION_DURATION_MS);
      const newRefreshToken = this.generateRefreshToken();

      session.refresh(newExpiresAt, newRefreshToken);
      await this.sessionRepository.save(session);

      return {
        success: true,
        data: {
          sessionId: session.id,
          expiresAt: newExpiresAt,
        },
      };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  private generateRefreshToken(): string {
    return `rt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

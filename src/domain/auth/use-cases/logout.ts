import { ISessionRepository } from '../repositories/i-session-repository';
import { EntityId, AsyncResult } from '../../shared/types';
import { SessionExpiredError, SessionNotFoundError } from '../errors/auth-errors';

export class LogoutUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(sessionId: EntityId): AsyncResult<void> {
    try {
      const session = await this.sessionRepository.findById(sessionId);

      if (!session) {
        return { success: false, error: new SessionNotFoundError(sessionId) };
      }

      if (session.isExpired) {
        return { success: false, error: new SessionExpiredError() };
      }

      session.revoke();
      await this.sessionRepository.save(session);

      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

import { GetSessionQuery } from '../queries/get-session.query';
import { SessionInfo } from '../dto/auth.dto';
import { ISessionRepository } from '../../../domain/auth/repositories/i-session-repository';

export class GetSessionHandler {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async handle(query: GetSessionQuery): Promise<SessionInfo | null> {
    const session = await this.sessionRepository.findById(query.sessionId);

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      userId: session.userId,
      telegramId: session.telegramId,
      expiresAt: session.expiresAt.toISOString(),
      isValid: session.isValid,
    };
  }
}
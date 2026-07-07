import { LoginHandler } from '../handlers/login.handler';
import { LogoutHandler } from '../handlers/logout.handler';
import { RefreshSessionHandler } from '../handlers/refresh-session.handler';
import { GetSessionHandler } from '../handlers/get-session.handler';
import { LoginCommand } from '../commands/login.command';
import { LogoutCommand } from '../commands/logout.command';
import { RefreshSessionCommand } from '../commands/refresh-session.command';
import { GetSessionQuery } from '../queries/get-session.query';
import { LoginRequest, LoginResponse, LogoutRequest, RefreshSessionRequest, SessionInfo } from '../dto/auth.dto';
import { ISessionRepository } from '../../../domain/auth/repositories/i-session-repository';
import { IUserRepository } from '../../../domain/auth/use-cases/login-with-telegram';
import { AuthorizationContext, AuthorizationMiddleware } from '../../shared/middleware/authorization-middleware';
import { LoggingMiddleware } from '../../shared/middleware/logging-middleware';

export class AuthService {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository,
    private readonly authorization: AuthorizationMiddleware,
    private readonly logger: LoggingMiddleware
  ) {}

  private getLoginHandler(): LoginHandler {
    return new LoginHandler(this.sessionRepository, this.userRepository);
  }

  private getLogoutHandler(): LogoutHandler {
    return new LogoutHandler(this.sessionRepository);
  }

  private getRefreshSessionHandler(): RefreshSessionHandler {
    return new RefreshSessionHandler(this.sessionRepository);
  }

  private getGetSessionHandler(): GetSessionHandler {
    return new GetSessionHandler(this.sessionRepository);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.logger.execute(
      'AuthService.login',
      undefined,
      async (correlationId) => {
        const command = new LoginCommand(request);
        const handler = this.getLoginHandler();

        const result = await handler.handle(command);

        if (!result.success) {
          throw result.error;
        }

        return result.data;
      },
      { correlationId: 'auth-correlation' }
    );
  }

  async logout(request: LogoutRequest): Promise<void> {
    const command = new LogoutCommand(request);
    const handler = this.getLogoutHandler();

    const result = await handler.handle(command);

    if (!result.success) {
      throw result.error;
    }
  }

  async refreshSession(request: RefreshSessionRequest): Promise<{ sessionId: string; expiresAt: string }> {
    const command = new RefreshSessionCommand(request);
    const handler = this.getRefreshSessionHandler();

    const result = await handler.handle(command);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async getSession(sessionId: string): Promise<SessionInfo | null> {
    const query = new GetSessionQuery(sessionId);
    const handler = this.getGetSessionHandler();

    return handler.handle(query);
  }

  async getUserContext(userId: string): Promise<AuthorizationContext> {
    const user = await this.userRepository.findById(userId);
    
    // In real implementation, would check premium, organizer status, etc.
    return {
      userId,
      role: user?.status === 'active' ? 'user' : 'guest',
      isPremium: user?.isPremium || false,
      isOrganizer: false,
    };
  }
}
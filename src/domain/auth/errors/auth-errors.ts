import { DomainError } from '../../shared/errors/base';

export class AuthError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'AUTH_ERROR', details);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid credentials', { code: 'INVALID_CREDENTIALS' });
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Session has expired', { code: 'SESSION_EXPIRED' });
  }
}

export class SessionNotFoundError extends AuthError {
  constructor(sessionId: string) {
    super('Session not found', { code: 'SESSION_NOT_FOUND', sessionId });
  }
}

export class InvalidTelegramDataError extends AuthError {
  constructor(reason?: string) {
    super('Invalid Telegram data', { code: 'INVALID_TELEGRAM_DATA', reason });
  }
}

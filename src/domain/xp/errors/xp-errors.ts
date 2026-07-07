import { DomainError } from '../../shared/errors/base';

export class XPError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'XP_ERROR', details);
  }
}

export class XPNotFoundError extends XPError {
  constructor(id: string) {
    super('XP record not found', { id });
  }
}

export class InvalidXPActionError extends XPError {
  constructor(action: string) {
    super('Invalid XP action', { action });
  }
}
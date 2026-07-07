import { DomainError } from '../../shared/errors/base';

export class BadgeError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'BADGE_ERROR', details);
  }
}

export class BadgeNotFoundError extends BadgeError {
  constructor(id: string) {
    super('Badge not found', { id });
  }
}

export class BadgeAlreadyEarnedError extends BadgeError {
  constructor(userId: string, badgeType: string) {
    super('Badge already earned', { userId, badgeType });
  }
}
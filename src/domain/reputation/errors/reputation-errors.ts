import { DomainError } from '../../shared/errors/base';

export class ReputationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'REPUTATION_ERROR', details);
  }
}

export class ReputationNotFoundError extends ReputationError {
  constructor(userId: string) {
    super('Reputation not found', { userId });
  }
}
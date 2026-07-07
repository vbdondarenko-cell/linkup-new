import { DomainError } from '../../shared/errors/base';

export class PremiumError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'PREMIUM_ERROR', details);
  }
}

export class PremiumRequiredError extends PremiumError {
  constructor(requiredTier?: PremiumTier) {
    super('Premium subscription required', { requiredTier });
  }
}

export class SubscriptionNotFoundError extends PremiumError {
  constructor(id: string) {
    super('Subscription not found', { id });
  }
}

export class AlreadySubscribedError extends PremiumError {
  constructor(userId: string) {
    super('User already has active subscription', { userId });
  }
}

export type { PremiumTier } from '../entities/premium-subscription';
import { DomainError } from '../../shared/errors/base';

export class BusinessError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'BUSINESS_ERROR', details);
  }
}

export class BusinessNotFoundError extends BusinessError {
  constructor(id: string) {
    super('Business not found', { id });
  }
}

export class BusinessVerificationRequiredError extends BusinessError {
  constructor(action: string) {
    super('Business verification required', { action });
  }
}

export class AlreadyVerifiedError extends BusinessError {
  constructor(businessId: string) {
    super('Business is already verified', { businessId });
  }
}

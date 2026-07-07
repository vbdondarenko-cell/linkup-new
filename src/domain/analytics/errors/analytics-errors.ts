import { DomainError } from '../../shared/errors/base';

export class AnalyticsError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'ANALYTICS_ERROR', details);
  }
}

export class InvalidEventTypeError extends AnalyticsError {
  constructor(type: string) {
    super('Invalid analytics event type', { type });
  }
}

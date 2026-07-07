export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
    public readonly isRetryable = false
  ) {
    super(message);
    this.name = 'ApplicationError';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      isRetryable: this.isRetryable,
    };
  }
}

export class ValidationApplicationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationApplicationError';
  }
}

export class AuthorizationApplicationError extends ApplicationError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationApplicationError';
  }
}

export class NotFoundApplicationError extends ApplicationError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', { resource, id });
    this.name = 'NotFoundApplicationError';
  }
}

export class ConflictApplicationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFLICT', details);
    this.name = 'ConflictApplicationError';
  }
}

export class NetworkApplicationError extends ApplicationError {
  constructor(message: string = 'Network error', details?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', details, true);
    this.name = 'NetworkApplicationError';
  }
}

export class RetryableApplicationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'RETRYABLE_ERROR', details, true);
    this.name = 'RetryableApplicationError';
  }
}

export class TransactionApplicationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionApplicationError';
  }
}

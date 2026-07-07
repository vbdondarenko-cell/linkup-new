import { DomainError } from '../../shared/errors/base';

export class ProfileError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'PROFILE_ERROR', details);
  }
}

export class ProfileNotFoundError extends ProfileError {
  constructor(id?: string) {
    super('Profile not found', { id });
  }
}

export class UsernameTakenError extends ProfileError {
  constructor(username: string) {
    super('Username is already taken', { username });
  }
}

export class InvalidUsernameError extends ProfileError {
  constructor(reason: string) {
    super('Invalid username', { reason });
  }
}

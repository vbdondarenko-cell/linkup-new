import { DomainError } from '../../shared/errors/base';

export class OrganizerError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'ORGANIZER_ERROR', details);
  }
}

export class OrganizerNotFoundError extends OrganizerError {
  constructor(id: string) {
    super('Organizer not found', { id });
  }
}

export class OrganizerLockedError extends OrganizerError {
  constructor(userId: string) {
    super('Organizer access is locked', { userId });
  }
}

export class OrganizerAlreadyExistsError extends OrganizerError {
  constructor(userId: string) {
    super('User is already an organizer', { userId });
  }
}

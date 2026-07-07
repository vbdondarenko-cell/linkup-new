import { DomainError } from '../../shared/errors/base';

export class EventError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'EVENT_ERROR', details);
  }
}

export class EventNotFoundError extends EventError {
  constructor(id: string) {
    super('Event not found', { id });
  }
}

export class EventFullError extends EventError {
  constructor(eventId: string) {
    super('Event is full', { eventId });
  }
}

export class AlreadyJoinedError extends EventError {
  constructor(eventId: string, userId: string) {
    super('User has already joined this event', { eventId, userId });
  }
}

export class NotParticipantError extends EventError {
  constructor(eventId: string, userId: string) {
    super('User is not a participant of this event', { eventId, userId });
  }
}

export class InvalidEventDateError extends EventError {
  constructor(reason: string) {
    super('Invalid event date', { reason });
  }
}

export class InvalidLocationError extends EventError {
  constructor(reason: string) {
    super('Invalid location', { reason });
  }
}

export class PermissionDeniedError extends EventError {
  constructor(action: string) {
    super('Permission denied', { action });
  }
}

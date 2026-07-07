import { DomainError } from '../../shared/errors/base';

export class RatingError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'RATING_ERROR', details);
  }
}

export class RatingNotFoundError extends RatingError {
  constructor(id: string) {
    super('Rating not found', { id });
  }
}

export class DuplicateRatingError extends RatingError {
  constructor(userId: string, targetId: string) {
    super('You have already rated this target', { userId, targetId });
  }
}

export class InvalidRatingScoreError extends RatingError {
  constructor(score: number) {
    super('Rating score must be between 1 and 5', { score });
  }
}

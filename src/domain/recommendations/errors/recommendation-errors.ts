import { DomainError } from '../../shared/errors/base';

export class RecommendationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'RECOMMENDATION_ERROR', details);
  }
}

export class RecommendationNotFoundError extends RecommendationError {
  constructor(id: string) {
    super('Recommendation not found', { id });
  }
}

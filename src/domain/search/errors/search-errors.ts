import { DomainError } from '../../shared/errors/base';

export class SearchError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'SEARCH_ERROR', details);
  }
}

export class InvalidSearchQueryError extends SearchError {
  constructor(reason: string) {
    super('Invalid search query', { reason });
  }
}

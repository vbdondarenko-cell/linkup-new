import { DomainError } from '../../shared/errors/base';

export class ReportError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'REPORT_ERROR', details);
  }
}

export class ReportNotFoundError extends ReportError {
  constructor(id: string) {
    super('Report not found', { id });
  }
}

export class DuplicateReportError extends ReportError {
  constructor(reporterId: string, targetId: string) {
    super('You have already reported this content', { reporterId, targetId });
  }
}

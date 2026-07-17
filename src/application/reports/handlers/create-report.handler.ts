import { CreateReportRequest, ReportResponse } from '../dto/report.dto';
import { Report } from '../../../domain/reports/entities/report';
import { IReportRepository } from '../../../domain/reports/repositories/i-report-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { ReportCreated } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class CreateReportHandler {
  constructor(
    private readonly reportRepository: IReportRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: CreateReportRequest): Promise<Result<ReportResponse>> {
    const report = Report.create({
      reporterId: request.reporterId,
      type: request.type,
      targetId: request.targetId,
      reason: request.reason,
      description: request.description,
      evidence: request.evidence,
    });

    await this.reportRepository.save(report);

    // Dispatch domain event
    await this.eventDispatcher.dispatch(new ReportCreated(report.id, report.reporterId, report.targetId));

    return {
      success: true,
      data: {
        id: report.id,
        reporterId: report.reporterId,
        type: report.type,
        targetId: report.targetId,
        reason: report.reason,
        description: report.description,
        status: report.status,
        createdAt: report.createdAt.toISOString(),
      },
    };
  }
}

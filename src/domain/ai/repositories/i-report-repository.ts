import { EntityId } from '../../shared/types';
import { ReportEntity } from '../entities/report';

export interface IReportRepository {
  findById(id: EntityId): Promise<ReportEntity | null>;
  findByTarget(targetId: EntityId, limit?: number): Promise<ReportEntity[]>;
  findByReporter(reporterId: EntityId, limit?: number): Promise<ReportEntity[]>;
  findPending(limit?: number): Promise<ReportEntity[]>;
  findByPriority(priority: string, limit?: number): Promise<ReportEntity[]>;
  save(report: ReportEntity): Promise<void>;
  deleteById(id: EntityId): Promise<void>;
}

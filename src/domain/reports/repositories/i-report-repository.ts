import { EntityId, PaginationParams } from '../../shared/types';
import { Report, ReportType, ReportStatus, ReportReason } from '../entities/report';

export interface ReportFilters {
  type?: ReportType[];
  status?: ReportStatus[];
  reason?: ReportReason[];
  reporterId?: EntityId;
  targetId?: EntityId;
  dateRange?: { start: Date; end: Date };
}

export interface IReportRepository {
  findById(id: EntityId): Promise<Report | null>;
  findByTargetId(targetId: EntityId): Promise<Report[]>;
  findByReporterId(reporterId: EntityId, pagination: PaginationParams): Promise<Report[]>;
  findPending(pagination: PaginationParams): Promise<Report[]>;
  findByFilters(filters: ReportFilters, pagination: PaginationParams): Promise<Report[]>;
  countByStatus(): Promise<Record<ReportStatus, number>>;
  save(report: Report): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

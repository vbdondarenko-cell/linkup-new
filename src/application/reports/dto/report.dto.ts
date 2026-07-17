import type { ReportReason } from '../../../shared/types/enums';

export interface CreateReportRequest {
  reporterId: string;
  type: 'event' | 'user' | 'message' | 'business' | 'content';
  targetId: string;
  reason: ReportReason;
  description?: string;
  evidence?: string[];
}

export interface ReportResponse {
  id: string;
  reporterId: string;
  type: string;
  targetId: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface CreateReportRequest {
  reporterId: string;
  type: 'event' | 'user' | 'message' | 'business' | 'content';
  targetId: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'fake' | 'scam' | 'other';
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

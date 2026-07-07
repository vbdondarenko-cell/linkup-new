export interface JoinEventRequest {
  eventId: string;
  userId: string;
}

export interface LeaveEventRequest {
  eventId: string;
  userId: string;
}

export interface ApproveRequestRequest {
  eventId: string;
  userId: string;
}

export interface DeclineRequestRequest {
  eventId: string;
  userId: string;
  reason?: string;
}

export interface ParticipantResponse {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  isOrganizer: boolean;
  joinedAt: string;
  approvedAt?: string;
  checkedInAt?: string;
}

export interface ParticipantListResponse {
  participants: ParticipantResponse[];
  totalCount: number;
}

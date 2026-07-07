export interface UnlockOrganizerRequest {
  userId: string;
  displayName: string;
}

export interface OrganizerResponse {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  status: string;
  totalEvents: number;
  successfulEvents: number;
  averageRating: number;
  totalParticipants: number;
  isFeatured: boolean;
  createdAt: string;
}

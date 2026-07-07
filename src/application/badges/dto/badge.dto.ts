export interface UnlockBadgeRequest {
  userId: string;
  badgeType: string;
}

export interface BadgeResponse {
  id: string;
  userId: string;
  badgeType: string;
  earnedAt: string;
  displayName?: string;
}

export interface UserBadgesResponse {
  badges: BadgeResponse[];
  totalCount: number;
}

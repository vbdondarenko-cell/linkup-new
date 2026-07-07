export interface GrantXPRequest {
  userId: string;
  action: string;
  description: string;
  eventId?: string;
}

export interface XPProgressResponse {
  userId: string;
  totalXP: number;
  level: number;
  levelTitle: string;
  progress: number;
  xpToNextLevel: number;
}

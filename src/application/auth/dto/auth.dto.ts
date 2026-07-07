export interface TelegramInitDataRequest {
  hash: string;
  queryId: string;
  user: {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
    isPremium?: boolean;
  };
  authDate: number;
}

export interface LoginRequest {
  telegramInitData: TelegramInitDataRequest;
}

export interface LoginResponse {
  userId: string;
  sessionId: string;
  isNewUser: boolean;
  expiresAt: string;
}

export interface RefreshSessionRequest {
  sessionId: string;
}

export interface RefreshSessionResponse {
  sessionId: string;
  expiresAt: string;
}

export interface LogoutRequest {
  sessionId: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  telegramId?: string;
  expiresAt: string;
  isValid: boolean;
}
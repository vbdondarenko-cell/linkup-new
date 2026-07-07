export interface CreateProfileRequest {
  userId: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  language?: string;
  radius?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
  };
  interests?: string[];
}

export interface UpdateProfileRequest {
  profileId: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ChangeLanguageRequest {
  profileId: string;
  language: string;
}

export interface UpdateLocationRequest {
  profileId: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  language: string;
  radius: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
  };
  interests: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileListResponse {
  profiles: ProfileResponse[];
  totalCount: number;
}

export interface AddInterestRequest {
  profileId: string;
  interestId: string;
}

export interface RemoveInterestRequest {
  profileId: string;
  interestId: string;
}

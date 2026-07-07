export interface CreateEventRequest {
  organizerId: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    placeId?: string;
  };
  startDate: string;
  endDate: string;
  maxCapacity?: number;
  isFree?: boolean;
  price?: { amount: number; currency: string };
  visibility?: 'public' | 'private' | 'followers';
  interests?: string[];
  seriesId?: string;
}

export interface UpdateEventRequest {
  eventId: string;
  title?: string;
  description?: string;
  coverImageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    placeId?: string;
  };
  startDate?: string;
  endDate?: string;
  maxCapacity?: number;
  isFree?: boolean;
  price?: { amount: number; currency: string };
  visibility?: 'public' | 'private' | 'followers';
  interests?: string[];
}

export interface EventResponse {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    placeId?: string;
  };
  startDate: string;
  endDate: string;
  capacity?: {
    min: number;
    max: number;
    waitlistEnabled: boolean;
    waitlistLimit?: number;
  };
  isFree: boolean;
  price?: { amount: number; currency: string };
  visibility: string;
  interests: string[];
  seriesId?: string;
  status: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventListResponse {
  events: EventResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface EventSearchFilters {
  organizerId?: string;
  status?: string[];
  interests?: string[];
  dateRange?: { start: string; end: string };
  location?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  isFree?: boolean;
  seriesId?: string;
}

export interface SearchEventsRequest {
  query?: string;
  filters?: EventSearchFilters;
  page?: number;
  pageSize?: number;
}

// Home Experience Types

export interface EventMarker {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatarUrl?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  startDate: Date;
  endDate: Date;
  isPremium: boolean;
  isVerified: boolean;
  isOrganizer: boolean;
  participantCount: number;
  maxParticipants?: number;
  distance?: number;
  interests: string[];
  status: 'pending' | 'approved' | 'waitlisted' | 'attended' | 'declined' | 'cancelled';
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface FilterOption {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  isSelected: boolean;
}

export interface SearchResult {
  id: string;
  type: 'event' | 'organizer' | 'business' | 'interest' | 'address';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface RecentSearch {
  id: string;
  query: string;
  type: SearchResult['type'];
  timestamp: Date;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  country?: string;
}

export interface BottomSheetSnapPoint {
  index: number;
  height: number;
  percentage: number;
}

export type BottomSheetState = 'collapsed' | 'medium' | 'expanded' | 'hidden';

export interface HomeState {
  isLoading: boolean;
  isOffline: boolean;
  location: UserLocation | null;
  region: MapRegion;
  markers: EventMarker[];
  selectedMarker: EventMarker | null;
  filters: FilterOption[];
  searchQuery: string;
  searchResults: SearchResult[];
  recentSearches: RecentSearch[];
  bottomSheetState: BottomSheetState;
  isSearchFocused: boolean;
}

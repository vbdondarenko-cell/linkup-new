/**
 * LinkUp Design System 2026
 * Discovery Types
 */

// Search
export type SearchResultType = 'event' | 'business' | 'organizer' | 'category' | 'interest' | 'address' | 'user';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  icon?: string;
  imageUrl?: string;
  relevanceScore: number;
  metadata?: Record<string, unknown>;
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  sortBy?: SortOption;
  limit?: number;
  offset?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  recentSearches: string[];
  isSearching: boolean;
  selectedResult?: SearchResult;
}

// Filters
export interface SearchFilters {
  distance?: number; // in km
  category?: string;
  date?: DateRange;
  time?: TimeRange;
  language?: string;
  trustScore?: { min: number; max: number };
  rating?: { min: number; max: number };
  price?: 'free' | 'paid' | 'all';
  availableSeats?: { min: number };
  organizer?: string;
  business?: string;
  premium?: boolean;
  verified?: boolean;
  openNow?: boolean;
}

export interface DateRange {
  start?: Date;
  end?: Date;
  today?: boolean;
  tomorrow?: boolean;
  thisWeek?: boolean;
  thisMonth?: boolean;
}

export interface TimeRange {
  morning?: boolean; // 6-12
  afternoon?: boolean; // 12-18
  evening?: boolean; // 18-24
  night?: boolean; // 0-6
}

// Sort Options
export type SortOption = 
  | 'recommended'
  | 'nearest'
  | 'starting_soon'
  | 'highest_rated'
  | 'most_popular'
  | 'newest'
  | 'most_trusted';

export const SORT_OPTIONS: Array<{ value: SortOption; label: string; icon: string }> = [
  { value: 'recommended', label: 'Recommended', icon: '✨' },
  { value: 'nearest', label: 'Nearest', icon: '📍' },
  { value: 'starting_soon', label: 'Starting Soon', icon: '⏰' },
  { value: 'highest_rated', label: 'Highest Rated', icon: '⭐' },
  { value: 'most_popular', label: 'Most Popular', icon: '🔥' },
  { value: 'newest', label: 'Newest', icon: '🆕' },
  { value: 'most_trusted', label: 'Most Trusted', icon: '🛡️' },
];

// Recommendations
export interface Recommendation {
  id: string;
  type: 'event' | 'business' | 'organizer';
  item: Event | Business | Organizer;
  reason: RecommendationReason;
  score: number;
  freshness: number; // 0-100, how new/relevant
}

export type RecommendationReason = 
  | 'nearby'
  | 'interests'
  | 'trust'
  | 'popular'
  | 'trending'
  | 'similar'
  | 'following'
  | 'location'
  | 'category';

export interface RecommendationWeights {
  distance: number;
  interestMatch: number;
  trustScore: number;
  attendanceRate: number;
  pastParticipation: number;
  languageMatch: number;
  categoryMatch: number;
  eventQuality: number;
  freshness: number;
  capacity: number;
}

// Events
export interface Event {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  category: string;
  categoryInfo?: { id: string; name: string; icon: string; color: string };
  startDate: Date;
  endDate: Date;
  location?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  distance?: number;
  currentParticipants: number;
  maxParticipants?: number;
  price?: number;
  isFree: boolean;
  organizer: {
    id: string;
    name: string;
    avatarUrl?: string;
    trustScore: number;
  };
  business?: {
    id: string;
    name: string;
    logoUrl?: string;
    isVerified: boolean;
  };
  rating?: number;
  ratingCount?: number;
  isPremium: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  views: number;
  joinedCount: number;
  shareUrl?: string;
}

// Businesses
export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  coverImageUrl?: string;
  category: string;
  categoryInfo?: { id: string; name: string; icon: string; color: string };
  address?: {
    street: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  distance?: number;
  isVerified: boolean;
  isOpen: boolean;
  averageRating: number;
  totalReviews: number;
  totalEvents: number;
  followers: number;
  rank: 'verified' | 'featured' | 'premium' | 'hub' | 'ambassador';
}

// Organizers
export interface Organizer {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  distance?: number;
  rank: 'rising' | 'pro' | 'community' | 'elite' | 'legend';
  trustScore: number;
  totalEvents: number;
  totalParticipants: number;
  averageRating: number;
  isVerified: boolean;
  streak: number;
}

// Categories
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  eventCount: number;
  isTrending: boolean;
}

export const CATEGORIES: Category[] = [
  { id: 'coffee', name: 'Coffee', icon: '☕', color: '#8B4513', eventCount: 245, isTrending: true },
  { id: 'food', name: 'Food', icon: '🍽️', color: '#DC2626', eventCount: 312, isTrending: true },
  { id: 'music', name: 'Music', icon: '🎵', color: '#7C3AED', eventCount: 189, isTrending: true },
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#22C55E', eventCount: 156, isTrending: false },
  { id: 'gaming', name: 'Gaming', icon: '🎮', color: '#3B82F6', eventCount: 98, isTrending: false },
  { id: 'technology', name: 'Technology', icon: '💻', color: '#6366F1', eventCount: 134, isTrending: true },
  { id: 'business', name: 'Business', icon: '💼', color: '#0EA5E9', eventCount: 167, isTrending: false },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#F59E0B', eventCount: 45, isTrending: false },
  { id: 'nature', name: 'Nature', icon: '🌿', color: '#10B981', eventCount: 89, isTrending: false },
  { id: 'art', name: 'Art', icon: '🎨', color: '#EC4899', eventCount: 123, isTrending: true },
  { id: 'photography', name: 'Photography', icon: '📷', color: '#F97316', eventCount: 67, isTrending: false },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: '#EF4444', eventCount: 178, isTrending: true },
  { id: 'movies', name: 'Movies', icon: '🎬', color: '#A855F7', eventCount: 56, isTrending: false },
  { id: 'books', name: 'Books', icon: '📚', color: '#64748B', eventCount: 34, isTrending: false },
  { id: 'education', name: 'Education', icon: '🎓', color: '#8B5CF6', eventCount: 145, isTrending: false },
  { id: 'languages', name: 'Languages', icon: '🗣️', color: '#14B8A6', eventCount: 78, isTrending: false },
  { id: 'volunteering', name: 'Volunteering', icon: '🤝', color: '#10B981', eventCount: 23, isTrending: false },
  { id: 'nightlife', name: 'Nightlife', icon: '🌃', color: '#6B21A8', eventCount: 112, isTrending: true },
  { id: 'culture', name: 'Culture', icon: '🏛️', color: '#B45309', eventCount: 89, isTrending: false },
  { id: 'wellness', name: 'Wellness', icon: '🧘', color: '#0D9488', eventCount: 134, isTrending: true },
];

// Trending
export interface TrendingItem {
  id: string;
  type: 'event' | 'category' | 'business' | 'organizer' | 'area';
  item: Event | Category | Business | Organizer;
  trendScore: number;
  change: number; // percentage change
  period: 'day' | 'week' | 'month';
}

// Favorites
export interface Favorite {
  id: string;
  type: 'event' | 'business' | 'organizer';
  itemId: string;
  savedAt: Date;
  notes?: string;
}

// History
export interface HistoryItem {
  id: string;
  type: 'search' | 'view' | 'join' | 'create';
  itemId?: string;
  itemTitle?: string;
  itemType?: SearchResultType;
  timestamp: Date;
}

// Similar Events
export interface SimilarEvent extends Event {
  similarityScore: number;
  similarityReasons: string[];
}

// Location
export interface LocationState {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  accuracy?: number;
  lastUpdated: Date;
}

// Discovery State
export interface DiscoveryState {
  recommendations: Recommendation[];
  trending: TrendingItem[];
  favorites: Favorite[];
  history: HistoryItem[];
  filters: SearchFilters;
  sortBy: SortOption;
  location: LocationState | null;
  radius: number;
  isLoading: boolean;
  error: string | null;
}

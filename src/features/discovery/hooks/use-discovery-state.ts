/**
 * LinkUp Design System 2026
 * Discovery State Hook
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  DiscoveryState,
  SearchFilters,
  SearchResult,
  SearchResultType,
  SortOption,
  Recommendation,
  TrendingItem,
  Favorite,
  HistoryItem,
  Event,
  Business,
  Organizer,
  Category,
  CATEGORIES,
  RecommendationWeights,
  SORT_OPTIONS,
} from '../types';

// Mock data generators
const generateMockEvents = (): Event[] => [
  {
    id: 'event_1',
    title: 'Friday Jazz Night',
    description: 'Live jazz performances in a cozy atmosphere',
    coverImageUrl: 'https://picsum.photos/seed/jazz/800/400',
    category: 'music',
    categoryInfo: { id: 'music', name: 'Music', icon: '🎵', color: '#7C3AED' },
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 2 + 14400000),
    location: { name: 'The Jazz Club', address: '123 Main St', latitude: 37.77, longitude: -122.41 },
    distance: 0.8,
    currentParticipants: 24,
    maxParticipants: 40,
    isFree: false,
    price: 15,
    organizer: { id: 'org_1', name: 'SF Jazz Collective', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazz', trustScore: 95 },
    rating: 4.8,
    ratingCount: 42,
    isPremium: false,
    isFeatured: true,
    isTrending: true,
    status: 'published',
    views: 580,
    joinedCount: 24,
  },
  {
    id: 'event_2',
    title: 'Coffee Tasting Workshop',
    description: 'Learn about specialty coffee beans',
    coverImageUrl: 'https://picsum.photos/seed/coffee/800/400',
    category: 'coffee',
    categoryInfo: { id: 'coffee', name: 'Coffee', icon: '☕', color: '#8B4513' },
    startDate: new Date(Date.now() + 86400000),
    endDate: new Date(Date.now() + 86400000 + 7200000),
    location: { name: 'Brew Lab', address: '456 Oak Ave', latitude: 37.78, longitude: -122.42 },
    distance: 1.2,
    currentParticipants: 12,
    maxParticipants: 15,
    isFree: false,
    price: 25,
    organizer: { id: 'org_2', name: 'Brew Masters', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coffee', trustScore: 88 },
    rating: 4.9,
    ratingCount: 28,
    isPremium: true,
    isFeatured: false,
    isTrending: false,
    status: 'published',
    views: 320,
    joinedCount: 12,
  },
  {
    id: 'event_3',
    title: 'Tech Meetup: AI & Future',
    description: 'Discussing the latest in AI',
    coverImageUrl: 'https://picsum.photos/seed/tech/800/400',
    category: 'technology',
    categoryInfo: { id: 'technology', name: 'Technology', icon: '💻', color: '#6366F1' },
    startDate: new Date(Date.now() + 86400000 * 3),
    endDate: new Date(Date.now() + 86400000 * 3 + 10800000),
    location: { name: 'TechHub', address: '789 Innovation Dr', latitude: 37.76, longitude: -122.40 },
    distance: 2.5,
    currentParticipants: 45,
    maxParticipants: 100,
    isFree: true,
    organizer: { id: 'org_3', name: 'SF Tech Community', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', trustScore: 92 },
    rating: 4.7,
    ratingCount: 56,
    isPremium: false,
    isFeatured: true,
    isTrending: true,
    status: 'published',
    views: 890,
    joinedCount: 45,
  },
  {
    id: 'event_4',
    title: 'Morning Yoga in the Park',
    description: 'Start your day with mindfulness',
    coverImageUrl: 'https://picsum.photos/seed/yoga/800/400',
    category: 'fitness',
    categoryInfo: { id: 'fitness', name: 'Fitness', icon: '💪', color: '#EF4444' },
    startDate: new Date(Date.now() + 86400000 * 4),
    endDate: new Date(Date.now() + 86400000 * 4 + 3600000),
    location: { name: 'Golden Gate Park', address: '501 Stanyan St', latitude: 37.77, longitude: -122.45 },
    distance: 3.0,
    currentParticipants: 18,
    maxParticipants: 30,
    isFree: true,
    organizer: { id: 'org_4', name: 'Wellness Warriors', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yoga', trustScore: 85 },
    rating: 4.6,
    ratingCount: 34,
    isPremium: false,
    isFeatured: false,
    isTrending: false,
    status: 'published',
    views: 420,
    joinedCount: 18,
  },
  {
    id: 'event_5',
    title: 'Art Walk Gallery Tour',
    description: 'Explore local art galleries',
    coverImageUrl: 'https://picsum.photos/seed/art/800/400',
    category: 'art',
    categoryInfo: { id: 'art', name: 'Art', icon: '🎨', color: '#EC4899' },
    startDate: new Date(Date.now() + 86400000 * 5),
    endDate: new Date(Date.now() + 86400000 * 5 + 14400000),
    location: { name: 'SoMa District', address: '1 Gallery Row', latitude: 37.78, longitude: -122.40 },
    distance: 1.5,
    currentParticipants: 22,
    maxParticipants: 25,
    isFree: false,
    price: 10,
    organizer: { id: 'org_5', name: 'SF Art Collective', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=art', trustScore: 90 },
    rating: 4.8,
    ratingCount: 19,
    isPremium: false,
    isFeatured: true,
    isTrending: true,
    status: 'published',
    views: 345,
    joinedCount: 22,
  },
];

const DEFAULT_WEIGHTS: RecommendationWeights = {
  distance: 0.25,
  interestMatch: 0.20,
  trustScore: 0.15,
  attendanceRate: 0.10,
  pastParticipation: 0.08,
  languageMatch: 0.05,
  categoryMatch: 0.07,
  eventQuality: 0.05,
  freshness: 0.03,
  capacity: 0.02,
};

interface UseDiscoveryStateReturn {
  // State
  state: DiscoveryState;
  events: Event[];
  
  // Search
  search: (query: string) => Promise<SearchResult[]>;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Filters
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  
  // Sort
  setSortBy: (sortBy: SortOption) => void;
  
  // Recommendations
  refreshRecommendations: () => Promise<void>;
  
  // Favorites
  addFavorite: (type: 'event' | 'business' | 'organizer', itemId: string) => void;
  removeFavorite: (favoriteId: string) => void;
  isFavorite: (itemId: string) => boolean;
  
  // History
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  
  // Location
  setLocation: (lat: number, lng: number, city?: string) => void;
  setRadius: (radius: number) => void;
  
  // Utilities
  getSortedEvents: () => Event[];
  getFilteredEvents: () => Event[];
  getRecommendedEvents: () => Event[];
  getTrendingCategories: () => Category[];
}

const INITIAL_STATE: DiscoveryState = {
  recommendations: [],
  trending: [],
  favorites: [],
  history: [],
  filters: {},
  sortBy: 'recommended',
  location: null,
  radius: 5,
  isLoading: false,
  error: null,
};

export const useDiscoveryState = (): UseDiscoveryStateReturn => {
  const [state, setState] = useState<DiscoveryState>(INITIAL_STATE);
  const [events, setEvents] = useState<Event[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      
      // Generate recommendations based on mock events
      const recommendations: Recommendation[] = mockEvents.map(event => ({
        id: `rec_${event.id}`,
        type: 'event',
        item: event,
        reason: 'nearby',
        score: Math.random() * 0.5 + 0.5,
        freshness: Math.random() * 100,
      })).sort((a, b) => b.score - a.score);
      
      // Generate trending categories
      const trending: TrendingItem[] = CATEGORIES
        .filter(c => c.isTrending)
        .map(category => ({
          id: `trend_${category.id}`,
          type: 'category',
          item: category,
          trendScore: Math.floor(Math.random() * 50) + 50,
          change: Math.floor(Math.random() * 30) + 5,
          period: 'week' as const,
        }));
      
      setState(prev => ({
        ...prev,
        recommendations,
        trending,
        isLoading: false,
      }));
    };
    
    loadData();
  }, []);

  // Search
  const search = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    setState(prev => ({ ...prev, isSearching: true }));
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Search events
    events.forEach(event => {
      if (
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description?.toLowerCase().includes(lowerQuery) ||
        event.category.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: event.id,
          type: 'event',
          title: event.title,
          subtitle: `${event.categoryInfo?.name} · ${event.distance?.toFixed(1)}km`,
          icon: event.categoryInfo?.icon,
          imageUrl: event.coverImageUrl,
          relevanceScore: 0.9,
        });
      }
    });
    
    // Search categories
    CATEGORIES.forEach(category => {
      if (
        category.name.toLowerCase().includes(lowerQuery) ||
        category.id.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          id: category.id,
          type: 'category',
          title: category.name,
          icon: category.icon,
          relevanceScore: 0.8,
        });
      }
    });
    
    setState(prev => ({ ...prev, isSearching: false }));
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [events]);

  const clearSearch = useCallback(() => {
    setState(prev => ({ ...prev, query: '' }));
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      history: [
        { id: `hist_${Date.now()}`, type: 'search', itemTitle: query, timestamp: new Date() },
        ...prev.history.filter(h => h.type !== 'search' || h.itemTitle !== query).slice(0, 9),
      ],
    }));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: prev.history.filter(h => h.type !== 'search'),
    }));
  }, []);

  // Filters
  const setFilters = useCallback((filters: Partial<SearchFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: {} }));
  }, []);

  // Sort
  const setSortBy = useCallback((sortBy: SortOption) => {
    setState(prev => ({ ...prev, sortBy }));
  }, []);

  // Recommendations
  const refreshRecommendations = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Re-generate recommendations
    const recommendations: Recommendation[] = events.map(event => ({
      id: `rec_${event.id}_${Date.now()}`,
      type: 'event',
      item: event,
      reason: 'nearby',
      score: Math.random() * 0.5 + 0.5,
      freshness: Math.random() * 100,
    })).sort((a, b) => b.score - a.score);
    
    setState(prev => ({
      ...prev,
      recommendations,
      isLoading: false,
    }));
  }, [events]);

  // Favorites
  const addFavorite = useCallback((type: 'event' | 'business' | 'organizer', itemId: string) => {
    setState(prev => ({
      ...prev,
      favorites: [
        { id: `fav_${Date.now()}`, type, itemId, savedAt: new Date() },
        ...prev.favorites.filter(f => !(f.type === type && f.itemId === itemId)),
      ],
    }));
  }, []);

  const removeFavorite = useCallback((favoriteId: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.filter(f => f.id !== favoriteId),
    }));
  }, []);

  const isFavorite = useCallback((itemId: string) => {
    return state.favorites.some(f => f.itemId === itemId);
  }, [state.favorites]);

  // History
  const addHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      history: [
        { ...item, id: `hist_${Date.now()}`, timestamp: new Date() },
        ...prev.history.filter(h => h.itemId !== item.itemId || h.type !== item.type).slice(0, 19),
      ],
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  // Location
  const setLocation = useCallback((latitude: number, longitude: number, city?: string) => {
    setState(prev => ({
      ...prev,
      location: { latitude, longitude, city, lastUpdated: new Date() },
    }));
  }, []);

  const setRadius = useCallback((radius: number) => {
    setState(prev => ({ ...prev, radius }));
  }, []);

  // Utilities
  const getSortedEvents = useCallback(() => {
    const sorted = [...events];
    
    switch (state.sortBy) {
      case 'nearest':
        return sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      case 'starting_soon':
        return sorted.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      case 'highest_rated':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'most_popular':
        return sorted.sort((a, b) => b.joinedCount - a.joinedCount);
      case 'newest':
        return sorted.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
      case 'most_trusted':
        return sorted.sort((a, b) => b.organizer.trustScore - a.organizer.trustScore);
      default: // recommended
        return sorted.sort((a, b) => {
          const scoreA = (a.rating || 0) * 0.3 + (a.organizer.trustScore / 100) * 0.3 - (a.distance || 0) * 0.2 + (a.isTrending ? 0.2 : 0);
          const scoreB = (b.rating || 0) * 0.3 + (b.organizer.trustScore / 100) * 0.3 - (b.distance || 0) * 0.2 + (b.isTrending ? 0.2 : 0);
          return scoreB - scoreA;
        });
    }
  }, [events, state.sortBy]);

  const getFilteredEvents = useCallback(() => {
    let filtered = events;
    const { distance, category, price, verified, openNow } = state.filters;
    
    if (distance) {
      filtered = filtered.filter(e => (e.distance || 0) <= distance);
    }
    
    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }
    
    if (price === 'free') {
      filtered = filtered.filter(e => e.isFree);
    } else if (price === 'paid') {
      filtered = filtered.filter(e => !e.isFree);
    }
    
    if (verified) {
      filtered = filtered.filter(e => e.business?.isVerified);
    }
    
    return filtered;
  }, [events, state.filters]);

  const getRecommendedEvents = useCallback(() => {
    return getSortedEvents().slice(0, 10);
  }, [getSortedEvents]);

  const getTrendingCategories = useCallback(() => {
    return CATEGORIES.filter(c => c.isTrending);
  }, []);

  return {
    state,
    events,
    search,
    clearSearch,
    addRecentSearch,
    clearRecentSearches,
    setFilters,
    clearFilters,
    setSortBy,
    refreshRecommendations,
    addFavorite,
    removeFavorite,
    isFavorite,
    addHistory,
    clearHistory,
    setLocation,
    setRadius,
    getSortedEvents,
    getFilteredEvents,
    getRecommendedEvents,
    getTrendingCategories,
  };
};

export type UseDiscoveryStateReturnType = ReturnType<typeof useDiscoveryState>;

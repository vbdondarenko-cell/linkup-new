import { useState, useCallback } from 'react';
import { HomeState, MapRegion, EventMarker, FilterOption, SearchResult, UserLocation } from '../types';

const DEFAULT_REGION: MapRegion = {
  latitude: 50.4501,
  longitude: 30.5234,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const DEFAULT_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All', isSelected: true },
  { id: 'coffee', label: 'Coffee', isSelected: false },
  { id: 'sports', label: 'Sports', isSelected: false },
  { id: 'music', label: 'Music', isSelected: false },
  { id: 'gaming', label: 'Gaming', isSelected: false },
  { id: 'travel', label: 'Travel', isSelected: false },
  { id: 'business', label: 'Business', isSelected: false },
  { id: 'food', label: 'Food', isSelected: false },
  { id: 'art', label: 'Art', isSelected: false },
  { id: 'education', label: 'Education', isSelected: false },
  { id: 'nightlife', label: 'Nightlife', isSelected: false },
  { id: 'volunteering', label: 'Volunteering', isSelected: false },
];

export interface UseHomeStateReturn {
  state: HomeState;
  setRegion: (region: MapRegion) => void;
  setSelectedMarker: (marker: EventMarker | null) => void;
  toggleFilter: (filterId: string) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  addRecentSearch: (search: Omit<SearchResult, 'id'>) => void;
  clearRecentSearches: () => void;
  setLocation: (location: UserLocation) => void;
  setBottomSheetState: (state: HomeState['bottomSheetState']) => void;
  setIsLoading: (loading: boolean) => void;
  setIsOffline: (offline: boolean) => void;
  setMarkers: (markers: EventMarker[]) => void;
  setIsSearchFocused: (focused: boolean) => void;
  recenterMap: () => void;
}

export const useHomeState = (): UseHomeStateReturn => {
  const [state, setState] = useState<HomeState>({
    isLoading: true,
    isOffline: false,
    location: null,
    region: DEFAULT_REGION,
    markers: [],
    selectedMarker: null,
    filters: DEFAULT_FILTERS,
    searchQuery: '',
    searchResults: [],
    recentSearches: [],
    bottomSheetState: 'collapsed',
    isSearchFocused: false,
  });

  const setRegion = useCallback((region: MapRegion) => {
    setState((prev) => ({ ...prev, region }));
  }, []);

  const setSelectedMarker = useCallback((marker: EventMarker | null) => {
    setState((prev) => ({
      ...prev,
      selectedMarker: marker,
      bottomSheetState: marker ? 'medium' : 'collapsed',
    }));
  }, []);

  const toggleFilter = useCallback((filterId: string) => {
    setState((prev) => ({
      ...prev,
      filters: prev.filters.map((f) =>
        f.id === 'all'
          ? { ...f, isSelected: f.id === filterId }
          : f.id === filterId
          ? { ...f, isSelected: !f.isSelected }
          : f
      ),
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: DEFAULT_FILTERS,
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setSearchResults = useCallback((results: SearchResult[]) => {
    setState((prev) => ({ ...prev, searchResults: results }));
  }, []);

  const addRecentSearch = useCallback((search: Omit<SearchResult, 'id'>) => {
    setState((prev) => ({
      ...prev,
      recentSearches: [
        { ...search, id: `search_${Date.now()}`, timestamp: new Date() },
        ...prev.recentSearches.slice(0, 9),
      ],
    }));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setState((prev) => ({ ...prev, recentSearches: [] }));
  }, []);

  const setLocation = useCallback((location: UserLocation) => {
    setState((prev) => ({
      ...prev,
      location,
      region: {
        ...prev.region,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  }, []);

  const setBottomSheetState = useCallback((bottomSheetState: HomeState['bottomSheetState']) => {
    setState((prev) => ({ ...prev, bottomSheetState }));
  }, []);

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setIsOffline = useCallback((isOffline: boolean) => {
    setState((prev) => ({ ...prev, isOffline }));
  }, []);

  const setMarkers = useCallback((markers: EventMarker[]) => {
    setState((prev) => ({ ...prev, markers }));
  }, []);

  const setIsSearchFocused = useCallback((isSearchFocused: boolean) => {
    setState((prev) => ({ ...prev, isSearchFocused }));
  }, []);

  const recenterMap = useCallback(() => {
    setState((prev) => ({
      ...prev,
      region: prev.location
        ? {
            ...prev.region,
            latitude: prev.location.latitude,
            longitude: prev.location.longitude,
          }
        : DEFAULT_REGION,
    }));
  }, []);

  return {
    state,
    setRegion,
    setSelectedMarker,
    toggleFilter,
    clearFilters,
    setSearchQuery,
    setSearchResults,
    addRecentSearch,
    clearRecentSearches,
    setLocation,
    setBottomSheetState,
    setIsLoading,
    setIsOffline,
    setMarkers,
    setIsSearchFocused,
    recenterMap,
  };
};

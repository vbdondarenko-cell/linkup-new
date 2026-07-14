import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHomeState, useLocation } from '../hooks';
import {
  HomeHeader,
  FloatingSearch,
  FilterChips,
  MapContainer,
  BottomSheet,
  EventPreview,
  FloatingDock,
  EmptyState,
  DockTab,
} from '../components';
import { EventMarker, MapRegion } from '../types';

export interface HomeScreenProps {
  onCreateEvent?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onEventPress?: (eventId: string) => void;
  onChatPress?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onCreateEvent,
  onNotifications,
  onProfile,
  onEventPress,
  onChatPress,
}) => {
  const theme = useTheme();
  const {
    state,
    setRegion,
    setSelectedMarker,
    toggleFilter,
    clearFilters,
    setSearchQuery,
    setSearchResults,
    setLocation,
    setBottomSheetState,
    setIsLoading,
    recenterMap,
  } = useHomeState();

  const { location, isLoading: locationLoading, requestLocation } = useLocation();

  // Initialize location
  useEffect(() => {
    if (location) {
      setLocation(location);
    }
  }, [location, setLocation]);

  // Loading state
  useEffect(() => {
    setIsLoading(locationLoading);
  }, [locationLoading, setIsLoading]);

  // Mock markers for demonstration
  useEffect(() => {
    const mockMarkers: EventMarker[] = [
      {
        id: '1',
        title: 'Tech Meetup',
        description: 'Join us for an evening of tech talks',
        organizerId: 'org1',
        organizerName: 'Tech Community',
        coordinates: { latitude: 50.4501, longitude: 30.5234 },
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 90000000),
        isPremium: false,
        isVerified: true,
        isOrganizer: true,
        participantCount: 24,
        maxParticipants: 50,
        interests: ['tech', 'networking'],
        status: 'approved',
      },
      {
        id: '2',
        title: 'Coffee & Code',
        description: 'Casual coding session with coffee',
        organizerId: 'org2',
        organizerName: 'DevHub',
        coordinates: { latitude: 50.4510, longitude: 30.5240 },
        startDate: new Date(Date.now() + 172800000),
        endDate: new Date(Date.now() + 180000000),
        isPremium: false,
        isVerified: false,
        isOrganizer: false,
        participantCount: 8,
        interests: ['coffee', 'coding'],
        status: 'approved',
      },
    ];
    // In real app, this would come from API
  }, []);

  const handleRegionChange = useCallback(
    (region: MapRegion) => {
      setRegion(region);
    },
    [setRegion]
  );

  const handleMarkerPress = useCallback(
    (marker: EventMarker) => {
      setSelectedMarker(marker);
    },
    [setSelectedMarker]
  );

  const handleMapPress = useCallback(() => {
    setSelectedMarker(null);
  }, [setSelectedMarker]);

  const handleSearch = useCallback(
    (query: string) => {
      // In real app, this would call the search API
      console.log('Searching for:', query);
    },
    []
  );

  const handleBottomSheetChange = useCallback(
    (newState: typeof state.bottomSheetState) => {
      setBottomSheetState(newState);
      if (newState === 'collapsed') {
        setSelectedMarker(null);
      }
    },
    [setBottomSheetState, setSelectedMarker]
  );

  const handleJoinEvent = useCallback(() => {
    if (state.selectedMarker) {
      console.log('Joining event:', state.selectedMarker.id);
      // In real app, this would call the JoinEvent use case
    }
  }, [state.selectedMarker]);

  const handleTabPress = useCallback(
    (tab: DockTab) => {
      switch (tab) {
        case 'create':
          onCreateEvent?.();
          break;
        case 'chats':
          onChatPress?.();
          break;
        case 'profile':
          onProfile?.();
          break;
      }
    },
    [onCreateEvent, onChatPress, onProfile]
  );

  const handleRecenter = useCallback(() => {
    recenterMap();
  }, [recenterMap]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    mapContainer: {
      flex: 1,
    },
    filtersContainer: {
      position: 'absolute',
      top: 160, // Below search
      left: 0,
      right: 0,
      zIndex: 10,
    },
    bottomSheetContent: {
      flex: 1,
    },
    offlineBanner: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.status.warning.bg,
      padding: spacing[2],
      alignItems: 'center',
    },
    offlineText: {
      ...typography.caption,
      color: theme.colors.status.warning.text,
      fontWeight: '600',
    },
  });

  const spacing = {
    2: 8,
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* Offline Banner */}
      {state.isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📶 You're offline. Some features may be limited.</Text>
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapContainer
          region={state.region}
          markers={state.markers}
          selectedMarker={state.selectedMarker}
          onRegionChange={handleRegionChange}
          onMarkerPress={handleMarkerPress}
          onMapPress={handleMapPress}
        />
      </View>

      {/* Header */}
      <HomeHeader
        location={state.location}
        notificationCount={0}
        onNotificationPress={onNotifications}
        onProfilePress={onProfile}
      />

      {/* Search */}
      <FloatingSearch
        value={state.searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        results={state.searchResults}
        recentSearches={state.recentSearches}
      />

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <FilterChips
          filters={state.filters}
          onToggle={toggleFilter}
          onClearAll={clearFilters}
        />
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        state={state.bottomSheetState}
        onStateChange={handleBottomSheetChange}
      >
        <View style={styles.bottomSheetContent}>
          {state.selectedMarker ? (
            <EventPreview
              event={state.selectedMarker}
              onJoin={handleJoinEvent}
              onClose={() => setSelectedMarker(null)}
              onPress={() => onEventPress?.(state.selectedMarker!.id)}
            />
          ) : (
            <EmptyState
              onCreateEvent={onCreateEvent}
            />
          )}
        </View>
      </BottomSheet>

      {/* Floating Dock */}
      <FloatingDock
        activeTab="map"
        onTabPress={handleTabPress}
        visible={state.bottomSheetState !== 'expanded'}
      />
    </View>
  );
};

export default HomeScreen;

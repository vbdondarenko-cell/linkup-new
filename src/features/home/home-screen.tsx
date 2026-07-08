/**
 * LinkUp Design System 2026
 * Home Screen - Main map experience composition
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../ui/providers/theme-provider';
import { useHaptics } from '../../ui/hooks/use-haptics';
import { spacing } from '../../ui/tokens/spacing';

// Import home components
import { HomeHeader } from './header/home-header';
import { HomeSearch } from './search/home-search';
import { FilterChips } from './filters/filter-chips';
import { HomeMap } from './map/home-map';
import { FloatingControls } from './floating-controls/floating-controls';
import { EventPreview } from './event-preview/event-preview';
import { NoEventsEmpty, OfflineBanner } from './empty-states/empty-states';
import { FloatingDock } from '../../ui/navigation/floating-dock/floating-dock';
import { BottomSheet } from '../../ui/navigation/bottom-sheet/bottom-sheet';

// Types
import type { DockTab } from '../../ui/navigation/floating-dock/floating-dock';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample data
const SAMPLE_MARKERS = [
  { id: '1', latitude: 40.7128, longitude: -74.006, type: 'user' as const, title: 'Coffee Meetup', isPremium: true },
  { id: '2', latitude: 40.7148, longitude: -74.008, type: 'organizer' as const, title: 'Tech Networking', isOrganizer: true },
  { id: '3', latitude: 40.7108, longitude: -74.004, type: 'business' as const, title: 'Startup Mixer', isBusiness: true },
  { id: '4', latitude: 40.7138, longitude: -74.002, type: 'user' as const, title: 'Art Walk' },
  { id: '5', latitude: 40.7168, longitude: -74.010, type: 'user' as const, title: 'Music Festival', isPremium: true },
];

const SAMPLE_CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'business', label: 'Business', icon: '💼' },
];

interface HomeScreenProps {
  style?: ViewStyle;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ style }) => {
  const theme = useTheme();
  const haptics = useHaptics();

  // State
  const [activeTab, setActiveTab] = useState<DockTab>('map');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['all']);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [compassRotation, setCompassRotation] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<'collapsed' | 'medium' | 'expanded'>('collapsed');

  // Map region
  const mapRegion = useMemo(() => ({
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }), []);

  // User location
  const userLocation = useMemo(() => ({
    latitude: 40.7128,
    longitude: -74.006,
  }), []);

  // Selected event
  const selectedEvent = useMemo(() => {
    if (!selectedMarkerId) return null;
    const marker = SAMPLE_MARKERS.find((m) => m.id === selectedMarkerId);
    if (!marker) return null;
    return {
      id: marker.id,
      title: marker.title,
      organizerName: marker.type === 'organizer' ? 'Sarah Johnson' : marker.type === 'business' ? 'TechHub Inc.' : 'John Doe',
      organizerAvatar: undefined,
      organizerIsVerified: marker.type === 'organizer',
      distance: '0.5 km',
      date: 'Dec 15',
      time: '3:00 PM',
      participantCount: 12,
      maxParticipants: 20,
      trustScore: 92,
      isPremium: marker.isPremium,
      isOrganizer: marker.isOrganizer,
      isBusiness: marker.isBusiness,
      category: 'Social',
    };
  }, [selectedMarkerId]);

  // Handlers
  const handleTabChange = useCallback((tab: DockTab) => {
    haptics.tabChange();
    setActiveTab(tab);
  }, [haptics]);

  const handleCreatePress = useCallback(() => {
    haptics.medium();
    // Open create event flow
  }, [haptics]);

  const handleMarkerPress = useCallback((marker: any) => {
    haptics.light();
    setSelectedMarkerId(marker.id);
  }, [haptics]);

  const handleSearchSubmit = useCallback((text: string) => {
    haptics.selection();
    // Perform search
  }, [haptics]);

  const handleCategoryChange = useCallback((ids: string[]) => {
    setSelectedCategory(ids);
  }, []);

  const handleCurrentLocation = useCallback(() => {
    haptics.medium();
    setIsFollowingUser(!isFollowingUser);
  }, [haptics, isFollowingUser]);

  const handleCompass = useCallback(() => {
    haptics.light();
    setCompassRotation(0);
  }, [haptics]);

  const handleFilters = useCallback(() => {
    haptics.light();
    // Open filters
  }, [haptics]);

  const handleCreateEvent = useCallback(() => {
    haptics.medium();
    // Open create event
  }, [haptics]);

  const handleJoinEvent = useCallback(() => {
    haptics.success();
    // Join event
  }, [haptics]);

  const handleSheetClose = useCallback(() => {
    setSelectedMarkerId(null);
    setSheetSnap('collapsed');
  }, []);

  const handleSheetSnapChange = useCallback((snap: 'collapsed' | 'medium' | 'expanded') => {
    haptics.selection();
    setSheetSnap(snap);
  }, [haptics]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }, style]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Home Header */}
      <HomeHeader
        userName="Alex"
        city="New York"
        notificationCount={3}
        onProfilePress={() => {}}
        onNotificationPress={() => {}}
        onLogoPress={() => {}}
      />

      {/* Search Bar */}
      <HomeSearch
        value={searchValue}
        onChangeText={setSearchValue}
        onSubmit={handleSearchSubmit}
        placeholder="Search events, places, people..."
        recentSearches={[
          { id: '1', text: 'Tech meetup', type: 'recent' },
          { id: '2', text: 'Coffee shops', type: 'recent' },
        ]}
        suggestions={[
          { id: '3', text: 'Art Gallery', type: 'suggestion', icon: '🎨' },
          { id: '4', text: 'Music Festival', type: 'suggestion', icon: '🎵' },
        ]}
      />

      {/* Filter Chips */}
      <FilterChips
        categories={SAMPLE_CATEGORIES}
        selectedIds={selectedCategory}
        onSelectionChange={handleCategoryChange}
        style={styles.filters}
      />

      {/* Map */}
      <View style={styles.mapContainer}>
        <HomeMap
          region={mapRegion}
          markers={SAMPLE_MARKERS}
          userLocation={userLocation}
          selectedMarkerId={selectedMarkerId}
          onMarkerPress={handleMarkerPress}
          showUserLocation
        />

        {/* Floating Controls */}
        <FloatingControls
          onCurrentLocation={handleCurrentLocation}
          onCompass={handleCompass}
          onFilters={handleFilters}
          onCreateEvent={handleCreateEvent}
          isFollowing={isFollowingUser}
          compassRotation={compassRotation}
          style={styles.floatingControls}
        />
      </View>

      {/* Event Preview Bottom Sheet */}
      {selectedEvent && (
        <BottomSheet
          visible={!!selectedEvent}
          onClose={handleSheetClose}
          snapPoints={{
            collapsed: 200,
            medium: SCREEN_HEIGHT * 0.5,
            expanded: SCREEN_HEIGHT * 0.85,
          }}
          style={styles.bottomSheet}
        >
          <EventPreview
            event={selectedEvent}
            onClose={handleSheetClose}
          />
        </BottomSheet>
      )}

      {/* Offline Banner */}
      <OfflineBanner
        isVisible={isOffline}
        onRetry={() => setIsOffline(false)}
        style={styles.offlineBanner}
      />

      {/* Floating Dock */}
      <FloatingDock
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreatePress={handleCreatePress}
        badgeCounts={{
          chats: 5,
          notifications: 3,
        }}
        style={styles.dock}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filters: {
    marginTop: spacing[3],
    marginBottom: spacing[2],
  },
  mapContainer: {
    flex: 1,
  },
  floatingControls: {
    top: spacing[4],
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  offlineBanner: {},
  dock: {},
});

HomeScreen.displayName = 'HomeScreen';

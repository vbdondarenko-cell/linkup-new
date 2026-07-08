/**
 * LinkUp Design System 2026
 * Discovery Screen
 */

'use client';

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ViewStyle, ScrollView, RefreshControl, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../ui/providers/theme-provider';
import { useHaptics } from '../../ui/hooks/use-haptics';
import { spacing } from '../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../ui/tokens/typography';

import { useDiscoveryState } from './hooks';
import { SearchBar, EventCard, FilterSheet } from './components';
import { CATEGORIES, SearchResult, Event } from './types';

interface DiscoveryScreenProps {
  onEventPress?: (event: Event) => void;
  onCategoryPress?: (categoryId: string) => void;
  onSearchResultPress?: (result: SearchResult) => void;
  style?: ViewStyle;
}

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  onEventPress,
  onCategoryPress,
  onSearchResultPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const {
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
    getSortedEvents,
    getFilteredEvents,
    getTrendingCategories,
  } = useDiscoveryState();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshRecommendations();
    setRefreshing(false);
  }, [refreshRecommendations]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
  }, []);

  const handleResultPress = useCallback((result: SearchResult) => {
    haptics.light();
    addRecentSearch(result.title);
    onSearchResultPress?.(result);
  }, [haptics, addRecentSearch, onSearchResultPress]);

  const handleRecentSearchPress = useCallback((query: string) => {
    setSearchQuery(query);
    search(query);
  }, [search]);

  const handleEventPress = useCallback((event: Event) => {
    haptics.light();
    onEventPress?.(event);
  }, [haptics, onEventPress]);

  const handleFavoritePress = useCallback((event: Event) => {
    if (isFavorite(event.id)) {
      removeFavorite(state.favorites.find(f => f.itemId === event.id)?.id || '');
    } else {
      addFavorite('event', event.id);
    }
  }, [isFavorite, removeFavorite, addFavorite, state.favorites]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    haptics.light();
    setFilters({ category: categoryId });
    onCategoryPress?.(categoryId);
  }, [haptics, setFilters, onCategoryPress]);

  const handleSortChange = useCallback((sortOption: string) => {
    haptics.light();
    setSortBy(sortOption as any);
  }, [haptics, setSortBy]);

  const displayEvents = state.filters.category || state.filters.distance || state.filters.price
    ? getFilteredEvents()
    : getSortedEvents();

  const trendingCategories = getTrendingCategories();

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
        stickyHeaderIndices={[1]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.background.secondary }]}>
          <Text style={[styles.greeting, { color: theme.colors.text.tertiary }]}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
          </Text>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Discover
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.background.secondary }]}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onSearch={search}
            onResultPress={handleResultPress}
            onClear={() => { clearSearch(); setSearchQuery(''); }}
            recentSearches={state.history.filter(h => h.type === 'search').slice(0, 5).map(h => h.itemTitle || '')}
            onRecentSearchPress={handleRecentSearchPress}
            onClearRecent={clearRecentSearches}
          />
        </View>

        {/* Filters & Sort */}
        <View style={[styles.filtersRow, { backgroundColor: theme.colors.background.secondary }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
            {/* Sort */}
            <Pressable
              onPress={() => { haptics.light(); handleSortChange('recommended'); }}
              style={({ pressed }) => [
                styles.sortButton,
                { backgroundColor: theme.colors.surface.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.sortIcon}>✨</Text>
              <Text style={[styles.sortText, { color: theme.colors.text.primary }]}>Recommended</Text>
              <Text style={[styles.sortArrow, { color: theme.colors.text.tertiary }]}>▼</Text>
            </Pressable>

            {/* Filter Button */}
            <Pressable
              onPress={() => { haptics.light(); setShowFilters(true); }}
              style={({ pressed }) => [
                styles.filterButton,
                { backgroundColor: theme.colors.surface.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.filterIcon}>⚙️</Text>
              <Text style={[styles.filterText, { color: theme.colors.text.primary }]}>Filters</Text>
              {Object.keys(state.filters).length > 0 && (
                <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary.DEFAULT }]}>
                  <Text style={styles.filterBadgeText}>{Object.keys(state.filters).length}</Text>
                </View>
              )}
            </Pressable>

            {/* Category Quick Filters */}
            {trendingCategories.slice(0, 3).map((category) => (
              <Pressable
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={({ pressed }) => [
                  styles.categoryChip,
                  { backgroundColor: `${category.color}15` },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.categoryChipIcon}>{category.icon}</Text>
                <Text style={[styles.categoryChipText, { color: category.color }]}>{category.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Trending Categories */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              🔥 Trending Categories
            </Text>
            <Pressable onPress={() => {}}>
              <Text style={[styles.seeAll, { color: theme.colors.primary.DEFAULT }]}>See All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {trendingCategories.map((category, index) => (
              <Animated.View key={category.id} entering={FadeInDown.delay(100 + index * 50)}>
                <Pressable
                  onPress={() => handleCategoryPress(category.id)}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    { backgroundColor: `${category.color}10`, borderColor: `${category.color}30` },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.categoryCardIcon}>{category.icon}</Text>
                  <Text style={[styles.categoryCardName, { color: category.color }]}>{category.name}</Text>
                  <Text style={[styles.categoryCardCount, { color: theme.colors.text.tertiary }]}>
                    {category.eventCount} events
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Nearby Events */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              📍 Nearby Events
            </Text>
            <Pressable onPress={() => {}}>
              <Text style={[styles.seeAll, { color: theme.colors.primary.DEFAULT }]}>See All</Text>
            </Pressable>
          </View>
          
          {displayEvents.length > 0 ? (
            <View style={styles.eventsGrid}>
              {displayEvents.slice(0, 6).map((event, index) => (
                <Animated.View 
                  key={event.id} 
                  entering={FadeInUp.delay(200 + index * 50)}
                  style={index % 2 === 0 ? styles.eventCardLeft : styles.eventCardRight}
                >
                  <EventCard
                    event={event}
                    onPress={() => handleEventPress(event)}
                    onFavoritePress={() => handleFavoritePress(event)}
                    isFavorite={isFavorite(event.id)}
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface.primary }]}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
                No nearby events
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>
                Try expanding your search radius
              </Text>
              <Pressable
                onPress={() => { haptics.light(); clearFilters(); }}
                style={[styles.emptyButton, { backgroundColor: theme.colors.primary.DEFAULT }]}
              >
                <Text style={styles.emptyButtonText}>Clear Filters</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>

        {/* Recommended For You */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              ✨ Recommended For You
            </Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedScroll}>
            {events.filter(e => e.isFeatured || e.isTrending).slice(0, 5).map((event, index) => (
              <Animated.View 
                key={event.id} 
                entering={FadeInUp.delay(300 + index * 50)}
                style={styles.recommendedCard}
              >
                <EventCard
                  event={event}
                  onPress={() => handleEventPress(event)}
                  onFavoritePress={() => handleFavoritePress(event)}
                  isFavorite={isFavorite(event.id)}
                  variant="compact"
                />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* All Categories */}
        <Animated.View entering={FadeInDown.delay(400)} style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              🏷️ All Categories
            </Text>
          </View>
          
          <View style={styles.allCategoriesGrid}>
            {CATEGORIES.map((category, index) => (
              <Animated.View 
                key={category.id}
                entering={FadeInUp.delay(400 + index * 30)}
              >
                <Pressable
                  onPress={() => handleCategoryPress(category.id)}
                  style={({ pressed }) => [
                    styles.allCategoryCard,
                    { backgroundColor: `${category.color}15` },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.allCategoryIcon}>{category.icon}</Text>
                  <Text style={[styles.allCategoryName, { color: category.color }]}>{category.name}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Sheet */}
      {showFilters && (
        <FilterSheet
          filters={state.filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[3],
  },
  greeting: {
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    marginTop: spacing[1],
  },
  searchContainer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  filtersRow: {
    paddingBottom: spacing[3],
  },
  filtersContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: spacing[1],
  },
  sortIcon: {
    fontSize: 14,
  },
  sortText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  sortArrow: {
    fontSize: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: spacing[1],
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  filterBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[1],
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: 4,
  },
  categoryChipIcon: {
    fontSize: 14,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  section: {
    paddingTop: spacing[5],
  },
  lastSection: {
    paddingBottom: spacing[5],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  categoriesScroll: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  categoryCard: {
    width: 120,
    padding: spacing[4],
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryCardIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  categoryCardName: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  categoryCardCount: {
    fontSize: 11,
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  eventCardLeft: {
    width: '48%',
  },
  eventCardRight: {
    width: '48%',
  },
  emptyState: {
    marginHorizontal: spacing[5],
    padding: spacing[6],
    borderRadius: 20,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  emptyButton: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  recommendedScroll: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  recommendedCard: {
    width: 280,
  },
  allCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  allCategoryCard: {
    width: '31%',
    padding: spacing[3],
    borderRadius: 12,
    alignItems: 'center',
  },
  allCategoryIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  allCategoryName: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

DiscoveryScreen.displayName = 'DiscoveryScreen';

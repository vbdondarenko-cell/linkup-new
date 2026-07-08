/**
 * LinkUp Design System 2026
 * Organizer - Event Management Screen
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { Chip } from '../../../ui/components/chips';
import { EventCard } from '../components';
import { ManagedEvent, EventManagementStatus } from '../types';

interface EventManagementScreenProps {
  events: ManagedEvent[];
  onEventPress?: (event: ManagedEvent) => void;
  onEventEdit?: (event: ManagedEvent) => void;
  onEventDuplicate?: (event: ManagedEvent) => void;
  onEventPublish?: (event: ManagedEvent) => void;
  onEventArchive?: (event: ManagedEvent) => void;
  onEventDelete?: (event: ManagedEvent) => void;
  onCreateEvent?: () => void;
  style?: ViewStyle;
}

const STATUS_FILTERS: Array<{ key: EventManagementStatus | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'published', label: 'Published' },
  { key: 'ongoing', label: 'Live' },
  { key: 'completed', label: 'Completed' },
  { key: 'archived', label: 'Archived' },
];

export const EventManagementScreen: React.FC<EventManagementScreenProps> = ({
  events,
  onEventPress,
  onEventEdit,
  onEventDuplicate,
  onEventPublish,
  onEventArchive,
  onEventDelete,
  onCreateEvent,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [selectedFilter, setSelectedFilter] = useState<EventManagementStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    let result = events;
    
    if (selectedFilter !== 'all') {
      result = result.filter(e => e.status === selectedFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
      );
    }
    
    return result.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, [events, selectedFilter, searchQuery]);

  const handleFilterPress = useCallback((filter: EventManagementStatus | 'all') => {
    haptics.light();
    setSelectedFilter(filter);
  }, [haptics]);

  const getCountForFilter = (filter: EventManagementStatus | 'all') => {
    if (filter === 'all') return events.length;
    return events.filter(e => e.status === filter).length;
  };

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Events
        </Text>
        <Button
          variant="primary"
          size="sm"
          onPress={() => { haptics.light(); onCreateEvent?.(); }}
        >
          Create Event
        </Button>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={[styles.searchInput, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchText, { color: theme.colors.text.primary }]}
            placeholder="Search events..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearIcon, { color: theme.colors.text.tertiary }]}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {STATUS_FILTERS.map((filter) => (
          <Animated.View
            key={filter.key}
            entering={FadeInDown.delay(100)}
            layout={Layout.springify()}
          >
            <Chip
              label={`${filter.label} (${getCountForFilter(filter.key)})`}
              variant={selectedFilter === filter.key ? 'filled' : 'outline'}
              onPress={() => handleFilterPress(filter.key)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* Events List */}
      <ScrollView
        style={styles.eventsList}
        contentContainerStyle={styles.eventsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              No Events Found
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Create your first event to get started'}
            </Text>
            {!searchQuery && (
              <Button
                variant="primary"
                onPress={() => { haptics.light(); onCreateEvent?.(); }}
                style={styles.emptyButton}
              >
                Create Event
              </Button>
            )}
          </Animated.View>
        ) : (
          filteredEvents.map((event, index) => (
            <Animated.View
              key={event.id}
              entering={FadeInDown.delay(index * 50)}
              layout={Layout.springify()}
            >
              <EventCard
                event={event}
                onPress={() => { haptics.light(); onEventPress?.(event); }}
                onEdit={() => { haptics.light(); onEventEdit?.(event); }}
                onDuplicate={() => { haptics.light(); onEventDuplicate?.(event); }}
                onPublish={() => { haptics.light(); onEventPublish?.(event); }}
                onArchive={() => { haptics.light(); onEventArchive?.(event); }}
                onDelete={() => { haptics.light(); onEventDelete?.(event); }}
                onViewParticipants={() => { haptics.light(); onEventPress?.(event); }}
                delay={0}
              />
            </Animated.View>
          ))
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    paddingTop: spacing[6],
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  searchContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    padding: spacing[1],
  },
  filtersContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[5],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  emptyButton: {
    paddingHorizontal: spacing[6],
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

EventManagementScreen.displayName = 'EventManagementScreen';

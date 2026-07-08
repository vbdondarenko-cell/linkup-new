/**
 * LinkUp Design System 2026
 * Organizer - Join Requests Screen
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Chip } from '../../../ui/components/chips';
import { Button } from '../../../ui/components/buttons';
import { RequestCard } from '../components';
import { JoinRequest } from '../types';

interface RequestsScreenProps {
  requests: JoinRequest[];
  onAccept?: (request: JoinRequest) => void;
  onDecline?: (request: JoinRequest) => void;
  onViewProfile?: (request: JoinRequest) => void;
  style?: ViewStyle;
}

type RequestFilter = 'all' | 'pending' | 'accepted' | 'declined' | 'expired';

export const RequestsScreen: React.FC<RequestsScreenProps> = ({
  requests,
  onAccept,
  onDecline,
  onViewProfile,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [selectedFilter, setSelectedFilter] = useState<RequestFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    let result = requests;
    
    if (selectedFilter !== 'all') {
      result = result.filter(r => r.status === selectedFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.displayName.toLowerCase().includes(query) ||
        r.eventTitle.toLowerCase().includes(query)
      );
    }
    
    return result.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
  }, [requests, selectedFilter, searchQuery]);

  const handleFilterPress = useCallback((filter: RequestFilter) => {
    haptics.light();
    setSelectedFilter(filter);
  }, [haptics]);

  const getCountForFilter = (filter: RequestFilter) => {
    if (filter === 'all') return requests.length;
    return requests.filter(r => r.status === filter).length;
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const handleBulkAccept = useCallback(() => {
    haptics.medium();
    const pending = requests.filter(r => r.status === 'pending');
    pending.forEach(r => onAccept?.(r));
  }, [requests, onAccept, haptics]);

  const handleBulkDecline = useCallback(() => {
    haptics.medium();
    const pending = requests.filter(r => r.status === 'pending');
    pending.forEach(r => onDecline?.(r));
  }, [requests, onDecline, haptics]);

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <View>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Requests
          </Text>
          {pendingCount > 0 && (
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              {pendingCount} pending review
            </Text>
          )}
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={[styles.searchInput, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchText, { color: theme.colors.text.primary }]}
            placeholder="Search by name or event..."
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
        {(['all', 'pending', 'accepted', 'declined', 'expired'] as RequestFilter[]).map((filter) => (
          <Animated.View
            key={filter}
            entering={FadeInDown.delay(100)}
            layout={Layout.springify()}
          >
            <Chip
              label={`${filter.charAt(0).toUpperCase() + filter.slice(1)} (${getCountForFilter(filter)})`}
              variant={selectedFilter === filter ? 'filled' : 'outline'}
              onPress={() => handleFilterPress(filter)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* Bulk Actions */}
      {selectedFilter === 'pending' && pendingCount > 1 && (
        <Animated.View 
          entering={FadeIn}
          style={[styles.bulkActions, { backgroundColor: theme.colors.surface.primary }]}
        >
          <Text style={[styles.bulkText, { color: theme.colors.text.secondary }]}>
            {pendingCount} requests selected
          </Text>
          <View style={styles.bulkButtons}>
            <Button
              variant="secondary"
              size="sm"
              onPress={handleBulkDecline}
            >
              Decline All
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={handleBulkAccept}
            >
              Accept All
            </Button>
          </View>
        </Animated.View>
      )}

      {/* Requests List */}
      <ScrollView
        style={styles.requestsList}
        contentContainerStyle={styles.requestsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRequests.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              No Requests Found
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              {searchQuery 
                ? 'Try adjusting your search or filters'
                : 'Join requests will appear here'}
            </Text>
          </Animated.View>
        ) : (
          filteredRequests.map((request, index) => (
            <Animated.View
              key={request.id}
              entering={FadeInDown.delay(index * 50)}
              layout={Layout.springify()}
            >
              <RequestCard
                request={request}
                onAccept={() => onAccept?.(request)}
                onDecline={() => onDecline?.(request)}
                onViewProfile={() => onViewProfile?.(request)}
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
    padding: spacing[5],
    paddingTop: spacing[6],
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
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
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing[5],
    marginBottom: spacing[4],
    padding: spacing[3],
    borderRadius: 12,
  },
  bulkText: {
    fontSize: 13,
  },
  bulkButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  requestsList: {
    flex: 1,
  },
  requestsContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
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
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

RequestsScreen.displayName = 'RequestsScreen';

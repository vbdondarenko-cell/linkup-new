/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Event Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { ManagedEvent, EventManagementStatus } from '../types';
import { Button } from '../../../ui/components/buttons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EventCardProps {
  event: ManagedEvent;
  onPress?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onPublish?: () => void;
  onPause?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onViewParticipants?: () => void;
  delay?: number;
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<EventManagementStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#64748B', bg: '#64748B20' },
  published: { label: 'Published', color: '#10B981', bg: '#10B98120' },
  ongoing: { label: 'Live', color: '#3B82F6', bg: '#3B82F620' },
  completed: { label: 'Completed', color: '#8B5CF6', bg: '#8B5CF620' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#EF444420' },
  archived: { label: 'Archived', color: '#9CA3AF', bg: '#9CA3AF20' },
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onEdit,
  onDuplicate,
  onPublish,
  onPause,
  onArchive,
  onDelete,
  onShare,
  onViewParticipants,
  delay = 0,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const statusConfig = STATUS_CONFIG[event.status];
  const spotsLeft = event.maxParticipants ? event.maxParticipants - event.currentParticipants : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      entering={FadeInRight.delay(delay).springify()}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.lg,
        },
        animatedStyle,
        style,
      ]}
    >
      {/* Cover Image */}
      {event.coverImageUrl && (
        <Image
          source={{ uri: event.coverImageUrl }}
          style={[styles.coverImage, { borderTopLeftRadius: theme.radius.component.lg, borderTopRightRadius: theme.radius.component.lg }]}
          resizeMode="cover"
        />
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Header Row */}
        <View style={styles.header}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          {event.isPremium && (
            <Text style={styles.premiumIcon}>⭐</Text>
          )}
          {event.isFeatured && (
            <Text style={styles.featuredIcon}>✨</Text>
          )}
        </View>

        {/* Title */}
        <Text 
          style={[styles.title, { color: theme.colors.text.primary }]}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        {/* Meta Info */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>
              {formatDate(event.startDate)}
            </Text>
          </View>
          
          {event.location && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={[styles.metaText, { color: theme.colors.text.secondary }]} numberOfLines={1}>
                {event.location.name}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
              {event.currentParticipants}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
              / {event.maxParticipants || '∞'}
            </Text>
          </View>

          {event.pendingRequests > 0 && (
            <View style={[styles.requestsBadge, { backgroundColor: '#F59E0B20' }]}>
              <Text style={[styles.requestsText, { color: '#F59E0B' }]}>
                {event.pendingRequests} pending
              </Text>
            </View>
          )}

          {isFull && (
            <View style={[styles.fullBadge, { backgroundColor: '#EF444420' }]}>
              <Text style={[styles.fullText, { color: '#EF4444' }]}>
                Full
              </Text>
            </View>
          )}

          {event.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={[styles.ratingValue, { color: theme.colors.text.primary }]}>
                {event.rating.toFixed(1)}
              </Text>
              {event.ratingCount && (
                <Text style={[styles.ratingCount, { color: theme.colors.text.tertiary }]}>
                  ({event.ratingCount})
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            variant="tertiary"
            size="sm"
            onPress={() => { haptics.light(); onEdit?.(); }}
          >
            Edit
          </Button>
          
          <Button
            variant="tertiary"
            size="sm"
            onPress={() => { haptics.light(); onDuplicate?.(); }}
          >
            Duplicate
          </Button>
          
          <Button
            variant="tertiary"
            size="sm"
            onPress={() => { haptics.light(); onViewParticipants?.(); }}
          >
            Participants
          </Button>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
  },
  premiumIcon: {
    fontSize: 14,
  },
  featuredIcon: {
    fontSize: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
    marginBottom: spacing[2],
  },
  meta: {
    marginBottom: spacing[3],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  metaIcon: {
    fontSize: 14,
    marginRight: spacing[2],
  },
  metaText: {
    fontSize: 13,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 13,
  },
  requestsBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  requestsText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  fullBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  fullText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 2,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing[3],
  },
});

EventCard.displayName = 'EventCard';

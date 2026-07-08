/**
 * LinkUp Design System 2026
 * Business Dashboard - Official Event Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { OfficialEvent, OfficialEventStatus } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OfficialEventCardProps {
  event: OfficialEvent;
  onPress?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onPublish?: () => void;
  onCancel?: () => void;
  onViewParticipants?: () => void;
  onViewAnalytics?: () => void;
  delay?: number;
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<OfficialEventStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#64748B', bg: '#64748B20' },
  published: { label: 'Published', color: '#10B981', bg: '#10B98120' },
  ongoing: { label: 'Live', color: '#3B82F6', bg: '#3B82F620' },
  completed: { label: 'Completed', color: '#8B5CF6', bg: '#8B5CF620' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#EF444420' },
  archived: { label: 'Archived', color: '#9CA3AF', bg: '#9CA3AF20' },
};

export const OfficialEventCard: React.FC<OfficialEventCardProps> = ({
  event,
  onPress,
  onEdit,
  onDuplicate,
  onPublish,
  onCancel,
  onViewParticipants,
  onViewAnalytics,
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
  const attendancePercent = event.maxParticipants 
    ? Math.round((event.currentParticipants / event.maxParticipants) * 100) 
    : 0;

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
        { backgroundColor: theme.colors.surface.primary, borderRadius: theme.radius.component.lg },
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
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          {event.isFeatured && <Text style={styles.featuredIcon}>★</Text>}
          {event.isPremium && <Text style={styles.premiumIcon}>⭐</Text>}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text.primary }]} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Date & Location */}
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

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
              {event.currentParticipants}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
              / {event.maxParticipants || '∞'}
            </Text>
          </View>

          {/* Attendance Progress */}
          {event.maxParticipants && (
            <View style={styles.attendanceContainer}>
              <View style={[styles.attendanceTrack, { backgroundColor: theme.colors.surface.secondary }]}>
                <View 
                  style={[
                    styles.attendanceFill, 
                    { width: `${attendancePercent}%`, backgroundColor: attendancePercent > 90 ? '#EF4444' : attendancePercent > 70 ? '#F59E0B' : '#10B981' }
                  ]} 
                />
              </View>
              <Text style={[styles.attendanceText, { color: theme.colors.text.tertiary }]}>
                {attendancePercent}%
              </Text>
            </View>
          )}

          {event.pendingRequests > 0 && (
            <View style={[styles.requestsBadge, { backgroundColor: '#F59E0B20' }]}>
              <Text style={[styles.requestsText, { color: '#F59E0B' }]}>
                {event.pendingRequests} pending
              </Text>
            </View>
          )}
        </View>

        {/* Secondary Stats */}
        <View style={styles.secondaryStats}>
          <View style={styles.secondaryStat}>
            <Text style={styles.secondaryIcon}>👁️</Text>
            <Text style={[styles.secondaryValue, { color: theme.colors.text.secondary }]}>
              {event.views} views
            </Text>
          </View>
          
          {event.rating && (
            <View style={styles.secondaryStat}>
              <Text style={styles.secondaryIcon}>⭐</Text>
              <Text style={[styles.secondaryValue, { color: theme.colors.text.secondary }]}>
                {event.rating.toFixed(1)} ({event.ratingCount})
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => { haptics.light(); onEdit?.(); }}
            style={[styles.actionButton, { backgroundColor: theme.colors.surface.secondary }]}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={[styles.actionText, { color: theme.colors.text.primary }]}>Edit</Text>
          </Pressable>
          
          <Pressable
            onPress={() => { haptics.light(); onViewParticipants?.(); }}
            style={[styles.actionButton, { backgroundColor: theme.colors.surface.secondary }]}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={[styles.actionText, { color: theme.colors.text.primary }]}>Guests</Text>
          </Pressable>
          
          <Pressable
            onPress={() => { haptics.light(); onViewAnalytics?.(); }}
            style={[styles.actionButton, { backgroundColor: theme.colors.surface.secondary }]}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={[styles.actionText, { color: theme.colors.text.primary }]}>Stats</Text>
          </Pressable>
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
  featuredIcon: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  premiumIcon: {
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
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 13,
    marginLeft: 2,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  attendanceTrack: {
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  attendanceFill: {
    height: '100%',
    borderRadius: 3,
  },
  attendanceText: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
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
  secondaryStats: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[3],
  },
  secondaryStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  secondaryValue: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing[3],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[2],
    borderRadius: 8,
    gap: 4,
  },
  actionIcon: {
    fontSize: 14,
  },
  actionText: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
});

OfficialEventCard.displayName = 'OfficialEventCard';

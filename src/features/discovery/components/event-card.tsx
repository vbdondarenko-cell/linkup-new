/**
 * LinkUp Design System 2026
 * Discovery - Event Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Event } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  style?: ViewStyle;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onFavoritePress,
  isFavorite = false,
  variant = 'default',
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  const handleFavorite = () => {
    haptics.light();
    onFavoritePress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const spotsLeft = event.maxParticipants ? event.maxParticipants - event.currentParticipants : 0;
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;

  if (variant === 'compact') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.compactContainer, { backgroundColor: theme.colors.surface.primary }, animatedStyle, style]}
      >
        {event.coverImageUrl && (
          <Image source={{ uri: event.coverImageUrl }} style={styles.compactImage} />
        )}
        <View style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: `${event.categoryInfo?.color || '#6366F1'}15` }]}>
              <Text style={styles.categoryIcon}>{event.categoryInfo?.icon}</Text>
            </View>
            {event.isTrending && (
              <View style={[styles.trendingBadge, { backgroundColor: '#EF444415' }]}>
                <Text style={styles.trendingText}>🔥</Text>
              </View>
            )}
          </View>
          <Text style={[styles.compactTitle, { color: theme.colors.text.primary }]} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={[styles.compactDate, { color: theme.colors.text.tertiary }]}>
            {formatDate(event.startDate)} · {formatTime(event.startDate)}
          </Text>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, { backgroundColor: theme.colors.surface.primary }, animatedStyle, style]}
    >
      {/* Cover Image */}
      <View style={styles.imageContainer}>
        {event.coverImageUrl ? (
          <Image source={{ uri: event.coverImageUrl }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverPlaceholder, { backgroundColor: event.categoryInfo?.color || theme.colors.primary.DEFAULT }]}>
            <Text style={styles.placeholderIcon}>{event.categoryInfo?.icon}</Text>
          </View>
        )}
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {event.isFeatured && (
            <View style={[styles.badge, { backgroundColor: '#FFD700' }]}>
              <Text style={styles.badgeIcon}>⭐</Text>
              <Text style={[styles.badgeText, { color: '#000' }]}>Featured</Text>
            </View>
          )}
          {event.isTrending && (
            <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.badgeIcon}>🔥</Text>
              <Text style={[styles.badgeText, { color: '#FFF' }]}>Trending</Text>
            </View>
          )}
          {event.isPremium && (
            <View style={[styles.badge, { backgroundColor: '#FFD700' }]}>
              <Text style={styles.badgeIcon}>✨</Text>
              <Text style={[styles.badgeText, { color: '#000' }]}>Premium</Text>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        {onFavoritePress && (
          <Pressable onPress={handleFavorite} style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
        )}

        {/* Price Badge */}
        <View style={[styles.priceBadge, { backgroundColor: event.isFree ? '#10B981' : theme.colors.primary.DEFAULT }]}>
          <Text style={styles.priceText}>{event.isFree ? 'Free' : `$${event.price}`}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        <View style={styles.categoryRow}>
          <View style={[styles.categoryBadge, { backgroundColor: `${event.categoryInfo?.color || '#6366F1'}15` }]}>
            <Text style={styles.categoryIcon}>{event.categoryInfo?.icon}</Text>
            <Text style={[styles.categoryName, { color: event.categoryInfo?.color || theme.colors.primary.DEFAULT }]}>
              {event.categoryInfo?.name}
            </Text>
          </View>
          {event.distance && (
            <Text style={[styles.distance, { color: theme.colors.text.tertiary }]}>
              📍 {event.distance.toFixed(1)}km
            </Text>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text.primary }]} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Date & Time */}
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={[styles.dateText, { color: theme.colors.text.secondary }]}>
              {formatDate(event.startDate)}
            </Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateIcon}>⏰</Text>
            <Text style={[styles.dateText, { color: theme.colors.text.secondary }]}>
              {formatTime(event.startDate)}
            </Text>
          </View>
        </View>

        {/* Location */}
        {event.location && (
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={[styles.locationText, { color: theme.colors.text.tertiary }]} numberOfLines={1}>
              {event.location.name}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {/* Organizer */}
          <View style={styles.organizerRow}>
            <Image source={{ uri: event.organizer.avatarUrl }} style={styles.organizerAvatar} />
            <Text style={[styles.organizerName, { color: theme.colors.text.secondary }]} numberOfLines={1}>
              {event.organizer.name}
            </Text>
            {event.organizer.trustScore >= 90 && (
              <Text style={styles.verifiedIcon}>✓</Text>
            )}
          </View>

          {/* Participants */}
          <View style={styles.participantsRow}>
            {isAlmostFull && (
              <Text style={[styles.spotsLeft, { color: '#EF4444' }]}>
                {spotsLeft} spots left!
              </Text>
            )}
            <Text style={[styles.participants, { color: theme.colors.text.tertiary }]}>
              👥 {event.currentParticipants}{event.maxParticipants ? `/${event.maxParticipants}` : ''}
            </Text>
            {event.rating && (
              <Text style={[styles.rating, { color: theme.colors.text.tertiary }]}>
                ⭐ {event.rating.toFixed(1)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  compactContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  compactImage: {
    width: 100,
    height: 100,
  },
  compactContent: {
    flex: 1,
    padding: spacing[3],
    justifyContent: 'center',
  },
  compactHeader: {
    flexDirection: 'row',
    marginBottom: spacing[1],
    gap: spacing[1],
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  compactDate: {
    fontSize: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
  },
  badgesContainer: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    flexDirection: 'row',
    gap: spacing[1],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
    gap: 4,
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  priceBadge: {
    position: 'absolute',
    bottom: spacing[3],
    right: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: fontWeight.bold,
  },
  content: {
    padding: spacing[4],
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  trendingBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingText: {
    fontSize: 12,
  },
  distance: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[2],
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: spacing[2],
    gap: spacing[4],
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  dateIcon: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 13,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  locationIcon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  locationText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: spacing[3],
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing[2],
  },
  organizerName: {
    fontSize: 13,
    flex: 1,
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: fontWeight.bold,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  spotsLeft: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  participants: {
    fontSize: 13,
  },
  rating: {
    fontSize: 13,
  },
});

EventCard.displayName = 'EventCard';

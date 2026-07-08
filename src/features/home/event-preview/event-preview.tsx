/**
 * LinkUp Design System 2026
 * Event Preview - Bottom sheet content for selected events
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../ui/providers/theme-provider';
import { useHaptics } from '../../ui/hooks/use-haptics';
import { spacing } from '../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../ui/tokens/typography';
import { Avatar } from '../../ui/components/avatars';
import { Badge, StatusBadge } from '../../ui/components/badges';
import { Button } from '../../ui/components/buttons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EventPreviewData {
  id: string;
  title: string;
  imageUrl?: string;
  organizerName: string;
  organizerAvatar?: string;
  organizerIsVerified?: boolean;
  distance?: string;
  date: string;
  time: string;
  participantCount?: number;
  maxParticipants?: number;
  trustScore?: number;
  isPremium?: boolean;
  isOrganizer?: boolean;
  isBusiness?: boolean;
  category?: string;
  onJoin?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onReport?: () => void;
}

interface EventPreviewProps {
  event: EventPreviewData;
  onClose?: () => void;
  style?: ViewStyle;
}

export const EventPreview: React.FC<EventPreviewProps> = ({
  event,
  onClose,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleJoin = useCallback(() => {
    haptics.success();
    event.onJoin?.();
  }, [haptics, event]);

  const handleFavorite = useCallback(() => {
    haptics.medium();
    event.onFavorite?.();
  }, [haptics, event]);

  const handleShare = useCallback(() => {
    haptics.light();
    event.onShare?.();
  }, [haptics, event]);

  const handleClose = useCallback(() => {
    haptics.light();
    onClose?.();
  }, [haptics, onClose]);

  // Calculate availability
  const availability = useMemo(() => {
    if (!event.participantCount || !event.maxParticipants) return null;
    const remaining = event.maxParticipants - event.participantCount;
    const percentage = (event.participantCount / event.maxParticipants) * 100;
    return { remaining, percentage };
  }, [event.participantCount, event.maxParticipants]);

  return (
    <View style={[styles.container, style]}>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        {event.imageUrl ? (
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: theme.colors.surface.secondary },
            ]}
          >
            <Text style={styles.placeholderIcon}>📅</Text>
          </View>
        )}

        {/* Category Badge */}
        {event.category && (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: theme.colors.surface.primary },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {event.category}
            </Text>
          </View>
        )}

        {/* Premium Badge */}
        {event.isPremium && (
          <View
            style={[
              styles.premiumBadge,
              { backgroundColor: theme.colors.premium.gold.DEFAULT },
            ]}
          >
            <Text style={styles.premiumText}>⭐ Premium</Text>
          </View>
        )}

        {/* Close Button */}
        <Pressable
          onPress={handleClose}
          style={[
            styles.closeButton,
            { backgroundColor: theme.colors.surface.primary },
          ]}
        >
          <Text style={{ fontSize: 18, color: theme.colors.text.primary }}>
            ×
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              fontSize: parseInt(fontSize.title.md as string, 10),
              fontWeight: fontWeight.semibold,
              color: theme.colors.text.primary,
            },
          ]}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        {/* Organizer Row */}
        <Pressable style={styles.organizerRow}>
          <Avatar
            src={event.organizerAvatar}
            name={event.organizerName}
            size="sm"
            status={event.organizerIsVerified ? 'verified' : undefined}
          />
          <View style={styles.organizerInfo}>
            <View style={styles.organizerNameRow}>
              <Text
                style={[
                  styles.organizerName,
                  { color: theme.colors.text.primary },
                ]}
              >
                {event.organizerName}
              </Text>
              {event.isOrganizer && (
                <View
                  style={[
                    styles.badgeContainer,
                    { backgroundColor: theme.colors.organizer.bg },
                  ]}
                >
                  <Text style={styles.badgeText}>🎯 Organizer</Text>
                </View>
              )}
              {event.isBusiness && (
                <View
                  style={[
                    styles.badgeContainer,
                    { backgroundColor: theme.colors.business.bg },
                  ]}
                >
                  <Text style={styles.badgeText}>🏢 Business</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          {/* Date & Time */}
          <View style={styles.detail}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text
              style={[
                styles.detailText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {event.date} • {event.time}
            </Text>
          </View>

          {/* Distance */}
          {event.distance && (
            <View style={styles.detail}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {event.distance}
              </Text>
            </View>
          )}
        </View>

        {/* Participants & Trust */}
        <View style={styles.statsRow}>
          {event.participantCount !== undefined && (
            <View style={styles.stat}>
              <Text style={styles.statIcon}>👥</Text>
              <Text
                style={[
                  styles.statText,
                  { color: theme.colors.text.primary },
                ]}
              >
                {event.participantCount}
                {event.maxParticipants && `/${event.maxParticipants}`}
              </Text>
            </View>
          )}

          {event.trustScore !== undefined && (
            <View style={styles.stat}>
              <Text style={styles.statIcon}>🛡️</Text>
              <Text
                style={[
                  styles.statText,
                  {
                    color:
                      event.trustScore >= 80
                        ? theme.colors.status.success.DEFAULT
                        : event.trustScore >= 50
                        ? theme.colors.status.warning.DEFAULT
                        : theme.colors.status.danger.DEFAULT,
                  },
                ]}
              >
                {event.trustScore}% Trust
              </Text>
            </View>
          )}
        </View>

        {/* Availability Bar */}
        {availability && (
          <View style={styles.availabilityContainer}>
            <View
              style={[
                styles.availabilityTrack,
                { backgroundColor: theme.colors.surface.tertiary },
              ]}
            >
              <View
                style={[
                  styles.availabilityFill,
                  {
                    width: `${availability.percentage}%`,
                    backgroundColor:
                      availability.percentage >= 90
                        ? theme.colors.status.danger.DEFAULT
                        : availability.percentage >= 70
                        ? theme.colors.status.warning.DEFAULT
                        : theme.colors.status.success.DEFAULT,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.availabilityText,
                { color: theme.colors.text.tertiary },
              ]}
            >
              {availability.remaining} spots left
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {/* Join Button */}
          <Button
            variant="primary"
            size="lg"
            onPress={handleJoin}
            style={styles.joinButton}
          >
            Join Event
          </Button>

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <Pressable
              onPress={handleFavorite}
              style={[
                styles.secondaryButton,
                { backgroundColor: theme.colors.surface.secondary },
              ]}
            >
              <Text style={styles.secondaryIcon}>❤️</Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={[
                styles.secondaryButton,
                { backgroundColor: theme.colors.surface.secondary },
              ]}
            >
              <Text style={styles.secondaryIcon}>📤</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

// Compact Preview for collapsed state
interface CompactEventPreviewProps {
  title: string;
  distance?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const CompactEventPreview: React.FC<CompactEventPreviewProps> = ({
  title,
  distance,
  onPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.compactContainer,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.compactTitle,
          { color: theme.colors.text.primary },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {distance && (
        <Text
          style={[
            styles.compactDistance,
            { color: theme.colors.text.secondary },
          ]}
        >
          📍 {distance}
        </Text>
      )}
      <Text style={styles.compactChevron}>›</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    opacity: 0.5,
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    bottom: spacing[3],
    right: spacing[3],
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing[4],
    marginTop: -24,
  },
  title: {
    marginBottom: spacing[3],
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  organizerInfo: {
    flex: 1,
    marginLeft: spacing[2],
  },
  organizerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  organizerName: {
    fontSize: 15,
    fontWeight: '500',
  },
  badgeContainer: {
    paddingHorizontal: spacing[1],
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[3],
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  detailText: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[3],
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
  },
  availabilityContainer: {
    marginBottom: spacing[4],
  },
  availabilityTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[1],
  },
  availabilityFill: {
    height: '100%',
    borderRadius: 2,
  },
  availabilityText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  joinButton: {
    flex: 1,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryIcon: {
    fontSize: 20,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compactTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  compactDistance: {
    fontSize: 13,
    marginRight: spacing[2],
  },
  compactChevron: {
    fontSize: 20,
    color: '#999',
  },
});

EventPreview.displayName = 'EventPreview';
CompactEventPreview.displayName = 'CompactEventPreview';

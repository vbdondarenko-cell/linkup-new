/**
 * LinkUp Design System 2026
 * Event Card - Reusable card for displaying events
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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar, AvatarGroup } from '../../../ui/components/avatars';
import { Badge } from '../../../ui/components/badges';
import { Chip } from '../../../ui/components/chips';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type EventCardSize = 'sm' | 'md' | 'lg';
export type EventCardVariant = 'standard' | 'compact' | 'horizontal' | 'featured';

interface EventCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  category?: string;
  date: string;
  time: string;
  location?: string;
  distance?: string;
  organizerName: string;
  organizerAvatar?: string;
  participantCount?: number;
  maxParticipants?: number;
  trustScore?: number;
  isPremium?: boolean;
  isOrganizer?: boolean;
  isBusiness?: boolean;
  isFavorite?: boolean;
  size?: EventCardSize;
  variant?: EventCardVariant;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onOrganizerPress?: () => void;
  style?: ViewStyle;
}

// Get image height based on size
const getImageHeight = (size: EventCardSize, variant: EventCardVariant): number => {
  if (variant === 'horizontal') return 100;
  switch (size) {
    case 'sm': return 120;
    case 'lg': return 200;
    default: return 160;
  }
};

// Get card width based on variant
const getCardWidth = (variant: EventCardVariant): number | string => {
  switch (variant) {
    case 'horizontal': return '100%';
    case 'featured': return 320;
    default: return '100%';
  }
};

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  imageUrl,
  category,
  date,
  time,
  location,
  distance,
  organizerName,
  organizerAvatar,
  participantCount,
  maxParticipants,
  trustScore,
  isPremium = false,
  isOrganizer = false,
  isBusiness = false,
  isFavorite = false,
  size = 'md',
  variant = 'standard',
  onPress,
  onFavoritePress,
  onOrganizerPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);

  const imageHeight = getImageHeight(size, variant);
  const cardWidth = getCardWidth(variant);

  // Calculate availability
  const availability = useMemo(() => {
    if (!participantCount || !maxParticipants) return null;
    const percentage = (participantCount / maxParticipants) * 100;
    const spotsLeft = maxParticipants - participantCount;
    return { percentage, spotsLeft };
  }, [participantCount, maxParticipants]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    haptics.light();
    onPress?.();
  }, [haptics, onPress]);

  const handleFavorite = useCallback((e: any) => {
    e.stopPropagation?.();
    haptics.medium();
    onFavoritePress?.();
  }, [haptics, onFavoritePress]);

  const handleOrganizerPress = useCallback((e: any) => {
    e.stopPropagation?.();
    onOrganizerPress?.();
  }, [onOrganizerPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isHorizontal = variant === 'horizontal';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          width: cardWidth,
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        },
        isHorizontal && styles.horizontalContainer,
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Event: ${title}`}
    >
      {/* Image */}
      <View
        style={[
          styles.imageContainer,
          {
            height: imageHeight,
            borderTopLeftRadius: theme.radius.component.card,
            borderTopRightRadius: theme.radius.component.card,
          },
          isHorizontal && {
            width: imageHeight + 40,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: theme.radius.component.card,
          },
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
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

        {/* Badges */}
        <View style={styles.badges}>
          {category && (
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
                {category}
              </Text>
            </View>
          )}
          {isPremium && (
            <View
              style={[
                styles.premiumBadge,
                { backgroundColor: theme.colors.premium.gold.DEFAULT },
              ]}
            >
              <Text style={styles.premiumText}>⭐</Text>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        {onFavoritePress && (
          <Pressable
            onPress={handleFavorite}
            style={[
              styles.favoriteButton,
              { backgroundColor: theme.colors.surface.primary },
            ]}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <View
        style={[
          styles.content,
          isHorizontal && styles.horizontalContent,
        ]}
      >
        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              fontSize:
                size === 'sm' ? 15 : size === 'lg' ? 20 : 17,
              fontWeight: fontWeight.semibold,
              color: theme.colors.text.primary,
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* Date & Time */}
        <View style={styles.row}>
          <Text style={styles.icon}>📅</Text>
          <Text
            style={[
              styles.detailText,
              { color: theme.colors.text.secondary },
            ]}
          >
            {date} • {time}
          </Text>
        </View>

        {/* Location & Distance */}
        {(location || distance) && (
          <View style={styles.row}>
            <Text style={styles.icon}>📍</Text>
            <Text
              style={[
                styles.detailText,
                { color: theme.colors.text.secondary },
              ]}
              numberOfLines={1}
            >
              {location}
              {distance && ` • ${distance}`}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {/* Organizer */}
          <Pressable
            onPress={handleOrganizerPress}
            style={styles.organizer}
          >
            <Avatar
              src={organizerAvatar}
              name={organizerName}
              size="xs"
              status={isOrganizer ? 'organizer' : isBusiness ? 'business' : undefined}
            />
            <Text
              style={[
                styles.organizerName,
                { color: theme.colors.text.tertiary },
              ]}
              numberOfLines={1}
            >
              {organizerName}
            </Text>
          </Pressable>

          {/* Participants */}
          {participantCount !== undefined && (
            <View style={styles.participants}>
              <Text style={styles.icon}>👥</Text>
              <Text
                style={[
                  styles.participantText,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                {participantCount}
                {maxParticipants && `/${maxParticipants}`}
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
                styles.spotsText,
                { color: theme.colors.text.tertiary },
              ]}
            >
              {availability.spotsLeft} spots left
            </Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
};

// Featured Event Card - larger variant with more details
interface FeaturedEventCardProps extends EventCardProps {
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({
  ...props
}) => {
  const theme = useTheme();

  return (
    <EventCard
      {...props}
      variant="featured"
      size="lg"
      style={styles.featuredCard}
    />
  );
};

// Compact Event Card - minimal info
interface CompactEventCardProps extends EventCardProps {}

export const CompactEventCard: React.FC<CompactEventCardProps> = ({
  ...props
}) => {
  return <EventCard {...props} variant="compact" size="sm" />;
};

// Event Card Grid
interface EventCardGridProps {
  events: EventCardProps[];
  columns?: number;
  onEventPress?: (eventId: string) => void;
  onFavoritePress?: (eventId: string) => void;
}

export const EventCardGrid: React.FC<EventCardGridProps> = ({
  events,
  columns = 2,
  onEventPress,
  onFavoritePress,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.grid,
        { gap: spacing[3] },
      ]}
    >
      {events.map((event, index) => (
        <Animated.View
          key={event.id}
          entering={FadeIn.delay(index * 50)}
          style={[
            styles.gridItem,
            { width: `${100 / columns - 2}%` },
          ]}
        >
          <EventCard
            {...event}
            onPress={() => onEventPress?.(event.id)}
            onFavoritePress={() => onFavoritePress?.(event.id)}
          />
        </Animated.View>
      ))}
    </View>
  );
};

// Event Card List
interface EventCardListProps {
  events: EventCardProps[];
  onEventPress?: (eventId: string) => void;
  onFavoritePress?: (eventId: string) => void;
}

export const EventCardList: React.FC<EventCardListProps> = ({
  events,
  onEventPress,
  onFavoritePress,
}) => {
  return (
    <View style={{ gap: spacing[3] }}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          {...event}
          variant="horizontal"
          onPress={() => onEventPress?.(event.id)}
          onFavoritePress={() => onFavoritePress?.(event.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: '100%',
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
  badges: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    flexDirection: 'row',
    gap: spacing[1],
  },
  categoryBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: {
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  content: {
    padding: spacing[3],
  },
  horizontalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing[2],
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  icon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizerName: {
    fontSize: 12,
    marginLeft: spacing[1],
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    fontSize: 12,
    marginLeft: spacing[1],
  },
  availabilityContainer: {
    marginTop: spacing[2],
  },
  availabilityTrack: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  availabilityFill: {
    height: '100%',
  },
  spotsText: {
    fontSize: 11,
    marginTop: spacing[0.5],
  },
  featuredCard: {},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {},
});

EventCard.displayName = 'EventCard';
FeaturedEventCard.displayName = 'FeaturedEventCard';
CompactEventCard.displayName = 'CompactEventCard';
EventCardGrid.displayName = 'EventCardGrid';
EventCardList.displayName = 'EventCardList';

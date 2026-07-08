/**
 * LinkUp Design System 2026
 * Event Card Component - For displaying events in the app
 */

'use client';

import React, { useCallback } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';
import { Avatar } from '../avatars';

export type EventCardSize = 'sm' | 'md' | 'lg';

interface EventCardProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  attendeeCount?: number;
  organizerName?: string;
  organizerAvatar?: string;
  imageUrl?: string;
  category?: string;
  isPremium?: boolean;
  isOrganizer?: boolean;
  isBusiness?: boolean;
  size?: EventCardSize;
  onPress?: () => void;
  onOrganizerPress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  time,
  location,
  attendeeCount,
  organizerName,
  organizerAvatar,
  imageUrl,
  category,
  isPremium = false,
  isOrganizer = false,
  isBusiness = false,
  size = 'md',
  onPress,
  onOrganizerPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);

  const getImageHeight = () => {
    switch (size) {
      case 'sm': return 120;
      case 'lg': return 200;
      default: return 160;
    }
  };

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

  const handleOrganizerPress = () => {
    haptics.light();
    onOrganizerPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const imageHeight = getImageHeight();

  const cardStyle: ViewStyle = {
    ...styles.card,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.radius.component.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  };

  const categoryBadgeStyle: ViewStyle = {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: theme.radius.component.badgeSmall,
  };

  const premiumBadgeStyle: ViewStyle = {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    backgroundColor: theme.colors.premium.gold.DEFAULT,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: theme.radius.component.badgeSmall,
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[cardStyle, animatedStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={`Event: ${title}`}
    >
      {/* Image */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            { height: imageHeight, borderTopLeftRadius: theme.radius.component.card, borderTopRightRadius: theme.radius.component.card },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { height: imageHeight, borderTopLeftRadius: theme.radius.component.card, borderTopRightRadius: theme.radius.component.card, backgroundColor: theme.colors.surface.secondary },
          ]}
        />
      )}

      {/* Category Badge */}
      {category && (
        <View style={categoryBadgeStyle}>
          <Text style={[styles.categoryText, { color: theme.colors.text.secondary }]}>
            {category}
          </Text>
        </View>
      )}

      {/* Premium Badge */}
      {isPremium && (
        <View style={premiumBadgeStyle}>
          <Text style={styles.premiumText}>⭐ Premium</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              fontSize: size === 'sm' ? 15 : size === 'lg' ? 20 : 17,
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
          <Text style={[styles.icon]}>📅</Text>
          <Text
            style={[
              styles.dateText,
              { color: theme.colors.text.secondary, fontSize: size === 'sm' ? 12 : 14 },
            ]}
          >
            {date}
            {time && ` • ${time}`}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.row}>
          <Text style={[styles.icon]}>📍</Text>
          <Text
            style={[
              styles.locationText,
              { color: theme.colors.text.secondary, fontSize: size === 'sm' ? 12 : 14 },
            ]}
            numberOfLines={1}
          >
            {location}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Attendees */}
          {attendeeCount !== undefined && (
            <View style={styles.attendees}>
              <Text style={[styles.icon]}>👥</Text>
              <Text
                style={[
                  styles.attendeeText,
                  { color: theme.colors.text.tertiary, fontSize: 12 },
                ]}
              >
                {attendeeCount} attending
              </Text>
            </View>
          )}

          {/* Organizer */}
          {organizerName && (
            <Pressable onPress={handleOrganizerPress} style={styles.organizer}>
              <Avatar
                src={organizerAvatar}
                name={organizerName}
                size="xs"
              />
              <Text
                style={[
                  styles.organizerName,
                  { color: theme.colors.text.secondary, fontSize: 12 },
                ]}
              >
                {organizerName}
              </Text>
              {isOrganizer && (
                <Text style={styles.badge}>🎯</Text>
              )}
              {isBusiness && (
                <Text style={styles.badge}>🏢</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  imagePlaceholder: {
    width: '100%',
  },
  content: {
    padding: spacing[3],
    gap: spacing[2],
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  dateText: {},
  locationText: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeText: {},
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerName: {
    marginLeft: spacing[1],
  },
  badge: {
    marginLeft: spacing[1],
    fontSize: 12,
  },
});

EventCard.displayName = 'EventCard';

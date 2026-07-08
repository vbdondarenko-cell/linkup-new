/**
 * LinkUp Design System 2026
 * Organizer Card - Trust-building organizer display
 */

'use client';

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { Badge } from '../../../ui/components/badges';
import { Button } from '../../../ui/components/buttons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OrganizerCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  trustScore?: number;
  averageRating?: number;
  reviewCount?: number;
  hostedEventsCount?: number;
  isVerified?: boolean;
  isOrganizer?: boolean;
  isBusiness?: boolean;
  memberSince?: string;
  badges?: string[];
  onPress?: () => void;
  onMessagePress?: () => void;
  style?: ViewStyle;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  id,
  name,
  avatarUrl,
  bio,
  trustScore,
  averageRating,
  reviewCount,
  hostedEventsCount,
  isVerified = false,
  isOrganizer = false,
  isBusiness = false,
  memberSince,
  badges = [],
  onPress,
  onMessagePress,
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

  const handleMessage = () => {
    haptics.light();
    onMessagePress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get trust level
  const getTrustLevel = () => {
    if (!trustScore) return null;
    if (trustScore >= 90) return { label: 'Excellent', color: '#10B981' };
    if (trustScore >= 70) return { label: 'Good', color: '#3B82F6' };
    if (trustScore >= 50) return { label: 'Fair', color: '#F59E0B' };
    return { label: 'New', color: '#737373' };
  };

  const trustLevel = getTrustLevel();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Organizer: ${name}`}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <Avatar
          src={avatarUrl}
          name={name}
          size="lg"
          status={isVerified ? 'verified' : isOrganizer ? 'organizer' : isBusiness ? 'business' : undefined}
        />

        {/* Name and Badges */}
        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                { color: theme.colors.text.primary },
              ]}
              numberOfLines={1}
            >
              {name}
            </Text>
            {isVerified && (
              <Text style={styles.verifiedIcon}>✓</Text>
            )}
          </View>

          {/* Type Badge */}
          <View style={styles.badgeRow}>
            {isOrganizer && (
              <Badge label="Organizer" variant="organizer" size="sm" />
            )}
            {isBusiness && (
              <Badge label="Business" variant="business" size="sm" />
            )}
            {isVerified && !isOrganizer && !isBusiness && (
              <Badge label="Verified" variant="verified" size="sm" />
            )}
          </View>
        </View>

        {/* Trust Score */}
        {trustScore !== undefined && (
          <View style={styles.trustContainer}>
            <View
              style={[
                styles.trustCircle,
                { borderColor: trustLevel?.color || theme.colors.text.tertiary },
              ]}
            >
              <Text
                style={[
                  styles.trustScore,
                  { color: trustLevel?.color || theme.colors.text.primary },
                ]}
              >
                {trustScore}
              </Text>
            </View>
            <Text
              style={[
                styles.trustLabel,
                { color: trustLevel?.color || theme.colors.text.tertiary },
              ]}
            >
              {trustLevel?.label}
            </Text>
          </View>
        )}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {averageRating !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.text.primary },
              ]}
            >
              {averageRating.toFixed(1)}
            </Text>
            {reviewCount !== undefined && (
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                ({reviewCount})
              </Text>
            )}
          </View>
        )}

        {hostedEventsCount !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statIcon}>📅</Text>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.text.primary },
              ]}
            >
              {hostedEventsCount}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.text.tertiary },
              ]}
            >
              events
            </Text>
          </View>
        )}

        {memberSince && (
          <View style={styles.stat}>
            <Text style={styles.statIcon}>📆</Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.text.tertiary },
              ]}
            >
              Since {memberSince}
            </Text>
          </View>
        )}
      </View>

      {/* Bio */}
      {bio && (
        <Text
          style={[
            styles.bio,
            { color: theme.colors.text.secondary },
          ]}
          numberOfLines={2}
        >
          {bio}
        </Text>
      )}

      {/* Action */}
      <View style={styles.action}>
        <Button
          variant="tertiary"
          size="md"
          onPress={handlePress}
          style={styles.viewButton}
        >
          View Profile
        </Button>
        {onMessagePress && (
          <Button
            variant="secondary"
            size="md"
            onPress={handleMessage}
            style={styles.messageButton}
          >
            Message
          </Button>
        )}
      </View>
    </AnimatedPressable>
  );
};

// Compact Organizer Row
interface OrganizerRowProps {
  name: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isOrganizer?: boolean;
  isBusiness?: boolean;
  trustScore?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const OrganizerRow: React.FC<OrganizerRowProps> = ({
  name,
  avatarUrl,
  isVerified = false,
  isOrganizer = false,
  isBusiness = false,
  trustScore,
  onPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.rowContainer,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
        },
        style,
      ]}
    >
      <Avatar
        src={avatarUrl}
        name={name}
        size="md"
        status={isVerified ? 'verified' : isOrganizer ? 'organizer' : isBusiness ? 'business' : undefined}
      />
      <View style={styles.rowInfo}>
        <View style={styles.rowNameRow}>
          <Text
            style={[
              styles.rowName,
              { color: theme.colors.text.primary },
            ]}
          >
            {name}
          </Text>
          {isVerified && (
            <Text style={styles.rowVerified}>✓</Text>
          )}
        </View>
        {trustScore !== undefined && (
          <Text
            style={[
              styles.rowTrust,
              { color: theme.colors.text.tertiary },
            ]}
          >
            Trust: {trustScore}%
          </Text>
        )}
      </View>
      <Text style={[styles.rowChevron, { color: theme.colors.text.tertiary }]}>
        ›
      </Text>
    </Pressable>
  );
};

// Trust Badge
interface TrustBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  score,
  size = 'md',
  style,
}) => {
  const theme = useTheme();

  const getColor = () => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#3B82F6';
    if (score >= 50) return '#F59E0B';
    return '#737373';
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return { container: 32, fontSize: 12 };
      case 'lg': return { container: 56, fontSize: 20 };
      default: return { container: 44, fontSize: 16 };
    }
  };

  const sizes = getSize();

  return (
    <View
      style={[
        styles.trustBadge,
        {
          width: sizes.container,
          height: sizes.container,
          borderRadius: sizes.container / 2,
          borderColor: getColor(),
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.trustBadgeText,
          {
            fontSize: sizes.fontSize,
            color: getColor(),
          },
        ]}
      >
        {score}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
    marginLeft: spacing[3],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: spacing[1],
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  trustContainer: {
    alignItems: 'center',
  },
  trustCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustScore: {
    fontSize: 16,
    fontWeight: fontWeight.bold,
  },
  trustLabel: {
    fontSize: 10,
    marginTop: spacing[0.5],
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing[4],
    gap: spacing[6],
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  statValue: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  statLabel: {
    fontSize: 13,
    marginLeft: spacing[1],
  },
  bio: {
    fontSize: 14,
    marginTop: spacing[3],
    lineHeight: 20,
  },
  action: {
    flexDirection: 'row',
    marginTop: spacing[4],
    gap: spacing[3],
  },
  viewButton: {
    flex: 1,
  },
  messageButton: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
  },
  rowInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  rowNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowName: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
  },
  rowVerified: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: spacing[1],
  },
  rowTrust: {
    fontSize: 12,
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  trustBadge: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBadgeText: {
    fontWeight: fontWeight.bold,
  },
});

OrganizerCard.displayName = 'OrganizerCard';
OrganizerRow.displayName = 'OrganizerRow';
TrustBadge.displayName = 'TrustBadge';

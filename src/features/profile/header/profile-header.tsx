/**
 * LinkUp Design System 2026
 * Profile Header - User profile header
 */

'use client';

import React, { useCallback } from 'react';
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
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { Badge } from '../../../ui/components/badges';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type BadgeType = 'verified' | 'premium' | 'organizer' | 'business' | 'legend';

interface ProfileHeaderProps {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  language?: string;
  memberSince?: Date;
  badges?: BadgeType[];
  isOwn?: boolean;
  onAvatarPress?: () => void;
  onEditPress?: () => void;
  onSharePress?: () => void;
  onSettingsPress?: () => void;
  style?: ViewStyle;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  username,
  avatarUrl,
  bio,
  city,
  language,
  memberSince,
  badges = [],
  isOwn = false,
  onAvatarPress,
  onEditPress,
  onSharePress,
  onSettingsPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const avatarScale = useSharedValue(1);

  const handleAvatarPress = useCallback(() => {
    haptics.light();
    avatarScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      avatarScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    onAvatarPress?.();
  }, [haptics, avatarScale, onAvatarPress]);

  const handleEdit = useCallback(() => {
    haptics.light();
    onEditPress?.();
  }, [haptics, onEditPress]);

  const handleShare = useCallback(() => {
    haptics.light();
    onSharePress?.();
  }, [haptics, onSharePress]);

  const handleSettings = useCallback(() => {
    haptics.light();
    onSettingsPress?.();
  }, [haptics, onSettingsPress]);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const formatMemberSince = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getBadgeConfig = (badge: BadgeType) => {
    switch (badge) {
      case 'verified':
        return { icon: '✓', label: 'Verified', color: '#3B82F6' };
      case 'premium':
        return { icon: '⭐', label: 'Premium', color: '#F59E0B' };
      case 'organizer':
        return { icon: '🎯', label: 'Organizer', color: '#A855F7' };
      case 'business':
        return { icon: '🏢', label: 'Business', color: '#3B82F6' };
      case 'legend':
        return { icon: '👑', label: 'Legend', color: '#F59E0B' };
      default:
        return { icon: '', label: '', color: '' };
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <AnimatedPressable
          onPress={handleAvatarPress}
          style={[styles.avatarContainer, avatarAnimatedStyle]}
        >
          <Avatar
            src={avatarUrl}
            name={displayName}
            size="xl"
            status={badges.includes('verified') ? 'verified' : undefined}
          />
          
          {/* Premium Ring */}
          {badges.includes('premium') && (
            <View
              style={[
                styles.premiumRing,
                { borderColor: '#F59E0B' },
              ]}
            />
          )}
        </AnimatedPressable>

        {/* Edit Avatar Button (own profile) */}
        {isOwn && (
          <Pressable
            onPress={handleEdit}
            style={[
              styles.editAvatarButton,
              { backgroundColor: theme.colors.surface.secondary },
            ]}
          >
            <Text style={styles.editAvatarIcon}>📷</Text>
          </Pressable>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        {/* Name and Actions Row */}
        <View style={styles.nameRow}>
          <View style={styles.nameContainer}>
            <Text
              style={[styles.displayName, { color: theme.colors.text.primary }]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            {username && (
              <Text
                style={[styles.username, { color: theme.colors.text.tertiary }]}
              >
                @{username}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {isOwn ? (
              <>
                <Pressable
                  onPress={handleEdit}
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.surface.secondary },
                  ]}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                </Pressable>
                <Pressable
                  onPress={handleSettings}
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.surface.secondary },
                  ]}
                >
                  <Text style={styles.actionIcon}>⚙️</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  onPress={handleShare}
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.surface.secondary },
                  ]}
                >
                  <Text style={styles.actionIcon}>📤</Text>
                </Pressable>
                <Pressable
                  onPress={() => {}}
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.surface.secondary },
                  ]}
                >
                  <Text style={styles.actionIcon}>•••</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Bio */}
        {bio && (
          <Text
            style={[styles.bio, { color: theme.colors.text.secondary }]}
            numberOfLines={3}
          >
            {bio}
          </Text>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <View style={styles.badgesRow}>
            {badges.map((badge) => {
              const config = getBadgeConfig(badge);
              return (
                <View
                  key={badge}
                  style={[
                    styles.badge,
                    { backgroundColor: `${config.color}15` },
                  ]}
                >
                  <Text style={styles.badgeIcon}>{config.icon}</Text>
                  <Text style={[styles.badgeLabel, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Meta Info */}
        <View style={styles.metaRow}>
          {city && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                {city}
              </Text>
            </View>
          )}
          {language && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🗣️</Text>
              <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                {language}
              </Text>
            </View>
          )}
          {memberSince && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                Joined {formatMemberSince(memberSince)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
  },
  avatarSection: {
    position: 'relative',
    marginBottom: spacing[4],
  },
  avatarContainer: {
    position: 'relative',
  },
  premiumRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 60,
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editAvatarIcon: {
    fontSize: 16,
  },
  infoSection: {
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  nameContainer: {
    flex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  username: {
    fontSize: 15,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 18,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  metaText: {
    fontSize: 13,
  },
});

ProfileHeader.displayName = 'ProfileHeader';

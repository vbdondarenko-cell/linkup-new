/**
 * LinkUp Design System 2026
 * Business Dashboard - Business Header Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { Badge } from '../../../ui/components/badges';
import { BusinessProfile } from '../types';

interface BusinessHeaderProps {
  profile: BusinessProfile;
  onEditPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
  style?: ViewStyle;
}

export const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  profile,
  onEditPress,
  onNotificationPress,
  notificationCount = 0,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleNotificationPress = () => {
    haptics.light();
    onNotificationPress?.();
  };

  const getOpeningStatus = () => {
    if (profile.isOpen) {
      return { label: 'Open Now', color: '#10B981' };
    }
    return { label: 'Closed', color: '#EF4444' };
  };

  const openingStatus = getOpeningStatus();

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[styles.container, { backgroundColor: theme.colors.surface.primary }, style]}
    >
      {/* Cover Image */}
      {profile.coverImageUrl && (
        <Image
          source={{ uri: profile.coverImageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Top Actions */}
      <View style={styles.topActions}>
        <Pressable 
          onPress={() => { haptics.light(); onEditPress?.(); }}
          style={[styles.iconButton, { backgroundColor: theme.colors.surface.primary }]}
        >
          <Text style={styles.iconText}>✏️</Text>
        </Pressable>
        
        <Pressable 
          onPress={handleNotificationPress}
          style={[styles.iconButton, { backgroundColor: theme.colors.surface.primary }]}
        >
          <Text style={styles.iconText}>🔔</Text>
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notificationCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Logo and Basic Info */}
      <View style={styles.mainContent}>
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          {profile.logoUrl ? (
            <Image source={{ uri: profile.logoUrl }} style={styles.logo} />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.surface.secondary }]}>
              <Text style={styles.logoIcon}>{profile.category.icon}</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(150).springify()} style={styles.businessInfo}>
          {/* Business Name */}
          <View style={styles.nameRow}>
            <Text style={[styles.businessName, { color: theme.colors.text.primary }]}>
              {profile.name}
            </Text>
            {profile.verificationStatus === 'verified' && (
              <View style={[styles.verifiedBadge, { backgroundColor: '#10B981' }]}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>

          {/* Category and Status */}
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: `${profile.category.color}20` }]}>
              <Text style={styles.categoryIcon}>{profile.category.icon}</Text>
              <Text style={[styles.categoryText, { color: profile.category.color }]}>
                {profile.category.name}
              </Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: `${openingStatus.color}20` }]}>
              <View style={[styles.statusDot, { backgroundColor: openingStatus.color }]} />
              <Text style={[styles.statusText, { color: openingStatus.color }]}>
                {openingStatus.label}
              </Text>
            </View>
          </View>

          {/* Rank Badge */}
          <View style={[styles.rankBadge, { backgroundColor: `${profile.rankInfo.color}20` }]}>
            <Text style={styles.rankIcon}>{profile.rankInfo.icon}</Text>
            <Text style={[styles.rankText, { color: profile.rankInfo.color }]}>
              {profile.rankInfo.label}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Stats Row */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.totalEvents}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            Events
          </Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.averageRating.toFixed(1)} ⭐
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            Rating
          </Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.followers}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            Followers
          </Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.totalParticipants}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            Guests
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 160,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topActions: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    gap: spacing[2],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[5],
    marginTop: -40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 32,
  },
  businessInfo: {
    flex: 1,
    marginLeft: spacing[4],
    marginBottom: spacing[2],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  businessName: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: spacing[2],
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
    gap: 4,
  },
  rankIcon: {
    fontSize: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing[4],
    marginTop: spacing[3],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
});

BusinessHeader.displayName = 'BusinessHeader';

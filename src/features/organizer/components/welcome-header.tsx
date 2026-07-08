/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Welcome Header Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { Badge } from '../../../ui/components/badges';
import { OrganizerProfile } from '../types';

interface WelcomeHeaderProps {
  profile: OrganizerProfile;
  onNotificationPress?: () => void;
  notificationCount?: number;
  style?: ViewStyle;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  profile,
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

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRankColor = () => {
    switch (profile.rank) {
      case 'rising': return '#9CA3AF';
      case 'pro': return '#3B82F6';
      case 'community': return '#8B5CF6';
      case 'elite': return '#F59E0B';
      case 'legend': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const getRankIcon = () => {
    switch (profile.rank) {
      case 'rising': return '🌱';
      case 'pro': return '⭐';
      case 'community': return '🎯';
      case 'elite': return '💫';
      case 'legend': return '👑';
      default: return '🌱';
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary },
        style,
      ]}
    >
      {/* Top Row - Notifications */}
      <View style={styles.topRow}>
        <View style={styles.dateContainer}>
          <Text style={[styles.date, { color: theme.colors.text.tertiary }]}>
            {formatDate()}
          </Text>
        </View>
        
        <Pressable
          onPress={handleNotificationPress}
          style={[styles.notificationButton, { backgroundColor: theme.colors.surface.secondary }]}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notificationCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Avatar with Status */}
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <Avatar
            src={profile.avatarUrl}
            name={profile.displayName}
            size="xl"
            status={profile.isVerified ? 'verified' : undefined}
          />
        </Animated.View>

        {/* Profile Info */}
        <Animated.View 
          entering={FadeInUp.delay(150).springify()} 
          style={styles.profileInfo}
        >
          <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.name, { color: theme.colors.text.primary }]}>
            {profile.displayName}
          </Text>

          {/* Rank Badge */}
          <View style={styles.badges}>
            <View style={[styles.rankBadge, { backgroundColor: `${getRankColor()}20` }]}>
              <Text style={styles.rankIcon}>{getRankIcon()}</Text>
              <Text style={[styles.rankText, { color: getRankColor() }]}>
                {profile.rank.charAt(0).toUpperCase() + profile.rank.slice(1)}
              </Text>
            </View>
            <Badge
              label={`Level ${profile.level}`}
              variant="default"
              size="sm"
            />
          </View>
        </Animated.View>
      </View>

      {/* Stats Row */}
      <Animated.View 
        entering={FadeInUp.delay(200).springify()} 
        style={styles.statsRow}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.trustScore}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            Trust Score
          </Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            Streak 🔥
          </Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
            Best Streak
          </Text>
        </View>
      </Animated.View>

      {/* Progress Bar */}
      {profile.nextRankInfo && (
        <Animated.View entering={FadeInUp.delay(250).springify()} style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme.colors.text.secondary }]}>
              Progress to {profile.nextRankInfo.label}
            </Text>
            <Text style={[styles.progressValue, { color: theme.colors.text.tertiary }]}>
              {profile.rankProgress}%
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface.secondary }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${profile.rankProgress}%`,
                  backgroundColor: getRankColor(),
                }
              ]} 
            />
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    paddingTop: spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  dateContainer: {},
  date: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
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
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing[4],
  },
  greeting: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  name: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 20,
    gap: spacing[1],
  },
  rankIcon: {
    fontSize: 14,
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
    marginTop: spacing[2],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
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
  progressSection: {
    marginTop: spacing[4],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  progressLabel: {
    fontSize: 12,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

WelcomeHeader.displayName = 'WelcomeHeader';

/**
 * LinkUp Design System 2026
 * Trust Card - Trust profile card
 */

'use client';

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

interface TrustCardProps {
  trustScore: number;
  averageRating?: number;
  attendanceRate?: number;
  completedEvents?: number;
  successfulMeetings?: number;
  isVerified?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const TrustCard: React.FC<TrustCardProps> = ({
  trustScore,
  averageRating,
  attendanceRate,
  completedEvents,
  successfulMeetings,
  isVerified = false,
  onPress,
  style,
}) => {
  const theme = useTheme();

  const getTrustLevel = () => {
    if (trustScore >= 90) return { label: 'Excellent', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (trustScore >= 75) return { label: 'Good', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
    if (trustScore >= 60) return { label: 'Fair', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    return { label: 'New', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' };
  };

  const trustLevel = useMemo(() => getTrustLevel(), [trustScore]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: theme.colors.border.default,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🛡️</Text>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Trust Profile
          </Text>
        </View>
        {isVerified && (
          <View
            style={[
              styles.verifiedBadge,
              { backgroundColor: 'rgba(59, 130, 246, 0.1)' },
            ]}
          >
            <Text style={styles.verifiedIcon}>✓</Text>
            <Text style={[styles.verifiedText, { color: '#3B82F6' }]}>
              Verified
            </Text>
          </View>
        )}
      </View>

      {/* Main Trust Score */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreContainer}>
          <Text
            style={[
              styles.scoreValue,
              { color: trustLevel.color },
            ]}
          >
            {trustScore}
          </Text>
          <Text style={[styles.scoreMax, { color: theme.colors.text.tertiary }]}>
            / 100
          </Text>
        </View>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: trustLevel.bg },
          ]}
        >
          <Text style={[styles.levelText, { color: trustLevel.color }]}>
            {trustLevel.label}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: theme.colors.surface.tertiary },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${trustScore}%`,
              backgroundColor: trustLevel.color,
            },
          ]}
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {averageRating !== undefined && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                {averageRating.toFixed(1)}
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
              Rating
            </Text>
          </View>
        )}

        {attendanceRate !== undefined && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>✓</Text>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                {attendanceRate}%
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
              Attendance
            </Text>
          </View>
        )}

        {completedEvents !== undefined && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                {completedEvents}
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
              Events
            </Text>
          </View>
        )}

        {successfulMeetings !== undefined && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>🤝</Text>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                {successfulMeetings}
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
              Meetings
            </Text>
          </View>
        )}
      </View>

      {/* Trust Indicators */}
      <View style={styles.indicatorsSection}>
        <Text style={[styles.indicatorsTitle, { color: theme.colors.text.secondary }]}>
          Trust Indicators
        </Text>
        <View style={styles.indicatorsGrid}>
          <View style={styles.indicatorItem}>
            <Text style={styles.indicatorIcon}>✓</Text>
            <Text style={[styles.indicatorLabel, { color: theme.colors.text.tertiary }]}>
              Identity Verified
            </Text>
          </View>
          <View style={styles.indicatorItem}>
            <Text style={styles.indicatorIcon}>✓</Text>
            <Text style={[styles.indicatorLabel, { color: theme.colors.text.tertiary }]}>
              Payment Protected
            </Text>
          </View>
          <View style={styles.indicatorItem}>
            <Text style={styles.indicatorIcon}>✓</Text>
            <Text style={[styles.indicatorLabel, { color: theme.colors.text.tertiary }]}>
              Community Guidelines
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Compact Trust Badge
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
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#6B7280';
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return { container: 36, fontSize: 14 };
      case 'lg': return { container: 56, fontSize: 22 };
      default: return { container: 44, fontSize: 18 };
    }
  };

  const sizes = getSize();
  const color = getColor();

  return (
    <View
      style={[
        styles.badge,
        {
          width: sizes.container,
          height: sizes.container,
          borderRadius: sizes.container / 2,
          borderColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.badgeScore, { fontSize: sizes.fontSize, color }]}>
        {score}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing[4],
    marginHorizontal: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: spacing[2],
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#3B82F6',
    marginRight: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
  },
  scoreMax: {
    fontSize: 20,
    marginLeft: 2,
  },
  levelBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing[4],
  },
  statItem: {
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
    marginRight: spacing[1],
  },
  statValue: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  indicatorsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing[3],
  },
  indicatorsTitle: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[2],
  },
  indicatorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorIcon: {
    fontSize: 14,
    color: '#10B981',
    marginRight: spacing[1],
  },
  indicatorLabel: {
    fontSize: 12,
  },
  badge: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeScore: {
    fontWeight: fontWeight.bold,
  },
});

TrustCard.displayName = 'TrustCard';
TrustBadge.displayName = 'TrustBadge';

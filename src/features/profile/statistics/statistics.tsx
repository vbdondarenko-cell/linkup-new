/**
 * LinkUp Design System 2026
 * Statistics - User statistics display
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
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

export interface UserStatistics {
  completedEvents: number;
  hostedEvents: number;
  joinedEvents: number;
  hoursOffline?: number;
  peopleMet?: number;
  favoriteCategory?: string;
  favoriteCategoryIcon?: string;
  longestStreak?: number;
  currentStreak?: number;
  monthlyActivity?: number[];
}

interface StatisticsProps {
  statistics: UserStatistics;
  showAll?: boolean;
  style?: ViewStyle;
}

// Animated counter
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
  icon: string;
  color?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  label,
  icon,
  color = '#3B82F6',
}) => {
  const theme = useTheme();
  const count = useSharedValue(0);

  React.useEffect(() => {
    count.value = withTiming(value, { duration: 1500 });
  }, [value, count]);

  // For simplicity, we'll display the value directly
  // In production, you could use a native animated text component

  return (
    <View style={styles.statItem}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
        {value.toLocaleString()}{suffix}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>
        {label}
      </Text>
    </View>
  );
};

// Stats Grid
interface StatsGridProps {
  statistics: UserStatistics;
  style?: ViewStyle;
}

const StatsGrid: React.FC<StatsGridProps> = ({ statistics, style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.grid, style]}>
      <View style={styles.gridRow}>
        <AnimatedCounter
          value={statistics.completedEvents}
          label="Completed"
          icon="✅"
        />
        <AnimatedCounter
          value={statistics.joinedEvents}
          label="Joined"
          icon="🎫"
        />
        {statistics.hostedEvents !== undefined && (
          <AnimatedCounter
            value={statistics.hostedEvents}
            label="Hosted"
            icon="🎉"
          />
        )}
      </View>

      <View style={styles.gridRow}>
        {statistics.peopleMet !== undefined && (
          <AnimatedCounter
            value={statistics.peopleMet}
            label="People Met"
            icon="🤝"
          />
        )}
        {statistics.hoursOffline !== undefined && (
          <AnimatedCounter
            value={statistics.hoursOffline}
            suffix="h"
            label="Hours Offline"
            icon="⏱️"
          />
        )}
        {statistics.currentStreak !== undefined && (
          <AnimatedCounter
            value={statistics.currentStreak}
            label="Day Streak"
            icon="🔥"
            color="#F59E0B"
          />
        )}
      </View>
    </View>
  );
};

// Favorite Category Card
interface FavoriteCategoryCardProps {
  category?: string;
  icon?: string;
  style?: ViewStyle;
}

const FavoriteCategoryCard: React.FC<FavoriteCategoryCardProps> = ({
  category,
  icon,
  style,
}) => {
  const theme = useTheme();

  if (!category) return null;

  return (
    <Animated.View
      entering={FadeIn}
      style={[
        styles.categoryCard,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: theme.colors.border.default,
        },
        style,
      ]}
    >
      <Text style={styles.categoryIcon}>{icon || '🏆'}</Text>
      <View style={styles.categoryInfo}>
        <Text style={[styles.categoryLabel, { color: theme.colors.text.tertiary }]}>
          Favorite Category
        </Text>
        <Text style={[styles.categoryName, { color: theme.colors.text.primary }]}>
          {category}
        </Text>
      </View>
    </Animated.View>
  );
};

// Streak Card
interface StreakCardProps {
  current?: number;
  longest?: number;
  style?: ViewStyle;
}

const StreakCard: React.FC<StreakCardProps> = ({
  current,
  longest,
  style,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn}
      style={[
        styles.streakCard,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: theme.colors.border.default,
        },
        style,
      ]}
    >
      <View style={styles.streakContent}>
        <Text style={styles.streakIcon}>🔥</Text>
        <Text style={[styles.streakValue, { color: '#F59E0B' }]}>
          {current || 0}
        </Text>
        <Text style={[styles.streakLabel, { color: theme.colors.text.tertiary }]}>
          Current Streak
        </Text>
      </View>
      <View style={[styles.streakDivider, { backgroundColor: theme.colors.border.default }]} />
      <View style={styles.streakContent}>
        <Text style={styles.streakIcon}>🏆</Text>
        <Text style={[styles.streakValue, { color: theme.colors.text.primary }]}>
          {longest || 0}
        </Text>
        <Text style={[styles.streakLabel, { color: theme.colors.text.tertiary }]}>
          Longest Streak
        </Text>
      </View>
    </Animated.View>
  );
};

// Monthly Activity Chart
interface MonthlyActivityProps {
  activity: number[];
  style?: ViewStyle;
}

const MonthlyActivity: React.FC<MonthlyActivityProps> = ({
  activity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  style,
}) => {
  const theme = useTheme();

  const maxActivity = Math.max(...activity, 1);

  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  return (
    <View
      style={[
        styles.activityContainer,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: theme.colors.border.default,
        },
        style,
      ]}
    >
      <Text style={[styles.activityTitle, { color: theme.colors.text.primary }]}>
        📊 Monthly Activity
      </Text>
      <View style={styles.activityChart}>
        {activity.map((value, index) => {
          const height = (value / maxActivity) * 60;
          return (
            <View key={index} style={styles.activityBar}>
              <View
                style={[
                  styles.activityBarFill,
                  {
                    height: Math.max(height, 4),
                    backgroundColor:
                      value > 0
                        ? theme.colors.interactive.primary
                        : theme.colors.surface.tertiary,
                  },
                ]}
              />
              <Text style={[styles.activityMonth, { color: theme.colors.text.tertiary }]}>
                {months[index]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Main Statistics Component
export const Statistics: React.FC<StatisticsProps> = ({
  statistics,
  showAll = true,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          📈 Statistics
        </Text>
      </View>

      {/* Stats Grid */}
      <StatsGrid statistics={statistics} />

      {/* Favorite Category */}
      <FavoriteCategoryCard
        category={statistics.favoriteCategory}
        icon={statistics.favoriteCategoryIcon}
        style={styles.categorySection}
      />

      {/* Streak Card */}
      {(statistics.currentStreak !== undefined || statistics.longestStreak !== undefined) && (
        <StreakCard
          current={statistics.currentStreak}
          longest={statistics.longestStreak}
          style={styles.streakSection}
        />
      )}

      {/* Monthly Activity */}
      {showAll && statistics.monthlyActivity && (
        <MonthlyActivity
          activity={statistics.monthlyActivity}
          style={styles.activitySection}
        />
      )}
    </View>
  );
};

// Compact Statistics Row
interface CompactStatsProps {
  statistics: UserStatistics;
  style?: ViewStyle;
}

export const CompactStats: React.FC<CompactStatsProps> = ({
  statistics,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.compactContainer, style]}>
      <View style={styles.compactItem}>
        <Text style={styles.compactValue}>{statistics.completedEvents}</Text>
        <Text style={[styles.compactLabel, { color: theme.colors.text.tertiary }]}>
          Events
        </Text>
      </View>
      <View style={[styles.compactDivider, { backgroundColor: theme.colors.border.default }]} />
      <View style={styles.compactItem}>
        <Text style={styles.compactValue}>{statistics.peopleMet || 0}</Text>
        <Text style={[styles.compactLabel, { color: theme.colors.text.tertiary }]}>
          Met
        </Text>
      </View>
      {statistics.currentStreak !== undefined && (
        <>
          <View style={[styles.compactDivider, { backgroundColor: theme.colors.border.default }]} />
          <View style={styles.compactItem}>
            <Text style={[styles.compactValue, { color: '#F59E0B' }]}>
              {statistics.currentStreak}
            </Text>
            <Text style={[styles.compactLabel, { color: theme.colors.text.tertiary }]}>
              Streak
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[4],
  },
  sectionHeader: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  grid: {
    paddingHorizontal: spacing[4],
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing[3],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  statValue: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  categorySection: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    marginTop: 2,
  },
  streakSection: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  streakCard: {
    flexDirection: 'row',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
  },
  streakContent: {
    flex: 1,
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  streakValue: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  streakLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    marginHorizontal: spacing[3],
  },
  activitySection: {
    marginHorizontal: spacing[4],
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
  },
  activityContainer: {},
  activityTitle: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[3],
  },
  activityChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  activityBar: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  activityBarFill: {
    width: 16,
    borderRadius: 4,
    marginBottom: spacing[1],
  },
  activityMonth: {
    fontSize: 10,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
  },
  compactItem: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  compactValue: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
  },
  compactLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  compactDivider: {
    width: 1,
    height: 30,
  },
});

Statistics.displayName = 'Statistics';
CompactStats.displayName = 'CompactStats';

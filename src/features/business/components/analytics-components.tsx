/**
 * LinkUp Design System 2026
 * Business Dashboard - Analytics Components
 */

'use client';

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

interface BusinessAnalyticsChartProps {
  title: string;
  subtitle?: string;
  data: Array<{ label: string; value: number; color?: string }>;
  type?: 'bar' | 'line';
  showValues?: boolean;
  delay?: number;
  style?: ViewStyle;
}

export const BusinessAnalyticsChart: React.FC<BusinessAnalyticsChartProps> = ({
  title,
  subtitle,
  data,
  type = 'bar',
  showValues = true,
  delay = 0,
  style,
}) => {
  const theme = useTheme();

  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.value), 1);
  }, [data]);

  const chartColors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#6366F1',
    '#14B8A6',
  ];

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary, borderRadius: theme.radius.component.lg },
        style,
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
          {subtitle}
        </Text>
      )}

      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = item.color || chartColors[index % chartColors.length];

          return (
            <View key={item.label} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <Animated.View
                  entering={FadeInUp.delay(delay + 100 + index * 50).springify()}
                  style={[styles.bar, { height: `${percentage}%`, backgroundColor: color }]}
                />
              </View>
              <Text style={[styles.barLabel, { color: theme.colors.text.tertiary }]}>
                {item.label}
              </Text>
              {showValues && (
                <Text style={[styles.barValue, { color: theme.colors.text.primary }]}>
                  {item.value}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

// Rating Distribution Component
interface RatingDistributionProps {
  distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
  averageRating: number;
  totalReviews: number;
  delay?: number;
  style?: ViewStyle;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  averageRating,
  totalReviews,
  delay = 0,
  style,
}) => {
  const theme = useTheme();
  const total = distribution[5] + distribution[4] + distribution[3] + distribution[2] + distribution[1];

  const getPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const ratings = [
    { stars: 5, count: distribution[5], color: '#10B981' },
    { stars: 4, count: distribution[4], color: '#22C55E' },
    { stars: 3, count: distribution[3], color: '#F59E0B' },
    { stars: 2, count: distribution[2], color: '#F97316' },
    { stars: 1, count: distribution[1], color: '#EF4444' },
  ];

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary, borderRadius: theme.radius.component.lg },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.ratingHeader}>
        <View style={styles.ratingOverview}>
          <Text style={[styles.ratingValue, { color: theme.colors.text.primary }]}>
            {averageRating.toFixed(1)}
          </Text>
          <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={[styles.ratingCount, { color: theme.colors.text.tertiary }]}>
            {totalReviews} reviews
          </Text>
        </View>
      </View>

      {/* Distribution Bars */}
      <View style={styles.distributionContainer}>
        {ratings.map((rating) => (
          <View key={rating.stars} style={styles.distributionRow}>
            <Text style={[styles.distributionLabel, { color: theme.colors.text.secondary }]}>
              {rating.stars}
            </Text>
            <View style={[styles.distributionTrack, { backgroundColor: theme.colors.surface.secondary }]}>
              <View
                style={[
                  styles.distributionFill,
                  { width: `${getPercentage(rating.count)}%`, backgroundColor: rating.color },
                ]}
              />
            </View>
            <Text style={[styles.distributionCount, { color: theme.colors.text.tertiary }]}>
              {rating.count}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

// Growth Indicator Component
interface BusinessGrowthIndicatorProps {
  label: string;
  value: number;
  positive?: boolean;
  delay?: number;
  style?: ViewStyle;
}

export const BusinessGrowthIndicator: React.FC<BusinessGrowthIndicatorProps> = ({
  label,
  value,
  positive,
  delay = 0,
  style,
}) => {
  const theme = useTheme();
  const isPositive = positive !== undefined ? positive : value > 0;
  const color = isPositive ? '#10B981' : '#EF4444';

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[
        styles.growthContainer,
        { backgroundColor: `${color}15`, borderRadius: theme.radius.component.md },
        style,
      ]}
    >
      <Text style={[styles.growthIcon, { color }]}>{isPositive ? '↑' : '↓'}</Text>
      <Text style={[styles.growthValue, { color }]}>{Math.abs(value)}%</Text>
      <Text style={[styles.growthLabel, { color: theme.colors.text.tertiary }]}>{label}</Text>
    </Animated.View>
  );
};

// Metric Card Component
interface BusinessMetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: number;
  color?: string;
  delay?: number;
  style?: ViewStyle;
}

export const BusinessMetricCard: React.FC<BusinessMetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = '#3B82F6',
  delay = 0,
  style,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[
        styles.metricCard,
        { backgroundColor: theme.colors.surface.primary, borderRadius: theme.radius.component.lg },
        style,
      ]}
    >
      <View style={[styles.metricIconContainer, { backgroundColor: `${color}15` }]}>
        <Text style={styles.metricIcon}>{icon}</Text>
      </View>
      <View style={styles.metricContent}>
        <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>{value}</Text>
        <Text style={[styles.metricLabel, { color: theme.colors.text.tertiary }]}>{label}</Text>
        {trend !== undefined && (
          <View style={[styles.metricTrend, { backgroundColor: trend > 0 ? '#10B98115' : '#EF444415' }]}>
            <Text style={[styles.metricTrendText, { color: trend > 0 ? '#10B981' : '#EF4444' }]}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
  },
  title: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: spacing[4],
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingTop: spacing[4],
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    width: '60%',
    height: 80,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: spacing[1],
  },
  barValue: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    marginTop: 2,
  },
  ratingHeader: {
    marginBottom: spacing[4],
  },
  ratingOverview: {
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
  },
  ratingStars: {
    fontSize: 16,
    marginVertical: spacing[1],
  },
  ratingCount: {
    fontSize: 12,
  },
  distributionContainer: {
    gap: spacing[2],
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  distributionLabel: {
    fontSize: 12,
    width: 16,
  },
  distributionTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
  growthContainer: {
    alignItems: 'center',
    padding: spacing[3],
  },
  growthIcon: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
  growthValue: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  growthLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  metricCard: {
    flexDirection: 'row',
    padding: spacing[4],
  },
  metricIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIcon: {
    fontSize: 22,
  },
  metricContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  metricValue: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  metricTrend: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: spacing[1],
  },
  metricTrendText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
});

BusinessAnalyticsChart.displayName = 'BusinessAnalyticsChart';
RatingDistribution.displayName = 'RatingDistribution';
BusinessGrowthIndicator.displayName = 'BusinessGrowthIndicator';
BusinessMetricCard.displayName = 'BusinessMetricCard';

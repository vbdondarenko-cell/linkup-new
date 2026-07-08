/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Analytics Chart Component
 */

'use client';

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  type?: 'bar' | 'line';
  showValues?: boolean;
  delay?: number;
  style?: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
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
    '#EF4444',
  ];

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.lg,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = item.color || chartColors[index % chartColors.length];

          return (
            <View key={item.label} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <Animated.View
                  entering={FadeInUp.delay(delay + 100 + index * 50).springify()}
                  style={[
                    styles.bar,
                    {
                      height: `${percentage}%`,
                      backgroundColor: color,
                    },
                  ]}
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

// Simple Line Chart Component
interface LineChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  color?: string;
  delay?: number;
  style?: ViewStyle;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  color = '#3B82F6',
  delay = 0,
  style,
}) => {
  const theme = useTheme();

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = useMemo(() => {
    return data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((item.value - minValue) / range) * 100;
      return { x, y, value: item.value };
    });
  }, [data, minValue, range]);

  const pathD = points.map((point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    return `L ${point.x} ${point.y}`;
  }).join(' ');

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.lg,
        },
        style,
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {title}
      </Text>

      <View style={styles.lineChartContainer}>
        {/* Grid Lines */}
        <View style={styles.gridLines}>
          {[100, 75, 50, 25, 0].map((pos) => (
            <View
              key={pos}
              style={[styles.gridLine, { top: `${pos}%` }]}
            />
          ))}
        </View>

        {/* Data Points */}
        <View style={styles.dataPoints}>
          {points.map((point, index) => (
            <View
              key={index}
              style={[
                styles.dataPoint,
                {
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  backgroundColor: color,
                },
              ]}
            >
              <Text style={styles.dataPointValue}>{point.value}</Text>
            </View>
          ))}
        </View>

        {/* X-Axis Labels */}
        <View style={styles.xAxisLabels}>
          {data.map((item, index) => (
            <Text
              key={index}
              style={[styles.xAxisLabel, { color: theme.colors.text.tertiary }]}
            >
              {item.label}
            </Text>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// Growth Indicator Component
interface GrowthIndicatorProps {
  value: number;
  label: string;
  positive?: boolean;
  delay?: number;
  style?: ViewStyle;
}

export const GrowthIndicator: React.FC<GrowthIndicatorProps> = ({
  value,
  label,
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
        {
          backgroundColor: `${color}15`,
          borderRadius: theme.radius.component.md,
        },
        style,
      ]}
    >
      <Text style={[styles.growthIcon, { color }]}>
        {isPositive ? '↑' : '↓'}
      </Text>
      <Text style={[styles.growthValue, { color }]}>
        {Math.abs(value)}%
      </Text>
      <Text style={[styles.growthLabel, { color: theme.colors.text.tertiary }]}>
        {label}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  title: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
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
  lineChartContainer: {
    height: 160,
    marginTop: spacing[3],
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dataPoints: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
    alignItems: 'center',
  },
  dataPointValue: {
    position: 'absolute',
    top: -20,
    fontSize: 10,
    fontWeight: fontWeight.medium,
    color: '#666',
    width: 30,
    textAlign: 'center',
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xAxisLabel: {
    fontSize: 10,
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
});

AnalyticsChart.displayName = 'AnalyticsChart';
LineChart.displayName = 'LineChart';
GrowthIndicator.displayName = 'GrowthIndicator';

/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Stat Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: number;
  subtitle?: string;
  color?: string;
  delay?: number;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  subtitle,
  color = '#3B82F6',
  delay = 0,
  style,
}) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (!trend) return theme.colors.text.tertiary;
    return trend > 0 ? '#10B981' : '#EF4444';
  };

  const getTrendIcon = () => {
    if (!trend) return '';
    return trend > 0 ? '↑' : '↓';
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.lg,
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        {trend !== undefined && (
          <View style={styles.trendContainer}>
            <Text style={[styles.trend, { color: getTrendColor() }]}>
              {getTrendIcon()} {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.value, { color: theme.colors.text.primary }]}>
          {value}
        </Text>
        <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  trendContainer: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  trend: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    lineHeight: 34,
  },
  label: {
    fontSize: 13,
    marginTop: spacing[1],
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
});

StatCard.displayName = 'StatCard';

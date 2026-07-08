/**
 * LinkUp Design System 2026
 * Trust Block - Trust-building UI components
 */

'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { LinearProgress } from '../../../ui/components/progress';

// Trust Score Display
interface TrustScoreDisplayProps {
  score: number;
  label?: string;
  showProgress?: boolean;
  style?: ViewStyle;
}

export const TrustScoreDisplay: React.FC<TrustScoreDisplayProps> = ({
  score,
  label,
  showProgress = true,
  style,
}) => {
  const theme = useTheme();

  const getScoreColor = () => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#3B82F6';
    if (score >= 50) return '#F59E0B';
    return '#737373';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'New';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label || 'Trust Score'}</Text>
        <View style={styles.scoreRow}>
          <Text
            style={[
              styles.score,
              { color: getScoreColor() },
            ]}
          >
            {score}
          </Text>
          <Text
            style={[
              styles.scoreLabel,
              { color: getScoreColor() },
            ]}
          >
            / 100
          </Text>
        </View>
      </View>

      {showProgress && (
        <View style={styles.progressContainer}>
          <LinearProgress
            progress={score}
            variant={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'default'}
            size="sm"
          />
        </View>
      )}

      <Text
        style={[
          styles.status,
          { color: getScoreColor() },
        ]}
      >
        {getScoreLabel()}
      </Text>
    </View>
  );
};

// Trust Metrics Row
interface TrustMetric {
  icon: string;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

interface TrustMetricsRowProps {
  metrics: TrustMetric[];
  style?: ViewStyle;
}

export const TrustMetricsRow: React.FC<TrustMetricsRowProps> = ({
  metrics,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.metricsContainer, style]}>
      {metrics.map((metric, index) => (
        <View key={index} style={styles.metric}>
          <Text style={styles.metricIcon}>{metric.icon}</Text>
          <Text
            style={[
              styles.metricValue,
              { color: theme.colors.text.primary },
            ]}
          >
            {metric.value}
          </Text>
          <Text
            style={[
              styles.metricLabel,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {metric.label}
          </Text>
          {metric.trend && (
            <Text style={styles.metricTrend}>
              {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

// Trust Badge
interface TrustBadgeProps {
  type: 'verified' | 'premium' | 'organizer' | 'business' | 'top-rated';
  label?: string;
  style?: ViewStyle;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  type,
  label,
  style,
}) => {
  const theme = useTheme();

  const getConfig = () => {
    switch (type) {
      case 'verified':
        return { icon: '✓', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'premium':
        return { icon: '⭐', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'organizer':
        return { icon: '🎯', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' };
      case 'business':
        return { icon: '🏢', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'top-rated':
        return { icon: '🏆', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
    }
  };

  const config = getConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.color,
        },
        style,
      ]}
    >
      <Text style={styles.badgeIcon}>{config.icon}</Text>
      <Text style={[styles.badgeText, { color: config.color }]}>
        {label || type.replace('-', ' ')}
      </Text>
    </View>
  );
};

// Trust Indicators
interface TrustIndicator {
  label: string;
  verified: boolean;
}

interface TrustIndicatorsProps {
  indicators: TrustIndicator[];
  style?: ViewStyle;
}

export const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  indicators,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.indicatorsContainer, style]}>
      {indicators.map((indicator, index) => (
        <View key={index} style={styles.indicator}>
          <Text style={styles.indicatorIcon}>
            {indicator.verified ? '✓' : '○'}
          </Text>
          <Text
            style={[
              styles.indicatorLabel,
              {
                color: indicator.verified
                  ? theme.colors.text.primary
                  : theme.colors.text.tertiary,
              },
            ]}
          >
            {indicator.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

// Complete Trust Block
interface TrustBlockProps {
  trustScore?: number;
  isVerified?: boolean;
  isPremium?: boolean;
  isOrganizer?: boolean;
  isBusiness?: boolean;
  averageRating?: number;
  reviewCount?: number;
  attendanceRate?: number;
  hostedEventsCount?: number;
  memberSince?: string;
  badges?: Array<'verified' | 'premium' | 'organizer' | 'business' | 'top-rated'>;
  style?: ViewStyle;
}

export const TrustBlock: React.FC<TrustBlockProps> = ({
  trustScore,
  isVerified = false,
  isPremium = false,
  isOrganizer = false,
  isBusiness = false,
  averageRating,
  reviewCount,
  attendanceRate,
  hostedEventsCount,
  memberSince,
  badges = [],
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.block,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.blockHeader}>
        <Text
          style={[
            styles.blockTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          🛡️ Trust & Safety
        </Text>
      </View>

      {/* Trust Score */}
      {trustScore !== undefined && (
        <TrustScoreDisplay
          score={trustScore}
          label="Overall Trust"
          style={styles.scoreSection}
        />
      )}

      {/* Badges */}
      {(isVerified || isPremium || isOrganizer || isBusiness || badges.length > 0) && (
        <View style={styles.badgesSection}>
          {isVerified && <TrustBadge type="verified" />}
          {isPremium && <TrustBadge type="premium" />}
          {isOrganizer && <TrustBadge type="organizer" />}
          {isBusiness && <TrustBadge type="business" />}
          {badges.map((badge, index) => (
            <TrustBadge key={index} type={badge} />
          ))}
        </View>
      )}

      {/* Metrics */}
      <View style={styles.metricsSection}>
        <TrustMetricsRow
          metrics={[
            ...(averageRating !== undefined
              ? [
                  {
                    icon: '⭐',
                    label: 'Rating',
                    value: averageRating.toFixed(1),
                    trend: 'up' as const,
                  },
                ]
              : []),
            ...(attendanceRate !== undefined
              ? [
                  {
                    icon: '✓',
                    label: 'Attendance',
                    value: `${attendanceRate}%`,
                    trend: attendanceRate >= 80 ? 'up' as const : 'neutral' as const,
                  },
                ]
              : []),
            ...(hostedEventsCount !== undefined
              ? [
                  {
                    icon: '📅',
                    label: 'Events',
                    value: hostedEventsCount,
                  },
                ]
              : []),
          ]}
        />
      </View>

      {/* Indicators */}
      <TrustIndicators
        indicators={[
          { label: 'Identity Verified', verified: isVerified },
          { label: 'Payment Protected', verified: true },
          { label: '24h Support', verified: true },
          { label: 'Community Guidelines', verified: true },
        ]}
        style={styles.indicatorsSection}
      />

      {/* Member Since */}
      {memberSince && (
        <Text
          style={[
            styles.memberSince,
            { color: theme.colors.text.tertiary },
          ]}
        >
          Member since {memberSince}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  scoreLabel: {
    fontSize: 14,
    marginLeft: spacing[1],
  },
  progressContainer: {
    marginTop: spacing[2],
  },
  status: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    marginTop: spacing[1],
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 20,
    marginBottom: spacing[1],
  },
  metricValue: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  metricLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  metricTrend: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  badgeText: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    textTransform: 'capitalize',
  },
  indicatorsContainer: {},
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  indicatorIcon: {
    fontSize: 14,
    marginRight: spacing[2],
    color: '#10B981',
  },
  indicatorLabel: {
    fontSize: 13,
  },
  block: {
    padding: spacing[4],
  },
  blockHeader: {
    marginBottom: spacing[3],
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  scoreSection: {
    marginBottom: spacing[4],
  },
  badgesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  metricsSection: {
    marginBottom: spacing[4],
  },
  indicatorsSection: {
    marginBottom: spacing[3],
  },
  memberSince: {
    fontSize: 12,
    textAlign: 'center',
  },
});

TrustScoreDisplay.displayName = 'TrustScoreDisplay';
TrustMetricsRow.displayName = 'TrustMetricsRow';
TrustBadge.displayName = 'TrustBadge';
TrustIndicators.displayName = 'TrustIndicators';
TrustBlock.displayName = 'TrustBlock';

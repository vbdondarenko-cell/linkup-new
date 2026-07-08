/**
 * LinkUp Design System 2026
 * Progress Components - Linear, Circular, XP, Skeleton, Shimmer
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedProps,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { spacing } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

// ============================================
// LINEAR PROGRESS
// ============================================

interface LinearProgressProps {
  progress: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const LinearProgress: React.FC<LinearProgressProps> = ({
  progress,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  style,
}) => {
  const theme = useTheme();
  const progressValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      progressValue.value = withTiming(progress, { duration: 500 });
    } else {
      progressValue.value = progress;
    }
  }, [progress, animated, progressValue]);

  const getProgressColor = () => {
    const { colors } = theme;
    const colorMap = {
      default: colors.interactive.primary,
      success: colors.status.success.DEFAULT,
      warning: colors.status.warning.DEFAULT,
      danger: colors.status.danger.DEFAULT,
      premium: colors.premium.gold.DEFAULT,
    };
    return colorMap[variant];
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 4;
      case 'lg': return 12;
      default: return 8;
    }
  };

  const progressColor = getProgressColor();
  const height = getHeight();

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(progressValue.value, 0), 100)}%`,
  }));

  return (
    <View style={[styles.linearContainer, style]}>
      {showLabel && (
        <View style={styles.linearLabelContainer}>
          <Text style={[styles.linearLabel, { color: theme.colors.text.secondary }]}>
            {label || `${Math.round(progress)}%`}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.linearTrack,
          {
            height,
            backgroundColor: theme.colors.surface.tertiary,
            borderRadius: height / 2,
          },
        ]}
      >
        <AnimatedView
          style={[
            styles.linearBar,
            {
              height,
              backgroundColor: progressColor,
              borderRadius: height / 2,
            },
            animatedBarStyle,
          ]}
        />
      </View>
    </View>
  );
};

// ============================================
// CIRCULAR PROGRESS
// ============================================

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 80,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  label,
  animated = true,
  style,
}) => {
  const theme = useTheme();
  const progressValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      progressValue.value = withTiming(progress, { duration: 500 });
    } else {
      progressValue.value = progress;
    }
  }, [progress, animated, progressValue]);

  const getProgressColor = () => {
    const { colors } = theme;
    const colorMap = {
      default: colors.interactive.primary,
      success: colors.status.success.DEFAULT,
      warning: colors.status.warning.DEFAULT,
      danger: colors.status.danger.DEFAULT,
      premium: colors.premium.gold.DEFAULT,
    };
    return colorMap[variant];
  };

  const progressColor = getProgressColor();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedStrokeStyle = useAnimatedStyle(() => {
    const strokeDashoffset = interpolate(
      progressValue.value,
      [0, 100],
      [circumference, 0],
      Extrapolation.CLAMP
    );
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.circularContainer, { width: size, height: size }, style]}>
      {/* Background Circle - Using View for simplicity */}
      <View
        style={[
          styles.circularTrack,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: theme.colors.surface.tertiary,
          },
        ]}
      />
      
      {/* Progress indicator using partial border simulation */}
      <View
        style={[
          styles.circularProgress,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: progressColor,
            borderRightColor: progress < 25 ? 'transparent' : progressColor,
            borderBottomColor: progress < 50 ? 'transparent' : progressColor,
            borderLeftColor: progress < 75 ? 'transparent' : progressColor,
            transform: [{ rotate: '-90deg' }],
          },
        ]}
      />

      {showLabel && (
        <View style={styles.circularLabelContainer}>
          <Text
            style={[
              styles.circularLabel,
              {
                fontSize: size * 0.25,
                fontWeight: fontWeight.semibold,
                color: theme.colors.text.primary,
              },
            ]}
          >
            {label || `${Math.round(progress)}%`}
          </Text>
        </View>
      )}
    </View>
  );
};

// ============================================
// XP PROGRESS
// ============================================

interface XPProgressProps {
  currentXP: number;
  xpToNextLevel: number;
  level: number;
  showLabel?: boolean;
  style?: ViewStyle;
}

export const XPProgress: React.FC<XPProgressProps> = ({
  currentXP,
  xpToNextLevel,
  level,
  showLabel = true,
  style,
}) => {
  const theme = useTheme();
  const progress = (currentXP / xpToNextLevel) * 100;

  return (
    <View style={[styles.xpContainer, style]}>
      {showLabel && (
        <View style={styles.xpHeader}>
          <Text style={[styles.xpLevel, { color: theme.colors.premium.gold.DEFAULT }]}>
            Level {level}
          </Text>
          <Text style={[styles.xpText, { color: theme.colors.text.tertiary }]}>
            {currentXP} / {xpToNextLevel} XP
          </Text>
        </View>
      )}
      <LinearProgress
        progress={progress}
        variant="premium"
        size="sm"
      />
    </View>
  );
};

// ============================================
// SKELETON LOADER
// ============================================

interface SkeletonProps {
  width?: number | string;
  height?: number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  variant = 'rectangular',
  borderRadius,
  style,
}) => {
  const theme = useTheme();

  const getBorderRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    switch (variant) {
      case 'circular': return 999;
      case 'text': return 4;
      default: return theme.radius.component.card;
    }
  };

  const getWidth = () => {
    if (typeof width === 'number') return width;
    return '100%';
  };

  return (
    <View
      style={[
        styles.skeleton,
        {
          width: getWidth(),
          height,
          backgroundColor: theme.colors.surface.tertiary,
          borderRadius: getBorderRadius(),
        },
        style,
      ]}
    />
  );
};

// ============================================
// SKELETON GROUP
// ============================================

interface SkeletonGroupProps {
  count?: number;
  gap?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 3,
  gap = spacing[2],
  children,
  style,
}) => {
  return (
    <View style={[styles.skeletonGroup, { gap }, style]}>
      {children ||
        Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} height={16} />
        ))}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Linear Progress
  linearContainer: {},
  linearLabelContainer: {
    marginBottom: spacing[1],
  },
  linearLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  linearTrack: {
    width: '100%',
    overflow: 'hidden',
  },
  linearBar: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  // Circular Progress
  circularContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTrack: {
    position: 'absolute',
  },
  circularProgress: {
    position: 'absolute',
  },
  circularLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularLabel: {},

  // XP Progress
  xpContainer: {},
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  xpLevel: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  xpText: {
    fontSize: 12,
  },

  // Skeleton
  skeleton: {},
  skeletonGroup: {},
});

LinearProgress.displayName = 'LinearProgress';
CircularProgress.displayName = 'CircularProgress';
XPProgress.displayName = 'XPProgress';
Skeleton.displayName = 'Skeleton';
SkeletonGroup.displayName = 'SkeletonGroup';

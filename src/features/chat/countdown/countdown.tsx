/**
 * LinkUp Design System 2026
 * Countdown - 6-hour auto-delete timer
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

interface CountdownTimerProps {
  endsAt: Date;
  onExpire: () => void;
  showProgress?: boolean;
  compact?: boolean;
  style?: ViewStyle;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

const getTimeRemaining = (endsAt: Date): TimeRemaining => {
  const now = new Date();
  const diff = endsAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds, totalMs: diff };
};

// Animated digit display
interface AnimatedDigitProps {
  value: number;
  label: string;
  isUrgent?: boolean;
}

const AnimatedDigit: React.FC<AnimatedDigitProps> = ({
  value,
  label,
  isUrgent = false,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withSpring(1.1, { damping: 10, stiffness: 200 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, 100);
  }, [value, scale]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={[styles.digitContainer, animatedStyle]}>
      <View
        style={[
          styles.digitBox,
          {
            backgroundColor: isUrgent
              ? 'rgba(239, 68, 68, 0.1)'
              : theme.colors.surface.secondary,
            borderColor: isUrgent
              ? 'rgba(239, 68, 68, 0.3)'
              : theme.colors.border.default,
          },
        ]}
      >
        <Text
          style={[
            styles.digitValue,
            {
              color: isUrgent
                ? '#EF4444'
                : theme.colors.text.primary,
            },
          ]}
        >
          {value.toString().padStart(2, '0')}
        </Text>
      </View>
      <Text
        style={[
          styles.digitLabel,
          { color: theme.colors.text.tertiary },
        ]}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

// Compact countdown (header version)
interface CompactCountdownProps {
  hours: number;
  minutes: number;
  style?: ViewStyle;
}

export const CompactCountdown: React.FC<CompactCountdownProps> = ({
  hours,
  minutes,
  style,
}) => {
  const theme = useTheme();
  const isUrgent = hours < 1;
  
  return (
    <View
      style={[
        styles.compactContainer,
        {
          backgroundColor: isUrgent
            ? 'rgba(239, 68, 68, 0.1)'
            : 'rgba(245, 158, 11, 0.1)',
        },
        style,
      ]}
    >
      <Text style={styles.compactIcon}>⏳</Text>
      <Text
        style={[
          styles.compactText,
          {
            color: isUrgent
              ? '#EF4444'
              : '#F59E0B',
          },
        ]}
      >
        {hours > 0
          ? `${hours}h ${minutes}m`
          : `${minutes}m`}
      </Text>
    </View>
  );
};

// Main Countdown Timer
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endsAt,
  onExpire,
  showProgress = true,
  compact = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    getTimeRemaining(endsAt)
  );
  
  const totalDuration = 6 * 60 * 60 * 1000; // 6 hours in ms
  
  // Update timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(endsAt);
      setTimeRemaining(remaining);
      
      // Haptic feedback at key moments
      if (remaining.hours === 1 && remaining.minutes === 0 && remaining.seconds === 0) {
        haptics.warning?.();
      } else if (remaining.hours === 0 && remaining.minutes === 30 && remaining.seconds === 0) {
        haptics.warning?.();
      } else if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 30) {
        haptics.warning?.();
      }
      
      if (remaining.totalMs <= 0) {
        clearInterval(interval);
        haptics.error?.();
        onExpire();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [endsAt, onExpire, haptics]);
  
  const isUrgent = timeRemaining.hours < 1;
  const progress = Math.max(0, (timeRemaining.totalMs / totalDuration) * 100);
  
  if (compact) {
    return (
      <CompactCountdown
        hours={timeRemaining.hours}
        minutes={timeRemaining.minutes}
        style={style}
      />
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⏳</Text>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Chat ending soon
        </Text>
      </View>
      
      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <AnimatedDigit
          value={timeRemaining.hours}
          label="hours"
          isUrgent={isUrgent}
        />
        <Text style={[styles.separator, { color: theme.colors.text.tertiary }]}>:</Text>
        <AnimatedDigit
          value={timeRemaining.minutes}
          label="min"
          isUrgent={isUrgent}
        />
        <Text style={[styles.separator, { color: theme.colors.text.tertiary }]}>:</Text>
        <AnimatedDigit
          value={timeRemaining.seconds}
          label="sec"
          isUrgent={isUrgent}
        />
      </View>
      
      {/* Progress Bar */}
      {showProgress && (
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.colors.surface.tertiary },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: isUrgent
                  ? '#EF4444'
                  : '#F59E0B',
              },
            ]}
          />
        </View>
      )}
      
      {/* Info */}
      <Text
        style={[
          styles.info,
          { color: theme.colors.text.tertiary },
        ]}
      >
        This chat will be automatically deleted after the event ends
      </Text>
    </View>
  );
};

// Countdown Progress Ring
interface CountdownRingProps {
  hours: number;
  minutes: number;
  totalHours: number;
  size?: number;
  strokeWidth?: number;
  style?: ViewStyle;
}

export const CountdownRing: React.FC<CountdownRingProps> = ({
  hours,
  minutes,
  totalHours,
  size = 120,
  strokeWidth = 8,
  style,
}) => {
  const theme = useTheme();
  
  const totalMinutes = hours * 60 + minutes;
  const total = totalHours * 60;
  const progress = totalMinutes / total;
  
  const isUrgent = hours < 1;
  
  // Calculate arc
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
  return (
    <View style={[styles.ringContainer, { width: size, height: size }, style]}>
      {/* Background Circle */}
      <View
        style={[
          styles.ringBackground,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: theme.colors.surface.tertiary,
          },
        ]}
      />
      
      {/* Progress Circle (simplified - actual implementation would use SVG) */}
      <View
        style={[
          styles.ringProgress,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: isUrgent ? '#EF4444' : '#F59E0B',
            borderTopColor: 'transparent',
            borderRightColor: progress > 0.25 ? (isUrgent ? '#EF4444' : '#F59E0B') : 'transparent',
            borderBottomColor: progress > 0.5 ? (isUrgent ? '#EF4444' : '#F59E0B') : 'transparent',
            borderLeftColor: progress > 0.75 ? (isUrgent ? '#EF4444' : '#F59E0B') : 'transparent',
            transform: [{ rotate: '-90deg' }],
          },
        ]}
      />
      
      {/* Center Content */}
      <View style={styles.ringContent}>
        <Text
          style={[
            styles.ringTime,
            {
              color: isUrgent
                ? '#EF4444'
                : theme.colors.text.primary,
            },
          ]}
        >
          {hours > 0 ? `${hours}h` : ''} {minutes}m
        </Text>
        <Text
          style={[
            styles.ringLabel,
            { color: theme.colors.text.tertiary },
          ]}
        >
          remaining
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  headerIcon: {
    fontSize: 20,
    marginRight: spacing[2],
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  digitContainer: {
    alignItems: 'center',
  },
  digitBox: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  digitValue: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  digitLabel: {
    fontSize: 11,
    marginTop: spacing[1],
    textTransform: 'uppercase',
  },
  separator: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: spacing[1],
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  compactIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  compactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBackground: {
    position: 'absolute',
  },
  ringProgress: {
    position: 'absolute',
  },
  ringContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTime: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  ringLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});

CountdownTimer.displayName = 'CountdownTimer';
CompactCountdown.displayName = 'CompactCountdown';
CountdownRing.displayName = 'CountdownRing';

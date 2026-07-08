/**
 * LinkUp Design System 2026
 * XP System - Experience points and levels
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
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

// Level definitions
export type LevelName = 'Explorer' | 'Connector' | 'Host' | 'Leader' | 'Ambassador' | 'Legend';

export interface Level {
  name: LevelName;
  minXP: number;
  icon: string;
  color: string;
  bgColor: string;
}

export const LEVELS: Level[] = [
  { name: 'Explorer', minXP: 0, icon: '🧭', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
  { name: 'Connector', minXP: 100, icon: '🔗', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  { name: 'Host', minXP: 300, icon: '🎉', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  { name: 'Leader', minXP: 600, icon: '⭐', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  { name: 'Ambassador', minXP: 1000, icon: '🌟', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { name: 'Legend', minXP: 2000, icon: '👑', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
];

interface XPDisplayProps {
  currentXP: number;
  recentEarnings?: Array<{ amount: number; description: string; date: Date }>;
  style?: ViewStyle;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({
  currentXP,
  recentEarnings = [],
  style,
}) => {
  const theme = useTheme();

  // Calculate current level
  const { level, levelProgress, nextLevelXP, xpToNextLevel } = useMemo(() => {
    let currentLevel = LEVELS[0];
    let nextLevelXPValue = LEVELS[1]?.minXP || currentLevel.minXP + 500;

    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (currentXP >= LEVELS[i].minXP) {
        currentLevel = LEVELS[i];
        nextLevelXPValue = LEVELS[i + 1]?.minXP || currentLevel.minXP + 500;
        break;
      }
    }

    const xpInLevel = currentXP - currentLevel.minXP;
    const xpNeededForLevel = nextLevelXPValue - currentLevel.minXP;
    const progress = (xpInLevel / xpNeededForLevel) * 100;

    return {
      level: currentLevel,
      levelProgress: progress,
      nextLevelXP: nextLevelXPValue,
      xpToNextLevel: nextLevelXPValue - currentXP,
    };
  }, [currentXP]);

  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withTiming(levelProgress, { duration: 1000 });
  }, [levelProgress, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: level.color,
        },
        style,
      ]}
    >
      {/* Level Badge */}
      <View style={styles.levelSection}>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: level.bgColor },
          ]}
        >
          <Text style={styles.levelIcon}>{level.icon}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={[styles.levelName, { color: level.color }]}>
            {level.name}
          </Text>
          <Text style={[styles.xpTotal, { color: theme.colors.text.primary }]}>
            {currentXP} XP
          </Text>
        </View>
      </View>

      {/* Progress to Next Level */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.colors.text.tertiary }]}>
            Next: {LEVELS[LEVELS.indexOf(level) + 1]?.name || 'Max Level'}
          </Text>
          <Text style={[styles.progressValue, { color: theme.colors.text.secondary }]}>
            {xpToNextLevel} XP
          </Text>
        </View>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.colors.surface.tertiary },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: level.color },
              progressStyle,
            ]}
          />
        </View>
      </View>

      {/* Recent Earnings */}
      {recentEarnings.length > 0 && (
        <View style={styles.earningsSection}>
          <Text style={[styles.earningsTitle, { color: theme.colors.text.secondary }]}>
            Recent XP
          </Text>
          {recentEarnings.slice(0, 3).map((earning, index) => (
            <Animated.View
              key={index}
              entering={FadeIn.delay(index * 100)}
              style={[
                styles.earningItem,
                { borderBottomColor: theme.colors.border.default },
              ]}
            >
              <Text style={styles.earningIcon}>✨</Text>
              <Text
                style={[styles.earningDescription, { color: theme.colors.text.primary }]}
                numberOfLines={1}
              >
                {earning.description}
              </Text>
              <Text style={[styles.earningAmount, { color: level.color }]}>
                +{earning.amount}
              </Text>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
};

// Level Badge Component
interface LevelBadgeProps {
  level: Level;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  style?: ViewStyle;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'md',
  showLabel = true,
  style,
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'sm': return { icon: 20, container: 36, text: 12 };
      case 'lg': return { icon: 32, container: 56, text: 16 };
      default: return { icon: 24, container: 44, text: 14 };
    }
  };

  const sizes = getSize();

  return (
    <View style={[styles.badgeContainer, style]}>
      <View
        style={[
          styles.badgeCircle,
          {
            width: sizes.container,
            height: sizes.container,
            backgroundColor: level.bgColor,
            borderColor: level.color,
          },
        ]}
      >
        <Text style={{ fontSize: sizes.icon }}>{level.icon}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.badgeLabel, { color: level.color }]}>
          {level.name}
        </Text>
      )}
    </View>
  );
};

// Level Progress Indicator
interface LevelProgressProps {
  currentLevel: Level;
  nextLevel?: Level;
  progress: number;
  style?: ViewStyle;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  nextLevel,
  progress,
  style,
}) => {
  const theme = useTheme();

  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withSpring(progress, { damping: 15, stiffness: 100 });
  }, [progress, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={[styles.levelProgressContainer, style]}>
      <LevelBadge level={currentLevel} size="sm" />
      
      <View style={styles.levelProgressTrack}>
        <View
          style={[
            styles.levelProgressFill,
            { backgroundColor: currentLevel.color },
            progressStyle,
          ]}
        />
      </View>
      
      {nextLevel && <LevelBadge level={nextLevel} size="sm" showLabel={false} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    padding: spacing[4],
    marginHorizontal: spacing[4],
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  levelBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  levelIcon: {
    fontSize: 28,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
  },
  xpTotal: {
    fontSize: 15,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: spacing[3],
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
  earningsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing[3],
  },
  earningsTitle: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[2],
  },
  earningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
  },
  earningIcon: {
    fontSize: 14,
    marginRight: spacing[2],
  },
  earningDescription: {
    flex: 1,
    fontSize: 14,
  },
  earningAmount: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  badgeContainer: {
    alignItems: 'center',
  },
  badgeCircle: {
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    marginTop: spacing[1],
  },
  levelProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginHorizontal: spacing[2],
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

XPDisplay.displayName = 'XPDisplay';
LevelBadge.displayName = 'LevelBadge';
LevelProgress.displayName = 'LevelProgress';

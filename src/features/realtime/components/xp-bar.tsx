/**
 * LinkUp Design System 2026
 * Realtime - XP Bar Component
 */

'use client';

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { XPState, Level } from '../types';

interface XPBarProps {
  xp: XPState;
  currentLevel: Level;
  nextLevel?: Level | null;
  onPress?: () => void;
  showDetails?: boolean;
  style?: ViewStyle;
}

export const XPBar: React.FC<XPBarProps> = ({
  xp,
  currentLevel,
  nextLevel,
  onPress,
  showDetails = true,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(xp.levelProgress, {
      damping: 15,
      stiffness: 100,
    });
  }, [xp.levelProgress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View entering={FadeIn}>
      <Pressable 
        onPress={() => { haptics.light(); onPress?.(); }}
        style={({ pressed }) => [
          styles.container,
          { backgroundColor: theme.colors.surface.primary },
          pressed && styles.pressed,
          style,
        ]}
      >
        {/* Level Badge */}
        <View style={[styles.levelBadge, { backgroundColor: `${currentLevel.color}20` }]}>
          <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
        </View>

        {/* XP Info */}
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={[styles.levelName, { color: theme.colors.text.primary }]}>
              {currentLevel.name}
            </Text>
            <Text style={[styles.levelNumber, { color: theme.colors.text.tertiary }]}>
              Level {currentLevel.id}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface.secondary }]}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { backgroundColor: currentLevel.color },
                  animatedProgressStyle,
                ]} 
              />
            </View>
          </View>

          {/* XP Text */}
          {showDetails && (
            <View style={styles.xpRow}>
              <Text style={[styles.xpText, { color: theme.colors.text.tertiary }]}>
                {xp.currentXP} XP
              </Text>
              {nextLevel && (
                <Text style={[styles.xpText, { color: theme.colors.text.tertiary }]}>
                  {nextLevel.requiredXP - xp.totalXP} XP to {nextLevel.name}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Total XP */}
        <View style={[styles.totalBadge, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={[styles.totalText, { color: theme.colors.text.primary }]}>
            {xp.totalXP}
          </Text>
          <Text style={[styles.totalLabel, { color: theme.colors.text.tertiary }]}>
            Total
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// XP Gain Toast Component
interface XPGainToastProps {
  amount: number;
  reason: string;
  onDismiss: () => void;
  style?: ViewStyle;
}

export const XPGainToast: React.FC<XPGainToastProps> = ({
  amount,
  reason,
  onDismiss,
  style,
}) => {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Animated.View 
      entering={FadeInUp.springify()}
      exiting={FadeIn.duration(200)}
      style={[styles.toast, { backgroundColor: theme.colors.surface.primary }, style]}
    >
      <View style={[styles.toastIcon, { backgroundColor: `${theme.colors.primary.DEFAULT}20` }]}>
        <Text style={styles.toastIconText}>✨</Text>
      </View>
      <View style={styles.toastContent}>
        <Text style={[styles.toastAmount, { color: theme.colors.primary.DEFAULT }]}>
          +{amount} XP
        </Text>
        <Text style={[styles.toastReason, { color: theme.colors.text.secondary }]}>
          {reason}
        </Text>
      </View>
    </Animated.View>
  );
};

// Level Up Celebration Component
interface LevelUpCelebrationProps {
  level: Level;
  rewards?: string[];
  onDismiss: () => void;
  style?: ViewStyle;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  level,
  rewards = [],
  onDismiss,
  style,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={[styles.celebrationOverlay, style]}
    >
      <Pressable onPress={onDismiss} style={styles.celebrationBackdrop}>
        <View />
      </Pressable>
      
      <Animated.View 
        style={[
          styles.celebrationCard,
          { backgroundColor: theme.colors.surface.primary },
          animatedStyle,
        ]}
      >
        <View style={[styles.celebrationBadge, { backgroundColor: `${level.color}20` }]}>
          <Text style={styles.celebrationIcon}>{level.icon}</Text>
        </View>
        
        <Text style={[styles.celebrationTitle, { color: theme.colors.text.primary }]}>
          Level Up!
        </Text>
        
        <Text style={[styles.celebrationLevel, { color: level.color }]}>
          {level.name}
        </Text>
        
        {rewards.length > 0 && (
          <View style={styles.rewardsSection}>
            <Text style={[styles.rewardsTitle, { color: theme.colors.text.tertiary }]}>
              Unlocked:
            </Text>
            {rewards.map((reward, index) => (
              <Text key={index} style={[styles.rewardText, { color: theme.colors.text.secondary }]}>
                • {reward}
              </Text>
            ))}
          </View>
        )}
        
        <Pressable
          onPress={onDismiss}
          style={[styles.celebrationButton, { backgroundColor: level.color }]}
        >
          <Text style={styles.celebrationButtonText}>Continue</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  levelIcon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  levelName: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  levelNumber: {
    fontSize: 12,
    marginLeft: spacing[2],
  },
  progressContainer: {
    marginBottom: spacing[1],
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
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpText: {
    fontSize: 11,
  },
  totalBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: spacing[3],
  },
  totalText: {
    fontSize: 14,
    fontWeight: fontWeight.bold,
  },
  totalLabel: {
    fontSize: 10,
  },
  // Toast
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 16,
    marginHorizontal: spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toastIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  toastIconText: {
    fontSize: 20,
  },
  toastContent: {
    flex: 1,
  },
  toastAmount: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
  toastReason: {
    fontSize: 13,
    marginTop: 2,
  },
  // Celebration
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  celebrationBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  celebrationCard: {
    width: '80%',
    padding: spacing[6],
    borderRadius: 24,
    alignItems: 'center',
  },
  celebrationBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  celebrationIcon: {
    fontSize: 40,
  },
  celebrationTitle: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[1],
  },
  celebrationLevel: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[4],
  },
  rewardsSection: {
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  rewardsTitle: {
    fontSize: 12,
    marginBottom: spacing[2],
  },
  rewardText: {
    fontSize: 13,
    marginBottom: 2,
  },
  celebrationButton: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: 12,
  },
  celebrationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});

XPBar.displayName = 'XPBar';
XPGainToast.displayName = 'XPGainToast';
LevelUpCelebration.displayName = 'LevelUpCelebration';

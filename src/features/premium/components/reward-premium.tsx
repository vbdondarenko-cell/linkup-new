/**
 * LinkUp Design System 2026
 * Premium - Reward Premium Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { RewardPremiumState, REWARD_ADS_REQUIRED, REWARD_PREMIUM_DURATION_HOURS } from '../types';

interface RewardPremiumCardProps {
  rewardState: RewardPremiumState;
  isPremium: boolean;
  onWatchAd: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
}

export const RewardPremiumCard: React.FC<RewardPremiumCardProps> = ({
  rewardState,
  isPremium,
  onWatchAd,
  isLoading = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  
  const progress = (rewardState.adsWatched / REWARD_ADS_REQUIRED) * 100;
  const progressAnimated = useSharedValue(0);

  useEffect(() => {
    progressAnimated.value = withTiming(progress, { duration: 500 });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnimated.value}%`,
  }));

  const isInCooldown = rewardState.cooldownEndsAt && new Date() < rewardState.cooldownEndsAt;
  const canWatchAd = !isInCooldown && rewardState.adsWatched < REWARD_ADS_REQUIRED && !isPremium;

  const formatCooldownTime = () => {
    if (!rewardState.cooldownEndsAt) return '';
    const diff = rewardState.cooldownEndsAt.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleWatchAd = () => {
    haptics.medium();
    onWatchAd();
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(300).springify()}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFD70015' }]}>
          <Text style={styles.icon}>🎁</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Reward Premium
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Watch ads, unlock free Premium
          </Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        {/* Progress Bar */}
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface.secondary }]}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { backgroundColor: '#FFD700' },
              progressStyle
            ]} 
          />
        </View>

        {/* Progress Text */}
        <View style={styles.progressTextRow}>
          <Text style={[styles.progressText, { color: theme.colors.text.secondary }]}>
            {rewardState.adsWatched} / {REWARD_ADS_REQUIRED} ads watched
          </Text>
          <Text style={[styles.rewardDuration, { color: '#FFD700' }]}>
            → {REWARD_PREMIUM_DURATION_HOURS}h Premium
          </Text>
        </View>
      </View>

      {/* Cooldown Message */}
      {isInCooldown && (
        <View style={[styles.cooldownContainer, { backgroundColor: '#EF444415' }]}>
          <Text style={styles.cooldownIcon}>⏰</Text>
          <Text style={[styles.cooldownText, { color: '#EF4444' }]}>
            Cooldown: {formatCooldownTime()} remaining
          </Text>
        </View>
      )}

      {/* Action */}
      {canWatchAd && (
        <Button
          variant="primary"
          size="lg"
          onPress={handleWatchAd}
          loading={isLoading}
          style={styles.watchButton}
        >
          Watch Ad
        </Button>
      )}

      {/* Unlocked Message */}
      {isPremium && rewardState.premiumExpiresAt && (
        <View style={[styles.unlockedContainer, { backgroundColor: '#10B98115' }]}>
          <Text style={styles.unlockedIcon}>✓</Text>
          <View>
            <Text style={[styles.unlockedTitle, { color: '#10B981' }]}>
              Premium Activated!
            </Text>
            <Text style={[styles.unlockedText, { color: theme.colors.text.secondary }]}>
              Expires {rewardState.premiumExpiresAt.toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}

      {/* Info */}
      <Text style={[styles.infoText, { color: theme.colors.text.tertiary }]}>
        Watch {REWARD_ADS_REQUIRED - rewardState.adsWatched} more ads to unlock {REWARD_PREMIUM_DURATION_HOURS}h of Premium for free. 72h cooldown after each reward.
      </Text>
    </Animated.View>
  );
};

// Reward Progress Dots Component
interface RewardProgressDotsProps {
  adsWatched: number;
  adsRequired: number;
  style?: ViewStyle;
}

export const RewardProgressDots: React.FC<RewardProgressDotsProps> = ({
  adsWatched,
  adsRequired,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.dotsContainer, style]}>
      {Array.from({ length: adsRequired }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { 
              backgroundColor: index < adsWatched ? '#FFD700' : theme.colors.surface.secondary,
              borderColor: index < adsWatched ? '#FFD700' : theme.colors.border.default,
            },
          ]}
        >
          {index < adsWatched && <Text style={styles.dotCheck}>✓</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    borderRadius: 20,
    marginHorizontal: spacing[5],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  title: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: spacing[4],
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  progressText: {
    fontSize: 13,
  },
  rewardDuration: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
  },
  cooldownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: 12,
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  cooldownIcon: {
    fontSize: 16,
  },
  cooldownText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  watchButton: {
    marginBottom: spacing[4],
  },
  unlockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: 12,
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  unlockedIcon: {
    fontSize: 20,
  },
  unlockedTitle: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  unlockedText: {
    fontSize: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCheck: {
    fontSize: 12,
    color: '#000000',
    fontWeight: fontWeight.bold,
  },
});

RewardPremiumCard.displayName = 'RewardPremiumCard';
RewardProgressDots.displayName = 'RewardProgressDots';

/**
 * LinkUp Design System 2026
 * Premium Home - Premium Hero Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';

interface PremiumHeroProps {
  isPremium: boolean;
  planName?: string;
  expiresAt?: Date;
  onUpgradePress?: () => void;
  onManagePress?: () => void;
  style?: ViewStyle;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({
  isPremium,
  planName,
  expiresAt,
  onUpgradePress,
  onManagePress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = () => {
    if (!expiresAt) return 0;
    const diff = expiresAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[
        styles.container,
        { backgroundColor: isPremium ? '#1A1A2E' : theme.colors.surface.primary },
        style,
      ]}
    >
      {/* Background Gradient Effect */}
      <View style={[styles.gradientOverlay, isPremium && styles.premiumGradient]} />

      {/* Premium Badge */}
      <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.badge}>
        <View style={[styles.badgeInner, isPremium && styles.premiumBadgeInner]}>
          <Text style={styles.badgeIcon}>⭐</Text>
          <Text style={[styles.badgeText, isPremium && styles.premiumBadgeText]}>Premium</Text>
        </View>
      </Animated.View>

      {/* Illustration */}
      <Animated.View entering={FadeInUp.delay(150).springify()} style={styles.illustration}>
        <Text style={styles.illustrationEmoji}>
          {isPremium ? '✨🌟✨' : '🌟'}
        </Text>
      </Animated.View>

      {/* Headline */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.content}>
        <Text style={[styles.headline, { color: isPremium ? '#FFFFFF' : theme.colors.text.primary }]}>
          {isPremium 
            ? "You're Premium!"
            : 'Elevate Your Experience'
          }
        </Text>

        <Text style={[styles.subheadline, { color: isPremium ? '#B8B8D1' : theme.colors.text.secondary }]}>
          {isPremium
            ? `${planName || 'Premium'} · ${daysRemaining} days remaining`
            : 'Unlock exclusive themes, advanced features, and priority support'
          }
        </Text>
      </Animated.View>

      {/* Action Button */}
      <Animated.View entering={FadeInUp.delay(250).springify()} style={styles.action}>
        {isPremium ? (
          <Pressable
            onPress={() => { haptics.light(); onManagePress?.(); }}
            style={({ pressed }) => [
              styles.manageButton,
              { backgroundColor: 'rgba(255,255,255,0.15)', opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
          </Pressable>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onPress={() => { haptics.light(); onUpgradePress?.(); }}
            style={styles.upgradeButton}
          >
            Upgrade to Premium
          </Button>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing[5],
    padding: spacing[6],
    borderRadius: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  premiumGradient: {
    backgroundColor: 'transparent',
  },
  badge: {
    marginBottom: spacing[4],
  },
  badgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: spacing[1],
  },
  premiumBadgeInner: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    color: '#3B82F6',
  },
  premiumBadgeText: {
    color: '#FFD700',
  },
  illustration: {
    marginBottom: spacing[4],
  },
  illustrationEmoji: {
    fontSize: 48,
  },
  content: {
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  headline: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subheadline: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing[4],
  },
  action: {
    width: '100%',
  },
  upgradeButton: {
    width: '100%',
  },
  manageButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: 14,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});

PremiumHero.displayName = 'PremiumHero';

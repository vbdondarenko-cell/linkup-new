/**
 * LinkUp Design System 2026
 * Auth Welcome Screen
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';

interface WelcomeScreenProps {
  onContinueWithTelegram: () => void;
  onPrivacyPress: () => void;
  onTermsPress: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinueWithTelegram,
  onPrivacyPress,
  onTermsPress,
  isLoading = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleContinue = () => {
    haptics.medium();
    onContinueWithTelegram();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Illustration */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <View style={[styles.illustrationCircle, { backgroundColor: `${theme.colors.primary.DEFAULT}20` }]}>
              <Text style={styles.illustrationEmoji}>📍</Text>
            </View>
            <View style={[styles.illustrationDot, styles.illustrationDot1, { backgroundColor: theme.colors.primary.DEFAULT }]} />
            <View style={[styles.illustrationDot, styles.illustrationDot2, { backgroundColor: '#10B981' }]} />
            <View style={[styles.illustrationDot, styles.illustrationDot3, { backgroundColor: '#F59E0B' }]} />
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Find people for{'\n'}real-life activities
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Discover nearby events, meet new people, and create memorable experiences together.
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.features}>
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: '#10B98120' }]}>
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text.primary }]}>
                Discover Nearby
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.text.tertiary }]}>
                Find events and people in your area
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: '#3B82F620' }]}>
              <Text style={styles.featureEmoji}>🤝</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text.primary }]}>
                Connect Authentically
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.text.tertiary }]}>
                Telegram-powered verification
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: '#8B5CF620' }]}>
              <Text style={styles.featureEmoji}>✨</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text.primary }]}>
                Create Memories
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.text.tertiary }]}>
                Host events and build community
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom */}
      <Animated.View entering={FadeInDown.delay(400)} style={[styles.bottomContainer, { backgroundColor: theme.colors.background.secondary }]}>
        {/* Telegram Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleContinue}
          loading={isLoading}
          style={styles.continueButton}
        >
          Continue with Telegram
        </Button>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: theme.colors.text.tertiary }]}>
            By continuing, you agree to our{' '}
          </Text>
          <Pressable onPress={() => { haptics.light(); onTermsPress(); }}>
            <Text style={[styles.termsLink, { color: theme.colors.primary.DEFAULT }]}>
              Terms of Service
            </Text>
          </Pressable>
          <Text style={[styles.termsText, { color: theme.colors.text.tertiary }]}> and </Text>
          <Pressable onPress={() => { haptics.light(); onPrivacyPress(); }}>
            <Text style={[styles.termsLink, { color: theme.colors.primary.DEFAULT }]}>
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  illustration: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: {
    fontSize: 64,
  },
  illustrationDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  illustrationDot1: {
    top: 20,
    right: 30,
  },
  illustrationDot2: {
    bottom: 40,
    left: 10,
  },
  illustrationDot3: {
    bottom: 20,
    right: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing[3],
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing[4],
  },
  features: {
    gap: spacing[4],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  featureDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  bottomContainer: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[5],
    paddingBottom: spacing[8],
  },
  continueButton: {
    marginBottom: spacing[4],
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
  },
  termsLink: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
});

WelcomeScreen.displayName = 'WelcomeScreen';

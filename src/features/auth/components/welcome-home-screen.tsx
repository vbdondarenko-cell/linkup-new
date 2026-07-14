/**
 * LinkUp Design System 2026
 * Auth Welcome Home Screen
 */

'use client';

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInUp, useSharedValue, useAnimatedStyle, withSequence, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

interface WelcomeHomeScreenProps {
  onComplete: () => void;
  style?: ViewStyle;
}

export const WelcomeHomeScreen: React.FC<WelcomeHomeScreenProps> = ({
  onComplete,
  style,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo
    scale.value = withSequence(
      withDelay(300, withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(1.5)) })),
      withTiming(1, { duration: 200 })
    );
    
    opacity.value = withDelay(800, withTiming(1, { duration: 500 }));

    // Auto-complete after animation
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={[styles.container, { backgroundColor: theme.colors.primary.DEFAULT }, style]}
    >
      {/* Background Pattern */}
      <View style={styles.patternContainer}>
        {[...Array(3)].map((_, i) => (
          <Animated.View 
            key={i}
            entering={FadeIn.delay(100 + i * 100)}
            style={[styles.patternCircle, { 
              width: 200 + i * 100, 
              height: 200 + i * 100,
              borderColor: 'rgba(255,255,255,0.1)',
            }]}
          />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={[styles.logoIcon, { backgroundColor: '#FFFFFF' }]}>
            <Text style={styles.logoEmoji}>📍</Text>
          </View>
        </Animated.View>

        {/* Welcome Text */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>LinkUp</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View entering={FadeInUp.delay(1200)} style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>
            Let's discover your city together
          </Text>
        </Animated.View>

        {/* Loading Dots */}
        <Animated.View entering={FadeIn.delay(1500)} style={styles.loadingContainer}>
          <View style={[styles.loadingDot, { backgroundColor: 'rgba(255,255,255,0.8)' }]} />
          <View style={[styles.loadingDot, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />
          <View style={[styles.loadingDot, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
        </Animated.View>
      </View>

      {/* Bottom Tips */}
      <Animated.View entering={FadeInUp.delay(2000)} style={styles.tipsContainer}>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Tip: Enable notifications to never miss an event
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: spacing[5],
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  welcomeText: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: fontWeight.medium,
  },
  appName: {
    fontSize: 40,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: fontWeight.medium,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[6],
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tipsContainer: {
    position: 'absolute',
    bottom: '15%',
    paddingHorizontal: spacing[6],
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    gap: spacing[2],
  },
  tipIcon: {
    fontSize: 18,
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
});

WelcomeHomeScreen.displayName = 'WelcomeHomeScreen';

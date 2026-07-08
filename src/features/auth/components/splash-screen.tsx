/**
 * LinkUp Design System 2026
 * Auth Splash Screen
 */

'use client';

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

interface SplashScreenProps {
  style?: ViewStyle;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ style }) => {
  const theme = useTheme();
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.8);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={[styles.container, { backgroundColor: theme.colors.primary.DEFAULT }, style]}
    >
      {/* Background Circles */}
      <View style={styles.circlesContainer}>
        <Animated.View style={[styles.circle, styles.circleLarge, pulseStyle]} />
        <Animated.View style={[styles.circle, styles.circleMedium]} />
        <Animated.View style={[styles.circle, styles.circleSmall]} />
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={[styles.logoIcon, { backgroundColor: '#FFFFFF' }]}>
          <Text style={styles.logoEmoji}>📍</Text>
        </View>
        <Text style={styles.logoText}>LinkUp</Text>
      </View>

      {/* Tagline */}
      <View style={styles.taglineContainer}>
        <Text style={styles.taglineText}>Connect through real experiences</Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <View style={[styles.loadingDot, { backgroundColor: 'rgba(255,255,255,0.8)' }]} />
        <View style={[styles.loadingDot, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />
        <View style={[styles.loadingDot, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlesContainer: {
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  circleLarge: {
    width: 200,
    height: 200,
  },
  circleMedium: {
    width: 150,
    height: 150,
  },
  circleSmall: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  logoEmoji: {
    fontSize: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: '25%',
  },
  taglineText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: fontWeight.medium,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: '15%',
    flexDirection: 'row',
    gap: spacing[2],
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

SplashScreen.displayName = 'SplashScreen';

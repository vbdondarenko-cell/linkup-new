/**
 * LinkUp Design System 2026
 * Auth Loading Screen
 */

'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { LOADING_MESSAGES } from '../types';

interface LoadingScreenProps {
  style?: ViewStyle;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ style }) => {
  const theme = useTheme();
  const [messageIndex, setMessageIndex] = useState(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Rotate messages
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    // Progress animation
    progressWidth.value = withRepeat(
      withTiming(100, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    return () => {
      clearInterval(messageInterval);
    };
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.primary.DEFAULT }, style]}
    >
      {/* Logo */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.logoContainer}>
        <View style={[styles.logoIcon, { backgroundColor: '#FFFFFF' }]}>
          <Text style={styles.logoEmoji}>📍</Text>
        </View>
        <Text style={styles.logoText}>LinkUp</Text>
      </Animated.View>

      {/* Progress */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Animated.View 
            style={[styles.progressFill, { backgroundColor: '#FFFFFF' }, progressStyle]} 
          />
        </View>
        
        {/* Message */}
        <Animated.View 
          key={messageIndex}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.messageContainer}
        >
          <Text style={styles.messageText}>
            {LOADING_MESSAGES[messageIndex]}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Telegram Logo */}
      <Animated.View entering={FadeInUp.delay(600)} style={styles.telegramContainer}>
        <View style={styles.telegramLogo}>
          <Text style={styles.telegramIcon}>✈️</Text>
        </View>
        <Text style={styles.telegramText}>Connecting to Telegram</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  logoEmoji: {
    fontSize: 36,
  },
  logoText: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  messageContainer: {
    marginTop: spacing[4],
    minHeight: 24,
  },
  messageText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  telegramContainer: {
    position: 'absolute',
    bottom: '20%',
    alignItems: 'center',
  },
  telegramLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  telegramIcon: {
    fontSize: 24,
  },
  telegramText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: fontWeight.medium,
  },
});

LoadingScreen.displayName = 'LoadingScreen';

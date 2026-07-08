/**
 * LinkUp Design System 2026
 * Home Header - Premium greeting and navigation
 */

'use client';

import React, { useMemo, useCallback } from 'react';
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
} from 'react-native-reanimated';
import { useTheme } from '../../ui/providers/theme-provider';
import { useHaptics } from '../../ui/hooks/use-haptics';
import { spacing } from '../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../ui/tokens/typography';
import { Avatar } from '../../ui/components/avatars';

interface HomeHeaderProps {
  userName?: string;
  userAvatar?: string;
  city?: string;
  notificationCount?: number;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  onLogoPress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = 'User',
  userAvatar,
  city,
  notificationCount = 0,
  onProfilePress,
  onNotificationPress,
  onLogoPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const avatarScale = useSharedValue(1);

  // Get greeting based on time of day
  const getGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }, []);

  const greeting = useMemo(() => getGreeting(), [getGreeting]);

  const handleProfilePress = useCallback(() => {
    haptics.light();
    avatarScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      avatarScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    onProfilePress?.();
  }, [haptics, avatarScale, onProfilePress]);

  const handleNotificationPress = useCallback(() => {
    haptics.light();
    onNotificationPress?.();
  }, [haptics, onNotificationPress]);

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: spacing[4],
          paddingBottom: spacing[3],
          paddingHorizontal: spacing[4],
          backgroundColor: theme.colors.surface.background,
        },
        style,
      ]}
    >
      {/* Left: Greeting and City */}
      <View style={styles.leftContent}>
        <Text
          style={[
            styles.greeting,
            {
              fontSize: parseInt(fontSize.title.md as string, 10),
              fontWeight: fontWeight.semibold,
              color: theme.colors.text.primary,
            },
          ]}
        >
          {greeting} 👋
        </Text>
        
        {/* City with location icon */}
        <Pressable style={styles.cityContainer} onPress={onLogoPress}>
          <Text style={[styles.locationIcon]}>📍</Text>
          <Text
            style={[
              styles.city,
              {
                fontSize: parseInt(fontSize.body.sm as string, 10),
                color: theme.colors.text.secondary,
              },
            ]}
          >
            {city || 'Detecting location...'}
          </Text>
        </Pressable>
      </View>

      {/* Right: Notification and Avatar */}
      <View style={styles.rightContent}>
        {/* Notification Bell */}
        <Pressable
          onPress={handleNotificationPress}
          style={[
            styles.notificationButton,
            { backgroundColor: theme.colors.surface.secondary },
          ]}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          
          {/* Notification Badge */}
          {notificationCount > 0 && (
            <View
              style={[
                styles.notificationBadge,
                { backgroundColor: theme.colors.status.danger.DEFAULT },
              ]}
            >
              <Text style={styles.notificationBadgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Profile Avatar */}
        <AnimatedPressable
          onPress={handleProfilePress}
          style={[styles.avatarContainer, avatarAnimatedStyle]}
          accessibilityLabel={`${userName}'s profile`}
          accessibilityRole="button"
        >
          <Avatar
            src={userAvatar}
            name={userName}
            size="md"
          />
          
          {/* Online indicator */}
          <View
            style={[
              styles.onlineIndicator,
              { backgroundColor: '#10B981', borderColor: theme.colors.surface.background },
            ]}
          />
        </AnimatedPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  greeting: {},
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  locationIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  city: {},
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  avatarContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});

HomeHeader.displayName = 'HomeHeader';

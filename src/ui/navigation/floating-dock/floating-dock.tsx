/**
 * LinkUp Design System 2026
 * Floating Dock - Primary navigation component
 * Premium, minimal, always accessible
 */

'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';
import { zIndex } from '../../tokens/z-index';

// ============================================
// TYPES
// ============================================

export type DockTab = 'map' | 'events' | 'create' | 'chats' | 'profile';

interface DockTabConfig {
  id: DockTab;
  icon: string;
  label: string;
  badge?: number;
  isCenter?: boolean;
}

interface FloatingDockProps {
  activeTab: DockTab;
  onTabChange: (tab: DockTab) => void;
  onCreatePress: () => void;
  badgeCounts?: {
    chats?: number;
    notifications?: number;
    premium?: number;
  };
  visible?: boolean;
  style?: ViewStyle;
}

// ============================================
// DOCK TAB ICON
// ============================================

interface DockIconProps {
  icon: string;
  label: string;
  isActive: boolean;
  isCenter?: boolean;
  badge?: number;
  onPress: () => void;
}

const DockIcon: React.FC<DockIconProps> = ({
  icon,
  label,
  isActive,
  isCenter = false,
  badge,
  onPress,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);
  const activeProgress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    activeProgress.value = withSpring(isActive ? 1 : 0, {
      damping: 20,
      stiffness: 200,
    });
  }, [isActive, activeProgress]);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    haptics.tabChange();
    onPress();
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const size = interpolate(
      activeProgress.value,
      [0, 1],
      [56, 64],
      Extrapolation.CLAMP
    );
    
    return {
      transform: [{ scale: scale.value }],
      width: size,
      height: size,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolate(
      activeProgress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ) > 0.5
      ? theme.colors.interactive.primary
      : 'transparent',
    opacity: interpolate(
      activeProgress.value,
      [0, 1],
      [0, 0.12],
      Extrapolation.CLAMP
    ),
  }));

  const animatedLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      activeProgress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          activeProgress.value,
          [0, 1],
          [4, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.iconContainer, animatedContainerStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.iconButton,
          {
            backgroundColor: isCenter
              ? theme.colors.interactive.primary
              : 'transparent',
          },
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={label}
      >
        <Animated.View
          style={[
            styles.iconBackground,
            animatedBackgroundStyle,
          ]}
        />
        <Text
          style={[
            styles.icon,
            {
              color: isActive
                ? theme.colors.interactive.primary
                : isCenter
                ? '#FFFFFF'
                : theme.colors.text.secondary,
            },
          ]}
        >
          {icon}
        </Text>

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.status.danger.DEFAULT },
            ]}
          >
            <Text style={styles.badgeText}>
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}

        {/* Label */}
        <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
          <Text
            style={[
              styles.label,
              { color: theme.colors.text.primary },
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

// ============================================
// FLOATING DOCK
// ============================================

export const FloatingDock: React.FC<FloatingDockProps> = ({
  activeTab,
  onTabChange,
  onCreatePress,
  badgeCounts = {},
  visible = true,
  style,
}) => {
  const theme = useTheme();

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const tabs: DockTabConfig[] = useMemo(
    () => [
      { id: 'map', icon: '🗺️', label: 'Map' },
      { id: 'events', icon: '📅', label: 'Events' },
      {
        id: 'create',
        icon: '✚',
        label: 'Create',
        isCenter: true,
      },
      { id: 'chats', icon: '💬', label: 'Chats', badge: badgeCounts.chats },
      {
        id: 'profile',
        icon: '👤',
        label: 'Profile',
        badge: badgeCounts.notifications,
      },
    ],
    [badgeCounts]
  );

  const handleTabPress = useCallback(
    (tab: DockTab) => {
      if (tab !== 'create') {
        onTabChange(tab);
      }
    },
    [onTabChange]
  );

  const handleCreatePress = useCallback(() => {
    onCreatePress();
  }, [onCreatePress]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dockContainer,
        {
          backgroundColor: theme.colors.surface.primary,
          shadowColor: '#000',
        },
        animatedContainerStyle,
        style,
      ]}
    >
      <View
        style={[
          styles.dock,
          {
            backgroundColor: theme.colors.surface.secondary,
            borderRadius: 32,
          },
        ]}
      >
        {tabs.map((tab) => (
          <DockIcon
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            isCenter={tab.isCenter}
            badge={tab.badge}
            onPress={
              tab.isCenter ? handleCreatePress : () => handleTabPress(tab.id)
            }
          />
        ))}
      </View>
    </Animated.View>
  );
};

// ============================================
// AUTO-HIDE HOOK
// ============================================

interface UseDockAutoHideOptions {
  scrollThreshold?: number;
  hideDelay?: number;
  showDelay?: number;
}

export const useDockAutoHide = (options: UseDockAutoHideOptions = {}) => {
  const {
    scrollThreshold = 50,
    hideDelay = 300,
    showDelay = 200,
  } = options;

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useSharedValue(0);
  const velocity = useSharedValue(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);
  }, [showDelay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  }, [hideDelay]);

  const handleScroll = useCallback(
    (scrollY: number, scrollVelocity?: number) => {
      const delta = scrollY - lastScrollY.value;
      lastScrollY.value = scrollY;

      if (scrollVelocity !== undefined) {
        velocity.value = scrollVelocity;
      }

      // Scrolling down - hide dock
      if (delta > scrollThreshold && scrollY > scrollThreshold) {
        hide();
      }
      // Scrolling up - show dock
      else if (delta < -scrollThreshold || scrollVelocity < -100) {
        show();
      }
    },
    [hide, show, lastScrollY, scrollThreshold]
  );

  const resetVisibility = useCallback(() => {
    setIsVisible(true);
    lastScrollY.value = 0;
    velocity.value = 0;
  }, [lastScrollY, velocity]);

  return {
    isVisible,
    handleScroll,
    show,
    hide,
    resetVisibility,
  };
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    bottom: spacing[6],
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: zIndex.nav.dock,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[1],
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  iconBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  icon: {
    fontSize: 24,
    textAlign: 'center',
  },
  labelContainer: {
    position: 'absolute',
    bottom: -2,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

FloatingDock.displayName = 'FloatingDock';

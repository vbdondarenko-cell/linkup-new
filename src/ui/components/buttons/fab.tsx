/**
 * LinkUp Design System 2026
 * Floating Action Button Component
 */

'use client';

import React, { useCallback } from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';

export type FABSize = 'sm' | 'md' | 'lg';
export type FABVariant = 'primary' | 'secondary' | 'tertiary';

interface FABProps {
  icon: React.ReactNode;
  label?: string;
  variant?: FABVariant;
  size?: FABSize;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  extended?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FAB: React.FC<FABProps> = ({
  icon,
  label,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right',
  extended = false,
  disabled = false,
  loading = false,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);

  const isDisabled = disabled || loading;

  const getSize = () => {
    switch (size) {
      case 'sm': return 40;
      case 'lg': return 64;
      default: return 52;
    }
  };

  const buttonSize = getSize();

  const getColors = () => {
    const { colors } = theme;
    switch (variant) {
      case 'primary':
        return {
          bg: colors.interactive.primary,
          icon: '#FFFFFF',
        };
      case 'secondary':
        return {
          bg: colors.brand.secondary[500],
          icon: '#FFFFFF',
        };
      case 'tertiary':
        return {
          bg: colors.surface.primary,
          icon: colors.text.primary,
        };
      default:
        return {
          bg: colors.interactive.primary,
          icon: '#FFFFFF',
        };
    }
  };

  const colors = getColors();

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...getPositionStyle(position),
    minHeight: extended ? 56 : buttonSize,
    width: extended ? undefined : buttonSize,
    borderRadius: extended ? theme.radius.component.fab : buttonSize / 2,
    backgroundColor: colors.bg,
    opacity: isDisabled ? 0.5 : 1,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!isDisabled) {
      haptics.medium();
      onPress?.();
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[containerStyle, animatedStyle, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <View style={styles.content}>
        <View style={[styles.icon, size === 'sm' && styles.iconSmall]}>{icon}</View>
        {extended && label && (
          <Animated.Text style={[styles.label, { color: colors.icon }]}>
            {label}
          </Animated.Text>
        )}
      </View>
    </AnimatedPressable>
  );
};

const getPositionStyle = (position: FABProps['position']): ViewStyle => {
  switch (position) {
    case 'bottom-left':
      return { left: spacing[4] };
    case 'bottom-center':
      return { alignSelf: 'center' };
    case 'bottom-right':
    default:
      return { right: spacing[4] };
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: spacing[2],
  },
});

FAB.displayName = 'FAB';

/**
 * LinkUp Design System 2026
 * Icon Button Component
 */

'use client';

import React, { useCallback } from 'react';
import { Pressable, View, StyleSheet, ViewStyle, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: 'circle' | 'rounded' | 'square';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'tertiary',
  size = 'md',
  shape = 'circle',
  disabled = false,
  loading = false,
  onPress,
  accessibilityLabel,
  ...props
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);

  const isDisabled = disabled || loading;

  const getSize = () => {
    switch (size) {
      case 'xs': return 28;
      case 'sm': return 36;
      case 'lg': return 52;
      default: return 44;
    }
  };

  const iconSize = () => {
    switch (size) {
      case 'xs': return 14;
      case 'sm': return 18;
      case 'lg': return 28;
      default: return 22;
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
          bg: colors.surface.tertiary,
          icon: colors.text.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          icon: colors.text.primary,
        };
      default:
        return {
          bg: colors.surface.tertiary,
          icon: colors.text.primary,
        };
    }
  };

  const colors = getColors();

  const getBorderRadius = () => {
    switch (shape) {
      case 'square': return 0;
      case 'rounded': return theme.radius.component.button;
      case 'circle':
      default: return buttonSize / 2;
    }
  };

  const containerStyle: ViewStyle = {
    ...styles.container,
    minWidth: buttonSize,
    minHeight: buttonSize,
    width: buttonSize,
    height: buttonSize,
    borderRadius: getBorderRadius(),
    backgroundColor: colors.bg,
    opacity: isDisabled ? 0.5 : 1,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!isDisabled) {
      haptics.light();
      onPress?.();
    }
  };

  return (
    <AnimatedPressable
      {...props}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[containerStyle, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
    >
      <View style={[styles.iconContainer, { width: iconSize(), height: iconSize() }]}>
        {icon}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

IconButton.displayName = 'IconButton';

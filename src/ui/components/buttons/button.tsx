/**
 * LinkUp Design System 2026
 * Button Component - Premium, tactile, accessible
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

// ============================================
// TYPES
// ============================================

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'destructive' 
  | 'success'
  | 'ghost';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BaseButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export interface ButtonProps extends BaseButtonProps {
  animated?: boolean;
}

// ============================================
// ANIMATED PRESSABLE
// ============================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============================================
// BUTTON COMPONENT
// ============================================

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  animated = true,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Determine if button is interactive
  const isDisabled = disabled || loading;

  // ============================================
  // STYLES
  // ============================================

  const containerStyle = useMemo<ViewStyle>(() => ({
    ...styles.container,
    width: fullWidth ? '100%' : undefined,
    minHeight: getSizeValue(size, 'height'),
    paddingHorizontal: getSizeValue(size, 'paddingX'),
    paddingVertical: getSizeValue(size, 'paddingY'),
    borderRadius: theme.radius.component.button[size === 'xs' || size === 'sm' ? 'buttonSmall' : 'button'],
    opacity: isDisabled ? 0.5 : opacity.value,
  }), [fullWidth, size, theme, isDisabled, opacity.value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animated ? scale.value : 1 }],
  }));

  // ============================================
  // COLORS
  // ============================================

  const getColors = useCallback(() => {
    const { colors } = theme;

    switch (variant) {
      case 'primary':
        return {
          bg: colors.interactive.primary,
          bgPressed: colors.interactive.primaryPressed,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: colors.brand.secondary[500],
          bgPressed: colors.brand.secondary[600],
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'tertiary':
        return {
          bg: 'transparent',
          bgPressed: colors.surface.tertiary,
          text: colors.text.primary,
          border: colors.border.default,
        };
      case 'destructive':
        return {
          bg: colors.status.danger.DEFAULT,
          bgPressed: colors.status.danger.dark,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'success':
        return {
          bg: colors.status.success.DEFAULT,
          bgPressed: colors.status.success.dark,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'ghost':
        return {
          bg: 'transparent',
          bgPressed: colors.surface.tertiary,
          text: colors.text.link,
          border: 'transparent',
        };
      default:
        return {
          bg: colors.interactive.primary,
          bgPressed: colors.interactive.primaryPressed,
          text: '#FFFFFF',
          border: 'transparent',
        };
    }
  }, [theme, variant]);

  const colors = getColors();

  // ============================================
  // TYPOGRAPHY
  // ============================================

  const textStyle = useMemo<TextStyle>(() => {
    const baseFontSize = {
      xs: fontSize.button.sm,
      sm: fontSize.button.sm,
      md: fontSize.button.md,
      lg: fontSize.button.lg,
      xl: fontSize.button.lg,
    }[size];

    return {
      fontSize: parseInt(baseFontSize as string, 10),
      fontWeight: fontWeight.semibold,
      color: colors.text,
    };
  }, [size, colors.text]);

  // ============================================
  // ANIMATIONS
  // ============================================

  const handlePressIn = useCallback((e: any) => {
    if (animated && !isDisabled) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(0.85, { duration: 100 });
    }
    onPressIn?.(e);
  }, [animated, isDisabled, onPressIn, scale, opacity]);

  const handlePressOut = useCallback((e: any) => {
    if (animated && !isDisabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 100 });
    }
    onPressOut?.(e);
  }, [animated, isDisabled, onPressOut, scale, opacity]);

  const handlePress = useCallback((e: any) => {
    if (!isDisabled && !loading) {
      haptics.buttonTap();
    }
    onPress?.(e);
  }, [isDisabled, loading, haptics, onPress]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <AnimatedPressable
      {...props}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[containerStyle, animatedStyle]}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={colors.text}
            style={styles.loader}
          />
        ) : (
          leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>
        )}
        <Text style={textStyle}>{children}</Text>
        {!loading && rightIcon && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>
    </AnimatedPressable>
  );
};

// ============================================
// SIZE HELPERS
// ============================================

const getSizeValue = (size: ButtonSize, property: 'height' | 'paddingX' | 'paddingY'): number | string => {
  const sizes = {
    xs: { height: 28, paddingX: spacing[2], paddingY: spacing[1] },
    sm: { height: 36, paddingX: spacing[3], paddingY: spacing[2] },
    md: { height: 44, paddingX: spacing[4], paddingY: spacing[2] },
    lg: { height: 52, paddingX: spacing[6], paddingY: spacing[3] },
    xl: { height: 60, paddingX: spacing[8], paddingY: spacing[4] },
  };
  return sizes[size][property];
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing[2],
  },
  iconRight: {
    marginLeft: spacing[2],
  },
  loader: {
    marginRight: spacing[2],
  },
});

// ============================================
// DISPLAY NAME
// ============================================

Button.displayName = 'Button';

// ============================================
// EXPORTS
// ============================================

export * from './button';

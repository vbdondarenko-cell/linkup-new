/**
 * LinkUp Design System 2026
 * Card Component - Premium, spacious, elegant
 */

'use client';

import React, { useCallback } from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing } from '../../tokens/spacing';

export type CardVariant = 'standard' | 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  padding = 'md',
  interactive = false,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);

  const getPaddingValue = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return spacing[3];
      case 'lg': return spacing[6];
      default: return spacing[4];
    }
  };

  const getVariantStyles = (): ViewStyle => {
    const { colors } = theme;

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface.primary,
          borderWidth: 1,
          borderColor: colors.border.default,
        };
      case 'filled':
        return {
          backgroundColor: colors.surface.secondary,
        };
      case 'standard':
      default:
        return {
          backgroundColor: colors.surface.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        };
    }
  };

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...getVariantStyles(),
    padding: getPaddingValue(),
    borderRadius: theme.radius.component.card,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interactive ? scale.value : 1 }],
  }));

  const handlePressIn = useCallback(() => {
    if (interactive) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  }, [interactive, scale]);

  const handlePressOut = useCallback(() => {
    if (interactive) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [interactive, scale]);

  const handlePress = useCallback(() => {
    if (interactive) {
      haptics.light();
      onPress?.();
    }
  }, [interactive, haptics, onPress]);

  if (interactive) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[containerStyle, animatedStyle, style]}
        accessibilityRole="button"
        accessibilityLabel={typeof children === 'string' ? children : undefined}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

Card.displayName = 'Card';

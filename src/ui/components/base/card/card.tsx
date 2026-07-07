import React from 'react';
import { StyleSheet, View, ViewProps, Pressable, PressableProps } from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { spacing } from '../../tokens/spacing';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'medium',
  interactive = false,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return theme.colors.surface.elevated;
      case 'outlined':
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.card.background;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: theme.colors.card.border,
      };
    }
    return {};
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return spacing[3];
      case 'large':
        return spacing[5];
      default:
        return spacing[4];
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: getBackgroundColor(),
      borderRadius: theme.radius.component.card,
      padding: getPadding(),
      ...getBorderStyle(),
      ...(variant === 'elevated' && { shadowColor: '#000', ...theme.shadows.component.md }),
    },
  });

  if (interactive) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
        accessibilityRole="button"
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

export default Card;

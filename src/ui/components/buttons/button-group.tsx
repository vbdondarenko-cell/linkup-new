/**
 * LinkUp Design System 2026
 * Button Group Component
 */

'use client';

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

interface ButtonGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  orientation?: ButtonGroupOrientation;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
  orientation = 'horizontal',
  fullWidth = false,
  size = 'md',
  disabled = false,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const selectedIndex = options.findIndex((opt) => opt.value === value);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { height: 32, paddingX: spacing[3], fontSize: 13 };
      case 'lg':
        return { height: 48, paddingX: spacing[5], fontSize: 17 };
      default:
        return { height: 40, paddingX: spacing[4], fontSize: 15 };
    }
  };

  const sizeStyles = getSizeStyles();

  const handleSelect = useCallback((option: ButtonGroupOption, index: number) => {
    if (!option.disabled && !disabled) {
      haptics.selection();
      onChange(option.value);
    }
  }, [disabled, haptics, onChange]);

  return (
    <View
      style={[
        styles.container,
        orientation === 'vertical' && styles.containerVertical,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: theme.colors.surface.secondary,
          borderRadius: theme.radius.component.button[size === 'sm' ? 'buttonSmall' : 'button'],
        },
      ]}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const isDisabled = option.disabled || disabled;

        return (
          <Pressable
            key={option.value}
            onPress={() => handleSelect(option, index)}
            disabled={isDisabled}
            style={[
              styles.button,
              orientation === 'vertical' && styles.buttonVertical,
              fullWidth && styles.fullWidth,
              {
                minHeight: sizeStyles.height,
                paddingHorizontal: sizeStyles.paddingX,
                backgroundColor: isSelected
                  ? theme.colors.surface.primary
                  : 'transparent',
                borderRadius: theme.radius.component.button[size === 'sm' ? 'buttonSmall' : 'button'],
                opacity: isDisabled ? 0.5 : 1,
              },
              isFirst && orientation === 'horizontal' && styles.firstButton,
              isLast && orientation === 'horizontal' && styles.lastButton,
              isFirst && orientation === 'vertical' && styles.firstButtonVertical,
              isLast && orientation === 'vertical' && styles.lastButtonVertical,
              isSelected && {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            accessibilityLabel={option.label}
          >
            {option.leftIcon && (
              <View style={styles.iconLeft}>{option.leftIcon}</View>
            )}
            <Text
              style={[
                styles.label,
                {
                  fontSize: sizeStyles.fontSize,
                  fontWeight: isSelected ? fontWeight.semibold : fontWeight.medium,
                  color: isSelected
                    ? theme.colors.text.primary
                    : theme.colors.text.secondary,
                },
              ]}
            >
              {option.label}
            </Text>
            {option.rightIcon && (
              <View style={styles.iconRight}>{option.rightIcon}</View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 2,
  },
  containerVertical: {
    flexDirection: 'column',
  },
  fullWidth: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
  },
  buttonVertical: {
    justifyContent: 'center',
  },
  firstButton: {
    borderTopLeftRadius: undefined,
    borderBottomLeftRadius: undefined,
  },
  lastButton: {
    borderTopRightRadius: undefined,
    borderBottomRightRadius: undefined,
  },
  firstButtonVertical: {
    borderTopLeftRadius: undefined,
    borderTopRightRadius: undefined,
  },
  lastButtonVertical: {
    borderBottomLeftRadius: undefined,
    borderBottomRightRadius: undefined,
  },
  iconLeft: {
    marginRight: spacing[1],
  },
  iconRight: {
    marginLeft: spacing[1],
  },
  label: {
    textAlign: 'center',
  },
});

ButtonGroup.displayName = 'ButtonGroup';

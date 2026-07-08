/**
 * LinkUp Design System 2026
 * Chip Component - Animated, interactive tags and filters
 */

'use client';

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

export type ChipVariant = 'default' | 'category' | 'filter' | 'interest' | 'location' | 'premium';
export type ChipSize = 'sm' | 'md' | 'lg';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onPress?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  size = 'md',
  selected = false,
  onSelect,
  onPress,
  icon,
  iconPosition = 'left',
  disabled = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const selectionProgress = useSharedValue(selected ? 1 : 0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    selectionProgress.value = withSpring(selected ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [selected, selectionProgress]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      haptics.selection();
      if (onSelect) {
        onSelect(!selected);
      }
      onPress?.();
    }
  }, [disabled, haptics, onSelect, selected, onPress]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          fontSize: 12,
          iconSize: 12,
        };
      case 'lg':
        return {
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
          fontSize: 15,
          iconSize: 18,
        };
      default:
        return {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1.5],
          fontSize: 14,
          iconSize: 16,
        };
    }
  };

  const getVariantColors = () => {
    const { colors } = theme;

    switch (variant) {
      case 'category':
        return {
          selected: {
            bg: colors.brand.primary[500],
            text: '#FFFFFF',
            border: colors.brand.primary[500],
          },
          default: {
            bg: colors.surface.secondary,
            text: colors.text.primary,
            border: colors.border.default,
          },
        };
      case 'filter':
        return {
          selected: {
            bg: colors.surface.inverse,
            text: colors.surface.primary,
            border: colors.surface.inverse,
          },
          default: {
            bg: colors.surface.primary,
            text: colors.text.secondary,
            border: colors.border.default,
          },
        };
      case 'interest':
        return {
          selected: {
            bg: colors.brand.secondary[500],
            text: '#FFFFFF',
            border: colors.brand.secondary[500],
          },
          default: {
            bg: colors.brand.secondary[50],
            text: colors.brand.secondary[700],
            border: colors.brand.secondary[200],
          },
        };
      case 'location':
        return {
          selected: {
            bg: colors.status.info.bg,
            text: colors.status.info.text,
            border: colors.status.info.border,
          },
          default: {
            bg: colors.surface.primary,
            text: colors.text.secondary,
            border: colors.border.default,
          },
        };
      case 'premium':
        return {
          selected: {
            bg: colors.premium.gold.DEFAULT,
            text: '#FFFFFF',
            border: colors.premium.gold.DEFAULT,
          },
          default: {
            bg: colors.premium.gold.bg,
            text: colors.premium.gold.text,
            border: colors.premium.gold.border,
          },
        };
      default:
        return {
          selected: {
            bg: colors.interactive.primary,
            text: '#FFFFFF',
            border: colors.interactive.primary,
          },
          default: {
            bg: colors.surface.secondary,
            text: colors.text.secondary,
            border: colors.border.default,
          },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantColors = getVariantColors();
  const currentColors = selected ? variantColors.selected : variantColors.default;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(currentColors.bg, { duration: 150 }),
    borderColor: withTiming(currentColors.border, { duration: 150 }),
    transform: [{ scale: scale.value }],
  }));

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizeStyles.paddingHorizontal,
    paddingVertical: sizeStyles.paddingVertical,
    borderRadius: theme.radius.component.chip,
    borderWidth: 1,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[containerStyle, animatedContainerStyle, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={label}
    >
      {icon && iconPosition === 'left' && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      <Text
        style={[
          styles.label,
          {
            fontSize: sizeStyles.fontSize,
            fontWeight: selected ? fontWeight.semibold : fontWeight.medium,
            color: currentColors.text,
          },
        ]}
      >
        {label}
      </Text>
      {icon && iconPosition === 'right' && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </AnimatedPressable>
  );
};

// Chip Group Component
interface ChipGroupProps {
  chips: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  variant?: ChipVariant;
  size?: ChipSize;
  multiSelect?: boolean;
  style?: ViewStyle;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  chips,
  selectedValues,
  onChange,
  variant = 'default',
  size = 'md',
  multiSelect = true,
  style,
}) => {
  const handleSelect = useCallback(
    (value: string, isSelected: boolean) => {
      let newValues: string[];

      if (multiSelect) {
        newValues = isSelected
          ? [...selectedValues, value]
          : selectedValues.filter((v) => v !== value);
      } else {
        newValues = isSelected ? [value] : [];
      }

      onChange(newValues);
    },
    [multiSelect, onChange, selectedValues]
  );

  return (
    <View style={[styles.chipGroup, style]}>
      {chips.map((chip) => (
        <Chip
          key={chip.value}
          label={chip.label}
          variant={variant}
          size={size}
          icon={chip.icon}
          selected={selectedValues.includes(chip.value)}
          onSelect={(isSelected) => handleSelect(chip.value, isSelected)}
          disabled={chip.disabled}
          style={styles.chipGroupItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: spacing[1],
  },
  iconRight: {
    marginLeft: spacing[1],
  },
  label: {},
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chipGroupItem: {},
});

Chip.displayName = 'Chip';
ChipGroup.displayName = 'ChipGroup';

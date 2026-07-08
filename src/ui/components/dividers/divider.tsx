/**
 * LinkUp Design System 2026
 * Divider Component - Clean, minimal separators
 */

'use client';

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { spacing } from '../../tokens/spacing';

export type DividerVariant = 'horizontal' | 'vertical' | 'inset' | 'section';
export type DividerWeight = 'thin' | 'medium' | 'thick';

interface DividerProps {
  variant?: DividerVariant;
  weight?: DividerWeight;
  color?: string;
  margin?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'horizontal',
  weight = 'thin',
  color,
  margin = spacing[4],
  marginVertical,
  marginHorizontal,
  style,
}) => {
  const theme = useTheme();

  const getWeightValue = () => {
    switch (weight) {
      case 'medium': return 1;
      case 'thick': return 2;
      default: return StyleSheet.hairlineWidth;
    }
  };

  const dividerColor = color || theme.colors.border.subtle;

  const baseStyle: ViewStyle = {
    backgroundColor: dividerColor,
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'vertical':
        return {
          width: getWeightValue(),
          height: '100%',
          marginHorizontal: marginHorizontal ?? margin,
        };
      case 'inset':
        return {
          height: getWeightValue(),
          marginHorizontal: marginHorizontal ?? spacing[4],
        };
      case 'section':
        return {
          height: getWeightValue(),
          marginVertical: marginVertical ?? spacing[6],
        };
      case 'horizontal':
      default:
        return {
          height: getWeightValue(),
          marginVertical: marginVertical ?? margin,
          marginHorizontal: marginHorizontal ?? 0,
        };
    }
  };

  return (
    <View
      style={[styles.divider, baseStyle, getVariantStyle(), style]}
      accessibilityRole="separator"
    />
  );
};

// Section Divider with optional label
interface SectionDividerProps {
  label?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  label,
  action,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.sectionContainer, style]}>
      <Divider variant="horizontal" weight="thin" />
      <View style={styles.sectionContent}>
        {label && (
          <View style={styles.sectionLabelContainer}>
            <View
              style={[
                styles.sectionLabel,
                { backgroundColor: theme.colors.surface.background },
              ]}
            >
              <View style={styles.sectionLabelText}>
                {/* Label would go here */}
              </View>
            </View>
          </View>
        )}
        {action && <View style={styles.sectionAction}>{action}</View>}
      </View>
      <Divider variant="horizontal" weight="thin" />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {},
  sectionContainer: {},
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing[2],
  },
  sectionLabelContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  sectionLabel: {
    position: 'absolute',
    top: -8,
    paddingHorizontal: spacing[2],
  },
  sectionLabelText: {},
  sectionAction: {},
});

Divider.displayName = 'Divider';
SectionDivider.displayName = 'SectionDivider';

/**
 * LinkUp Design System 2026
 * Badge Component - Clean, elegant status indicators
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { spacing } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'premium'
  | 'business'
  | 'organizer'
  | 'verified'
  | 'new'
  | 'live'
  | 'trending'
  | 'recommended';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  outlined?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  outlined = false,
  style,
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    const { colors } = theme;

    const variants: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
      default: {
        bg: colors.surface.secondary,
        text: colors.text.secondary,
        border: colors.border.default,
      },
      success: {
        bg: colors.status.success.bg,
        text: colors.status.success.text,
        border: colors.status.success.border,
      },
      warning: {
        bg: colors.status.warning.bg,
        text: colors.status.warning.text,
        border: colors.status.warning.border,
      },
      danger: {
        bg: colors.status.danger.bg,
        text: colors.status.danger.text,
        border: colors.status.danger.border,
      },
      info: {
        bg: colors.status.info.bg,
        text: colors.status.info.text,
        border: colors.status.info.border,
      },
      premium: {
        bg: colors.premium.bg,
        text: colors.premium.text,
        border: colors.premium.border,
      },
      business: {
        bg: colors.business.bg,
        text: colors.business.text,
        border: colors.business.border,
      },
      organizer: {
        bg: colors.organizer.bg,
        text: colors.organizer.text,
        border: colors.organizer.border,
      },
      verified: {
        bg: colors.status.info.bg,
        text: colors.status.info.text,
        border: colors.status.info.border,
      },
      new: {
        bg: colors.status.success.bg,
        text: colors.status.success.text,
        border: colors.status.success.border,
      },
      live: {
        bg: colors.status.danger.bg,
        text: colors.status.danger.text,
        border: colors.status.danger.border,
      },
      trending: {
        bg: colors.status.warning.bg,
        text: colors.status.warning.text,
        border: colors.status.warning.border,
      },
      recommended: {
        bg: colors.brand.primary[50],
        text: colors.brand.primary[600],
        border: colors.brand.primary[200],
      },
    };

    return variants[variant];
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: spacing[1],
          paddingVertical: spacing[0.5],
          fontSize: 10,
        };
      case 'lg':
        return {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          fontSize: 14,
        };
      default:
        return {
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          fontSize: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: outlined ? 'transparent' : variantStyles.bg,
    borderWidth: outlined ? 1 : 0,
    borderColor: variantStyles.border,
    borderRadius: theme.radius.component.badge,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    paddingVertical: sizeStyles.paddingVertical,
  };

  const textStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    fontWeight: fontWeight.semibold,
    color: outlined ? variantStyles.text : variantStyles.text,
  };

  return (
    <View style={[containerStyle, style]}>
      {icon && iconPosition === 'left' && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      <Text style={textStyle}>{label}</Text>
      {icon && iconPosition === 'right' && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </View>
  );
};

// Status Badge (dot indicator)
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away' | 'live';
  label?: string;
  size?: BadgeSize;
  style?: ViewStyle;
}

const statusColors = {
  online: '#10B981',
  offline: '#737373',
  busy: '#EF4444',
  away: '#F59E0B',
  live: '#EF4444',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  style,
}) => {
  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;

  return (
    <View style={[styles.statusContainer, style]}>
      <View
        style={[
          styles.statusDot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: statusColors[status],
          },
          status === 'live' && styles.livePulse,
        ]}
      />
      {label && (
        <Text
          style={[
            styles.statusLabel,
            { color: statusColors[status], fontSize: size === 'sm' ? 10 : 12 },
          ]}
        >
          {label}
        </Text>
      )}
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {},
  livePulse: {
    // Animated pulse effect would be added with Reanimated
  },
  statusLabel: {
    marginLeft: spacing[1],
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

Badge.displayName = 'Badge';
StatusBadge.displayName = 'StatusBadge';

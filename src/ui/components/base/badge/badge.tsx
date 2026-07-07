import React from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium' | 'business' | 'organizer';
export type BadgeSize = 'small' | 'medium';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'medium',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: theme.colors.status.success.bg,
          text: theme.colors.status.success.text,
        };
      case 'warning':
        return {
          bg: theme.colors.status.warning.bg,
          text: theme.colors.status.warning.text,
        };
      case 'danger':
        return {
          bg: theme.colors.status.danger.bg,
          text: theme.colors.status.danger.text,
        };
      case 'info':
        return {
          bg: theme.colors.status.info.bg,
          text: theme.colors.status.info.text,
        };
      case 'premium':
        return {
          bg: theme.colors.premium.background,
          text: theme.colors.premium.accent,
        };
      case 'business':
        return {
          bg: theme.colors.business.background,
          text: theme.colors.business.accent,
        };
      case 'organizer':
        return {
          bg: theme.colors.organizer.background,
          text: theme.colors.organizer.accent,
        };
      default:
        return {
          bg: theme.colors.interactive.muted,
          text: theme.colors.text.secondary,
        };
    }
  };

  const colors = getColors();

  const styles = StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bg,
      borderRadius: theme.radius.component.badge,
      paddingHorizontal: size === 'small' ? spacing[1] : spacing[2],
      paddingVertical: size === 'small' ? 2 : spacing[1],
    },
    text: {
      ...typography.caption,
      fontWeight: typography.captionBold.fontWeight,
      color: colors.text,
      fontSize: size === 'small' ? 10 : 12,
    },
  });

  return (
    <View style={[styles.badge, style]} {...props}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

export default Badge;

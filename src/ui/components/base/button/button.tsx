import React from 'react';
import { StyleSheet, Pressable, Text, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';
import { typography } from '../../../tokens/typography';
import { spacing } from '../../../tokens/spacing';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'muted' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<React.ComponentProps<typeof Pressable>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();

    const isDisabled = disabled || loading;

    const getBackgroundColor = () => {
      if (isDisabled) return theme.colors.interactive.disabled;
      
      switch (variant) {
        case 'primary':
          return theme.colors.interactive.primary;
        case 'secondary':
          return theme.colors.interactive.secondary;
        case 'muted':
          return theme.colors.interactive.muted;
        case 'ghost':
          return 'transparent';
        case 'danger':
          return theme.colors.status.danger.light;
        default:
          return theme.colors.interactive.primary;
      }
    };

    const getTextColor = () => {
      if (isDisabled) return theme.colors.text.disabled;
      
      switch (variant) {
        case 'primary':
        case 'danger':
          return '#FFFFFF';
        case 'secondary':
          return theme.mode === 'dark' ? '#FFFFFF' : theme.colors.interactive.primary;
        case 'muted':
        case 'ghost':
          return theme.colors.text.primary;
        default:
          return '#FFFFFF';
      }
    };

    const getPadding = () => {
      switch (size) {
        case 'small':
          return { paddingHorizontal: spacing[3], paddingVertical: spacing[2] };
        case 'large':
          return { paddingHorizontal: spacing[6], paddingVertical: spacing[4] };
        default:
          return { paddingHorizontal: spacing[4], paddingVertical: spacing[3] };
      }
    };

    const getFontSize = () => {
      switch (size) {
        case 'small':
          return typography.bodySmall.fontSize;
        case 'large':
          return typography.title3.fontSize;
        default:
          return typography.button.fontSize;
      }
    };

    const styles = StyleSheet.create({
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.component.button,
        backgroundColor: getBackgroundColor(),
        ...getPadding(),
        opacity: isDisabled ? 0.6 : 1,
        width: fullWidth ? '100%' : undefined,
      },
      text: {
        color: getTextColor(),
        fontSize: parseInt(getFontSize() as string),
        fontWeight: typography.button.fontWeight,
        textAlign: 'center',
      },
      icon: {
        marginRight: leftIcon ? spacing[2] : 0,
        marginLeft: rightIcon ? spacing[2] : 0,
      },
      loader: {
        marginRight: spacing[2],
      },
    });

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.button,
          pressed && !isDisabled && styles.buttonPressed,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        {...props}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
            style={styles.loader}
          />
        )}
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={styles.text}>{children}</Text>
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      style,
      editable = true,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const hasError = !!error;

    const getBorderColor = () => {
      if (hasError) return theme.colors.status.danger.light;
      if (isFocused) return theme.colors.interactive.primary;
      return theme.colors.border.default;
    };

    const styles = StyleSheet.create({
      container: {
        width: '100%',
      },
      label: {
        ...typography.bodySmall,
        color: theme.colors.text.secondary,
        marginBottom: spacing[1],
      },
      inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface.primary,
        borderWidth: 1.5,
        borderColor: getBorderColor(),
        borderRadius: theme.radius.component.input,
        paddingHorizontal: spacing[3],
        minHeight: 48,
      },
      input: {
        flex: 1,
        ...typography.body,
        color: theme.colors.text.primary,
        paddingVertical: spacing[3],
        backgroundColor: 'transparent',
      },
      icon: {
        marginRight: spacing[2],
      },
      rightIcon: {
        marginLeft: spacing[2],
      },
      hint: {
        ...typography.caption,
        color: theme.colors.text.tertiary,
        marginTop: spacing[1],
      },
      error: {
        ...typography.caption,
        color: theme.colors.status.danger.light,
        marginTop: spacing[1],
      },
      disabled: {
        opacity: 0.5,
        backgroundColor: theme.colors.surface.secondary,
      },
    });

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.inputWrapper, !editable && styles.disabled]}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={theme.colors.text.tertiary}
            editable={editable}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <Pressable
              onPress={onRightIconPress}
              style={styles.rightIcon}
              disabled={!onRightIconPress}
            >
              {rightIcon}
            </Pressable>
          )}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

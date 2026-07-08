/**
 * LinkUp Design System 2026
 * Text Input Component
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
  Animated,
} from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outlined' | 'filled' | 'flushed';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  showCharCount?: boolean;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  helperText,
  errorText,
  successText,
  size = 'md',
  variant = 'outlined',
  leftIcon,
  rightIcon,
  rightAction,
  showCharCount = false,
  maxLength,
  disabled = false,
  readOnly = false,
  onRightIconPress,
  containerStyle,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const inputRef = useRef<RNTextInput>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  const hasError = !!errorText;
  const hasSuccess = !!successText && !hasError;
  const hasText = !!value && value.length > 0;

  const getBorderColor = () => {
    if (hasError) return theme.colors.status.danger.DEFAULT;
    if (hasSuccess) return theme.colors.status.success.DEFAULT;
    if (isFocused) return theme.colors.interactive.primary;
    if (variant === 'flushed') return theme.colors.border.default;
    return theme.colors.border.default;
  };

  const getBackgroundColor = () => {
    if (variant === 'filled') {
      return theme.colors.surface.secondary;
    }
    return theme.colors.surface.primary;
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 40;
      case 'lg': return 56;
      default: return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 18;
      default: return 16;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return spacing[2];
      case 'lg': return spacing[4];
      default: return spacing[3];
    }
  };

  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  }, [onFocus]);

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const handleChangeText = useCallback((text: string) => {
    setCharCount(text.length);
    onChangeText?.(text);
  }, [onChangeText]);

  const handleLabelPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const borderColor = getBorderColor();
  const height = getHeight();
  const fontSizeVal = getFontSize();
  const padding = getPadding();

  const inputContainerStyle: ViewStyle = {
    ...styles.inputContainer,
    height,
    paddingHorizontal: leftIcon ? padding : padding,
    backgroundColor: disabled ? theme.colors.surface.secondary : getBackgroundColor(),
    borderWidth: variant === 'outlined' || variant === 'flushed' ? 1.5 : 0,
    borderColor: variant === 'flushed' && !isFocused ? 'transparent' : borderColor,
    borderRadius: variant === 'outlined' ? theme.radius.component.input : theme.radius.component.input,
    borderBottomWidth: variant === 'flushed' ? 2 : 1.5,
    opacity: disabled ? 0.5 : 1,
  };

  const labelStyle: TextStyle = {
    fontSize: size === 'sm' ? 13 : 14,
    fontWeight: fontWeight.medium,
    color: hasError
      ? theme.colors.status.danger.DEFAULT
      : isFocused
      ? theme.colors.text.link
      : theme.colors.text.secondary,
    marginBottom: spacing[1],
  };

  const inputStyle: TextStyle = {
    fontSize: fontSizeVal,
    color: theme.colors.text.primary,
    flex: 1,
    paddingVertical: padding,
    paddingLeft: leftIcon ? spacing[8] : 0,
    paddingRight: rightIcon || rightAction ? spacing[8] : 0,
  };

  const helperStyle: TextStyle = {
    fontSize: 12,
    color: hasError
      ? theme.colors.status.danger.DEFAULT
      : hasSuccess
      ? theme.colors.status.success.DEFAULT
      : theme.colors.text.tertiary,
    marginTop: spacing[1],
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Pressable onPress={handleLabelPress}>
          <Text style={labelStyle}>{label}</Text>
        </Pressable>
      )}

      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={[styles.leftIcon, { left: padding }]}>
            {leftIcon}
          </View>
        )}

        <RNTextInput
          {...props}
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.placeholder}
          editable={!disabled && !readOnly}
          maxLength={maxLength}
          style={inputStyle}
        />

        {rightIcon && !rightAction && (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={[styles.rightIcon, { right: padding }]}
          >
            {rightIcon}
          </Pressable>
        )}

        {rightAction && (
          <View style={[styles.rightAction, { right: padding }]}>
            {rightAction}
          </View>
        )}
      </View>

      {(helperText || errorText || successText || showCharCount) && (
        <View style={styles.helperContainer}>
          <Text style={helperStyle}>
            {errorText || successText || helperText}
          </Text>
          {showCharCount && maxLength && (
            <Text style={[helperStyle, styles.charCount]}>
              {charCount}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    position: 'absolute',
    left: spacing[3],
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: spacing[3],
    zIndex: 1,
  },
  rightAction: {
    position: 'absolute',
    right: spacing[3],
    zIndex: 1,
  },
  helperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    textAlign: 'right',
  },
});

TextInput.displayName = 'TextInput';

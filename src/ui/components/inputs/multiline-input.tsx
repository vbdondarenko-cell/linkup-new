/**
 * LinkUp Design System 2026
 * Multiline Input Component
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
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { spacing } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

interface MultilineInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  minHeight?: number;
  maxHeight?: number;
  showCharCount?: boolean;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  containerStyle?: ViewStyle;
}

export const MultilineInput: React.FC<MultilineInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  helperText,
  errorText,
  minHeight = 100,
  maxHeight = 200,
  showCharCount = false,
  maxLength,
  disabled = false,
  autoFocus = false,
  containerStyle,
}) => {
  const theme = useTheme();
  const inputRef = useRef<RNTextInput>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);
  const [inputHeight, setInputHeight] = useState(minHeight);

  const hasError = !!errorText;

  const getBorderColor = () => {
    if (hasError) return theme.colors.status.danger.DEFAULT;
    if (isFocused) return theme.colors.interactive.primary;
    return theme.colors.border.default;
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChangeText = useCallback((text: string) => {
    setCharCount(text.length);
    onChangeText(text);
  }, [onChangeText]);

  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const newHeight = e.nativeEvent.contentSize.height;
      setInputHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
    },
    [minHeight, maxHeight]
  );

  const borderColor = getBorderColor();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              fontSize: 14,
              fontWeight: fontWeight.medium,
              color: hasError
                ? theme.colors.status.danger.DEFAULT
                : isFocused
                ? theme.colors.text.link
                : theme.colors.text.secondary,
              marginBottom: spacing[1],
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            minHeight,
            height: inputHeight,
            backgroundColor: disabled ? theme.colors.surface.secondary : theme.colors.surface.primary,
            borderWidth: 1.5,
            borderColor,
            borderRadius: theme.radius.component.textarea,
            padding: spacing[3],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <RNTextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onContentSizeChange={handleContentSizeChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.placeholder}
          multiline
          editable={!disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          style={[
            styles.input,
            {
              fontSize: parseInt(fontSize.body.md as string, 10),
              color: theme.colors.text.primary,
            },
          ]}
          textAlignVertical="top"
        />
      </View>

      {(helperText || errorText || showCharCount) && (
        <View style={styles.helperContainer}>
          <Text
            style={[
              styles.helperText,
              {
                fontSize: 12,
                color: hasError
                  ? theme.colors.status.danger.DEFAULT
                  : theme.colors.text.tertiary,
              },
            ]}
          >
            {errorText || helperText}
          </Text>
          {showCharCount && maxLength && (
            <Text
              style={[
                styles.charCount,
                {
                  fontSize: 12,
                  color: charCount >= maxLength
                    ? theme.colors.status.danger.DEFAULT
                    : theme.colors.text.tertiary,
                },
              ]}
            >
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
  label: {},
  inputContainer: {
    width: '100%',
  },
  input: {
    flex: 1,
  },
  helperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  helperText: {},
  charCount: {},
});

MultilineInput.displayName = 'MultilineInput';

/**
 * LinkUp Design System 2026
 * OTP Input Component
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing } from '../../tokens/spacing';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  error?: boolean;
  containerStyle?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus = true,
  disabled = false,
  error = false,
  containerStyle,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const inputRef = useRef<TextInput>(null);

  const [isFocused, setIsFocused] = useState(false);

  const shakeAnimation = useSharedValue(0);

  useEffect(() => {
    if (error && value.length === length) {
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      haptics.error();
    }
  }, [error, value.length, length, shakeAnimation, haptics]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChange = useCallback(
    (text: string) => {
      const cleanText = text.replace(/[^0-9]/g, '').slice(0, length);
      onChange(cleanText);

      if (cleanText.length === length) {
        onComplete?.(cleanText);
        haptics.success();
      }
    },
    [length, onChange, onComplete, haptics]
  );

  const handlePress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const getBorderColor = (index: number) => {
    if (error) return theme.colors.status.danger.DEFAULT;
    if (isFocused && index === value.length) {
      return theme.colors.interactive.primary;
    }
    if (value[index]) {
      return theme.colors.interactive.primary;
    }
    return theme.colors.border.default;
  };

  const digitContainerStyle: ViewStyle = {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: getBorderColor(0),
    borderRadius: theme.radius.component.input,
    backgroundColor: theme.colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <AnimatedView style={[styles.digitsContainer, shakeStyle]}>
        {Array.from({ length }).map((_, index) => (
          <Pressable
            key={index}
            onPress={handlePress}
            style={[
              digitContainerStyle,
              {
                borderColor: getBorderColor(index),
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.digit,
                {
                  fontSize: 24,
                  fontWeight: '600',
                  color: theme.colors.text.primary,
                },
              ]}
            >
              {value[index] || ''}
            </Text>
            {isFocused && index === value.length && (
              <View
                style={[
                  styles.cursor,
                  { backgroundColor: theme.colors.interactive.primary },
                ]}
              />
            )}
          </Pressable>
        ))}
      </AnimatedView>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        editable={!disabled}
        style={styles.hiddenInput}
        caretHidden
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  digitsContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  digit: {
    textAlign: 'center',
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});

OTPInput.displayName = 'OTPInput';

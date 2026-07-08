/**
 * LinkUp Design System 2026
 * Search Input Component - Premium search experience
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
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { spacing } from '../../tokens/spacing';
import { fontSize } from '../../tokens/typography';

interface RecentSearch {
  id: string;
  text: string;
  timestamp?: number;
}

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  placeholder?: string;
  recentSearches?: RecentSearch[];
  onRecentSearchPress?: (search: RecentSearch) => void;
  onRemoveRecentSearch?: (search: RecentSearch) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  showRecentSearches?: boolean;
  loading?: boolean;
  containerStyle?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  onClear,
  placeholder = 'Search...',
  recentSearches = [],
  onRecentSearchPress,
  onRemoveRecentSearch,
  autoFocus = false,
  disabled = false,
  showRecentSearches = true,
  loading = false,
  containerStyle,
}) => {
  const theme = useTheme();
  const inputRef = useRef<RNTextInput>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const focusAnimation = useSharedValue(0);

  const hasText = value.length > 0;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    focusAnimation.value = withSpring(1, { damping: 15, stiffness: 300 });
    setShowRecent(showRecentSearches && recentSearches.length > 0);
    onFocus?.();
  }, [focusAnimation, onFocus, recentSearches.length, showRecentSearches]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    focusAnimation.value = withSpring(0, { damping: 15, stiffness: 300 });
    onBlur?.();
  }, [focusAnimation, onBlur]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChangeText, onClear]);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSubmit?.(value.trim());
      setShowRecent(false);
    }
  }, [onSubmit, value]);

  const handleRecentPress = useCallback((search: RecentSearch) => {
    onChangeText(search.text);
    onRecentSearchPress?.(search);
    setShowRecent(false);
  }, [onChangeText, onRecentSearchPress]);

  const handleRemoveRecent = useCallback((search: RecentSearch) => {
    onRemoveRecentSearch?.(search);
  }, [onRemoveRecentSearch]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderWidth: 1.5,
    borderColor: isFocused
      ? theme.colors.interactive.primary
      : theme.colors.border.default,
    shadowOpacity: interpolate(
      focusAnimation.value,
      [0, 1],
      [0, 0.08],
      Extrapolation.CLAMP
    ),
  }));

  const containerStyle: ViewStyle = {
    ...styles.container,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.component.input,
    height: 48,
    opacity: disabled ? 0.5 : 1,
  };

  const inputStyle: TextStyle = {
    fontSize: parseInt(fontSize.body.md as string, 10),
    color: theme.colors.text.primary,
    flex: 1,
    paddingLeft: spacing[10],
    paddingRight: hasText ? spacing[10] : spacing[3],
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        {/* Search Icon */}
        <View style={styles.searchIcon}>
          <Text style={{ color: theme.colors.text.tertiary, fontSize: 18 }}>
            🔍
          </Text>
        </View>

        {/* Input */}
        <RNTextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.placeholder}
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          editable={!disabled}
          style={inputStyle}
        />

        {/* Clear Button */}
        {hasText && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <View
              style={[
                styles.clearIcon,
                { backgroundColor: theme.colors.text.tertiary },
              ]}
            >
              <Text style={styles.clearText}>×</Text>
            </View>
          </Pressable>
        )}

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={{ color: theme.colors.text.tertiary }}>...</Text>
          </View>
        )}
      </Animated.View>

      {/* Recent Searches */}
      {showRecent && showRecentSearches && recentSearches.length > 0 && (
        <View
          style={[
            styles.recentContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderRadius: theme.radius.component.input,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            },
          ]}
        >
          <Text
            style={[
              styles.recentTitle,
              { color: theme.colors.text.tertiary },
            ]}
          >
            Recent Searches
          </Text>
          {recentSearches.slice(0, 5).map((search) => (
            <View key={search.id} style={styles.recentItem}>
              <Pressable
                onPress={() => handleRecentPress(search)}
                style={styles.recentItemContent}
              >
                <Text
                  style={[
                    styles.recentItemText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {search.text}
                </Text>
              </Pressable>
              {onRemoveRecentSearch && (
                <Pressable
                  onPress={() => handleRemoveRecent(search)}
                  style={styles.recentRemoveButton}
                >
                  <Text style={{ color: theme.colors.text.tertiary }}>
                    ×
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  searchIcon: {
    position: 'absolute',
    left: spacing[3],
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: spacing[3],
    zIndex: 1,
    padding: spacing[1],
  },
  clearIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: -2,
  },
  loadingContainer: {
    position: 'absolute',
    right: spacing[3],
  },
  recentContainer: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemText: {
    fontSize: 15,
  },
  recentRemoveButton: {
    padding: spacing[1],
  },
});

SearchInput.displayName = 'SearchInput';

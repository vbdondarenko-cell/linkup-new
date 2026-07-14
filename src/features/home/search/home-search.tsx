/**
 * LinkUp Design System 2026
 * Home Search - Floating, expandable, premium search
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  FlatList,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'suggestion' | 'category';
  icon?: string;
}

interface HomeSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  recentSearches?: SearchSuggestion[];
  suggestions?: SearchSuggestion[];
  onSuggestionPress?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
  onVoicePress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const HomeSearch: React.FC<HomeSearchProps> = ({
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  placeholder = 'Search events, places, people...',
  recentSearches = [],
  suggestions = [],
  onSuggestionPress,
  onClear,
  onVoicePress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const inputRef = useRef<TextInput>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const focusProgress = useSharedValue(0);
  const searchWidth = useSharedValue(SCREEN_WIDTH - spacing[8] * 2);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowSuggestions(true);
    focusProgress.value = withSpring(1, { damping: 15, stiffness: 200 });
    searchWidth.value = withSpring(SCREEN_WIDTH - spacing[4] * 2, {
      damping: 15,
      stiffness: 200,
    });
    onFocus?.();
  }, [focusProgress, searchWidth, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setShowSuggestions(false);
    focusProgress.value = withSpring(0, { damping: 15, stiffness: 200 });
    searchWidth.value = withSpring(SCREEN_WIDTH - spacing[8] * 2, {
      damping: 15,
      stiffness: 200,
    });
    onBlur?.();
  }, [focusProgress, searchWidth, onBlur]);

  const handleClear = useCallback(() => {
    haptics.light();
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  }, [haptics, onChangeText, onClear]);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      haptics.selection();
      onSubmit?.(value.trim());
      setShowSuggestions(false);
    }
  }, [haptics, value, onSubmit]);

  const handleSuggestionPress = useCallback(
    (suggestion: SearchSuggestion) => {
      haptics.selection();
      onChangeText(suggestion.text);
      onSuggestionPress?.(suggestion);
      setShowSuggestions(false);
    },
    [haptics, onChangeText, onSuggestionPress]
  );

  const handleVoicePress = useCallback(() => {
    haptics.medium();
    onVoicePress?.();
  }, [haptics, onVoicePress]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    width: searchWidth.value,
    paddingHorizontal: interpolate(
      focusProgress.value,
      [0, 1],
      [spacing[4], spacing[4]],
      Extrapolation.CLAMP
    ),
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    borderWidth: interpolate(
      focusProgress.value,
      [0, 1],
      [0, 2],
      Extrapolation.CLAMP
    ),
    borderColor: interpolate(
      focusProgress.value,
      [0, 1],
      ['transparent', theme.colors.interactive.primary],
      Extrapolation.CLAMP
    ),
    shadowOpacity: interpolate(
      focusProgress.value,
      [0, 1],
      [0.08, 0.15],
      Extrapolation.CLAMP
    ),
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      focusProgress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
    pointerEvents: focusProgress.value > 0.5 ? 'auto' : 'none',
  }));

  const hasText = value.length > 0;

  return (
    <View style={[styles.wrapper, style]}>
      {/* Search Bar */}
      <Animated.View
        style={[
          styles.container,
          containerAnimatedStyle,
        ]}
      >
        <AnimatedPressable
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface.primary,
              borderRadius: theme.radius.component.input,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 4,
            },
            searchBarAnimatedStyle,
          ]}
          onPress={() => inputRef.current?.focus()}
        >
          {/* Search Icon */}
          <View style={styles.searchIconContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>

          {/* Input */}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.placeholder}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.input,
              {
                color: theme.colors.text.primary,
                fontSize: parseInt(fontSize.body.md as string, 10),
              },
            ]}
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

          {/* Voice Button */}
          {!hasText && (
            <Pressable onPress={handleVoicePress} style={styles.voiceButton}>
              <Text style={styles.voiceIcon}>🎤</Text>
            </Pressable>
          )}
        </AnimatedPressable>
      </Animated.View>

      {/* Suggestions Dropdown */}
      {showSuggestions && (recentSearches.length > 0 || suggestions.length > 0) && (
        <Animated.View
          style={[
            styles.suggestionsContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderRadius: theme.radius.component.card,
              marginHorizontal: spacing[4],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            },
          ]}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                Recent
              </Text>
              {recentSearches.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text style={styles.suggestionIcon}>🕐</Text>
                  <Text
                    style={[
                      styles.suggestionText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {item.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.section}>
              {recentSearches.length > 0 && (
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  Suggestions
                </Text>
              )}
              {suggestions.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text style={styles.suggestionIcon}>
                    {item.icon || '🔍'}
                  </Text>
                  <Text
                    style={[
                      styles.suggestionText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {item.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
  },
  container: {
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing[3],
  },
  searchIconContainer: {
    marginRight: spacing[2],
  },
  searchIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing[1],
  },
  clearIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: -2,
  },
  voiceButton: {
    padding: spacing[1],
  },
  voiceIcon: {
    fontSize: 20,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    maxHeight: 300,
    overflow: 'hidden',
  },
  section: {
    paddingVertical: spacing[2],
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  suggestionIcon: {
    fontSize: 16,
    marginRight: spacing[3],
  },
  suggestionText: {
    fontSize: 15,
  },
});

HomeSearch.displayName = 'HomeSearch';

/**
 * LinkUp Design System 2026
 * Discovery - Search Bar Component
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, TextInput, ScrollView, Image } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeOut, 
  Layout, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { SearchResult, CATEGORIES } from '../types';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultPress: (result: SearchResult) => void;
  onClear: () => void;
  recentSearches: string[];
  onRecentSearchPress: (query: string) => void;
  onClearRecent: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  onResultPress,
  onClear,
  recentSearches,
  onRecentSearchPress,
  onClearRecent,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const width = useSharedValue(1);

  // Debounced search
  useEffect(() => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchResults = await onSearch(value);
        setResults(searchResults);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleFocus = () => {
    setIsFocused(true);
    width.value = withSpring(1);
    haptics.light();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    haptics.light();
    onClear();
    setResults([]);
    inputRef.current?.blur();
  };

  const handleResultPress = (result: SearchResult) => {
    haptics.light();
    onResultPress(result);
    setResults([]);
    inputRef.current?.blur();
  };

  const handleRecentPress = (query: string) => {
    haptics.light();
    onRecentSearchPress(query);
  };

  const showResults = isFocused && (results.length > 0 || isSearching);
  const showRecent = isFocused && !value && recentSearches.length > 0;
  const showEmpty = isFocused && value && results.length === 0 && !isSearching;

  return (
    <View style={[styles.container, style]}>
      {/* Search Input */}
      <Animated.View 
        entering={FadeIn}
        layout={Layout.springify()}
        style={[
          styles.inputContainer,
          { backgroundColor: theme.colors.surface.secondary },
          isFocused && { borderColor: theme.colors.primary.DEFAULT, borderWidth: 2 },
        ]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: theme.colors.text.primary }]}
          placeholder="Search events, places, people..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <View style={[styles.clearIcon, { backgroundColor: theme.colors.text.tertiary }]}>
              <Text style={styles.clearText}>✕</Text>
            </View>
          </Pressable>
        )}
      </Animated.View>

      {/* Results Dropdown */}
      {showResults && (
        <Animated.View 
          entering={FadeInDown.springify()}
          exiting={FadeOut.duration(200)}
          style={[styles.resultsContainer, { backgroundColor: theme.colors.surface.primary }]}
        >
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Loading */}
            {isSearching && (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: theme.colors.text.tertiary }]}>
                  Searching...
                </Text>
              </View>
            )}

            {/* Results */}
            {!isSearching && results.map((result, index) => (
              <Animated.View 
                key={result.id}
                entering={FadeInDown.delay(index * 30)}
              >
                <Pressable
                  onPress={() => handleResultPress(result)}
                  style={({ pressed }) => [
                    styles.resultItem,
                    { backgroundColor: pressed ? theme.colors.surface.secondary : 'transparent' },
                  ]}
                >
                  {result.imageUrl ? (
                    <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
                  ) : result.icon ? (
                    <View style={[styles.resultIcon, { backgroundColor: theme.colors.surface.secondary }]}>
                      <Text style={styles.resultIconText}>{result.icon}</Text>
                    </View>
                  ) : (
                    <View style={[styles.resultIcon, { backgroundColor: theme.colors.surface.secondary }]}>
                      <Text style={styles.resultIconText}>📍</Text>
                    </View>
                  )}
                  <View style={styles.resultContent}>
                    <Text style={[styles.resultTitle, { color: theme.colors.text.primary }]} numberOfLines={1}>
                      {result.title}
                    </Text>
                    {result.subtitle && (
                      <Text style={[styles.resultSubtitle, { color: theme.colors.text.tertiary }]} numberOfLines={1}>
                        {result.subtitle}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.resultType, { backgroundColor: theme.colors.surface.secondary }]}>
                    <Text style={[styles.resultTypeText, { color: theme.colors.text.tertiary }]}>
                      {result.type}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}

            {/* Empty State */}
            {showEmpty && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
                  No results found
                </Text>
                <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>
                  Try different keywords or browse categories
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* Recent Searches */}
      {showRecent && (
        <Animated.View 
          entering={FadeInDown.springify()}
          exiting={FadeOut.duration(200)}
          style={[styles.recentContainer, { backgroundColor: theme.colors.surface.primary }]}
        >
          <View style={styles.recentHeader}>
            <Text style={[styles.recentTitle, { color: theme.colors.text.tertiary }]}>Recent</Text>
            <Pressable onPress={() => { haptics.light(); onClearRecent(); }}>
              <Text style={[styles.clearRecentText, { color: theme.colors.primary.DEFAULT }]}>Clear</Text>
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {recentSearches.map((query, index) => (
              <Pressable
                key={`${query}-${index}`}
                onPress={() => handleRecentPress(query)}
                style={({ pressed }) => [
                  styles.recentItem,
                  { backgroundColor: pressed ? theme.colors.surface.secondary : 'transparent' },
                ]}
              >
                <Text style={styles.recentIcon}>🕐</Text>
                <Text style={[styles.recentText, { color: theme.colors.text.primary }]}>{query}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Trending Categories */}
          <View style={styles.trendingSection}>
            <Text style={[styles.trendingTitle, { color: theme.colors.text.tertiary }]}>Trending</Text>
            <View style={styles.trendingChips}>
              {CATEGORIES.filter(c => c.isTrending).slice(0, 5).map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => handleRecentPress(category.name)}
                  style={({ pressed }) => [
                    styles.trendingChip,
                    { backgroundColor: `${category.color}15` },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.trendingChipIcon}>{category.icon}</Text>
                  <Text style={[styles.trendingChipText, { color: category.color }]}>{category.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
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
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  resultsContainer: {
    marginTop: spacing[2],
    borderRadius: 16,
    maxHeight: 400,
    overflow: 'hidden',
  },
  loadingContainer: {
    padding: spacing[4],
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
  },
  resultImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: spacing[3],
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  resultIconText: {
    fontSize: 20,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
  },
  resultSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  resultType: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  resultTypeText: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    padding: spacing[5],
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing[3],
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  recentContainer: {
    marginTop: spacing[2],
    borderRadius: 16,
    maxHeight: 400,
    overflow: 'hidden',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    paddingBottom: spacing[2],
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearRecentText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    paddingHorizontal: spacing[4],
  },
  recentIcon: {
    fontSize: 16,
    marginRight: spacing[3],
  },
  recentText: {
    fontSize: 15,
  },
  trendingSection: {
    padding: spacing[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[3],
  },
  trendingChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: spacing[1],
  },
  trendingChipIcon: {
    fontSize: 14,
  },
  trendingChipText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
});

SearchBar.displayName = 'SearchBar';

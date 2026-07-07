import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { typography } from '../../../../ui/tokens/typography';
import { spacing } from '../../../../ui/tokens/spacing';
import { SearchResult, RecentSearch } from '../../types';

export interface FloatingSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSearch?: (query: string) => void;
  onResultPress?: (result: SearchResult) => void;
  onRecentPress?: (search: RecentSearch) => void;
  onClear?: () => void;
  results?: SearchResult[];
  recentSearches?: RecentSearch[];
  isLoading?: boolean;
}

export const FloatingSearch: React.FC<FloatingSearchProps> = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onSearch,
  onResultPress,
  onRecentPress,
  onClear,
  results = [],
  recentSearches = [],
  isLoading = false,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleSubmit = useCallback(() => {
    if (value.trim()) {
      onSearch?.(value.trim());
    }
  }, [value, onSearch]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
  }, [onChangeText, onClear]);

  const animatedPlaceholders = [
    'Search events...',
    'Search organizers...',
    'Search businesses...',
  ];

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: insets.top + 80, // Below header
      left: spacing[4],
      right: spacing[4],
      zIndex: 15,
    },
    searchContainer: {
      backgroundColor: theme.colors.surface.elevated,
      borderRadius: theme.radius.component.card,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      ...theme.shadows.component.md,
      borderWidth: isFocused ? 2 : 0,
      borderColor: theme.colors.interactive.primary,
    },
    searchIcon: {
      marginRight: spacing[2],
    },
    searchInput: {
      flex: 1,
      ...typography.body,
      color: theme.colors.text.primary,
      padding: 0,
    },
    clearButton: {
      padding: spacing[1],
    },
    dropdown: {
      backgroundColor: theme.colors.surface.elevated,
      borderRadius: theme.radius.component.card,
      marginTop: spacing[2],
      maxHeight: 300,
      shadowColor: '#000',
      ...theme.shadows.component.lg,
    },
    sectionTitle: {
      ...typography.caption,
      color: theme.colors.text.tertiary,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      backgroundColor: theme.colors.surface.secondary,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider.default,
    },
    resultIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[3],
    },
    resultContent: {
      flex: 1,
    },
    resultTitle: {
      ...typography.body,
      color: theme.colors.text.primary,
    },
    resultSubtitle: {
      ...typography.caption,
      color: theme.colors.text.secondary,
    },
    recentIcon: {
      marginRight: spacing[2],
    },
  });

  const renderResult = ({ item }: { item: SearchResult }) => (
    <Pressable
      style={styles.resultItem}
      onPress={() => onResultPress?.(item)}
      accessibilityLabel={`${item.title}, ${item.type}`}
    >
      <View style={styles.resultIcon}>
        <Text>
          {item.type === 'event' ? '📍' : item.type === 'organizer' ? '👤' : '🏢'}
        </Text>
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
        )}
      </View>
    </Pressable>
  );

  const renderRecent = ({ item }: { item: RecentSearch }) => (
    <Pressable
      style={styles.resultItem}
      onPress={() => onRecentPress?.(item)}
      accessibilityLabel={`Recent search: ${item.query}`}
    >
      <Text style={styles.recentIcon}>🕐</Text>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.query}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          placeholder="Search events, organizers, places..."
          placeholderTextColor={theme.colors.text.tertiary}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={handleClear}
            accessibilityLabel="Clear search"
          >
            <Text>✕</Text>
          </Pressable>
        )}
      </View>

      {isFocused && (results.length > 0 || recentSearches.length > 0) && (
        <View style={styles.dropdown}>
          {recentSearches.length > 0 && results.length === 0 && (
            <>
              <Text style={styles.sectionTitle}>RECENT</Text>
              <FlatList
                data={recentSearches}
                renderItem={renderRecent}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
          {results.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>RESULTS</Text>
              <FlatList
                data={results}
                renderItem={renderResult}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default FloatingSearch;

/**
 * LinkUp Design System 2026
 * Filter Chips - Horizontal scrolling category filters
 */

'use client';

import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  FlatList,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useTheme } from '../../ui/providers/theme-provider';
import { useHaptics } from '../../ui/hooks/use-haptics';
import { spacing } from '../../ui/tokens/spacing';
import { Chip, ChipGroup } from '../../ui/components/chips';

interface FilterCategory {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

interface FilterChipsProps {
  categories: FilterCategory[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  style?: ViewStyle;
}

const DEFAULT_CATEGORIES: FilterCategory[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'food', label: 'Food', icon: '🍕' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'volunteer', label: 'Volunteer', icon: '🤝' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'study', label: 'Study', icon: '📖' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  categories = DEFAULT_CATEGORIES,
  selectedIds = [],
  onSelectionChange,
  multiSelect = true,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSelect = useCallback(
    (id: string, isSelected: boolean) => {
      haptics.selection();

      // Handle "All" special case
      if (id === 'all') {
        onSelectionChange(isSelected ? ['all'] : []);
        return;
      }

      let newSelected: string[];

      if (multiSelect) {
        newSelected = isSelected
          ? [...selectedIds.filter((s) => s !== 'all'), id]
          : selectedIds.filter((s) => s !== id);

        // If nothing selected, default to "All"
        if (newSelected.length === 0) {
          newSelected = ['all'];
        }
      } else {
        newSelected = isSelected ? [id] : ['all'];
      }

      onSelectionChange(newSelected);
    },
    [haptics, multiSelect, selectedIds, onSelectionChange]
  );

  const isSelected = (id: string) => {
    if (id === 'all') {
      return selectedIds.length === 0 || selectedIds.includes('all');
    }
    return selectedIds.includes(id);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={spacing[2] + 80}
      >
        {categories.map((category) => (
          <Animated.View
            key={category.id}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.chipWrapper}
          >
            <Chip
              label={category.label}
              icon={<Text style={styles.chipIcon}>{category.icon}</Text>}
              selected={isSelected(category.id)}
              onSelect={(selected) => handleSelect(category.id, selected)}
              size="md"
              variant={
                category.id === 'all' && isSelected(category.id)
                  ? 'category'
                  : isSelected(category.id)
                  ? 'filter'
                  : 'default'
              }
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* Gradient fade edges */}
      <View
        style={[
          styles.gradientLeft,
          {
            backgroundColor: `linear-gradient(to right, ${theme.colors.surface.background}, transparent)`,
          },
        ]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.gradientRight,
          {
            backgroundColor: `linear-gradient(to left, ${theme.colors.surface.background}, transparent)`,
          },
        ]}
        pointerEvents="none"
      />
    </View>
  );
};

// Compact version for smaller screens
interface CompactFilterChipsProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories?: FilterCategory[];
  style?: ViewStyle;
}

export const CompactFilterChips: React.FC<CompactFilterChipsProps> = ({
  selectedCategory,
  onCategoryChange,
  categories = DEFAULT_CATEGORIES.filter((c) => c.id !== 'all').slice(0, 5),
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  return (
    <View style={[styles.compactContainer, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.compactScrollContent}
      >
        <Chip
          label="All"
          selected={selectedCategory === null}
          onSelect={() => {
            haptics.selection();
            onCategoryChange(null);
          }}
          size="sm"
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
            icon={<Text style={styles.compactChipIcon}>{category.icon}</Text>}
            selected={selectedCategory === category.id}
            onSelect={() => {
              haptics.selection();
              onCategoryChange(category.id);
            }}
            size="sm"
            style={styles.compactChip}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    alignItems: 'center',
  },
  chipWrapper: {},
  chipIcon: {
    fontSize: 14,
  },
  gradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
  },
  gradientRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
  },
  compactContainer: {
    height: 40,
  },
  compactScrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    alignItems: 'center',
  },
  compactChip: {
    marginLeft: spacing[1],
  },
  compactChipIcon: {
    fontSize: 12,
  },
});

FilterChips.displayName = 'FilterChips';
CompactFilterChips.displayName = 'CompactFilterChips';

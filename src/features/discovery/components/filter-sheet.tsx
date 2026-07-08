/**
 * LinkUp Design System 2026
 * Discovery - Filter Sheet Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { SearchFilters, CATEGORIES, SORT_OPTIONS, SortOption } from '../types';

interface FilterSheetProps {
  filters: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  onClose: () => void;
  style?: ViewStyle;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onClose,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const hasActiveFilters = Object.keys(filters).length > 0;

  const handleCategoryPress = (categoryId: string) => {
    haptics.light();
    onFilterChange({
      category: filters.category === categoryId ? undefined : categoryId,
    });
  };

  const handlePricePress = (price: 'free' | 'paid' | 'all') => {
    haptics.light();
    onFilterChange({
      price: filters.price === price ? undefined : price,
    });
  };

  const handleDistancePress = (distance: number) => {
    haptics.light();
    onFilterChange({
      distance: filters.distance === distance ? undefined : distance,
    });
  };

  const handleSortPress = (sortOption: SortOption) => {
    haptics.light();
    onFilterChange({} as Partial<SearchFilters>); // Trigger sort
  };

  const handleVerifiedPress = () => {
    haptics.light();
    onFilterChange({
      verified: filters.verified ? undefined : true,
    });
  };

  const handleOpenNowPress = () => {
    haptics.light();
    onFilterChange({
      openNow: filters.openNow ? undefined : true,
    });
  };

  const handleClear = () => {
    haptics.light();
    onClearFilters();
  };

  return (
    <Animated.View 
      entering={FadeInUp.springify()}
      style={[styles.container, { backgroundColor: theme.colors.surface.primary }, style]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Filters</Text>
        {hasActiveFilters && (
          <Pressable onPress={handleClear}>
            <Text style={[styles.clearText, { color: theme.colors.primary.DEFAULT }]}>Clear All</Text>
          </Pressable>
        )}
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeIcon, { color: theme.colors.text.primary }]}>✕</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sort */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.tertiary }]}>Sort By</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleSortPress(option.value)}
                style={({ pressed }) => [
                  styles.chip,
                  { backgroundColor: theme.colors.surface.secondary },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.chipIcon}>{option.icon}</Text>
                <Text style={[styles.chipText, { color: theme.colors.text.primary }]}>{option.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.tertiary }]}>Distance</Text>
          <View style={styles.chipsGrid}>
            {[1, 2, 5, 10, 25, 50].map((distance) => (
              <Pressable
                key={distance}
                onPress={() => handleDistancePress(distance)}
                style={({ pressed }) => [
                  styles.chip,
                  { 
                    backgroundColor: filters.distance === distance 
                      ? theme.colors.primary.DEFAULT 
                      : theme.colors.surface.secondary,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text 
                  style={[
                    styles.chipText, 
                    { color: filters.distance === distance ? '#FFFFFF' : theme.colors.text.primary }
                  ]}
                >
                  {distance}km
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.tertiary }]}>Category</Text>
          <View style={styles.chipsGrid}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={({ pressed }) => [
                  styles.chip,
                  { 
                    backgroundColor: filters.category === category.id 
                      ? category.color 
                      : `${category.color}15`,
                    borderColor: category.color,
                    borderWidth: filters.category === category.id ? 0 : 1,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.chipIcon}>{category.icon}</Text>
                <Text 
                  style={[
                    styles.chipText, 
                    { color: filters.category === category.id ? '#FFFFFF' : category.color }
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.tertiary }]}>Price</Text>
          <View style={styles.chipsRow}>
            <Pressable
              onPress={() => handlePricePress('all')}
              style={({ pressed }) => [
                styles.chip,
                { 
                  backgroundColor: filters.price === 'all' || !filters.price
                    ? theme.colors.primary.DEFAULT 
                    : theme.colors.surface.secondary,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                style={[
                  styles.chipText, 
                  { color: filters.price === 'all' || !filters.price ? '#FFFFFF' : theme.colors.text.primary }
                ]}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handlePricePress('free')}
              style={({ pressed }) => [
                styles.chip,
                { 
                  backgroundColor: filters.price === 'free' 
                    ? '#10B981' 
                    : theme.colors.surface.secondary,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                style={[
                  styles.chipText, 
                  { color: filters.price === 'free' ? '#FFFFFF' : theme.colors.text.primary }
                ]}
              >
                Free
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handlePricePress('paid')}
              style={({ pressed }) => [
                styles.chip,
                { 
                  backgroundColor: filters.price === 'paid' 
                    ? theme.colors.primary.DEFAULT 
                    : theme.colors.surface.secondary,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                style={[
                  styles.chipText, 
                  { color: filters.price === 'paid' ? '#FFFFFF' : theme.colors.text.primary }
                ]}
              >
                Paid
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.tertiary }]}>More</Text>
          <View style={styles.togglesGrid}>
            <Pressable
              onPress={handleVerifiedPress}
              style={({ pressed }) => [
                styles.toggleChip,
                { 
                  backgroundColor: filters.verified 
                    ? theme.colors.primary.DEFAULT 
                    : theme.colors.surface.secondary,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.toggleIcon}>✓</Text>
              <Text 
                style={[
                  styles.toggleText, 
                  { color: filters.verified ? '#FFFFFF' : theme.colors.text.primary }
                ]}
              >
                Verified Only
              </Text>
            </Pressable>
            <Pressable
              onPress={handleOpenNowPress}
              style={({ pressed }) => [
                styles.toggleChip,
                { 
                  backgroundColor: filters.openNow 
                    ? theme.colors.primary.DEFAULT 
                    : theme.colors.surface.secondary,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.toggleIcon}>🕐</Text>
              <Text 
                style={[
                  styles.toggleText, 
                  { color: filters.openNow ? '#FFFFFF' : theme.colors.text.primary }
                ]}
              >
                Open Now
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border.default }]}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.applyButton,
            { backgroundColor: theme.colors.primary.DEFAULT },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.applyText}>Show Results</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: spacing[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[5],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
  },
  clearText: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
  },
  section: {
    padding: spacing[5],
    paddingBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[3],
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: spacing[1],
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  togglesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    gap: spacing[2],
  },
  toggleIcon: {
    fontSize: 16,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  footer: {
    padding: spacing[5],
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  applyButton: {
    paddingVertical: spacing[4],
    borderRadius: 16,
    alignItems: 'center',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});

FilterSheet.displayName = 'FilterSheet';

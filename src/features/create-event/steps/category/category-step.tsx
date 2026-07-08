/**
 * LinkUp Design System 2026
 * Category Step - Choose event category
 */

'use client';

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { useHaptics } from '../../../../ui/hooks/use-haptics';
import { spacing } from '../../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../../ui/tokens/typography';
import type { CreateEventData } from '../../flow/create-event-flow';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing[4] * 2 - spacing[3]) / 2;

interface CategoryStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

const CATEGORIES = [
  { id: 'coffee', label: 'Coffee', icon: '☕', color: '#8B4513' },
  { id: 'food', label: 'Food', icon: '🍕', color: '#FF6B6B' },
  { id: 'music', label: 'Music', icon: '🎵', color: '#9B59B6' },
  { id: 'sports', label: 'Sports', icon: '⚽', color: '#27AE60' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', color: '#3498DB' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: '#E67E22' },
  { id: 'business', label: 'Business', icon: '💼', color: '#2C3E50' },
  { id: 'movies', label: 'Movies', icon: '🎬', color: '#E74C3C' },
  { id: 'nature', label: 'Nature', icon: '🌿', color: '#16A085' },
  { id: 'study', label: 'Study', icon: '📚', color: '#2980B9' },
  { id: 'volunteer', label: 'Volunteer', icon: '🤝', color: '#1ABC9C' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙', color: '#8E44AD' },
  { id: 'art', label: 'Art', icon: '🎨', color: '#D35400' },
  { id: 'fitness', label: 'Fitness', icon: '💪', color: '#C0392B' },
  { id: 'tech', label: 'Tech', icon: '💻', color: '#34495E' },
  { id: 'pets', label: 'Pets', icon: '🐕', color: '#F39C12' },
];

export const CategoryStep: React.FC<CategoryStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleSelectCategory = useCallback(
    (category: typeof CATEGORIES[0]) => {
      haptics.selection();
      const categoryData = {
        id: category.id,
        label: category.label,
        icon: category.icon,
      };
      onUpdate({ category: categoryData });
      onComplete({ category: categoryData });
    },
    [haptics, onUpdate, onComplete]
  );

  const renderCategory = ({ item, index }: { item: typeof CATEGORIES[0]; index: number }) => {
    const isSelected = data.category?.id === item.id;

    return (
      <CategoryCard
        category={item}
        isSelected={isSelected}
        onPress={() => handleSelectCategory(item)}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        What type of event? 🏷️
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Choose a category that best describes your event
      </Text>

      {/* Categories Grid */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />

      {/* Selected Preview */}
      {data.category && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.selectedPreview,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.interactive.primary,
            },
          ]}
        >
          <Text style={styles.selectedIcon}>{data.category.icon}</Text>
          <Text
            style={[
              styles.selectedText,
              { color: theme.colors.text.primary },
            ]}
          >
            {data.category.label}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

// Category Card
interface CategoryCardProps {
  category: typeof CATEGORIES[0];
  isSelected: boolean;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: isSelected
              ? category.color + '20'
              : theme.colors.surface.primary,
            borderColor: isSelected ? category.color : theme.colors.border.default,
          },
        ]}
      >
        <Text style={styles.cardIcon}>{category.icon}</Text>
        <Text
          style={[
            styles.cardLabel,
            {
              color: isSelected ? category.color : theme.colors.text.primary,
            },
          ]}
        >
          {category.label}
        </Text>
        {isSelected && (
          <View
            style={[
              styles.checkmark,
              { backgroundColor: category.color },
            ]}
          >
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 15,
    marginBottom: spacing[6],
  },
  grid: {
    paddingBottom: spacing[4],
  },
  row: {
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    width: '100%',
    padding: spacing[4],
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
  },
  checkmark: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 2,
    marginTop: spacing[4],
  },
  selectedIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  selectedText: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});

CategoryStep.displayName = 'CategoryStep';

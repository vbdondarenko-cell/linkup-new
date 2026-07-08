/**
 * LinkUp Design System 2026
 * Organizer - Templates Screen
 */

'use client';

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ViewStyle, Image } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { Chip } from '../../../ui/components/chips';
import { EventTemplateData } from '../types';

interface TemplatesScreenProps {
  templates?: EventTemplateData[];
  onTemplatePress?: (template: EventTemplateData) => void;
  onCreateFromTemplate?: (template: EventTemplateData) => void;
  onCreateEvent?: () => void;
  style?: ViewStyle;
}

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'arts', label: 'Arts', icon: '🎨' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'wellness', label: 'Wellness', icon: '🧘' },
];

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({
  templates = [],
  onTemplatePress,
  onCreateFromTemplate,
  onCreateEvent,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredTemplates = useMemo(() => {
    let result = templates;
    
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    if (showFavoritesOnly) {
      result = result.filter(t => t.isFavorite);
    }
    
    return result.sort((a, b) => b.useCount - a.useCount);
  }, [templates, selectedCategory, showFavoritesOnly]);

  const handleCategoryPress = (category: string) => {
    haptics.light();
    setSelectedCategory(category);
  };

  const toggleFavorites = () => {
    haptics.light();
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const getCategoryInfo = (categoryId: string) => {
    return TEMPLATE_CATEGORIES.find(c => c.id === categoryId) || TEMPLATE_CATEGORIES[0];
  };

  // Generate mock templates for demo
  const mockTemplates: EventTemplateData[] = templates.length > 0 ? templates : [
    {
      id: 't1',
      title: 'Weekly Coffee Meetup',
      description: 'Casual networking over coffee',
      category: 'social',
      categoryInfo: TEMPLATE_CATEGORIES[1],
      defaultDuration: 120,
      defaultCapacity: 10,
      coverImageUrl: 'https://picsum.photos/seed/t1/400/200',
      isFavorite: true,
      useCount: 15,
      lastUsedAt: new Date(Date.now() - 86400000 * 3),
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
    {
      id: 't2',
      title: 'Tech Talk Session',
      description: 'Share knowledge with the community',
      category: 'tech',
      categoryInfo: TEMPLATE_CATEGORIES[2],
      defaultDuration: 90,
      defaultCapacity: 30,
      coverImageUrl: 'https://picsum.photos/seed/t2/400/200',
      isFavorite: false,
      useCount: 8,
      lastUsedAt: new Date(Date.now() - 86400000 * 7),
      createdAt: new Date(Date.now() - 86400000 * 60),
    },
    {
      id: 't3',
      title: 'Art Workshop',
      description: 'Hands-on creative learning',
      category: 'arts',
      categoryInfo: TEMPLATE_CATEGORIES[3],
      defaultDuration: 180,
      defaultCapacity: 15,
      coverImageUrl: 'https://picsum.photos/seed/t3/400/200',
      isFavorite: true,
      useCount: 5,
      lastUsedAt: new Date(Date.now() - 86400000 * 14),
      createdAt: new Date(Date.now() - 86400000 * 45),
    },
    {
      id: 't4',
      title: 'Morning Yoga',
      description: 'Start your day with mindfulness',
      category: 'wellness',
      categoryInfo: TEMPLATE_CATEGORIES[6],
      defaultDuration: 60,
      defaultCapacity: 20,
      coverImageUrl: 'https://picsum.photos/seed/t4/400/200',
      isFavorite: false,
      useCount: 22,
      lastUsedAt: new Date(Date.now() - 86400000),
      createdAt: new Date(Date.now() - 86400000 * 90),
    },
  ];

  const displayTemplates = templates.length > 0 ? filteredTemplates : mockTemplates.filter(t => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (showFavoritesOnly && !t.isFavorite) return false;
    return true;
  });

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Templates
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Create events faster with reusable templates
        </Text>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {TEMPLATE_CATEGORIES.map((category) => (
          <Animated.View
            key={category.id}
            entering={FadeInDown.delay(100)}
          >
            <Chip
              label={category.label}
              variant={selectedCategory === category.id ? 'filled' : 'outline'}
              onPress={() => handleCategoryPress(category.id)}
              icon={category.icon}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* Favorites Toggle */}
      <View style={styles.favoritesRow}>
        <Pressable onPress={toggleFavorites} style={styles.favoritesToggle}>
          <View style={[
            styles.checkbox,
            showFavoritesOnly && { backgroundColor: theme.colors.primary.DEFAULT }
          ]}>
            {showFavoritesOnly && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.favoritesText, { color: theme.colors.text.primary }]}>
            Favorites only
          </Text>
        </Pressable>
      </View>

      {/* Templates Grid */}
      <ScrollView
        style={styles.templatesList}
        contentContainerStyle={styles.templatesContent}
        showsVerticalScrollIndicator={false}
      >
        {displayTemplates.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              No Templates Found
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              {showFavoritesOnly 
                ? 'Mark templates as favorites to see them here'
                : 'Create templates from your events to reuse them'}
            </Text>
            <Button
              variant="primary"
              onPress={() => { haptics.light(); onCreateEvent?.(); }}
              style={styles.emptyButton}
            >
              Create Event
            </Button>
          </Animated.View>
        ) : (
          displayTemplates.map((template, index) => {
            const categoryInfo = getCategoryInfo(template.category);
            return (
              <Animated.View
                key={template.id}
                entering={FadeInDown.delay(index * 50)}
              >
                <Pressable
                  onPress={() => { haptics.light(); onTemplatePress?.(template); }}
                  style={[
                    styles.templateCard,
                    { backgroundColor: theme.colors.surface.primary }
                  ]}
                >
                  {/* Cover Image */}
                  {template.coverImageUrl && (
                    <Image
                      source={{ uri: template.coverImageUrl }}
                      style={styles.templateCover}
                      resizeMode="cover"
                    />
                  )}

                  {/* Content */}
                  <View style={styles.templateContent}>
                    <View style={styles.templateHeader}>
                      <View style={[styles.categoryBadge, { backgroundColor: `${categoryInfo.color}20` }]}>
                        <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
                        <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                          {categoryInfo.label}
                        </Text>
                      </View>
                      {template.isFavorite && (
                        <Text style={styles.favoriteIcon}>❤️</Text>
                      )}
                    </View>

                    <Text style={[styles.templateTitle, { color: theme.colors.text.primary }]}>
                      {template.title}
                    </Text>
                    <Text 
                      style={[styles.templateDescription, { color: theme.colors.text.secondary }]}
                      numberOfLines={2}
                    >
                      {template.description}
                    </Text>

                    {/* Meta */}
                    <View style={styles.templateMeta}>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>⏱️</Text>
                        <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                          {template.defaultDuration} min
                        </Text>
                      </View>
                      {template.defaultCapacity && (
                        <View style={styles.metaItem}>
                          <Text style={styles.metaIcon}>👥</Text>
                          <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                            Up to {template.defaultCapacity}
                          </Text>
                        </View>
                      )}
                      <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>📊</Text>
                        <Text style={[styles.metaText, { color: theme.colors.text.tertiary }]}>
                          Used {template.useCount} times
                        </Text>
                      </View>
                    </View>

                    {/* Action */}
                    <Button
                      variant="primary"
                      size="sm"
                      onPress={() => { haptics.light(); onCreateFromTemplate?.(template); }}
                      style={styles.useButton}
                    >
                      Use Template
                    </Button>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing[5],
    paddingTop: spacing[6],
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing[1],
  },
  categoriesContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  favoritesRow: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
  },
  favoritesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  favoritesText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  templatesList: {
    flex: 1,
  },
  templatesContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  templateCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  templateCover: {
    width: '100%',
    height: 100,
  },
  templateContent: {
    padding: spacing[4],
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  templateTitle: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  templateDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing[3],
  },
  templateMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
  },
  useButton: {
    marginTop: spacing[1],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[5],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  emptyButton: {
    paddingHorizontal: spacing[6],
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

TemplatesScreen.displayName = 'TemplatesScreen';

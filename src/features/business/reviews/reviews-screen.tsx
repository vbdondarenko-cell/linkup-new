/**
 * LinkUp Design System 2026
 * Business - Reviews Screen
 */

'use client';

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Chip } from '../../../ui/components/chips';
import { ReviewCard, RatingDistribution } from '../components';
import { BusinessReview } from '../types';

interface ReviewsScreenProps {
  reviews: BusinessReview[];
  ratingDistribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
  averageRating: number;
  totalReviews: number;
  onRespond?: (reviewId: string, response: string) => void;
  style?: ViewStyle;
}

type ReviewFilter = 'all' | 'responded' | 'unresponded' | 'positive' | 'negative';

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({
  reviews,
  ratingDistribution,
  averageRating,
  totalReviews,
  onRespond,
  style,
}) => {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>('all');

  const filteredReviews = useMemo(() => {
    switch (selectedFilter) {
      case 'responded': return reviews.filter(r => r.businessResponse);
      case 'unresponded': return reviews.filter(r => !r.businessResponse);
      case 'positive': return reviews.filter(r => r.rating >= 4);
      case 'negative': return reviews.filter(r => r.rating <= 2);
      default: return reviews;
    }
  }, [reviews, selectedFilter]);

  const filters: Array<{ key: ReviewFilter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'responded', label: 'Responded' },
    { key: 'unresponded', label: 'Unresponded' },
    { key: 'positive', label: 'Positive' },
    { key: 'negative', label: 'Critical' },
  ];

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Reviews</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {totalReviews} total reviews
        </Text>
      </View>

      {/* Rating Distribution */}
      <View style={styles.distributionContainer}>
        <RatingDistribution
          distribution={ratingDistribution}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
        {filters.map((filter) => (
          <Animated.View key={filter.key} entering={FadeInDown.delay(100)} layout={Layout.springify()}>
            <Chip
              label={filter.label}
              variant={selectedFilter === filter.key ? 'filled' : 'outline'}
              onPress={() => setSelectedFilter(filter.key)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* Reviews List */}
      <ScrollView style={styles.reviewsList} contentContainerStyle={styles.reviewsContent} showsVerticalScrollIndicator={false}>
        {filteredReviews.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No Reviews Found</Text>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              {selectedFilter === 'all' ? 'Reviews will appear here' : 'Try a different filter'}
            </Text>
          </Animated.View>
        ) : (
          filteredReviews.map((review, index) => (
            <Animated.View key={review.id} entering={FadeInDown.delay(index * 50)} layout={Layout.springify()}>
              <ReviewCard
                review={review}
                onRespond={(response) => onRespond?.(review.id, response)}
                delay={0}
              />
            </Animated.View>
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing[5], paddingTop: spacing[6] },
  title: { fontSize: 28, fontWeight: fontWeight.bold },
  subtitle: { fontSize: 14, marginTop: 2 },
  distributionContainer: { paddingHorizontal: spacing[5], marginTop: spacing[4] },
  filtersContainer: { paddingHorizontal: spacing[5], paddingVertical: spacing[4], gap: spacing[2] },
  reviewsList: { flex: 1 },
  reviewsContent: { paddingHorizontal: spacing[5], gap: spacing[3] },
  emptyState: { alignItems: 'center', paddingVertical: spacing[8] },
  emptyIcon: { fontSize: 64, marginBottom: spacing[4] },
  emptyTitle: { fontSize: 20, fontWeight: fontWeight.semibold, marginBottom: spacing[2] },
  emptyText: { fontSize: 15, textAlign: 'center' },
  bottomSpacer: { height: spacing[8] },
});

ReviewsScreen.displayName = 'ReviewsScreen';

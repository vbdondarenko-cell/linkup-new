/**
 * LinkUp Design System 2026
 * Business - Analytics Screen
 */

'use client';

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { BusinessAnalyticsChart, RatingDistribution, BusinessGrowthIndicator, BusinessMetricCard } from '../components';
import { BusinessAnalytics } from '../types';

interface AnalyticsScreenProps {
  analytics: BusinessAnalytics | null;
  style?: ViewStyle;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ analytics, style }) => {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!analytics) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>Analytics Coming Soon</Text>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          Create your first event to see analytics
        </Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInUp} style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Analytics</Text>
          <Text style={[styles.period, { color: theme.colors.text.secondary }]}>
            {formatDate(analytics.period.start)} - {formatDate(analytics.period.end)}
          </Text>
        </Animated.View>

        {/* Growth Indicators */}
        <View style={styles.section}>
          <View style={styles.growthRow}>
            <BusinessGrowthIndicator label="Views" value={analytics.growth.views} delay={100} style={styles.growthCard} />
            <BusinessGrowthIndicator label="Guests" value={analytics.growth.participants} delay={150} style={styles.growthCard} />
            <BusinessGrowthIndicator label="Rating" value={analytics.growth.rating} delay={200} style={styles.growthCard} />
          </View>
        </View>

        {/* Overview Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Overview</Text>
          <View style={styles.metricsGrid}>
            <BusinessMetricCard label="Total Views" value={analytics.overview.totalViews.toLocaleString()} icon="👁️" color="#3B82F6" delay={100} />
            <BusinessMetricCard label="Unique Visitors" value={analytics.overview.uniqueVisitors.toLocaleString()} icon="👤" color="#8B5CF6" delay={150} />
            <BusinessMetricCard label="Avg Attendance" value={`${analytics.overview.averageAttendance}%`} icon="📈" color="#10B981" delay={200} />
            <BusinessMetricCard label="Conversion" value={`${analytics.overview.conversionRate}%`} icon="🎯" color="#F59E0B" delay={250} />
          </View>
        </View>

        {/* Views Chart */}
        <View style={styles.section}>
          <BusinessAnalyticsChart
            title="Views Over Time"
            subtitle="Daily views for your events"
            data={analytics.viewsByDay.map(d => ({ label: d.date.split('-')[2], value: d.views }))}
            delay={300}
          />
        </View>

        {/* Participants Chart */}
        <View style={styles.section}>
          <BusinessAnalyticsChart
            title="Participants Over Time"
            subtitle="Daily participant growth"
            data={analytics.participantsByDay.map(d => ({ label: d.date.split('-')[2], value: d.participants, color: '#10B981' }))}
            delay={350}
          />
        </View>

        {/* Rating Distribution */}
        <View style={styles.section}>
          <RatingDistribution
            distribution={analytics.ratingDistribution}
            averageRating={analytics.overview.averageRating}
            totalReviews={analytics.overview.totalParticipants}
            delay={400}
          />
        </View>

        {/* Peak Days */}
        <Animated.View entering={FadeInUp.delay(450)} style={[styles.peakDaysCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Peak Days</Text>
          <View style={styles.peakDaysContainer}>
            {analytics.peakDays.map((day, index) => (
              <View key={day} style={[styles.peakDayBadge, { backgroundColor: `${index === 0 ? '#10B981' : index === 1 ? '#3B82F6' : '#8B5CF6'}20` }]}>
                <Text style={[styles.peakDayText, { color: index === 0 ? '#10B981' : index === 1 ? '#3B82F6' : '#8B5CF6' }]}>
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Popular Categories */}
        <Animated.View entering={FadeInUp.delay(500)} style={[styles.categoriesCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Popular Categories</Text>
          {analytics.popularCategories.map((cat, index) => (
            <View key={cat.category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryRank, { color: theme.colors.text.tertiary }]}>#{index + 1}</Text>
                <Text style={[styles.categoryName, { color: theme.colors.text.primary }]}>{cat.category}</Text>
              </View>
              <View style={styles.categoryBar}>
                <View style={[styles.categoryFill, { width: `${(cat.count / analytics.popularCategories[0].count) * 100}%`, backgroundColor: '#3B82F6' }]} />
              </View>
              <Text style={[styles.categoryCount, { color: theme.colors.text.secondary }]}>{cat.count}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { justifyContent: 'center', alignItems: 'center', padding: spacing[5] },
  emptyIcon: { fontSize: 64, marginBottom: spacing[4] },
  emptyTitle: { fontSize: 20, fontWeight: fontWeight.semibold, marginBottom: spacing[2] },
  emptyText: { fontSize: 15, textAlign: 'center' },
  header: { padding: spacing[5], paddingTop: spacing[6] },
  title: { fontSize: 28, fontWeight: fontWeight.bold },
  period: { fontSize: 14, marginTop: 2 },
  section: { marginTop: spacing[5], paddingHorizontal: spacing[5] },
  sectionTitle: { fontSize: 18, fontWeight: fontWeight.bold, marginBottom: spacing[3] },
  growthRow: { flexDirection: 'row', gap: spacing[3] },
  growthCard: { flex: 1 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  peakDaysCard: { margin: spacing[5], marginTop: spacing[5], padding: spacing[4], borderRadius: 16 },
  cardTitle: { fontSize: 15, fontWeight: fontWeight.semibold, marginBottom: spacing[3] },
  peakDaysContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  peakDayBadge: { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: 20 },
  peakDayText: { fontSize: 13, fontWeight: fontWeight.semibold },
  categoriesCard: { margin: spacing[5], marginTop: 0, padding: spacing[4], borderRadius: 16 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[3] },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', width: 100 },
  categoryRank: { fontSize: 12, width: 24 },
  categoryName: { fontSize: 14, fontWeight: fontWeight.medium },
  categoryBar: { flex: 1, height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, marginHorizontal: spacing[3] },
  categoryFill: { height: '100%', borderRadius: 4 },
  categoryCount: { fontSize: 13, width: 30, textAlign: 'right' },
  bottomSpacer: { height: spacing[8] },
});

AnalyticsScreen.displayName = 'AnalyticsScreen';

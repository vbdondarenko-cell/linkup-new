/**
 * LinkUp Design System 2026
 * Business Dashboard - Main Screen
 */

'use client';

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

import { useBusinessState } from '../hooks';
import {
  BusinessHeader,
  OfficialEventCard,
  ReviewCard,
  BusinessAnalyticsChart,
  RatingDistribution,
  BusinessGrowthIndicator,
  BusinessMetricCard,
} from '../components';
import { OfficialEvent, QuickAction, BusinessReview } from '../types';

interface BusinessDashboardProps {
  onCreateEvent?: () => void;
  onEventPress?: (event: OfficialEvent) => void;
  onEventEdit?: (event: OfficialEvent) => void;
  onAnalyticsPress?: () => void;
  onReviewsPress?: () => void;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
  style?: ViewStyle;
}

const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { id: 'create', label: 'Create Event', icon: '➕', color: '#10B981', action: 'create' },
  { id: 'analytics', label: 'Analytics', icon: '📊', color: '#3B82F6', action: 'analytics' },
  { id: 'reviews', label: 'Reviews', icon: '⭐', color: '#F59E0B', action: 'reviews' },
  { id: 'profile', label: 'Profile', icon: '🏢', color: '#8B5CF6', action: 'profile' },
  { id: 'settings', label: 'Settings', icon: '⚙️', color: '#64748B', action: 'settings' },
];

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  onCreateEvent,
  onEventPress,
  onEventEdit,
  onAnalyticsPress,
  onReviewsPress,
  onProfilePress,
  onSettingsPress,
  onNotificationsPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const {
    profile,
    summary,
    events,
    reviews,
    analytics,
    isLoading,
    getUpcomingEvents,
  } = useBusinessState();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleQuickAction = useCallback((action: QuickAction) => {
    haptics.light();
    switch (action.action) {
      case 'create': onCreateEvent?.(); break;
      case 'analytics': onAnalyticsPress?.(); break;
      case 'reviews': onReviewsPress?.(); break;
      case 'profile': onProfilePress?.(); break;
      case 'settings': onSettingsPress?.(); break;
    }
  }, [onCreateEvent, onAnalyticsPress, onReviewsPress, onProfilePress, onSettingsPress, haptics]);

  const upcomingEvents = getUpcomingEvents().slice(0, 3);
  const recentReviews = reviews.slice(0, 2);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary.DEFAULT} />
        }
      >
        {/* Business Header */}
        <BusinessHeader
          profile={profile!}
          onEditPress={onProfilePress}
          onNotificationPress={onNotificationsPress}
          notificationCount={3}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContainer}>
            {DEFAULT_QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => handleQuickAction(action)}
                style={({ pressed }) => [
                  styles.quickActionItem,
                  { backgroundColor: theme.colors.surface.primary, opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
                ]}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Text style={styles.quickActionIconText}>{action.icon}</Text>
                </View>
                <Text style={[styles.quickActionLabel, { color: theme.colors.text.primary }]}>{action.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Overview Stats */}
        {summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Overview</Text>
            <View style={styles.statsGrid}>
              <BusinessMetricCard label="Views" value={summary.totalViews.toLocaleString()} icon="👁️" trend={summary.growthRate} color="#3B82F6" delay={100} />
              <BusinessMetricCard label="Participants" value={summary.totalParticipants} icon="👥" trend={12} color="#10B981" delay={150} />
              <BusinessMetricCard label="Conversion" value={`${summary.conversionRate}%`} icon="📈" trend={5} color="#8B5CF6" delay={200} />
              <BusinessMetricCard label="Repeat Visitors" value={`${summary.repeatVisitors}%`} icon="🔄" trend={8} color="#F59E0B" delay={250} />
            </View>
          </View>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Upcoming Events</Text>
              <Pressable onPress={() => {}}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary.DEFAULT }]}>View All →</Text>
              </Pressable>
            </View>
            <View style={styles.eventsContainer}>
              {upcomingEvents.map((event, index) => (
                <OfficialEventCard
                  key={event.id}
                  event={event}
                  onPress={() => onEventPress?.(event)}
                  onEdit={() => onEventEdit?.(event)}
                  delay={index * 100}
                />
              ))}
            </View>
          </View>
        )}

        {/* Recent Reviews */}
        {recentReviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Recent Reviews</Text>
              <Pressable onPress={() => { haptics.light(); onReviewsPress?.(); }}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary.DEFAULT }]}>View All →</Text>
              </Pressable>
            </View>
            <View style={styles.reviewsContainer}>
              {recentReviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} delay={index * 100} />
              ))}
            </View>
          </View>
        )}

        {/* Analytics Preview */}
        {analytics && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Analytics</Text>
              <Pressable onPress={() => { haptics.light(); onAnalyticsPress?.(); }}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary.DEFAULT }]}>View Full →</Text>
              </Pressable>
            </View>
            
            {/* Growth Indicators */}
            <View style={styles.growthRow}>
              <BusinessGrowthIndicator label="Views" value={analytics.growth.views} delay={100} style={styles.growthItem} />
              <BusinessGrowthIndicator label="Guests" value={analytics.growth.participants} delay={150} style={styles.growthItem} />
              <BusinessGrowthIndicator label="Rating" value={analytics.growth.rating} delay={200} style={styles.growthItem} />
              <BusinessGrowthIndicator label="Followers" value={analytics.growth.followers} delay={250} style={styles.growthItem} />
            </View>

            {/* Views Chart */}
            <BusinessAnalyticsChart
              title="Views This Week"
              subtitle="Daily views for your events"
              data={analytics.viewsByDay.map(d => ({ label: d.date.split('-')[2], value: d.views }))}
              delay={300}
            />

            {/* Rating Distribution */}
            <RatingDistribution
              distribution={analytics.ratingDistribution}
              averageRating={analytics.overview.averageRating}
              totalReviews={summary?.totalReviews || 0}
              delay={400}
            />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  section: { marginTop: spacing[5], paddingHorizontal: spacing[5] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  sectionTitle: { fontSize: 18, fontWeight: fontWeight.bold, marginBottom: spacing[3] },
  viewAllText: { fontSize: 13, fontWeight: fontWeight.medium },
  quickActionsContainer: { gap: spacing[3] },
  quickActionItem: { alignItems: 'center', padding: spacing[3], minWidth: 80, borderRadius: 16 },
  quickActionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[2] },
  quickActionIconText: { fontSize: 24 },
  quickActionLabel: { fontSize: 12, fontWeight: fontWeight.medium, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  eventsContainer: { gap: spacing[4] },
  reviewsContainer: { gap: spacing[3] },
  growthRow: { flexDirection: 'row', gap: spacing[2], marginBottom: spacing[4] },
  growthItem: { flex: 1 },
  bottomSpacer: { height: spacing[8] },
});

BusinessDashboard.displayName = 'BusinessDashboard';

/**
 * LinkUp Design System 2026
 * Organizer - Analytics Screen
 */

'use client';

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { StatCard, AnalyticsChart, GrowthIndicator } from '../components';
import { OrganizerAnalytics } from '../types';

interface AnalyticsScreenProps {
  analytics: OrganizerAnalytics | null;
  style?: ViewStyle;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  analytics,
  style,
}) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!analytics) return [];
    return [
      { label: 'Jan', value: 12 },
      { label: 'Feb', value: 18 },
      { label: 'Mar', value: 15 },
      { label: 'Apr', value: 22 },
      { label: 'May', value: 28 },
      { label: 'Jun', value: analytics.overview.totalEvents },
    ];
  }, [analytics]);

  const participantData = useMemo(() => {
    if (!analytics) return [];
    return [
      { label: 'Jan', value: 45 },
      { label: 'Feb', value: 62 },
      { label: 'Mar', value: 58 },
      { label: 'Apr', value: 85 },
      { label: 'May', value: 98 },
      { label: 'Jun', value: analytics.overview.totalParticipants },
    ];
  }, [analytics]);

  const statusData = useMemo(() => {
    if (!analytics) return [];
    return [
      { label: 'Completed', value: analytics.eventsByStatus.completed, color: '#10B981' },
      { label: 'Published', value: analytics.eventsByStatus.published, color: '#3B82F6' },
      { label: 'Ongoing', value: analytics.eventsByStatus.ongoing, color: '#8B5CF6' },
      { label: 'Draft', value: analytics.eventsByStatus.draft, color: '#9CA3AF' },
    ];
  }, [analytics]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!analytics) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
          Analytics Coming Soon
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          Complete your first event to see analytics
        </Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp}
          style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}
        >
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Analytics
          </Text>
          <Text style={[styles.period, { color: theme.colors.text.secondary }]}>
            {formatDate(analytics.period.start)} - {formatDate(analytics.period.end)}
          </Text>
        </Animated.View>

        {/* Growth Indicators */}
        <View style={styles.section}>
          <View style={styles.growthRow}>
            <GrowthIndicator
              value={analytics.growth.participants}
              label="Participants"
              positive={analytics.growth.participants > 0}
              delay={100}
              style={styles.growthCard}
            />
            <GrowthIndicator
              value={analytics.growth.events}
              label="Events"
              positive={analytics.growth.events > 0}
              delay={150}
              style={styles.growthCard}
            />
            <GrowthIndicator
              value={analytics.growth.rating}
              label="Rating"
              positive={analytics.growth.rating > 0}
              delay={200}
              style={styles.growthCard}
            />
          </View>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Overview
          </Text>
          <View style={styles.overviewGrid}>
            <StatCard
              label="Total Events"
              value={analytics.overview.totalEvents}
              icon="📅"
              color="#3B82F6"
              delay={100}
            />
            <StatCard
              label="Avg Attendance"
              value={`${analytics.overview.averageAttendance}%`}
              icon="👥"
              color="#10B981"
              delay={150}
            />
            <StatCard
              label="Avg Rating"
              value={`${analytics.overview.averageRating.toFixed(1)}`}
              icon="⭐"
              color="#F59E0B"
              delay={200}
            />
            <StatCard
              label="Completion"
              value={`${analytics.overview.completionRate}%`}
              icon="✅"
              color="#8B5CF6"
              delay={250}
            />
          </View>
        </View>

        {/* Events Chart */}
        <View style={styles.section}>
          <AnalyticsChart
            title="Events Over Time"
            subtitle="Monthly event creation"
            data={chartData}
            type="bar"
            delay={300}
            style={styles.chartCard}
          />
        </View>

        {/* Participants Chart */}
        <View style={styles.section}>
          <AnalyticsChart
            title="Total Participants"
            subtitle="Monthly participant growth"
            data={participantData}
            type="bar"
            color="#10B981"
            delay={350}
            style={styles.chartCard}
          />
        </View>

        {/* Events by Status */}
        <View style={styles.section}>
          <AnalyticsChart
            title="Events by Status"
            data={statusData}
            type="bar"
            delay={400}
            style={styles.chartCard}
          />
        </View>

        {/* Retention */}
        <Animated.View 
          entering={FadeInUp.delay(450)}
          style={[styles.retentionCard, { backgroundColor: theme.colors.surface.primary }]}
        >
          <Text style={[styles.retentionTitle, { color: theme.colors.text.primary }]}>
            Participant Retention
          </Text>
          <View style={styles.retentionContent}>
            <Text style={[styles.retentionValue, { color: '#10B981' }]}>
              {analytics.participantRetention}%
            </Text>
            <Text style={[styles.retentionLabel, { color: theme.colors.text.secondary }]}>
              of participants return for more events
            </Text>
          </View>
          <View style={[styles.retentionBar, { backgroundColor: theme.colors.surface.secondary }]}>
            <View 
              style={[
                styles.retentionFill, 
                { width: `${analytics.participantRetention}%`, backgroundColor: '#10B981' }
              ]} 
            />
          </View>
        </Animated.View>

        {/* Top Events */}
        {analytics.topEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Top Performing Events
            </Text>
            {analytics.topEvents.map((event, index) => (
              <Animated.View
                key={event.id}
                entering={FadeInDown.delay(500 + index * 50)}
                style={[styles.topEventCard, { backgroundColor: theme.colors.surface.primary }]}
              >
                <View style={styles.topEventRank}>
                  <Text style={[styles.rankNumber, { color: theme.colors.text.tertiary }]}>
                    #{index + 1}
                  </Text>
                </View>
                <View style={styles.topEventInfo}>
                  <Text 
                    style={[styles.topEventTitle, { color: theme.colors.text.primary }]}
                    numberOfLines={1}
                  >
                    {event.title}
                  </Text>
                  <View style={styles.topEventStats}>
                    <Text style={[styles.topEventStat, { color: theme.colors.text.secondary }]}>
                      👥 {event.participants} attendees
                    </Text>
                    {event.rating && (
                      <Text style={[styles.topEventStat, { color: theme.colors.text.secondary }]}>
                        ⭐ {event.rating.toFixed(1)}
                      </Text>
                    )}
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[5],
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
  },
  header: {
    padding: spacing[5],
    paddingTop: spacing[6],
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  period: {
    fontSize: 14,
  },
  section: {
    marginTop: spacing[5],
    paddingHorizontal: spacing[5],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[3],
  },
  growthRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  growthCard: {
    flex: 1,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  chartCard: {
    marginHorizontal: spacing[5],
    marginTop: 0,
  },
  retentionCard: {
    margin: spacing[5],
    marginTop: spacing[5],
    padding: spacing[4],
    borderRadius: 16,
  },
  retentionTitle: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[3],
  },
  retentionContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing[3],
  },
  retentionValue: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
    marginRight: spacing[2],
  },
  retentionLabel: {
    fontSize: 13,
    flex: 1,
  },
  retentionBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  retentionFill: {
    height: '100%',
    borderRadius: 4,
  },
  topEventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    marginBottom: spacing[3],
  },
  topEventRank: {
    width: 32,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: fontWeight.bold,
  },
  topEventInfo: {
    flex: 1,
    marginLeft: spacing[2],
  },
  topEventTitle: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  topEventStats: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  topEventStat: {
    fontSize: 12,
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

AnalyticsScreen.displayName = 'AnalyticsScreen';

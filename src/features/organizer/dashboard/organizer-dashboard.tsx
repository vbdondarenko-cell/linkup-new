/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Main Screen
 */

'use client';

import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

import { useOrganizerState } from '../hooks';
import {
  WelcomeHeader,
  StatCard,
  EventCard,
  QuickActions,
  RequestCard,
  MiniCalendar,
  DEFAULT_QUICK_ACTIONS,
} from '../components';
import { QuickAction, ManagedEvent, CalendarEvent } from '../types';

interface OrganizerDashboardProps {
  onCreateEvent?: () => void;
  onEventPress?: (event: ManagedEvent) => void;
  onEventEdit?: (event: ManagedEvent) => void;
  onCalendarPress?: () => void;
  onRequestsPress?: () => void;
  onAnalyticsPress?: () => void;
  onTemplatesPress?: () => void;
  onNotificationsPress?: () => void;
  style?: ViewStyle;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  onCreateEvent,
  onEventPress,
  onEventEdit,
  onCalendarPress,
  onRequestsPress,
  onAnalyticsPress,
  onTemplatesPress,
  onNotificationsPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const {
    profile,
    summary,
    events,
    requests,
    isLoading,
    getUpcomingEvents,
    getPendingRequestsCount,
    acceptRequest,
    declineRequest,
  } = useOrganizerState();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleQuickAction = useCallback((action: QuickAction) => {
    haptics.light();
    switch (action.action) {
      case 'create':
        onCreateEvent?.();
        break;
      case 'calendar':
        onCalendarPress?.();
        break;
      case 'requests':
        onRequestsPress?.();
        break;
      case 'analytics':
        onAnalyticsPress?.();
        break;
      case 'templates':
        onTemplatesPress?.();
        break;
      default:
        break;
    }
  }, [onCreateEvent, onCalendarPress, onRequestsPress, onAnalyticsPress, onTemplatesPress, haptics]);

  const upcomingEvents = getUpcomingEvents().slice(0, 3);
  const pendingRequests = requests.filter(r => r.status === 'pending').slice(0, 3);
  const calendarEvents: CalendarEvent[] = events.map(e => ({
    id: e.id,
    title: e.title,
    status: e.status,
    startDate: e.startDate,
    endDate: e.endDate,
    isAllDay: false,
    participants: e.currentParticipants,
    maxParticipants: e.maxParticipants,
  }));

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
      >
        {/* Welcome Header */}
        <WelcomeHeader
          profile={profile!}
          onNotificationPress={onNotificationsPress}
          notificationCount={pendingRequests.length}
        />

        {/* Summary Stats */}
        {summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Overview
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsContainer}
            >
              <StatCard
                label="Hosted Events"
                value={summary.hostedEvents}
                icon="📅"
                color="#3B82F6"
                delay={100}
              />
              <StatCard
                label="Upcoming"
                value={summary.upcomingEvents}
                icon="🔜"
                color="#8B5CF6"
                delay={150}
              />
              <StatCard
                label="Participants"
                value={summary.totalParticipants}
                icon="👥"
                trend={12}
                color="#10B981"
                delay={200}
              />
              <StatCard
                label="Attendance"
                value={`${summary.attendanceRate}%`}
                icon="✅"
                color="#F59E0B"
                delay={250}
              />
              <StatCard
                label="Rating"
                value={`${summary.averageRating.toFixed(1)}`}
                icon="⭐"
                trend={5}
                color="#EC4899"
                delay={300}
              />
            </ScrollView>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <QuickActions
            actions={DEFAULT_QUICK_ACTIONS}
            onActionPress={handleQuickAction}
          />
        </View>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Upcoming Events
              </Text>
              <Text style={[styles.viewAllText, { color: theme.colors.primary.DEFAULT }]}>
                View All →
              </Text>
            </View>
            <View style={styles.eventsContainer}>
              {upcomingEvents.map((event, index) => (
                <EventCard
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

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Pending Requests
              </Text>
              <Text style={[styles.viewAllText, { color: theme.colors.primary.DEFAULT }]}>
                View All ({getPendingRequestsCount()}) →
              </Text>
            </View>
            <View style={styles.requestsContainer}>
              {pendingRequests.map((request, index) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => acceptRequest(request.id)}
                  onDecline={() => declineRequest(request.id)}
                  delay={index * 100}
                />
              ))}
            </View>
          </View>
        )}

        {/* Mini Calendar */}
        <View style={styles.section}>
          <MiniCalendar
            events={calendarEvents}
            onViewAllPress={onCalendarPress}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    marginTop: spacing[5],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    paddingHorizontal: spacing[5],
    marginBottom: spacing[3],
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  statsContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  eventsContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  requestsContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

OrganizerDashboard.displayName = 'OrganizerDashboard';

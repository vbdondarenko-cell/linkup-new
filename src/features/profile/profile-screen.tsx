/**
 * LinkUp Design System 2026
 * Profile Screen - Complete user profile
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../ui/providers/theme-provider';
import { spacing } from '../../ui/tokens/spacing';
import { fontWeight } from '../../ui/tokens/typography';

// Profile Components
import { ProfileHeader } from './header/profile-header';
import { TrustCard } from './trust/trust-card';
import { XPDisplay, LEVELS } from './xp/xp-system';
import { Statistics, UserStatistics, CompactStats } from './statistics/statistics';
import { Achievements, SAMPLE_ACHIEVEMENTS, Achievement } from './achievements/achievements';

// Types
interface ProfileData {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  language?: string;
  memberSince?: Date;
  badges?: ('verified' | 'premium' | 'organizer' | 'business' | 'legend')[];
  trustScore: number;
  averageRating?: number;
  attendanceRate?: number;
  completedEvents?: number;
  successfulMeetings?: number;
  currentXP: number;
  recentEarnings?: Array<{ amount: number; description: string; date: Date }>;
  statistics: UserStatistics;
  achievements?: Achievement[];
  isVerified?: boolean;
}

interface ProfileScreenProps {
  profile: ProfileData;
  isOwn?: boolean;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
  onSettingsPress?: () => void;
  onAchievementPress?: (achievement: Achievement) => void;
  onEventPress?: (eventId: string) => void;
  onChatPress?: (eventId: string) => void;
  style?: ViewStyle;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  isOwn = false,
  onEditProfile,
  onShareProfile,
  onSettingsPress,
  onAchievementPress,
  onEventPress,
  onChatPress,
  style,
}) => {
  const theme = useTheme();

  const handleAvatarPress = useCallback(() => {
    // Open avatar viewer
  }, []);

  const handleEditProfile = useCallback(() => {
    onEditProfile?.();
  }, [onEditProfile]);

  const handleShareProfile = useCallback(() => {
    onShareProfile?.();
  }, [onShareProfile]);

  const handleSettings = useCallback(() => {
    onSettingsPress?.();
  }, [onSettingsPress]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface.background }, style]}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface.background}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader
          id={profile.id}
          displayName={profile.displayName}
          username={profile.username}
          avatarUrl={profile.avatarUrl}
          bio={profile.bio}
          city={profile.city}
          language={profile.language}
          memberSince={profile.memberSince}
          badges={profile.badges}
          isOwn={isOwn}
          onAvatarPress={handleAvatarPress}
          onEditPress={handleEditProfile}
          onSharePress={handleShareProfile}
          onSettingsPress={handleSettings}
        />

        {/* Trust Card */}
        <Animated.View entering={FadeIn.delay(100)}>
          <TrustCard
            trustScore={profile.trustScore}
            averageRating={profile.averageRating}
            attendanceRate={profile.attendanceRate}
            completedEvents={profile.completedEvents}
            successfulMeetings={profile.successfulMeetings}
            isVerified={profile.isVerified}
          />
        </Animated.View>

        {/* XP Display */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.section}>
          <XPDisplay
            currentXP={profile.currentXP}
            recentEarnings={profile.recentEarnings}
          />
        </Animated.View>

        {/* Statistics */}
        <Animated.View entering={FadeIn.delay(300)}>
          <Statistics statistics={profile.statistics} />
        </Animated.View>

        {/* Achievements */}
        <Animated.View entering={FadeIn.delay(400)}>
          <Achievements
            achievements={profile.achievements || SAMPLE_ACHIEVEMENTS}
            onAchievementPress={onAchievementPress}
          />
        </Animated.View>

        {/* Upcoming Events */}
        {isOwn && (
          <Animated.View entering={FadeIn.delay(500)} style={styles.section}>
            <UpcomingEventsSection
              onEventPress={onEventPress}
              onChatPress={onChatPress}
            />
          </Animated.View>
        )}

        {/* Quick Stats for other profiles */}
        {!isOwn && (
          <Animated.View entering={FadeIn.delay(500)} style={styles.section}>
            <CompactStats statistics={profile.statistics} />
          </Animated.View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Upcoming Events Section
interface UpcomingEventsSectionProps {
  onEventPress?: (eventId: string) => void;
  onChatPress?: (eventId: string) => void;
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  onEventPress,
  onChatPress,
}) => {
  const theme = useTheme();

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: '1',
      name: 'Tech Networking',
      date: 'Dec 20',
      time: '3:00 PM',
      status: 'upcoming' as const,
    },
  ];

  if (upcomingEvents.length === 0) {
    return (
      <View style={styles.upcomingSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            📅 Upcoming Events
          </Text>
        </View>
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.colors.surface.primary, borderColor: theme.colors.border.default },
          ]}
        >
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No upcoming events
          </Text>
          <Pressable
            onPress={() => {}}
            style={[styles.exploreButton, { backgroundColor: theme.colors.interactive.primary }]}
          >
            <Text style={styles.exploreButtonText}>Explore Events</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.upcomingSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          📅 Upcoming Events
        </Text>
        <Pressable onPress={() => {}}>
          <Text style={[styles.seeAllText, { color: theme.colors.interactive.primary }]}>
            See All
          </Text>
        </Pressable>
      </View>

      {upcomingEvents.map((event) => (
        <Pressable
          key={event.id}
          onPress={() => onEventPress?.(event.id)}
          style={[
            styles.eventCard,
            { backgroundColor: theme.colors.surface.primary, borderColor: theme.colors.border.default },
          ]}
        >
          <View style={styles.eventInfo}>
            <Text style={[styles.eventName, { color: theme.colors.text.primary }]}>
              {event.name}
            </Text>
            <Text style={[styles.eventDateTime, { color: theme.colors.text.tertiary }]}>
              {event.date} • {event.time}
            </Text>
          </View>
          <View style={styles.eventActions}>
            <Pressable
              onPress={() => onChatPress?.(event.id)}
              style={[styles.eventAction, { backgroundColor: theme.colors.surface.secondary }]}
            >
              <Text style={styles.eventActionIcon}>💬</Text>
            </Pressable>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[4],
  },
  section: {
    marginTop: spacing[4],
  },
  bottomSpacer: {
    height: spacing[8],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  upcomingSection: {
    marginTop: spacing[4],
  },
  emptyState: {
    marginHorizontal: spacing[4],
    padding: spacing[6],
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[2],
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    marginBottom: spacing[4],
  },
  exploreButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  eventCard: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    padding: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  eventDateTime: {
    fontSize: 13,
  },
  eventActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  eventAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventActionIcon: {
    fontSize: 18,
  },
});

ProfileScreen.displayName = 'ProfileScreen';

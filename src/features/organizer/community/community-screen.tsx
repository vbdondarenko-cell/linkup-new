/**
 * LinkUp Design System 2026
 * Organizer - Community Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { CommunityStats } from '../types';

interface CommunityScreenProps {
  community: CommunityStats | null;
  style?: ViewStyle;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  community,
  style,
}) => {
  const theme = useTheme();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (!community) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={styles.emptyIcon}>🏘️</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
          Build Your Community
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          Create events to start building your community
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
            Community
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Your growing network of participants
          </Text>
        </Animated.View>

        {/* Growth Overview */}
        <View style={styles.section}>
          <Animated.View 
            entering={FadeInDown.delay(100)}
            style={[styles.growthCard, { backgroundColor: theme.colors.surface.primary }]}
          >
            <View style={styles.growthHeader}>
              <Text style={styles.growthIcon}>📈</Text>
              <View>
                <Text style={[styles.growthLabel, { color: theme.colors.text.secondary }]}>
                  Community Growth
                </Text>
                <Text style={[styles.growthValue, { color: '#10B981' }]}>
                  +{community.growthRate}% this month
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <Animated.View 
              entering={FadeInDown.delay(150)}
              style={[styles.statCard, { backgroundColor: theme.colors.surface.primary }]}
            >
              <Text style={styles.statIcon}>👥</Text>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                {formatNumber(community.returningParticipants)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Returning
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(200)}
              style={[styles.statCard, { backgroundColor: theme.colors.surface.primary }]}
            >
              <Text style={styles.statIcon}>🌱</Text>
              <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                {formatNumber(community.newMembers)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                New Members
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Top Attendees */}
        {community.topAttendees.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Top Attendees
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
              Your most engaged community members
            </Text>

            {community.topAttendees.map((attendee, index) => (
              <Animated.View
                key={attendee.id}
                entering={FadeInDown.delay(250 + index * 50)}
                style={[styles.attendeeCard, { backgroundColor: theme.colors.surface.primary }]}
              >
                <View style={styles.rankBadge}>
                  <Text style={[styles.rankText, { color: index === 0 ? '#F59E0B' : theme.colors.text.tertiary }]}>
                    #{index + 1}
                  </Text>
                </View>
                
                <Avatar
                  src={attendee.avatarUrl}
                  name={attendee.displayName}
                  size="md"
                  status="verified"
                />

                <View style={styles.attendeeInfo}>
                  <Text style={[styles.attendeeName, { color: theme.colors.text.primary }]}>
                    {attendee.displayName}
                  </Text>
                  <View style={styles.attendeeStats}>
                    <Text style={[styles.attendeeStat, { color: theme.colors.text.secondary }]}>
                      📅 {attendee.attendanceCount} events
                    </Text>
                    <Text style={[styles.attendeeStat, { color: '#10B981' }]}>
                      ❤️ {attendee.trustScore}% trust
                    </Text>
                  </View>
                </View>

                {index === 0 && (
                  <View style={[styles.topBadge, { backgroundColor: '#F59E0B20' }]}>
                    <Text style={styles.topIcon}>👑</Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>
        )}

        {/* Community Health */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Community Health
          </Text>

          <Animated.View 
            entering={FadeInUp.delay(400)}
            style={[styles.healthCard, { backgroundColor: theme.colors.surface.primary }]}
          >
            <View style={styles.healthItem}>
              <View style={styles.healthHeader}>
                <Text style={styles.healthIcon}>🔄</Text>
                <Text style={[styles.healthLabel, { color: theme.colors.text.primary }]}>
                  Return Rate
                </Text>
              </View>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: '75%', backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.healthValue, { color: theme.colors.text.secondary }]}>
                75% of participants return
              </Text>
            </View>

            <View style={[styles.healthDivider, { backgroundColor: theme.colors.border.default }]} />

            <View style={styles.healthItem}>
              <View style={styles.healthHeader}>
                <Text style={styles.healthIcon}>🤝</Text>
                <Text style={[styles.healthLabel, { color: theme.colors.text.primary }]}>
                  Engagement
                </Text>
              </View>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: '82%', backgroundColor: '#3B82F6' }]} />
              </View>
              <Text style={[styles.healthValue, { color: theme.colors.text.secondary }]}>
                High participant interaction
              </Text>
            </View>

            <View style={[styles.healthDivider, { backgroundColor: theme.colors.border.default }]} />

            <View style={styles.healthItem}>
              <View style={styles.healthHeader}>
                <Text style={styles.healthIcon}>⭐</Text>
                <Text style={[styles.healthLabel, { color: theme.colors.text.primary }]}>
                  Satisfaction
                </Text>
              </View>
              <View style={styles.healthBar}>
                <View style={[styles.healthFill, { width: '88%', backgroundColor: '#8B5CF6' }]} />
              </View>
              <Text style={[styles.healthValue, { color: theme.colors.text.secondary }]}>
                Average rating 4.7 stars
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Future Features */}
        <Animated.View 
          entering={FadeInUp.delay(450)}
          style={[styles.comingSoon, { backgroundColor: theme.colors.surface.primary }]}
        >
          <Text style={styles.comingSoonIcon}>🚀</Text>
          <Text style={[styles.comingSoonTitle, { color: theme.colors.text.primary }]}>
            Coming Soon
          </Text>
          <Text style={[styles.comingSoonText, { color: theme.colors.text.secondary }]}>
            Community badges, member milestones, and more engagement features
          </Text>
        </Animated.View>

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
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing[1],
  },
  section: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[5],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: spacing[4],
  },
  growthCard: {
    padding: spacing[4],
    borderRadius: 16,
  },
  growthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthIcon: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  growthLabel: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  growthValue: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 16,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: spacing[2],
  },
  statValue: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    marginBottom: spacing[3],
  },
  rankBadge: {
    width: 28,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: fontWeight.bold,
  },
  attendeeInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  attendeeName: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  attendeeStats: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  attendeeStat: {
    fontSize: 12,
  },
  topBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIcon: {
    fontSize: 18,
  },
  healthCard: {
    padding: spacing[4],
    borderRadius: 16,
  },
  healthItem: {
    marginBottom: spacing[4],
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  healthIcon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  healthLabel: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  healthBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: spacing[1],
  },
  healthFill: {
    height: '100%',
    borderRadius: 3,
  },
  healthValue: {
    fontSize: 12,
  },
  healthDivider: {
    height: 1,
    marginVertical: spacing[3],
  },
  comingSoon: {
    margin: spacing[5],
    marginTop: spacing[5],
    padding: spacing[5],
    borderRadius: 16,
    alignItems: 'center',
  },
  comingSoonIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  comingSoonText: {
    fontSize: 13,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

CommunityScreen.displayName = 'CommunityScreen';

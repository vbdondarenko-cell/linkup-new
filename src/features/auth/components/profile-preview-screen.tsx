/**
 * LinkUp Design System 2026
 * Auth Profile Preview Screen
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { UserProfile, Interest } from '../types';

interface ProfilePreviewScreenProps {
  profile: Partial<UserProfile>;
  selectedInterests: Interest[];
  radius: number;
  onStartExploring: () => void;
  onBack: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
}

export const ProfilePreviewScreen: React.FC<ProfilePreviewScreenProps> = ({
  profile,
  selectedInterests,
  radius,
  onStartExploring,
  onBack,
  isLoading = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const formatRadius = (r: number) => {
    if (r < 1) return `${Math.round(r * 1000)}m`;
    return `${r}km`;
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Your Profile
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
            Here's what you'll look like to others
          </Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInUp.delay(200)} style={[styles.profileCard, { backgroundColor: theme.colors.surface.primary }]}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surface.secondary }]}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
            )}
            <View style={[styles.avatarBadge, { backgroundColor: theme.colors.primary.DEFAULT }]}>
              <Text style={styles.avatarBadgeText}>✓</Text>
            </View>
          </View>

          {/* Name */}
          <Text style={[styles.displayName, { color: theme.colors.text.primary }]}>
            {profile.displayName}
          </Text>
          {profile.username && (
            <Text style={[styles.username, { color: theme.colors.text.tertiary }]}>
              @{profile.username}
            </Text>
          )}

          {/* Telegram Badge */}
          <View style={[styles.telegramBadge, { backgroundColor: `${theme.colors.primary.DEFAULT}15` }]}>
            <Text style={styles.telegramIcon}>✈️</Text>
            <Text style={[styles.telegramText, { color: theme.colors.primary.DEFAULT }]}>
              Telegram Verified
            </Text>
          </View>
        </Animated.View>

        {/* Selected Interests */}
        <Animated.View entering={FadeInUp.delay(300)} style={[styles.section, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🎯</Text>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Interests
            </Text>
            <Text style={[styles.sectionCount, { color: theme.colors.text.tertiary }]}>
              {selectedInterests.length}
            </Text>
          </View>
          <View style={styles.interestsGrid}>
            {selectedInterests.slice(0, 8).map((interest) => (
              <View 
                key={interest.id} 
                style={[styles.interestChip, { backgroundColor: theme.colors.surface.secondary }]}
              >
                <Text style={styles.interestIcon}>{interest.icon}</Text>
                <Text style={[styles.interestName, { color: theme.colors.text.secondary }]}>
                  {interest.name}
                </Text>
              </View>
            ))}
            {selectedInterests.length > 8 && (
              <View style={[styles.interestChip, { backgroundColor: theme.colors.surface.secondary }]}>
                <Text style={[styles.interestName, { color: theme.colors.text.tertiary }]}>
                  +{selectedInterests.length - 8} more
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Settings Preview */}
        <Animated.View entering={FadeInUp.delay(400)} style={[styles.section, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingEmoji}>📍</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.colors.text.tertiary }]}>Radius</Text>
              <Text style={[styles.settingValue, { color: theme.colors.text.primary }]}>
                {formatRadius(radius)} from your location
              </Text>
            </View>
          </View>

          <View style={[styles.settingDivider, { backgroundColor: theme.colors.border.default }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingEmoji}>🌐</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.colors.text.tertiary }]}>Language</Text>
              <Text style={[styles.settingValue, { color: theme.colors.text.primary }]}>
                {profile.language?.toUpperCase() || 'EN'}
              </Text>
            </View>
          </View>

          <View style={[styles.settingDivider, { backgroundColor: theme.colors.border.default }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingEmoji}>🔔</Text>
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.colors.text.tertiary }]}>Notifications</Text>
              <Text style={[styles.settingValue, { color: theme.colors.text.primary }]}>
                Enabled
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Ready Message */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.readyContainer}>
          <Text style={styles.readyIcon}>✨</Text>
          <Text style={[styles.readyText, { color: theme.colors.text.secondary }]}>
            You're all set! Start exploring events in your area.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Button
          variant="primary"
          size="lg"
          onPress={() => { haptics.medium(); onStartExploring(); }}
          loading={isLoading}
          style={styles.startButton}
        >
          Start Exploring
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    padding: spacing[5],
    paddingTop: spacing[6],
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing[1],
  },
  profileCard: {
    marginHorizontal: spacing[5],
    padding: spacing[5],
    borderRadius: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing[3],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: fontWeight.bold,
  },
  displayName: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  username: {
    fontSize: 14,
    marginBottom: spacing[3],
  },
  telegramBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 12,
    gap: spacing[1],
  },
  telegramIcon: {
    fontSize: 14,
  },
  telegramText: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  section: {
    marginHorizontal: spacing[5],
    marginTop: spacing[4],
    padding: spacing[4],
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: spacing[2],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
    gap: 4,
  },
  interestIcon: {
    fontSize: 14,
  },
  interestName: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  settingEmoji: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 12,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  settingDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing[2],
  },
  readyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[5],
    paddingHorizontal: spacing[5],
  },
  readyIcon: {
    fontSize: 20,
    marginRight: spacing[2],
  },
  readyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  startButton: {
    width: '100%',
  },
});

ProfilePreviewScreen.displayName = 'ProfilePreviewScreen';

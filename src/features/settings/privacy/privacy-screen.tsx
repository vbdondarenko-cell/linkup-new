/**
 * LinkUp Design System 2026
 * Privacy Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontWeight } from '../../../ui/tokens/typography';

import { useSettingsState } from '../hooks';
import { SettingsRow, SettingsDivider, SettingsSectionHeader, SettingsGroup } from '../components';

interface PrivacyScreenProps {
  onBlockedUsersPress?: () => void;
  onExportDataPress?: () => void;
  style?: ViewStyle;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  onBlockedUsersPress,
  onExportDataPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const { privacy, setPrivacySetting } = useSettingsState();

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: '🌍' },
    { value: 'friends', label: 'Friends Only', icon: '👥' },
    { value: 'private', label: 'Private', icon: '🔒' },
  ];

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Privacy</Text>
        </View>

        {/* Profile Visibility */}
        <SettingsSectionHeader title="Profile Visibility" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="👁️"
              title="Profile Visibility"
              value={visibilityOptions.find(o => o.value === privacy.profileVisibility)?.label}
              showArrow
              onPress={() => {}}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📊"
              title="Show Statistics"
              subtitle="Let others see your event attendance"
              showSwitch
              switchValue={privacy.showStatistics}
              onSwitchChange={(value) => setPrivacySetting('showStatistics', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🏆"
              title="Show Achievements"
              subtitle="Display badges and achievements on profile"
              showSwitch
              switchValue={privacy.showAchievements}
              onSwitchChange={(value) => setPrivacySetting('showAchievements', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🎯"
              title="Show Interests"
              subtitle="Display your interests on profile"
              showSwitch
              switchValue={privacy.showInterests}
              onSwitchChange={(value) => setPrivacySetting('showInterests', value)}
            />
          </SettingsGroup>
        </View>

        {/* Activity Visibility */}
        <SettingsSectionHeader title="Activity" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="📍"
              title="Activity Visibility"
              subtitle="Show your activity status to others"
              showSwitch
              switchValue={privacy.activityVisibility === 'public'}
              onSwitchChange={(value) => setPrivacySetting('activityVisibility', value ? 'public' : 'hidden')}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🎪"
              title="Organizer Visibility"
              subtitle="Show your organizer events publicly"
              showSwitch
              switchValue={privacy.organizerVisibility === 'public'}
              onSwitchChange={(value) => setPrivacySetting('organizerVisibility', value ? 'public' : 'hidden')}
            />
          </SettingsGroup>
        </View>

        {/* Blocked & Muted */}
        <SettingsSectionHeader title="Blocked & Muted" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="🚫"
              title="Blocked Users"
              subtitle={`${privacy.blockedUsers.length} blocked`}
              showArrow
              onPress={() => { haptics.light(); onBlockedUsersPress?.(); }}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🔇"
              title="Muted Users"
              subtitle={`${privacy.mutedUsers.length} muted`}
              showArrow
              onPress={() => {}}
            />
          </SettingsGroup>
        </View>

        {/* Data */}
        <SettingsSectionHeader title="Data" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="📤"
              title="Export Data"
              subtitle="Download your personal data"
              showArrow
              onPress={() => { haptics.light(); onExportDataPress?.(); }}
            />
          </SettingsGroup>
        </View>

        {/* Privacy Info */}
        <Animated.View entering={FadeInDown.delay(400)} style={[styles.infoCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={styles.infoIcon}>🔒</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.colors.text.primary }]}>Your Privacy Matters</Text>
            <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
              We never sell your data. You control what others can see. Review our privacy policy for more details.
            </Text>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing[5], paddingTop: spacing[6] },
  title: { fontSize: 28, fontWeight: fontWeight.bold },
  groupContainer: { paddingHorizontal: spacing[5] },
  infoCard: { flexDirection: 'row', margin: spacing[5], padding: spacing[4], borderRadius: 16 },
  infoIcon: { fontSize: 24, marginRight: spacing[3] },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: fontWeight.semibold, marginBottom: spacing[1] },
  infoText: { fontSize: 13, lineHeight: 18 },
  bottomSpacer: { height: spacing[8] },
});

PrivacyScreen.displayName = 'PrivacyScreen';

/**
 * LinkUp Design System 2026
 * Notifications Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontWeight } from '../../../ui/tokens/typography';

import { useSettingsState } from '../hooks';
import { SettingsRow, SettingsDivider, SettingsSectionHeader, SettingsGroup } from '../components';
import { NotificationType } from '../types';

interface NotificationsScreenProps {
  onBack?: () => void;
  style?: ViewStyle;
}

const NOTIFICATION_CATEGORIES: Array<{ id: NotificationType; icon: string; title: string }> = [
  { id: 'join_requests', icon: '👋', title: 'Join Requests' },
  { id: 'messages', icon: '💬', title: 'Messages' },
  { id: 'accepted_requests', icon: '✅', title: 'Accepted Requests' },
  { id: 'declined_requests', icon: '❌', title: 'Declined Requests' },
  { id: 'upcoming_events', icon: '📅', title: 'Upcoming Events' },
  { id: 'event_reminders', icon: '⏰', title: 'Event Reminders' },
  { id: 'recommendations', icon: '🎯', title: 'Recommendations' },
  { id: 'achievements', icon: '🏆', title: 'Achievements' },
  { id: 'premium', icon: '⭐', title: 'Premium' },
  { id: 'business', icon: '🏢', title: 'Business' },
  { id: 'organizer', icon: '🎪', title: 'Organizer' },
];

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack, style }) => {
  const theme = useTheme();
  const { notifications, setNotificationSetting, setCategoryNotification } = useSettingsState();

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Notifications</Text>
        </View>

        {/* Master Controls */}
        <SettingsSectionHeader title="Master Controls" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="🔔"
              title="Push Notifications"
              showSwitch
              switchValue={notifications.push}
              onSwitchChange={(value) => setNotificationSetting('push', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📱"
              title="In-App Notifications"
              showSwitch
              switchValue={notifications.inApp}
              onSwitchChange={(value) => setNotificationSetting('inApp', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🔊"
              title="Sound"
              showSwitch
              switchValue={notifications.sound}
              onSwitchChange={(value) => setNotificationSetting('sound', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📳"
              title="Vibration"
              showSwitch
              switchValue={notifications.vibration}
              onSwitchChange={(value) => setNotificationSetting('vibration', value)}
            />
          </SettingsGroup>
        </View>

        {/* Quiet Hours */}
        <SettingsSectionHeader title="Quiet Hours" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="🌙"
              title="Enable Quiet Hours"
              subtitle={`${notifications.quietHours.start} - ${notifications.quietHours.end}`}
              showSwitch
              switchValue={notifications.quietHours.enabled}
              onSwitchChange={(value) => setNotificationSetting('quietHours', { ...notifications.quietHours, enabled: value })}
            />
          </SettingsGroup>
        </View>

        {/* Focus Mode */}
        <SettingsSectionHeader title="Focus Mode" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="🎯"
              title="Focus Mode"
              subtitle="Pause all non-essential notifications"
              showSwitch
              switchValue={notifications.focusMode}
              onSwitchChange={(value) => setNotificationSetting('focusMode', value)}
            />
          </SettingsGroup>
        </View>

        {/* Categories */}
        <SettingsSectionHeader title="Categories" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            {NOTIFICATION_CATEGORIES.map((category, index) => (
              <View key={category.id}>
                {index > 0 && <SettingsDivider />}
                <SettingsRow
                  icon={category.icon}
                  title={category.title}
                  showSwitch
                  switchValue={notifications.categories[category.id].enabled}
                  onSwitchChange={(value) => setCategoryNotification(category.id, value)}
                />
              </View>
            ))}
          </SettingsGroup>
        </View>

        {/* Smart Notifications Info */}
        <Animated.View entering={FadeInDown.delay(500)} style={[styles.infoCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.colors.text.primary }]}>Smart Notifications</Text>
            <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
              We respect your Quiet Hours and Focus Mode. We group similar notifications to avoid spam.
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

NotificationsScreen.displayName = 'NotificationsScreen';

/**
 * LinkUp Design System 2026
 * Safety Center Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontWeight } from '../../../ui/tokens/typography';

import { useSettingsState } from '../hooks';
import { SettingsRow, SettingsDivider, SettingsSectionHeader, SettingsGroup } from '../components';
import { REPORT_REASONS } from '../types';

interface SafetyScreenProps {
  onReportUserPress?: () => void;
  onBlockedUsersPress?: () => void;
  onGuidelinesPress?: () => void;
  style?: ViewStyle;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({
  onReportUserPress,
  onBlockedUsersPress,
  onGuidelinesPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const { privacy } = useSettingsState();

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Safety Center</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            Your safety is our priority
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Pressable
            onPress={() => { haptics.light(); onReportUserPress?.(); }}
            style={({ pressed }) => [
              styles.quickActionCard,
              { backgroundColor: theme.colors.surface.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#EF444415' }]}>
              <Text style={styles.quickActionEmoji}>🚩</Text>
            </View>
            <Text style={[styles.quickActionTitle, { color: theme.colors.text.primary }]}>Report User</Text>
            <Text style={[styles.quickActionSubtitle, { color: theme.colors.text.secondary }]}>Report inappropriate behavior</Text>
          </Pressable>

          <Pressable
            onPress={() => { haptics.light(); onBlockedUsersPress?.(); }}
            style={({ pressed }) => [
              styles.quickActionCard,
              { backgroundColor: theme.colors.surface.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F59E0B15' }]}>
              <Text style={styles.quickActionEmoji}>🚫</Text>
            </View>
            <Text style={[styles.quickActionTitle, { color: theme.colors.text.primary }]}>Blocked Users</Text>
            <Text style={[styles.quickActionSubtitle, { color: theme.colors.text.secondary }]}>
              {privacy.blockedUsers.length} blocked
            </Text>
          </Pressable>
        </View>

        {/* Report Reasons */}
        <SettingsSectionHeader title="Report Reasons" />
        <Animated.View entering={FadeInDown.delay(200)} style={styles.reportReasons}>
          {REPORT_REASONS.map((reason, index) => (
            <View
              key={reason.value}
              style={[styles.reportReason, { backgroundColor: theme.colors.surface.primary }]}
            >
              <Text style={styles.reportIcon}>{reason.icon}</Text>
              <View style={styles.reportContent}>
                <Text style={[styles.reportLabel, { color: theme.colors.text.primary }]}>{reason.label}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Safety Tips */}
        <SettingsSectionHeader title="Meeting Safety Tips" />
        <Animated.View entering={FadeInUp.delay(300)} style={[styles.tipsCard, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>🏠</Text>
            <Text style={[styles.tipText, { color: theme.colors.text.primary }]}>
              Meet in public places first
            </Text>
          </View>
          <View style={[styles.tipDivider, { backgroundColor: theme.colors.border.default }]} />
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>👥</Text>
            <Text style={[styles.tipText, { color: theme.colors.text.primary }]}>
              Tell a friend where you're going
            </Text>
          </View>
          <View style={[styles.tipDivider, { backgroundColor: theme.colors.border.default }]} />
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>🚗</Text>
            <Text style={[styles.tipText, { color: theme.colors.text.primary }]}>
              Arrange your own transportation
            </Text>
          </View>
          <View style={[styles.tipDivider, { backgroundColor: theme.colors.border.default }]} />
          <View style={styles.tipRow}>
            <Text style={styles.tipIcon}>💬</Text>
            <Text style={[styles.tipText, { color: theme.colors.text.primary }]}>
              Trust your instincts
            </Text>
          </View>
        </Animated.View>

        {/* Trust System */}
        <SettingsSectionHeader title="Trust System" />
        <Animated.View entering={FadeInUp.delay(400)} style={[styles.trustCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.trustTitle, { color: theme.colors.text.primary }]}>How Trust Works</Text>
          <Text style={[styles.trustDescription, { color: theme.colors.text.secondary }]}>
            Our trust system helps you identify reliable community members. Higher trust scores are earned through positive interactions and verified information.
          </Text>
          
          <View style={styles.trustLevels}>
            <View style={[styles.trustLevel, { backgroundColor: '#10B98115' }]}>
              <Text style={styles.trustLevelIcon}>🟢</Text>
              <Text style={[styles.trustLevelText, { color: '#10B981' }]}>High Trust</Text>
            </View>
            <View style={[styles.trustLevel, { backgroundColor: '#F59E0B15' }]}>
              <Text style={styles.trustLevelIcon}>🟡</Text>
              <Text style={[styles.trustLevelText, { color: '#F59E0B' }]}>Medium</Text>
            </View>
            <View style={[styles.trustLevel, { backgroundColor: '#EF444415' }]}>
              <Text style={styles.trustLevelIcon}>🔴</Text>
              <Text style={[styles.trustLevelText, { color: '#EF4444' }]}>Low</Text>
            </View>
          </View>
        </Animated.View>

        {/* Guidelines */}
        <View style={styles.guidelinesContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="📋"
              title="Community Guidelines"
              showArrow
              onPress={() => { haptics.light(); onGuidelinesPress?.(); }}
            />
          </SettingsGroup>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing[5], paddingTop: spacing[6] },
  title: { fontSize: 28, fontWeight: fontWeight.bold },
  subtitle: { fontSize: 14, marginTop: spacing[1] },
  quickActionsContainer: { flexDirection: 'row', paddingHorizontal: spacing[5], paddingVertical: spacing[4], gap: spacing[3] },
  quickActionCard: { flex: 1, padding: spacing[4], borderRadius: 16, alignItems: 'center' },
  quickActionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[2] },
  quickActionEmoji: { fontSize: 24 },
  quickActionTitle: { fontSize: 14, fontWeight: fontWeight.semibold, textAlign: 'center' },
  quickActionSubtitle: { fontSize: 12, marginTop: 2, textAlign: 'center' },
  reportReasons: { paddingHorizontal: spacing[5], gap: spacing[2] },
  reportReason: { flexDirection: 'row', alignItems: 'center', padding: spacing[4], borderRadius: 12 },
  reportIcon: { fontSize: 20, marginRight: spacing[3] },
  reportContent: { flex: 1 },
  reportLabel: { fontSize: 15, fontWeight: fontWeight.medium },
  tipsCard: { marginHorizontal: spacing[5], padding: spacing[4], borderRadius: 16 },
  tipRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[2] },
  tipIcon: { fontSize: 20, marginRight: spacing[3] },
  tipText: { fontSize: 14, flex: 1 },
  tipDivider: { height: StyleSheet.hairlineWidth, marginVertical: spacing[1] },
  trustCard: { marginHorizontal: spacing[5], padding: spacing[4], borderRadius: 16 },
  trustTitle: { fontSize: 16, fontWeight: fontWeight.semibold, marginBottom: spacing[2] },
  trustDescription: { fontSize: 13, lineHeight: 18, marginBottom: spacing[4] },
  trustLevels: { flexDirection: 'row', gap: spacing[3] },
  trustLevel: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing[2], borderRadius: 8, gap: spacing[1] },
  trustLevelIcon: { fontSize: 14 },
  trustLevelText: { fontSize: 11, fontWeight: fontWeight.semibold },
  guidelinesContainer: { paddingHorizontal: spacing[5], marginTop: spacing[4] },
  bottomSpacer: { height: spacing[8] },
});

SafetyScreen.displayName = 'SafetyScreen';

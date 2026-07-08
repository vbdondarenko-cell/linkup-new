/**
 * LinkUp Design System 2026
 * Appearance Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';

import { useSettingsState } from '../hooks';
import { SettingsRow, SettingsDivider, SettingsSectionHeader, SettingsGroup } from '../components';
import { ThemePicker } from '../components';
import { THEMES, ThemeType } from '../types';
import { spacing } from '../../../ui/tokens/spacing';
import { fontWeight } from '../../../ui/tokens/typography';

interface AppearanceScreenProps {
  style?: ViewStyle;
}

export const AppearanceScreen: React.FC<AppearanceScreenProps> = ({ style }) => {
  const theme = useTheme();
  const { appearance, isPremium, setTheme, setAppearanceSetting } = useSettingsState();

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Appearance</Text>
        </View>

        {/* Theme Selector */}
        <SettingsSectionHeader title="Theme" />
        <ThemePicker
          themes={THEMES}
          currentTheme={appearance.theme}
          isPremium={isPremium}
          onSelectTheme={setTheme}
          style={styles.themePicker}
        />

        {/* Accessibility */}
        <SettingsSectionHeader title="Accessibility" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="📐"
              title="Dynamic Type"
              subtitle="Automatically adjust text size"
              showSwitch
              switchValue={appearance.dynamicType}
              onSwitchChange={(value) => setAppearanceSetting('dynamicType', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🎬"
              title="Reduce Motion"
              subtitle="Minimize animations"
              showSwitch
              switchValue={appearance.reduceMotion}
              onSwitchChange={(value) => setAppearanceSetting('reduceMotion', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🌓"
              title="High Contrast"
              subtitle="Increase visual contrast"
              showSwitch
              switchValue={appearance.highContrast}
              onSwitchChange={(value) => setAppearanceSetting('highContrast', value)}
            />
          </SettingsGroup>
        </View>

        {/* Premium Info */}
        <View style={[styles.premiumInfo, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={styles.premiumIcon}>✨</Text>
          <View style={styles.premiumContent}>
            <Text style={[styles.premiumTitle, { color: theme.colors.text.primary }]}>Premium Themes</Text>
            <Text style={[styles.premiumText, { color: theme.colors.text.secondary }]}>
              Upgrade to unlock 7 exclusive themes including Midnight, Ocean, Forest, and more.
            </Text>
          </View>
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
  groupContainer: { paddingHorizontal: spacing[5] },
  themePicker: { marginBottom: spacing[4] },
  premiumInfo: { flexDirection: 'row', margin: spacing[5], padding: spacing[4], borderRadius: 16 },
  premiumIcon: { fontSize: 24, marginRight: spacing[3] },
  premiumContent: { flex: 1 },
  premiumTitle: { fontSize: 15, fontWeight: fontWeight.semibold, marginBottom: spacing[1] },
  premiumText: { fontSize: 13, lineHeight: 18 },
  bottomSpacer: { height: spacing[8] },
});

AppearanceScreen.displayName = 'AppearanceScreen';

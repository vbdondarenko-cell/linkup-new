/**
 * LinkUp Design System 2026
 * About Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, Image, Linking } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontWeight } from '../../../ui/tokens/typography';

import { SettingsRow, SettingsDivider, SettingsSectionHeader, SettingsGroup } from '../components';

interface AboutScreenProps {
  style?: ViewStyle;
}

const APP_INFO = {
  version: '6.0.0',
  buildNumber: '2024.01.15',
  termsUrl: 'https://linkup.app/terms',
  privacyUrl: 'https://linkup.app/privacy',
  licensesUrl: 'https://linkup.app/licenses',
};

export const AboutScreen: React.FC<AboutScreenProps> = ({ style }) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>About</Text>
        </View>

        {/* App Logo */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.logoContainer}>
          <View style={[styles.logoWrapper, { backgroundColor: theme.colors.surface.primary }]}>
            <Text style={styles.logoEmoji}>📍</Text>
          </View>
          <Text style={[styles.appName, { color: theme.colors.text.primary }]}>LinkUp</Text>
          <Text style={[styles.version, { color: theme.colors.text.tertiary }]}>
            Version {APP_INFO.version} ({APP_INFO.buildNumber})
          </Text>
        </Animated.View>

        {/* Legal Links */}
        <SettingsSectionHeader title="Legal" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="📄"
              title="Terms of Service"
              showArrow
              onPress={() => openUrl(APP_INFO.termsUrl)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🔒"
              title="Privacy Policy"
              showArrow
              onPress={() => openUrl(APP_INFO.privacyUrl)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📜"
              title="Open Source Licenses"
              showArrow
              onPress={() => openUrl(APP_INFO.licensesUrl)}
            />
          </SettingsGroup>
        </View>

        {/* Support */}
        <SettingsSectionHeader title="Support" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="💬"
              title="Contact Support"
              showArrow
              onPress={() => {}}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🐛"
              title="Report a Bug"
              showArrow
              onPress={() => {}}
            />
            <SettingsDivider />
            <SettingsRow
              icon="💡"
              title="Suggest a Feature"
              showArrow
              onPress={() => {}}
            />
          </SettingsGroup>
        </View>

        {/* Community */}
        <SettingsSectionHeader title="Community" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="🌐"
              title="Website"
              showArrow
              onPress={() => openUrl('https://linkup.app')}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📱"
              title="App Store"
              showArrow
              onPress={() => {}}
            />
            <SettingsDivider />
            <SettingsRow
              icon="▶️"
              title="Google Play"
              showArrow
              onPress={() => {}}
            />
          </SettingsGroup>
        </View>

        {/* Acknowledgements */}
        <Animated.View entering={FadeInDown.delay(300)} style={[styles.acknowledgements, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={styles.ackIcon}>❤️</Text>
          <Text style={[styles.ackTitle, { color: theme.colors.text.primary }]}>Made with Love</Text>
          <Text style={[styles.ackText, { color: theme.colors.text.secondary }]}>
            Thank you for being part of the LinkUp community. Together, we're building better ways to connect.
          </Text>
        </Animated.View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={[styles.copyrightText, { color: theme.colors.text.tertiary }]}>
            © 2024 LinkUp. All rights reserved.
          </Text>
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
  logoContainer: { alignItems: 'center', paddingVertical: spacing[6] },
  logoWrapper: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[3] },
  logoEmoji: { fontSize: 40 },
  appName: { fontSize: 24, fontWeight: fontWeight.bold },
  version: { fontSize: 14, marginTop: spacing[1] },
  groupContainer: { paddingHorizontal: spacing[5] },
  acknowledgements: { margin: spacing[5], padding: spacing[5], borderRadius: 16, alignItems: 'center' },
  ackIcon: { fontSize: 32, marginBottom: spacing[2] },
  ackTitle: { fontSize: 18, fontWeight: fontWeight.bold, marginBottom: spacing[2] },
  ackText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  copyright: { alignItems: 'center', paddingVertical: spacing[5] },
  copyrightText: { fontSize: 12 },
  bottomSpacer: { height: spacing[8] },
});

AboutScreen.displayName = 'AboutScreen';

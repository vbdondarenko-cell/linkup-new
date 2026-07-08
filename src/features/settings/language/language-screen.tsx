/**
 * LinkUp Design System 2026
 * Language Screen
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
import { SUPPORTED_LANGUAGES, Language } from '../types';

interface LanguageScreenProps {
  style?: ViewStyle;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({ style }) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const { language, setLanguage } = useSettingsState();

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language.language);

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Language</Text>
        </View>

        {/* Current Language */}
        {currentLanguage && (
          <>
            <SettingsSectionHeader title="Current Language" />
            <View style={styles.groupContainer}>
              <SettingsGroup>
                <SettingsRow
                  icon={currentLanguage.flag}
                  title={currentLanguage.name}
                  subtitle={currentLanguage.nativeName}
                  badge="Active"
                />
              </SettingsGroup>
            </View>
          </>
        )}

        {/* Language Detection */}
        <SettingsSectionHeader title="Language Detection" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="📱"
              title="Use Device Language"
              subtitle="Automatically match your device language"
              showSwitch
              switchValue={language.useDeviceLanguage}
              onSwitchChange={() => {}}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📍"
              title="Use Region"
              subtitle="Detect language from your location"
              showSwitch
              switchValue={language.autoDetect}
              onSwitchChange={() => {}}
            />
          </SettingsGroup>
        </View>

        {/* Available Languages */}
        <SettingsSectionHeader title="Available Languages" />
        <View style={styles.languagesContainer}>
          {SUPPORTED_LANGUAGES.map((lang, index) => {
            const isSelected = language.language === lang.code;
            return (
              <Animated.View key={lang.code} entering={FadeInDown.delay(index * 30)}>
                <Pressable
                  onPress={() => { haptics.light(); setLanguage(lang.code); }}
                  style={({ pressed }) => [
                    styles.languageItem,
                    { 
                      backgroundColor: theme.colors.surface.primary,
                      borderColor: isSelected ? theme.colors.primary.DEFAULT : 'transparent',
                      borderWidth: 2,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <View style={styles.languageContent}>
                    <Text style={[styles.languageName, { color: theme.colors.text.primary }]}>
                      {lang.name}
                    </Text>
                    <Text style={[styles.languageNative, { color: theme.colors.text.tertiary }]}>
                      {lang.nativeName}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: theme.colors.primary.DEFAULT }]}>
                      <Text style={styles.selectedIcon}>✓</Text>
                    </View>
                  )}
                  {lang.direction === 'rtl' && (
                    <View style={[styles.rtlBadge, { backgroundColor: theme.colors.surface.secondary }]}>
                      <Text style={[styles.rtlText, { color: theme.colors.text.tertiary }]}>RTL</Text>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Localization Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={styles.infoIcon}>🌍</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.colors.text.primary }]}>Localization</Text>
            <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
              All text, dates, times, and numbers are automatically formatted for your language and region.
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
  languagesContainer: { paddingHorizontal: spacing[5], gap: spacing[2] },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
  },
  languageFlag: { fontSize: 28, marginRight: spacing[3] },
  languageContent: { flex: 1 },
  languageName: { fontSize: 16, fontWeight: fontWeight.medium },
  languageNative: { fontSize: 13, marginTop: 2 },
  selectedBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selectedIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: fontWeight.bold },
  rtlBadge: { paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: 4 },
  rtlText: { fontSize: 10, fontWeight: fontWeight.medium },
  infoCard: { flexDirection: 'row', margin: spacing[5], padding: spacing[4], borderRadius: 16 },
  infoIcon: { fontSize: 24, marginRight: spacing[3] },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: fontWeight.semibold, marginBottom: spacing[1] },
  infoText: { fontSize: 13, lineHeight: 18 },
  bottomSpacer: { height: spacing[8] },
});

LanguageScreen.displayName = 'LanguageScreen';

/**
 * LinkUp Design System 2026
 * Settings Home Screen
 */

'use client';

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, Pressable, TextInput } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

import { useSettingsState } from '../hooks';
import { SettingsRow, SettingsDivider, SettingsGroup } from '../components';
import { SETTINGS_SECTIONS, SettingsSection, SettingsScreen } from '../types';

interface SettingsHomeScreenProps {
  onNavigate?: (screen: SettingsScreen) => void;
  onPremiumPress?: () => void;
  onLogoutPress?: () => void;
  onDeletePress?: () => void;
  style?: ViewStyle;
}

export const SettingsHomeScreen: React.FC<SettingsHomeScreenProps> = ({
  onNavigate,
  onPremiumPress,
  onLogoutPress,
  onDeletePress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const { account } = useSettingsState();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredSections = searchQuery.trim()
    ? SETTINGS_SECTIONS.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : SETTINGS_SECTIONS;

  const handleSectionPress = useCallback((section: SettingsSection) => {
    haptics.light();
    onNavigate?.(section.screen);
  }, [haptics, onNavigate]);

  const toggleSearch = () => {
    haptics.light();
    setShowSearch(!showSearch);
    if (showSearch) setSearchQuery('');
  };

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Settings</Text>
            <Pressable onPress={toggleSearch} style={[styles.searchButton, { backgroundColor: theme.colors.surface.secondary }]}>
              <Text style={styles.searchIcon}>{showSearch ? '✕' : '🔍'}</Text>
            </Pressable>
          </View>

          {showSearch && (
            <Animated.View entering={FadeInRight}>
              <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface.secondary }]}>
                <TextInput
                  style={[styles.searchInput, { color: theme.colors.text.primary }]}
                  placeholder="Search settings..."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* Account Section */}
        {account && !searchQuery.trim() && (
          <Animated.View entering={FadeInDown.delay(100)}>
            <SettingsGroup style={styles.accountGroup}>
              <SettingsRow
                icon="👤"
                title={account.displayName}
                subtitle={`@${account.username}`}
                showArrow
                onPress={() => handleSectionPress(SETTINGS_SECTIONS[0])}
              />
            </SettingsGroup>
          </Animated.View>
        )}

        {/* Settings Sections */}
        <View style={styles.sectionsContainer}>
          {filteredSections.map((section, index) => (
            <Animated.View key={section.id} entering={FadeInDown.delay(150 + index * 30)}>
              <SettingsGroup>
                <SettingsRow
                  icon={section.icon}
                  title={section.title}
                  showArrow
                  isPremium={section.id === 'premium'}
                  onPress={() => {
                    if (section.id === 'premium') onPremiumPress?.();
                    else handleSectionPress(section);
                  }}
                />
              </SettingsGroup>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <SettingsDivider />
          <SettingsRow icon="📤" title="Export Data" subtitle="Download your data" showArrow onPress={() => {}} style={styles.actionRow} />
          <SettingsDivider />
          <SettingsRow icon="🚪" title="Log Out" onPress={() => { haptics.light(); onLogoutPress?.(); }} style={styles.actionRow} />
          <SettingsDivider />
          <SettingsRow icon="🗑️" title="Delete Account" subtitle="Permanently remove your account" isDestructive showArrow onPress={() => { haptics.light(); onDeletePress?.(); }} style={styles.actionRow} />
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.text.tertiary }]}>LinkUp V6.0.0</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing[5], paddingTop: spacing[6] },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: fontWeight.bold },
  searchButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  searchIcon: { fontSize: 16 },
  searchContainer: { marginTop: spacing[3], paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: 12 },
  searchInput: { fontSize: 15 },
  accountGroup: { marginBottom: spacing[4] },
  sectionsContainer: { gap: spacing[3], paddingHorizontal: spacing[5] },
  quickActions: { paddingHorizontal: spacing[5], marginTop: spacing[5] },
  actionRow: { minHeight: 52 },
  versionContainer: { alignItems: 'center', paddingVertical: spacing[5] },
  versionText: { fontSize: 12 },
  bottomSpacer: { height: spacing[8] },
});

SettingsHomeScreen.displayName = 'SettingsHomeScreen';

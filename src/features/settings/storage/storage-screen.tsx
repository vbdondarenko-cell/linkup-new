/**
 * LinkUp Design System 2026
 * Storage Screen
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

interface StorageScreenProps {
  style?: ViewStyle;
}

export const StorageScreen: React.FC<StorageScreenProps> = ({ style }) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const { storage, setStorage, clearCache, resetOfflineData } = useSettingsState();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const totalUsage = storage.cacheSize + storage.offlineDataSize + storage.downloadedImagesSize;
  const maxStorage = 512 * 1024 * 1024; // 512 MB example max

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Data & Storage</Text>
        </View>

        {/* Storage Usage */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.storageCard, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.storageHeader}>
            <Text style={[styles.storageLabel, { color: theme.colors.text.secondary }]}>Storage Used</Text>
            <Text style={[styles.storageValue, { color: theme.colors.text.primary }]}>
              {formatBytes(totalUsage)}
            </Text>
          </View>
          
          {/* Progress Bar */}
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface.secondary }]}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(totalUsage / maxStorage) * 100}%`, backgroundColor: '#3B82F6' }
              ]} 
            />
          </View>
          
          <Text style={[styles.storageHint, { color: theme.colors.text.tertiary }]}>
            {formatBytes(maxStorage - totalUsage)} available
          </Text>
        </Animated.View>

        {/* Storage Breakdown */}
        <SettingsSectionHeader title="Storage Breakdown" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="🗄️"
              title="Cache"
              value={formatBytes(storage.cacheSize)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📴"
              title="Offline Data"
              value={formatBytes(storage.offlineDataSize)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="🖼️"
              title="Downloaded Images"
              value={formatBytes(storage.downloadedImagesSize)}
            />
          </SettingsGroup>
        </View>

        {/* Auto Download Settings */}
        <SettingsSectionHeader title="Auto Download" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <SettingsRow
              icon="📥"
              title="Auto Download"
              subtitle="Download content for offline use"
              showSwitch
              switchValue={storage.autoDownload}
              onSwitchChange={(value) => setStorage('autoDownload', value)}
            />
            <SettingsDivider />
            <SettingsRow
              icon="📶"
              title="Wi-Fi Only"
              subtitle="Only download on Wi-Fi"
              showSwitch
              switchValue={storage.wifiOnly}
              onSwitchChange={(value) => setStorage('wifiOnly', value)}
            />
          </SettingsGroup>
        </View>

        {/* Clear Actions */}
        <SettingsSectionHeader title="Clear Data" />
        <View style={styles.groupContainer}>
          <SettingsGroup>
            <Pressable
              onPress={() => { haptics.light(); clearCache(); }}
              style={[styles.clearButton, { backgroundColor: theme.colors.surface.primary }]}
            >
              <View style={[styles.clearIcon, { backgroundColor: '#EF444415' }]}>
                <Text style={styles.clearEmoji}>🗑️</Text>
              </View>
              <View style={styles.clearContent}>
                <Text style={[styles.clearTitle, { color: theme.colors.text.primary }]}>Clear Cache</Text>
                <Text style={[styles.clearSubtitle, { color: theme.colors.text.tertiary }]}>
                  Remove temporary files
                </Text>
              </View>
            </Pressable>
            
            <SettingsDivider />
            
            <Pressable
              onPress={() => { haptics.light(); resetOfflineData(); }}
              style={[styles.clearButton, { backgroundColor: theme.colors.surface.primary }]}
            >
              <View style={[styles.clearIcon, { backgroundColor: '#F59E0B15' }]}>
                <Text style={styles.clearEmoji}>📴</Text>
              </View>
              <View style={styles.clearContent}>
                <Text style={[styles.clearTitle, { color: theme.colors.text.primary }]}>Reset Offline Data</Text>
                <Text style={[styles.clearSubtitle, { color: theme.colors.text.tertiary }]}>
                  Remove all downloaded content
                </Text>
              </View>
            </Pressable>
          </SettingsGroup>
        </View>

        {/* Info */}
        <Animated.View entering={FadeInDown.delay(300)} style={[styles.infoCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.colors.text.primary }]}>Save Storage</Text>
            <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
              Disabling auto download and clearing cache regularly helps save space on your device.
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
  storageCard: { margin: spacing[5], padding: spacing[4], borderRadius: 16 },
  storageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  storageLabel: { fontSize: 14 },
  storageValue: { fontSize: 24, fontWeight: fontWeight.bold },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  storageHint: { fontSize: 12, marginTop: spacing[2], textAlign: 'right' },
  groupContainer: { paddingHorizontal: spacing[5] },
  clearButton: { flexDirection: 'row', alignItems: 'center', padding: spacing[4] },
  clearIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clearEmoji: { fontSize: 22 },
  clearContent: { flex: 1, marginLeft: spacing[3] },
  clearTitle: { fontSize: 15, fontWeight: fontWeight.medium },
  clearSubtitle: { fontSize: 13, marginTop: 2 },
  infoCard: { flexDirection: 'row', margin: spacing[5], padding: spacing[4], borderRadius: 16 },
  infoIcon: { fontSize: 24, marginRight: spacing[3] },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: fontWeight.semibold, marginBottom: spacing[1] },
  infoText: { fontSize: 13, lineHeight: 18 },
  bottomSpacer: { height: spacing[8] },
});

StorageScreen.displayName = 'StorageScreen';

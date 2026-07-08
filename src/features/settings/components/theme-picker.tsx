/**
 * LinkUp Design System 2026
 * Settings - Theme Picker Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Theme, ThemeType } from '../types';

interface ThemePickerProps {
  themes: Theme[];
  currentTheme: ThemeType;
  isPremium: boolean;
  onSelectTheme: (theme: ThemeType) => void;
  style?: ViewStyle;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  themes,
  currentTheme,
  isPremium,
  onSelectTheme,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleSelectTheme = (themeId: ThemeType, requiresPremium: boolean) => {
    if (requiresPremium && !isPremium) return;
    haptics.light();
    onSelectTheme(themeId);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {themes.map((themeItem, index) => {
          const isSelected = currentTheme === themeItem.id;
          const isLocked = themeItem.isPremium && !isPremium;

          return (
            <Animated.View
              key={themeItem.id}
              entering={FadeInUp.delay(100 + index * 50)}
            >
              <Pressable
                onPress={() => handleSelectTheme(themeItem.id, themeItem.isPremium)}
                style={({ pressed }) => [
                  styles.themeCard,
                  {
                    backgroundColor: themeItem.colors.surface,
                    borderColor: isSelected ? themeItem.colors.primary : themeItem.colors.border,
                    borderWidth: isSelected ? 2 : 1,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                {/* Theme Preview */}
                <View style={styles.previewContainer}>
                  <View style={[styles.previewBar, { backgroundColor: themeItem.colors.primary }]} />
                  <View style={[styles.previewContent, { backgroundColor: themeItem.colors.surface }]}>
                    <View style={[styles.previewLine, { backgroundColor: themeItem.colors.text.tertiary }]} />
                    <View style={[styles.previewLineShort, { backgroundColor: themeItem.colors.text.tertiary }]} />
                  </View>
                </View>

                {/* Theme Name */}
                <Text style={[styles.themeName, { color: themeItem.colors.text.primary }]}>
                  {themeItem.icon} {themeItem.name}
                </Text>

                {/* Lock Badge */}
                {isLocked && (
                  <View style={[styles.lockBadge, { backgroundColor: '#FFD70015' }]}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}

                {/* Selected Indicator */}
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: themeItem.colors.primary }]}>
                    <Text style={styles.selectedIcon}>✓</Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Theme Preview Large Component
interface ThemePreviewLargeProps {
  theme: Theme;
  isPremium: boolean;
  onSelect?: () => void;
  style?: ViewStyle;
}

export const ThemePreviewLarge: React.FC<ThemePreviewLargeProps> = ({
  theme: themeItem,
  isPremium,
  onSelect,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const isLocked = themeItem.isPremium && !isPremium;

  return (
    <Pressable
      onPress={() => { 
        if (!isLocked) {
          haptics.light();
          onSelect?.();
        }
      }}
      style={[
        styles.previewLarge,
        { backgroundColor: themeItem.colors.background },
        style,
      ]}
    >
      {/* Header */}
      <View style={[styles.previewHeader, { backgroundColor: themeItem.colors.surface }]}>
        <View style={[styles.previewTitle, { backgroundColor: themeItem.colors.primary }]} />
      </View>

      {/* Content */}
      <View style={styles.previewBody}>
        <View style={[styles.previewCard, { backgroundColor: themeItem.colors.surface }]}>
          <View style={[styles.previewLine, { backgroundColor: themeItem.colors.text.tertiary }]} />
          <View style={[styles.previewLineShort, { backgroundColor: themeItem.colors.text.tertiary }]} />
        </View>
      </View>

      {/* Lock Overlay */}
      {isLocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockOverlayIcon}>🔒</Text>
          <Text style={[styles.lockOverlayText, { color: theme.colors.text.primary }]}>
            Premium Required
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[3],
  },
  scrollContent: {
    gap: spacing[3],
    paddingHorizontal: spacing[5],
  },
  themeCard: {
    width: 100,
    padding: spacing[3],
    borderRadius: 16,
    alignItems: 'center',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  previewBar: {
    height: 8,
  },
  previewContent: {
    flex: 1,
    padding: spacing[2],
    justifyContent: 'center',
    gap: spacing[1],
  },
  previewLine: {
    height: 4,
    borderRadius: 2,
  },
  previewLineShort: {
    height: 4,
    borderRadius: 2,
    width: '60%',
  },
  themeName: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 10,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  previewLarge: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: 0.75,
  },
  previewHeader: {
    padding: spacing[3],
  },
  previewTitle: {
    height: 10,
    borderRadius: 5,
    width: '50%',
  },
  previewBody: {
    flex: 1,
    padding: spacing[3],
    gap: spacing[2],
  },
  previewCard: {
    flex: 1,
    borderRadius: 12,
    padding: spacing[3],
    justifyContent: 'center',
    gap: spacing[2],
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  lockOverlayIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  lockOverlayText: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
});

ThemePicker.displayName = 'ThemePicker';
ThemePreviewLarge.displayName = 'ThemePreviewLarge';

/**
 * LinkUp Design System 2026
 * Premium - Theme Selector Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { PremiumTheme, ThemeType } from '../types';

interface ThemeSelectorProps {
  themes: PremiumTheme[];
  currentTheme: ThemeType;
  isPremium: boolean;
  onSelectTheme: (themeId: ThemeType) => void;
  style?: ViewStyle;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentTheme,
  isPremium,
  onSelectTheme,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleSelectTheme = (themeId: ThemeType, requiresPremium: boolean) => {
    if (requiresPremium && !isPremium) {
      // Don't select premium theme if not premium
      return;
    }
    haptics.light();
    onSelectTheme(themeId);
  };

  const renderThemePreview = (themeData: PremiumTheme) => {
    const colors = themeData.colors;
    return (
      <View style={styles.themePreview}>
        {/* Mini UI Preview */}
        <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.previewHeader, { backgroundColor: colors.primary }]} />
          <View style={styles.previewContent}>
            <View style={[styles.previewLine, { backgroundColor: colors.text.tertiary }]} />
            <View style={[styles.previewLineShort, { backgroundColor: colors.text.tertiary }]} />
          </View>
          <View style={[styles.previewButton, { backgroundColor: colors.primary }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        App Theme
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
        Personalize your experience
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.themesContainer}
      >
        {themes.map((themeData, index) => {
          const isSelected = currentTheme === themeData.id;
          const isLocked = themeData.isPremiumRequired && !isPremium;

          return (
            <Animated.View
              key={themeData.id}
              entering={FadeInUp.delay(100 + index * 50)}
            >
              <Pressable
                onPress={() => handleSelectTheme(themeData.id, themeData.isPremiumRequired)}
                style={({ pressed }) => [
                  styles.themeCard,
                  {
                    backgroundColor: themeData.colors.surface,
                    borderColor: isSelected ? themeData.colors.primary : themeData.colors.border,
                    borderWidth: isSelected ? 2 : 1,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                {/* Theme Preview */}
                {renderThemePreview(themeData)}

                {/* Theme Name */}
                <Text 
                  style={[
                    styles.themeName, 
                    { color: themeData.colors.text.primary }
                  ]}
                >
                  {themeData.icon} {themeData.name}
                </Text>

                {/* Premium Badge */}
                {themeData.isPremiumRequired && !isPremium && (
                  <View style={[styles.lockedBadge, { backgroundColor: '#FFD70015' }]}>
                    <Text style={styles.lockedIcon}>🔒</Text>
                    <Text style={[styles.lockedText, { color: '#FFD700' }]}>
                      Premium
                    </Text>
                  </View>
                )}

                {/* Selected Indicator */}
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: themeData.colors.primary }]}>
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
  theme: PremiumTheme;
  isPremium: boolean;
  onUpgrade?: () => void;
  style?: ViewStyle;
}

export const ThemePreviewLarge: React.FC<ThemePreviewLargeProps> = ({
  theme: themeData,
  isPremium,
  onUpgrade,
  style,
}) => {
  const theme = useTheme();
  const colors = themeData.colors;

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[
        styles.previewLarge,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      {/* Header */}
      <View style={[styles.previewLargeHeader, { backgroundColor: colors.surface }]}>
        <View style={[styles.previewLargeTitle, { backgroundColor: colors.primary }]} />
      </View>

      {/* Content */}
      <View style={styles.previewLargeContent}>
        <View style={[styles.previewLargeCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.previewLargeLine, { backgroundColor: colors.text.tertiary }]} />
          <View style={[styles.previewLargeLineShort, { backgroundColor: colors.text.tertiary }]} />
          <View style={[styles.previewLargeLineMedium, { backgroundColor: colors.text.tertiary }]} />
        </View>

        <View style={[styles.previewLargeCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.previewLargeLine, { backgroundColor: colors.text.tertiary }]} />
          <View style={[styles.previewLargeLineMedium, { backgroundColor: colors.text.tertiary }]} />
        </View>
      </View>

      {/* Button */}
      <View style={[styles.previewLargeButton, { backgroundColor: colors.primary }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: spacing[4],
  },
  themesContainer: {
    gap: spacing[3],
    paddingRight: spacing[5],
  },
  themeCard: {
    width: 100,
    padding: spacing[3],
    borderRadius: 16,
    alignItems: 'center',
  },
  themePreview: {
    width: '100%',
    marginBottom: spacing[2],
  },
  previewCard: {
    borderRadius: 8,
    padding: 4,
    aspectRatio: 1,
  },
  previewHeader: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
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
  previewButton: {
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  themeName: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: spacing[1],
    gap: 2,
  },
  lockedIcon: {
    fontSize: 10,
  },
  lockedText: {
    fontSize: 9,
    fontWeight: fontWeight.semibold,
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing[2],
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
  previewLargeHeader: {
    padding: spacing[3],
  },
  previewLargeTitle: {
    height: 12,
    borderRadius: 6,
    width: '60%',
  },
  previewLargeContent: {
    flex: 1,
    padding: spacing[3],
    gap: spacing[2],
  },
  previewLargeCard: {
    flex: 1,
    borderRadius: 12,
    padding: spacing[3],
    justifyContent: 'center',
    gap: spacing[2],
  },
  previewLargeLine: {
    height: 6,
    borderRadius: 3,
  },
  previewLargeLineShort: {
    height: 6,
    borderRadius: 3,
    width: '70%',
  },
  previewLargeLineMedium: {
    height: 6,
    borderRadius: 3,
    width: '85%',
  },
  previewLargeButton: {
    height: 32,
    borderRadius: 16,
    marginHorizontal: spacing[3],
    marginBottom: spacing[3],
  },
});

ThemeSelector.displayName = 'ThemeSelector';
ThemePreviewLarge.displayName = 'ThemePreviewLarge';

/**
 * LinkUp Design System 2026
 * Auth Radius Selection Screen
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { RADIUS_OPTIONS } from '../types';

interface RadiusScreenProps {
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  onContinue: () => void;
  onBack: () => void;
  style?: ViewStyle;
}

export const RadiusScreen: React.FC<RadiusScreenProps> = ({
  selectedRadius,
  onRadiusChange,
  onContinue,
  onBack,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const sliderPosition = useSharedValue(0.5);

  const handleRadiusSelect = (radius: number, index: number) => {
    haptics.light();
    sliderPosition.value = withSpring(index / (RADIUS_OPTIONS.length - 1));
    onRadiusChange(radius);
  };

  const formatRadius = (radius: number) => {
    if (radius < 1) {
      return `${Math.round(radius * 1000)}m`;
    }
    return `${radius}km`;
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <Pressable onPress={() => { haptics.light(); onBack(); }} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: theme.colors.text.primary }]}>←</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Set your radius
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
            How far are you willing to travel?
          </Text>
        </View>
      </View>

      {/* Visual Map Preview */}
      <Animated.View entering={FadeInUp.delay(100)} style={[styles.mapPreview, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={styles.mapContainer}>
          {/* Map Grid */}
          <View style={styles.mapGrid}>
            {[...Array(5)].map((_, row) => (
              <View key={row} style={styles.mapRow}>
                {[...Array(5)].map((_, col) => {
                  const distance = Math.sqrt(Math.pow(row - 2, 2) + Math.pow(col - 2, 2));
                  const isInRadius = distance <= (selectedRadius / 25); // Normalize to 0-4 range
                  return (
                    <View
                      key={`${row}-${col}`}
                      style={[
                        styles.mapCell,
                        { 
                          backgroundColor: isInRadius 
                            ? `${theme.colors.primary.DEFAULT}40` 
                            : 'transparent',
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
          
          {/* Center Point */}
          <View style={[styles.centerPoint, { backgroundColor: theme.colors.primary.DEFAULT }]}>
            <Text style={styles.centerIcon}>📍</Text>
          </View>
          
          {/* Radius Circle */}
          <View style={[
            styles.radiusCircle,
            { 
              borderColor: theme.colors.primary.DEFAULT,
              width: `${selectedRadius * 4}%`,
              height: `${selectedRadius * 4}%`,
            }
          ]} />
        </View>
        
        {/* Selected Radius Display */}
        <View style={styles.radiusDisplay}>
          <Text style={[styles.radiusValue, { color: theme.colors.text.primary }]}>
            {formatRadius(selectedRadius)}
          </Text>
          <Text style={[styles.radiusLabel, { color: theme.colors.text.tertiary }]}>
            from your location
          </Text>
        </View>
      </Animated.View>

      {/* Options */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.optionsContainer}>
        <View style={styles.optionsGrid}>
          {RADIUS_OPTIONS.map((option, index) => {
            const isSelected = selectedRadius === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => handleRadiusSelect(option.value, index)}
                style={({ pressed }) => [
                  styles.optionButton,
                  { 
                    backgroundColor: isSelected 
                      ? theme.colors.primary.DEFAULT 
                      : theme.colors.surface.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text 
                  style={[
                    styles.optionText,
                    { color: isSelected ? '#FFFFFF' : theme.colors.text.primary }
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Info */}
      <Animated.View entering={FadeInUp.delay(300)} style={[styles.infoCard, { backgroundColor: theme.colors.surface.primary }]}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
          You can change this later in Settings. Starting with 5km is a great way to discover nearby events.
        </Text>
      </Animated.View>

      {/* Continue Button */}
      <View style={[styles.bottomContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Button
          variant="primary"
          size="lg"
          onPress={() => { haptics.medium(); onContinue(); }}
          style={styles.continueButton}
        >
          Continue
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[5],
    paddingTop: spacing[6],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing[2],
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  mapPreview: {
    margin: spacing[5],
    padding: spacing[4],
    borderRadius: 20,
    alignItems: 'center',
  },
  mapContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mapRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mapCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  centerPoint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerIcon: {
    fontSize: 16,
  },
  radiusCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 999,
    borderStyle: 'dashed',
  },
  radiusDisplay: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
  radiusValue: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
  },
  radiusLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  optionsContainer: {
    paddingHorizontal: spacing[5],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  optionButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  infoCard: {
    flexDirection: 'row',
    margin: spacing[5],
    padding: spacing[4],
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  continueButton: {
    width: '100%',
  },
});

RadiusScreen.displayName = 'RadiusScreen';

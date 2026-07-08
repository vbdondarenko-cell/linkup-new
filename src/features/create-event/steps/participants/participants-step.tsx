/**
 * LinkUp Design System 2026
 * Participants Step - Set event capacity
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { useHaptics } from '../../../../ui/hooks/use-haptics';
import { spacing } from '../../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../../ui/tokens/typography';
import type { CreateEventData } from '../../flow/create-event-flow';

interface ParticipantsStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

const PARTICIPANT_PRESETS = [
  { label: 'Small', min: 2, max: 10, icon: '☕' },
  { label: 'Medium', min: 10, max: 25, icon: '🍽️' },
  { label: 'Large', min: 25, max: 50, icon: '🏠' },
  { label: 'Event', min: 50, max: 200, icon: '🎉' },
];

const SLIDER_WIDTH = 280;
const THUMB_SIZE = 28;

export const ParticipantsStep: React.FC<ParticipantsStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const [minParticipants, setMinParticipants] = useState(data.participants?.min ?? 2);
  const [maxParticipants, setMaxParticipants] = useState(data.participants?.max ?? 20);

  const minPosition = useSharedValue(((minParticipants - 2) / 98) * (SLIDER_WIDTH - THUMB_SIZE));
  const maxPosition = useSharedValue(((maxParticipants - 2) / 98) * (SLIDER_WIDTH - THUMB_SIZE));

  const updateParticipants = useCallback(
    (min: number, max: number) => {
      const participantsData = {
        min,
        max,
        isLimited: true,
      };
      onUpdate({ participants: participantsData });
      onComplete({ participants: participantsData });
    },
    [onUpdate, onComplete]
  );

  const handlePresetSelect = useCallback(
    (preset: typeof PARTICIPANT_PRESETS[0]) => {
      haptics.selection();
      setMinParticipants(preset.min);
      setMaxParticipants(preset.max);
      minPosition.value = withSpring(((preset.min - 2) / 98) * (SLIDER_WIDTH - THUMB_SIZE));
      maxPosition.value = withSpring(((preset.max - 2) / 98) * (SLIDER_WIDTH - THUMB_SIZE));
      updateParticipants(preset.min, preset.max);
    },
    [haptics, minPosition, maxPosition, updateParticipants]
  );

  const minThumbGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newPos = Math.max(0, Math.min(e.x, maxPosition.value - THUMB_SIZE));
      minPosition.value = newPos;
      const newMin = Math.round((newPos / (SLIDER_WIDTH - THUMB_SIZE)) * 98) + 2;
      runOnJS(setMinParticipants)(Math.min(newMin, maxParticipants - 1));
    })
    .onEnd(() => {
      runOnJS(haptics.selection)();
      runOnJS(updateParticipants)(minParticipants, maxParticipants);
    });

  const maxThumbGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newPos = Math.max(minPosition.value + THUMB_SIZE, Math.min(e.x, SLIDER_WIDTH - THUMB_SIZE));
      maxPosition.value = newPos;
      const newMax = Math.round((newPos / (SLIDER_WIDTH - THUMB_SIZE)) * 98) + 2;
      runOnJS(setMaxParticipants)(Math.max(newMax, minParticipants + 1));
    })
    .onEnd(() => {
      runOnJS(haptics.selection)();
      runOnJS(updateParticipants)(minParticipants, maxParticipants);
    });

  const minThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: minPosition.value }],
  }));

  const maxThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: maxPosition.value }],
  }));

  const rangeStyle = useAnimatedStyle(() => ({
    left: minPosition.value + THUMB_SIZE / 2,
    width: maxPosition.value - minPosition.value,
  }));

  const spotsLeft = maxParticipants - minParticipants;

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        How many people? 👥
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Set the capacity for your event
      </Text>

      {/* Quick Presets */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Quick Select
        </Text>
        <View style={styles.presetsGrid}>
          {PARTICIPANT_PRESETS.map((preset, index) => {
            const isSelected =
              minParticipants === preset.min && maxParticipants === preset.max;
            return (
              <Pressable
                key={preset.label}
                onPress={() => handlePresetSelect(preset)}
                style={[
                  styles.presetCard,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.interactive.primary
                      : theme.colors.surface.primary,
                    borderColor: isSelected
                      ? theme.colors.interactive.primary
                      : theme.colors.border.default,
                  },
                ]}
              >
                <Text style={styles.presetIcon}>{preset.icon}</Text>
                <Text
                  style={[
                    styles.presetLabel,
                    { color: isSelected ? '#FFFFFF' : theme.colors.text.primary },
                  ]}
                >
                  {preset.label}
                </Text>
                <Text
                  style={[
                    styles.presetRange,
                    { color: isSelected ? 'rgba(255,255,255,0.7)' : theme.colors.text.tertiary },
                  ]}
                >
                  {preset.min}-{preset.max}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Custom Slider */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Custom Range
        </Text>

        {/* Display */}
        <View style={styles.display}>
          <View style={styles.displayItem}>
            <Text
              style={[
                styles.displayValue,
                { color: theme.colors.text.primary },
              ]}
            >
              {minParticipants}
            </Text>
            <Text
              style={[
                styles.displayLabel,
                { color: theme.colors.text.tertiary },
              ]}
            >
              Minimum
            </Text>
          </View>
          <View style={styles.displayDivider}>
            <Text style={styles.displayDividerText}>-</Text>
          </View>
          <View style={styles.displayItem}>
            <Text
              style={[
                styles.displayValue,
                { color: theme.colors.text.primary },
              ]}
            >
              {maxParticipants}
            </Text>
            <Text
              style={[
                styles.displayLabel,
                { color: theme.colors.text.tertiary },
              ]}
            >
              Maximum
            </Text>
          </View>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <GestureDetector gesture={minThumbGesture}>
            <Animated.View style={[styles.thumb, minThumbStyle]}>
              <View
                style={[
                  styles.thumbInner,
                  { backgroundColor: theme.colors.interactive.primary },
                ]}
              />
            </Animated.View>
          </GestureDetector>
          <GestureDetector gesture={maxThumbGesture}>
            <Animated.View style={[styles.thumb, maxThumbStyle]}>
              <View
                style={[
                  styles.thumbInner,
                  { backgroundColor: theme.colors.interactive.primary },
                ]}
              />
            </Animated.View>
          </GestureDetector>
          <View style={[styles.track, { backgroundColor: theme.colors.surface.tertiary }]} />
          <Animated.View
            style={[
              styles.range,
              { backgroundColor: theme.colors.interactive.primary },
              rangeStyle,
            ]}
          />
        </View>

        {/* Scale */}
        <View style={styles.scale}>
          <Text style={[styles.scaleText, { color: theme.colors.text.tertiary }]}>2</Text>
          <Text style={[styles.scaleText, { color: theme.colors.text.tertiary }]}>100</Text>
        </View>
      </View>

      {/* Spots Info */}
      <Animated.View
        style={[
          styles.spotsInfo,
          {
            backgroundColor: theme.colors.surface.primary,
            borderColor: theme.colors.interactive.primary,
          },
        ]}
      >
        <Text style={styles.spotsIcon}>🎟️</Text>
        <Text
          style={[
            styles.spotsText,
            { color: theme.colors.text.primary },
          ]}
        >
          {spotsLeft} spots available after minimum
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 15,
    marginBottom: spacing[6],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  presetCard: {
    width: '47%',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  presetIcon: {
    fontSize: 28,
    marginBottom: spacing[1],
  },
  presetLabel: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  presetRange: {
    fontSize: 12,
    marginTop: 2,
  },
  display: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  displayItem: {
    alignItems: 'center',
  },
  displayValue: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
  },
  displayLabel: {
    fontSize: 13,
    marginTop: spacing[1],
  },
  displayDivider: {
    paddingHorizontal: spacing[4],
  },
  displayDividerText: {
    fontSize: 32,
    color: '#999',
  },
  sliderContainer: {
    height: 60,
    justifyContent: 'center',
    width: SLIDER_WIDTH,
    alignSelf: 'center',
  },
  track: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  range: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  thumbInner: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    alignSelf: 'center',
    marginTop: spacing[2],
  },
  scaleText: {
    fontSize: 12,
  },
  spotsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 2,
    marginTop: spacing[4],
  },
  spotsIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  spotsText: {
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
});

ParticipantsStep.displayName = 'ParticipantsStep';

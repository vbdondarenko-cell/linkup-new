/**
 * LinkUp Design System 2026
 * Time Step - Choose event time
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { useHaptics } from '../../../../ui/hooks/use-haptics';
import { spacing } from '../../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../../ui/tokens/spacing';
import type { CreateEventData } from '../../flow/create-event-flow';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TimeStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

const TIME_PRESETS = [
  { label: 'Morning', time: '09:00', icon: '🌅', range: '9 AM - 12 PM' },
  { label: 'Afternoon', time: '14:00', icon: '☀️', range: '12 PM - 5 PM' },
  { label: 'Evening', time: '18:00', icon: '🌆', range: '5 PM - 9 PM' },
  { label: 'Night', time: '21:00', icon: '🌙', range: '9 PM - 12 AM' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const TimeStep: React.FC<TimeStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatTime = (hour: number): string => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  const handleSelectPreset = useCallback(
    (preset: typeof TIME_PRESETS[0]) => {
      haptics.selection();
      const timeData = {
        startTime: preset.time,
        endTime: `${(parseInt(preset.time.split(':')[0]) + 3).toString().padStart(2, '0')}:00`,
      };
      onUpdate({ time: timeData });
      onComplete({ time: timeData });
    },
    [haptics, onUpdate, onComplete]
  );

  const handleSelectTime = useCallback(
    (type: 'start' | 'end', hour: number) => {
      haptics.selection();
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      
      if (type === 'start') {
        setShowStartPicker(false);
        const newData = { time: { ...data.time, startTime: timeStr } };
        onUpdate(newData);
        onComplete(newData);
      } else {
        setShowEndPicker(false);
        const newData = { time: { ...data.time, endTime: timeStr } };
        onUpdate(newData);
        onComplete(newData);
      }
    },
    [haptics, data.time, onUpdate, onComplete]
  );

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        What time? ⏰
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Choose when your event starts and ends
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
          {TIME_PRESETS.map((preset, index) => {
            const isSelected = data.time?.startTime === preset.time;
            return (
              <Animated.View key={preset.label} entering={FadeIn.delay(index * 50)}>
                <Pressable
                  onPress={() => handleSelectPreset(preset)}
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
                    {preset.range}
                  </Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Custom Time Selection */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Or Set Custom Times
        </Text>
        
        <View style={styles.timeSelectors}>
          {/* Start Time */}
          <View style={styles.timeSelector}>
            <Text
              style={[
                styles.timeSelectorLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Start Time
            </Text>
            <Pressable
              onPress={() => setShowStartPicker(!showStartPicker)}
              style={[
                styles.timeSelectorButton,
                {
                  backgroundColor: theme.colors.surface.primary,
                  borderColor: showStartPicker
                    ? theme.colors.interactive.primary
                    : theme.colors.border.default,
                },
              ]}
            >
              <Text
                style={[
                  styles.timeSelectorValue,
                  { color: theme.colors.text.primary },
                ]}
              >
                {data.time?.startTime
                  ? formatTime(parseInt(data.time.startTime.split(':')[0]))
                  : 'Select start'}
              </Text>
              <Text style={styles.timeSelectorChevron}>▼</Text>
            </Pressable>
            
            {showStartPicker && (
              <ScrollView style={styles.timePicker} showsVerticalScrollIndicator={false}>
                {HOURS.map((hour) => (
                  <Pressable
                    key={hour}
                    onPress={() => handleSelectTime('start', hour)}
                    style={[
                      styles.timeOption,
                      data.time?.startTime === `${hour.toString().padStart(2, '0')}:00` && {
                        backgroundColor: theme.colors.interactive.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        {
                          color: data.time?.startTime === `${hour.toString().padStart(2, '0')}:00`
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                        },
                      ]}
                    >
                      {formatTime(hour)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          {/* End Time */}
          <View style={styles.timeSelector}>
            <Text
              style={[
                styles.timeSelectorLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              End Time
            </Text>
            <Pressable
              onPress={() => setShowEndPicker(!showEndPicker)}
              style={[
                styles.timeSelectorButton,
                {
                  backgroundColor: theme.colors.surface.primary,
                  borderColor: showEndPicker
                    ? theme.colors.interactive.primary
                    : theme.colors.border.default,
                },
              ]}
            >
              <Text
                style={[
                  styles.timeSelectorValue,
                  { color: theme.colors.text.primary },
                ]}
              >
                {data.time?.endTime
                  ? formatTime(parseInt(data.time.endTime.split(':')[0]))
                  : 'Select end'}
              </Text>
              <Text style={styles.timeSelectorChevron}>▼</Text>
            </Pressable>
            
            {showEndPicker && (
              <ScrollView style={styles.timePicker} showsVerticalScrollIndicator={false}>
                {HOURS.map((hour) => (
                  <Pressable
                    key={hour}
                    onPress={() => handleSelectTime('end', hour)}
                    style={[
                      styles.timeOption,
                      data.time?.endTime === `${hour.toString().padStart(2, '0')}:00` && {
                        backgroundColor: theme.colors.interactive.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        {
                          color: data.time?.endTime === `${hour.toString().padStart(2, '0')}:00`
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                        },
                      ]}
                    >
                      {formatTime(hour)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>

      {/* Duration Preview */}
      {data.time?.startTime && data.time?.endTime && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.durationPreview,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.interactive.primary,
            },
          ]}
        >
          <Text style={styles.durationIcon}>⏱️</Text>
          <Text
            style={[
              styles.durationText,
              { color: theme.colors.text.primary },
            ]}
          >
            Duration: {parseInt(data.time.endTime.split(':')[0]) - parseInt(data.time.startTime.split(':')[0])} hours
          </Text>
        </Animated.View>
      )}
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
  timeSelectors: {
    gap: spacing[4],
  },
  timeSelector: {
    marginBottom: spacing[2],
  },
  timeSelectorLabel: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[2],
  },
  timeSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
  },
  timeSelectorValue: {
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
  timeSelectorChevron: {
    fontSize: 12,
    color: '#999',
  },
  timePicker: {
    maxHeight: 200,
    marginTop: spacing[2],
    borderRadius: 12,
    overflow: 'hidden',
  },
  timeOption: {
    padding: spacing[3],
    borderRadius: 8,
  },
  timeOptionText: {
    fontSize: 15,
    textAlign: 'center',
  },
  durationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 2,
    marginTop: spacing[4],
  },
  durationIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  durationText: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});

TimeStep.displayName = 'TimeStep';

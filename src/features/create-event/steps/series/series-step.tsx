/**
 * LinkUp Design System 2026
 * Series Step - Set recurring events
 */

'use client';

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { useHaptics } from '../../../../ui/hooks/use-haptics';
import { spacing } from '../../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../../ui/tokens/spacing';
import type { CreateEventData } from '../../flow/create-event-flow';

interface SeriesStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily', icon: '📅', description: 'Every day' },
  { id: 'weekly', label: 'Weekly', icon: '📆', description: 'Every week' },
  { id: 'monthly', label: 'Monthly', icon: '🗓️', description: 'Every month' },
  { id: 'custom', label: 'Custom', icon: '⚙️', description: 'Set your own' },
];

const INTERVAL_OPTIONS = [
  { value: 1, label: 'Every 1' },
  { value: 2, label: 'Every 2' },
  { value: 3, label: 'Every 3' },
  { value: 4, label: 'Every 4' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'S', full: 'Sun' },
  { value: 1, label: 'M', full: 'Mon' },
  { value: 2, label: 'T', full: 'Tue' },
  { value: 3, label: 'W', full: 'Wed' },
  { value: 4, label: 'T', full: 'Thu' },
  { value: 5, label: 'F', full: 'Fri' },
  { value: 6, label: 'S', full: 'Sat' },
];

export const SeriesStep: React.FC<SeriesStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const isRecurring = data.series?.isRecurring ?? false;
  const frequency = data.series?.frequency ?? 'weekly';
  const interval = data.series?.interval ?? 1;
  const selectedDays = data.series?.daysOfWeek ?? [new Date().getDay()];

  const handleToggleRecurring = useCallback(
    (value: boolean) => {
      haptics.selection();
      const seriesData = {
        isRecurring: value,
        frequency: value ? frequency : undefined,
        interval: value ? interval : undefined,
        daysOfWeek: value ? selectedDays : undefined,
      };
      onUpdate({ series: seriesData });
      if (!value) {
        onComplete({ series: { isRecurring: false } });
      }
    },
    [haptics, frequency, interval, selectedDays, onUpdate, onComplete]
  );

  const handleSelectFrequency = useCallback(
    (freq: typeof FREQUENCY_OPTIONS[0]) => {
      haptics.selection();
      const seriesData = {
        ...data.series,
        frequency: freq.id as CreateEventData['series']['frequency'],
      };
      onUpdate({ series: seriesData });
    },
    [haptics, data.series, onUpdate]
  );

  const handleSelectDay = useCallback(
    (day: number) => {
      haptics.selection();
      const newDays = selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day];
      if (newDays.length === 0) return; // Keep at least one day
      
      const seriesData = {
        ...data.series,
        daysOfWeek: newDays,
      };
      onUpdate({ series: seriesData });
    },
    [haptics, selectedDays, data.series, onUpdate]
  );

  const handleComplete = useCallback(() => {
    onComplete({});
  }, [onComplete]);

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        Make it recurring? 🔄
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Turn this into a recurring event (optional)
      </Text>

      {/* Toggle */}
      <View
        style={[
          styles.toggleCard,
          {
            backgroundColor: theme.colors.surface.primary,
            borderColor: isRecurring
              ? theme.colors.interactive.primary
              : theme.colors.border.default,
          },
        ]}
      >
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleIcon}>🔄</Text>
          <View style={styles.toggleContent}>
            <Text
              style={[
                styles.toggleTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Recurring Event
            </Text>
            <Text
              style={[
                styles.toggleDescription,
                { color: theme.colors.text.tertiary },
              ]}
            >
              Repeat this event on a schedule
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => handleToggleRecurring(!isRecurring)}
          style={[
            styles.toggle,
            {
              backgroundColor: isRecurring
                ? theme.colors.interactive.primary
                : theme.colors.surface.tertiary,
            },
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              isRecurring && styles.toggleThumbActive,
            ]}
          />
        </Pressable>
      </View>

      {/* Recurring Options */}
      {isRecurring && (
        <Animated.View entering={FadeIn}>
          {/* Frequency */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              Repeat
            </Text>
            <View style={styles.frequencyGrid}>
              {FREQUENCY_OPTIONS.map((option) => {
                const isSelected = frequency === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => handleSelectFrequency(option)}
                    style={[
                      styles.frequencyCard,
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
                    <Text style={styles.frequencyIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.frequencyLabel,
                        { color: isSelected ? '#FFFFFF' : theme.colors.text.primary },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.frequencyDescription,
                        { color: isSelected ? 'rgba(255,255,255,0.7)' : theme.colors.text.tertiary },
                      ]}
                    >
                      {option.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Days of Week (for weekly) */}
          {frequency === 'weekly' && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                On these days
              </Text>
              <View style={styles.daysRow}>
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day.value);
                  return (
                    <Pressable
                      key={day.value}
                      onPress={() => handleSelectDay(day.value)}
                      style={[
                        styles.dayButton,
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
                      <Text
                        style={[
                          styles.dayLabel,
                          { color: isSelected ? '#FFFFFF' : theme.colors.text.primary },
                        ]}
                      >
                        {day.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </Animated.View>
      )}

      {/* Info */}
      <View
        style={[
          styles.info,
          {
            backgroundColor: theme.colors.surface.primary,
            borderColor: theme.colors.border.default,
          },
        ]}
      >
        <Text style={styles.infoIcon}>📋</Text>
        <Text
          style={[
            styles.infoText,
            { color: theme.colors.text.secondary },
          ]}
        >
          {isRecurring
            ? 'You can edit individual events or the whole series later.'
            : 'You can always convert this to a recurring event later.'}
        </Text>
      </View>

      {/* Skip Option */}
      <Pressable onPress={handleComplete} style={styles.skipButton}>
        <Text
          style={[
            styles.skipText,
            { color: theme.colors.text.tertiary },
          ]}
        >
          {isRecurring ? 'Continue →' : 'Skip this step →'}
        </Text>
      </Pressable>
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
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: spacing[6],
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    fontSize: 28,
    marginRight: spacing[3],
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  toggleDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
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
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  frequencyCard: {
    width: '47%',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  frequencyIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  frequencyLabel: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  frequencyDescription: {
    fontSize: 11,
    marginTop: 2,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  info: {
    flexDirection: 'row',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing[4],
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
  skipButton: {
    marginTop: spacing[6],
    alignItems: 'center',
    padding: spacing[3],
  },
  skipText: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
  },
});

SeriesStep.displayName = 'SeriesStep';

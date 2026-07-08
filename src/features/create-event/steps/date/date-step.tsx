/**
 * LinkUp Design System 2026
 * Date Step - Choose event date
 */

'use client';

import React, { useCallback, useMemo } from 'react';
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
import { fontSize, fontWeight } from '../../../../ui/tokens/typography';
import type { CreateEventData } from '../../flow/create-event-flow';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DateStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DateStep: React.FC<DateStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const today = useMemo(() => new Date(), []);
  
  // Quick date options
  const quickDates = useMemo(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeekend = new Date(today);
    const dayOfWeek = today.getDay();
    const daysUntilWeekend = dayOfWeek === 0 ? 6 : dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
    nextWeekend.setDate(nextWeekend.getDate() + daysUntilWeekend);
    
    return [
      { label: 'Today', date: today, icon: '📅' },
      { label: 'Tomorrow', date: tomorrow, icon: '➡️' },
      { label: 'This Weekend', date: nextWeekend, icon: '🎉' },
    ];
  }, [today]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (Date | null)[] = [];
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [today]);

  const handleSelectDate = useCallback(
    (date: Date) => {
      haptics.selection();
      const dateData = {
        start: date,
        isAllDay: data.date?.isAllDay ?? true,
      };
      onUpdate({ date: dateData });
      onComplete({ date: dateData });
    },
    [haptics, data.date?.isAllDay, onUpdate, onComplete]
  );

  const handleToggleAllDay = useCallback(
    (isAllDay: boolean) => {
      haptics.selection();
      if (data.date) {
        onUpdate({ date: { ...data.date, isAllDay } });
      }
    },
    [haptics, data.date, onUpdate]
  );

  const formatDate = (date: Date) => {
    return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
  };

  const isSelected = (date: Date) => {
    if (!data.date?.start) return false;
    return data.date.start.toDateString() === date.toDateString();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        When is your event? 📅
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Choose a date for your event
      </Text>

      {/* Quick Options */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Quick Select
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickOptions}
        >
          {quickDates.map((option, index) => (
            <Animated.View key={option.label} entering={FadeIn.delay(index * 50)}>
              <Pressable
                onPress={() => handleSelectDate(option.date)}
                style={[
                  styles.quickOption,
                  {
                    backgroundColor: isSelected(option.date)
                      ? theme.colors.interactive.primary
                      : theme.colors.surface.primary,
                    borderColor: isSelected(option.date)
                      ? theme.colors.interactive.primary
                      : theme.colors.border.default,
                  },
                ]}
              >
                <Text style={styles.quickIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.quickLabel,
                    {
                      color: isSelected(option.date)
                        ? '#FFFFFF'
                        : theme.colors.text.primary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.quickDate,
                    {
                      color: isSelected(option.date)
                        ? 'rgba(255,255,255,0.8)'
                        : theme.colors.text.tertiary,
                    },
                  ]}
                >
                  {formatDate(option.date)}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          {MONTHS[today.getMonth()]} {today.getFullYear()}
        </Text>
        
        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {DAYS.map((day) => (
            <Text
              key={day}
              style={[
                styles.dayHeader,
                { color: theme.colors.text.tertiary },
              ]}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((date, index) => {
            if (!date) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const selected = isSelected(date);
            const isToday = date.toDateString() === today.toDateString();

            return (
              <Pressable
                key={date.toISOString()}
                onPress={() => handleSelectDate(date)}
                style={[
                  styles.dayCell,
                  selected && {
                    backgroundColor: theme.colors.interactive.primary,
                  },
                  isToday && !selected && {
                    borderWidth: 2,
                    borderColor: theme.colors.interactive.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: selected
                        ? '#FFFFFF'
                        : theme.colors.text.primary,
                    },
                  ]}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* All Day Toggle */}
      <View style={styles.toggleRow}>
        <Text
          style={[
            styles.toggleLabel,
            { color: theme.colors.text.primary },
          ]}
        >
          All Day Event
        </Text>
        <Pressable
          onPress={() => handleToggleAllDay(true)}
          style={[
            styles.toggleOption,
            {
              backgroundColor: data.date?.isAllDay
                ? theme.colors.interactive.primary
                : theme.colors.surface.tertiary,
            },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: data.date?.isAllDay ? '#FFFFFF' : theme.colors.text.secondary },
            ]}
          >
            Yes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleToggleAllDay(false)}
          style={[
            styles.toggleOption,
            {
              backgroundColor: !data.date?.isAllDay
                ? theme.colors.interactive.primary
                : theme.colors.surface.tertiary,
            },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: !data.date?.isAllDay ? '#FFFFFF' : theme.colors.text.secondary },
            ]}
          >
            No
          </Text>
        </Pressable>
      </View>

      {/* Selected Preview */}
      {data.date?.start && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.selectedPreview,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.interactive.primary,
            },
          ]}
        >
          <Text style={styles.selectedIcon}>📅</Text>
          <Text
            style={[
              styles.selectedText,
              { color: theme.colors.text.primary },
            ]}
          >
            {formatDate(data.date.start)}
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
  quickOptions: {
    gap: spacing[3],
  },
  quickOption: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 100,
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: spacing[1],
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  quickDate: {
    fontSize: 11,
    marginTop: 2,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  toggleOption: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 2,
    marginTop: spacing[4],
  },
  selectedIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  selectedText: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
});

DateStep.displayName = 'DateStep';

/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Mini Calendar Component
 */

'use client';

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { CalendarEvent } from '../types';

interface MiniCalendarProps {
  events: CalendarEvent[];
  onEventPress?: (event: CalendarEvent) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  events,
  onEventPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    
    const days: Array<{ date: Date | null; isCurrentMonth: boolean }> = [];
    
    // Add padding for days before the first of the month
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const goToPreviousMonth = () => {
    haptics.light();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    haptics.light();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10B981';
      case 'ongoing': return '#3B82F6';
      case 'draft': return '#9CA3AF';
      case 'completed': return '#8B5CF6';
      default: return '#9CA3AF';
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(400).springify()}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.lg,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={[styles.navIcon, { color: theme.colors.text.secondary }]}>‹</Text>
        </Pressable>
        <Text style={[styles.monthTitle, { color: theme.colors.text.primary }]}>
          {monthName}
        </Text>
        <Pressable onPress={goToNextMonth} style={styles.navButton}>
          <Text style={[styles.navIcon, { color: theme.colors.text.secondary }]}>›</Text>
        </Pressable>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, { color: theme.colors.text.tertiary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          const dayEvents = day.date ? getEventsForDate(day.date) : [];
          const hasEvents = dayEvents.length > 0;
          
          return (
            <View key={index} style={styles.dayCell}>
              {day.date && (
                <View
                  style={[
                    styles.dayContent,
                    isToday(day.date) && {
                      backgroundColor: theme.colors.primary.DEFAULT,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isToday(day.date) ? '#FFFFFF' : theme.colors.text.primary },
                      !day.isCurrentMonth && { opacity: 0.3 },
                    ]}
                  >
                    {day.date.getDate()}
                  </Text>
                </View>
              )}
              {hasEvents && (
                <View style={styles.eventDots}>
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <View
                      key={i}
                      style={[
                        styles.eventDot,
                        { backgroundColor: getStatusColor(event.status) },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* View All Button */}
      <Pressable
        onPress={() => { haptics.light(); onViewAllPress?.(); }}
        style={styles.viewAllButton}
      >
        <Text style={[styles.viewAllText, { color: theme.colors.primary.DEFAULT }]}>
          View Full Calendar →
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  navButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 24,
    fontWeight: fontWeight.medium,
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  dayContent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingTop: spacing[4],
    marginTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
});

MiniCalendar.displayName = 'MiniCalendar';

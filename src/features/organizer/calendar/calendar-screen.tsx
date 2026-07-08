/**
 * LinkUp Design System 2026
 * Organizer - Calendar Screen
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { CalendarEvent, EventManagementStatus } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
  onEventPress?: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  style?: ViewStyle;
}

type ViewMode = 'month' | 'week' | 'agenda';

const STATUS_COLORS: Record<EventManagementStatus, string> = {
  draft: '#9CA3AF',
  published: '#10B981',
  ongoing: '#3B82F6',
  completed: '#8B5CF6',
  cancelled: '#EF4444',
  archived: '#64748B',
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  events,
  onEventPress,
  onCreateEvent,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  }), [currentDate]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    
    const days: Array<{ date: Date | null; isCurrentMonth: boolean }> = [];
    
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    return days;
  }, [year, month]);

  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  }, [events]);

  const goToPreviousMonth = () => {
    haptics.light();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    haptics.light();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    haptics.light();
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get events for the whole month for summary
  const monthEvents = useMemo(() => {
    return events.filter(event => {
      const date = new Date(event.startDate);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [events, month, year]);

  const selectedDate = new Date();
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Calendar
          </Text>
          <Button
            variant="primary"
            size="sm"
            onPress={() => { haptics.light(); onCreateEvent?.(); }}
          >
            Create Event
          </Button>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <Pressable onPress={goToPreviousMonth} style={styles.navButton}>
            <Text style={[styles.navIcon, { color: theme.colors.text.secondary }]}>‹</Text>
          </Pressable>
          <View style={styles.monthCenter}>
            <Text style={[styles.monthTitle, { color: theme.colors.text.primary }]}>
              {monthName}
            </Text>
            <Pressable onPress={goToToday}>
              <Text style={[styles.todayText, { color: theme.colors.primary.DEFAULT }]}>
                Today
              </Text>
            </Pressable>
          </View>
          <Pressable onPress={goToNextMonth} style={styles.navButton}>
            <Text style={[styles.navIcon, { color: theme.colors.text.secondary }]}>›</Text>
          </Pressable>
        </View>

        {/* View Mode Tabs */}
        <View style={styles.viewModeTabs}>
          {(['month', 'week', 'agenda'] as ViewMode[]).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => { haptics.light(); setViewMode(mode); }}
              style={[
                styles.viewModeTab,
                viewMode === mode && {
                  backgroundColor: theme.colors.primary.DEFAULT,
                },
              ]}
            >
              <Text
                style={[
                  styles.viewModeText,
                  { color: viewMode === mode ? '#FFFFFF' : theme.colors.text.secondary },
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={[styles.calendarContainer, { backgroundColor: theme.colors.surface.primary }]}>
        {/* Weekday Headers */}
        <View style={styles.weekdayRow}>
          {weekDays.map((day) => (
            <View key={day} style={styles.weekdayCell}>
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
            const isSelected = day.date && isToday(day.date);
            
            return (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(index * 10)}
                style={styles.dayCell}
              >
                {day.date && (
                  <>
                    <View
                      style={[
                        styles.dayContent,
                        isSelected && {
                          backgroundColor: theme.colors.primary.DEFAULT,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          { color: isSelected ? '#FFFFFF' : theme.colors.text.primary },
                          !day.isCurrentMonth && { opacity: 0.3 },
                        ]}
                      >
                        {day.date.getDate()}
                      </Text>
                    </View>
                    
                    {/* Event Indicators */}
                    <View style={styles.eventIndicators}>
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <Pressable
                          key={i}
                          onPress={() => { haptics.light(); onEventPress?.(event); }}
                          style={[
                            styles.eventDot,
                            { backgroundColor: STATUS_COLORS[event.status] },
                          ]}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <Text style={[styles.moreEvents, { color: theme.colors.text.tertiary }]}>
                          +{dayEvents.length - 3}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Month Summary */}
      <Animated.View 
        entering={FadeInUp.delay(200)}
        style={[styles.summaryContainer, { backgroundColor: theme.colors.surface.primary }]}
      >
        <Text style={[styles.summaryTitle, { color: theme.colors.text.primary }]}>
          {monthName} Summary
        </Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={[styles.summaryValue, { color: theme.colors.text.primary }]}>
              {monthEvents.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.text.tertiary }]}>
              Events
            </Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {monthEvents.filter(e => e.status === 'published').length}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.text.tertiary }]}>
              Published
            </Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>
              {monthEvents.filter(e => e.status === 'ongoing').length}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.text.tertiary }]}>
              Live
            </Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={[styles.summaryValue, { color: '#8B5CF6' }]}>
              {monthEvents.reduce((sum, e) => sum + (e.participants || 0), 0)}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.text.tertiary }]}>
              Total Guests
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={[styles.legendText, { color: theme.colors.text.secondary }]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing[5],
    paddingTop: spacing[6],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 28,
    fontWeight: fontWeight.medium,
  },
  monthCenter: {
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
  },
  todayText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  viewModeTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 4,
  },
  viewModeTab: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: 8,
  },
  viewModeText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  calendarContainer: {
    margin: spacing[5],
    marginTop: 0,
    padding: spacing[4],
    borderRadius: 16,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing[3],
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
    minHeight: 60,
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
  eventIndicators: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  moreEvents: {
    fontSize: 9,
    marginLeft: 2,
  },
  summaryContainer: {
    margin: spacing[5],
    marginTop: 0,
    padding: spacing[4],
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[4],
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
  },
  summaryLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[1],
  },
  legendText: {
    fontSize: 11,
  },
});

CalendarScreen.displayName = 'CalendarScreen';

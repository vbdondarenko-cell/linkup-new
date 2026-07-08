/**
 * LinkUp Design System 2026
 * Event Preview - Preview event before publishing
 */

'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/spacing';
import type { CreateEventData } from '../flow/create-event-flow';

interface EventPreviewProps {
  data: CreateEventData;
  style?: ViewStyle;
}

export const EventPreview: React.FC<EventPreviewProps> = ({
  data,
  style,
}) => {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hour] = time.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
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
        Preview your event 👀
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        This is how your event will appear to others
      </Text>

      {/* Preview Card */}
      <Animated.View
        entering={FadeIn}
        style={[
          styles.previewCard,
          {
            backgroundColor: theme.colors.surface.primary,
            borderColor: theme.colors.border.default,
          },
        ]}
      >
        {/* Image Placeholder */}
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: theme.colors.surface.secondary },
          ]}
        >
          {data.photos?.[0] ? (
            <Text style={styles.imagePlaceholderIcon}>📸</Text>
          ) : (
            <Text style={styles.imagePlaceholderIcon}>🖼️</Text>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Category Badge */}
          {data.category && (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: theme.colors.surface.secondary },
              ]}
            >
              <Text style={styles.categoryIcon}>{data.category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {data.category.label}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text
            style={[
              styles.eventTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {data.description?.title || 'Untitled Event'}
          </Text>

          {/* Date & Time */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text
              style={[
                styles.infoText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {data.date?.start
                ? formatDate(data.date.start)
                : 'Date not set'}
              {data.time && ` • ${formatTime(data.time.startTime)}`}
            </Text>
          </View>

          {/* Location */}
          {data.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.text.secondary },
                ]}
                numberOfLines={1}
              >
                {data.location.name}
              </Text>
            </View>
          )}

          {/* Participants */}
          {data.participants && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👥</Text>
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {data.participants.min} - {data.participants.max} people
              </Text>
            </View>
          )}

          {/* Series */}
          {data.series?.isRecurring && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔄</Text>
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Recurring {data.series.frequency}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Trust Tips */}
      <View
        style={[
          styles.tipsCard,
          {
            backgroundColor: theme.colors.status.success.bg,
            borderColor: theme.colors.status.success.border,
          },
        ]}
      >
        <Text style={styles.tipsIcon}>✨</Text>
        <View style={styles.tipsContent}>
          <Text
            style={[
              styles.tipsTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Tips for more attendees
          </Text>
          <Text
            style={[
              styles.tipsItem,
              { color: theme.colors.text.secondary },
            ]}
          >
            • Add a clear, descriptive title
          </Text>
          <Text
            style={[
              styles.tipsItem,
              { color: theme.colors.text.secondary },
            ]}
          >
            • Include photos of past events
          </Text>
          <Text
            style={[
              styles.tipsItem,
              { color: theme.colors.text.secondary },
            ]}
          >
            • Set a reasonable participant limit
          </Text>
        </View>
      </View>

      {/* Organizer Preview */}
      <View
        style={[
          styles.organizerPreview,
          {
            backgroundColor: theme.colors.surface.primary,
            borderColor: theme.colors.border.default,
          },
        ]}
      >
        <Text style={styles.organizerIcon}>👤</Text>
        <View style={styles.organizerContent}>
          <Text
            style={[
              styles.organizerLabel,
              { color: theme.colors.text.tertiary },
            ]}
          >
            You'll be the organizer
          </Text>
          <Text
            style={[
              styles.organizerText,
              { color: theme.colors.text.primary },
            ]}
          >
            Your profile will be shown to attendees
          </Text>
        </View>
      </View>
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
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  imagePlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    opacity: 0.5,
  },
  content: {
    padding: spacing[4],
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
    marginBottom: spacing[2],
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  categoryText: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  infoIcon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  tipsCard: {
    flexDirection: 'row',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing[4],
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  tipsItem: {
    fontSize: 13,
    lineHeight: 20,
  },
  organizerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
  },
  organizerIcon: {
    fontSize: 32,
    marginRight: spacing[3],
  },
  organizerContent: {
    flex: 1,
  },
  organizerLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  organizerText: {
    fontSize: 14,
    marginTop: 2,
  },
});

EventPreview.displayName = 'EventPreview';

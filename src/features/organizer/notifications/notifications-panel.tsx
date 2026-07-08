/**
 * LinkUp Design System 2026
 * Organizer - Notifications Panel
 */

'use client';

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { OrganizerNotification } from '../types';

interface NotificationsPanelProps {
  notifications: OrganizerNotification[];
  onNotificationPress?: (notification: OrganizerNotification) => void;
  onMarkAllRead?: () => void;
  onSettingsPress?: () => void;
  style?: ViewStyle;
}

const NOTIFICATION_ICONS: Record<string, string> = {
  join_request: '👋',
  participant_accepted: '✅',
  participant_declined: '❌',
  event_reminder: '⏰',
  event_started: '🚀',
  event_finished: '🏁',
  statistics_ready: '📊',
};

const NOTIFICATION_COLORS: Record<string, string> = {
  join_request: '#3B82F6',
  participant_accepted: '#10B981',
  participant_declined: '#EF4444',
  event_reminder: '#F59E0B',
  event_started: '#8B5CF6',
  event_finished: '#10B981',
  statistics_ready: '#EC4899',
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onNotificationPress,
  onMarkAllRead,
  onSettingsPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [showRead, setShowRead] = useState(false);

  const filteredNotifications = useMemo(() => {
    if (showRead) return notifications;
    return notifications.filter(n => !n.read);
  }, [notifications, showRead]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleNotificationPress = (notification: OrganizerNotification) => {
    haptics.light();
    onNotificationPress?.(notification);
  };

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
                {unreadCount} unread
              </Text>
            )}
          </View>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <Pressable onPress={() => { haptics.light(); onMarkAllRead?.(); }}>
                <Text style={[styles.markReadText, { color: theme.colors.primary.DEFAULT }]}>
                  Mark all read
                </Text>
              </Pressable>
            )}
            <Pressable onPress={() => { haptics.light(); onSettingsPress?.(); }}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <Pressable
            onPress={() => { haptics.light(); setShowRead(false); }}
            style={[
              styles.filterTab,
              !showRead && { backgroundColor: theme.colors.primary.DEFAULT },
            ]}
          >
            <Text style={[
              styles.filterText,
              { color: !showRead ? '#FFFFFF' : theme.colors.text.secondary },
            ]}>
              Unread
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { haptics.light(); setShowRead(true); }}
            style={[
              styles.filterTab,
              showRead && { backgroundColor: theme.colors.primary.DEFAULT },
            ]}
          >
            <Text style={[
              styles.filterText,
              { color: showRead ? '#FFFFFF' : theme.colors.text.secondary },
            ]}>
              All
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        contentContainerStyle={styles.notificationsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {showRead ? '🔔' : '🔕'}
            </Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              {showRead ? 'No Notifications' : 'All Caught Up!'}
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              {showRead 
                ? 'Notifications will appear here'
                : "You have no unread notifications"}
            </Text>
          </Animated.View>
        ) : (
          filteredNotifications.map((notification, index) => {
            const icon = NOTIFICATION_ICONS[notification.type] || '🔔';
            const color = NOTIFICATION_COLORS[notification.type] || '#3B82F6';

            return (
              <Animated.View
                key={notification.id}
                entering={FadeInRight.delay(index * 30)}
              >
                <Pressable
                  onPress={() => handleNotificationPress(notification)}
                  style={[
                    styles.notificationCard,
                    { 
                      backgroundColor: theme.colors.surface.primary,
                      opacity: notification.read ? 0.7 : 1,
                    },
                  ]}
                >
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <View style={[styles.unreadDot, { backgroundColor: color }]} />
                  )}

                  {/* Icon */}
                  <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                    <Text style={styles.icon}>{icon}</Text>
                  </View>

                  {/* Content */}
                  <View style={styles.content}>
                    <Text style={[styles.notificationTitle, { color: theme.colors.text.primary }]}>
                      {notification.title}
                    </Text>
                    <Text 
                      style={[styles.notificationBody, { color: theme.colors.text.secondary }]}
                      numberOfLines={2}
                    >
                      {notification.body}
                    </Text>
                    <Text style={[styles.notificationTime, { color: theme.colors.text.tertiary }]}>
                      {formatTime(notification.createdAt)}
                    </Text>
                  </View>

                  {/* Arrow */}
                  <Text style={[styles.arrow, { color: theme.colors.text.tertiary }]}>›</Text>
                </Pressable>
              </Animated.View>
            );
          })
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  markReadText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  settingsIcon: {
    fontSize: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    padding: spacing[5],
    gap: spacing[3],
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[2],
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    marginLeft: spacing[3],
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  notificationBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing[1],
  },
  notificationTime: {
    fontSize: 11,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
    marginLeft: spacing[2],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[5],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

NotificationsPanel.displayName = 'NotificationsPanel';

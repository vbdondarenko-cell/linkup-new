/**
 * LinkUp Design System 2026
 * Realtime - Notification Center
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, ScrollView, Image } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, Layout } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Notification, NotificationGroup, NotificationType } from '../types';

interface NotificationCenterProps {
  groups: NotificationGroup[];
  onNotificationPress: (notification: Notification) => void;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (notificationId: string) => void;
  onBack?: () => void;
  style?: ViewStyle;
}

const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    join_request: '👋',
    request_accepted: '✅',
    request_declined: '❌',
    new_message: '💬',
    upcoming_event: '📅',
    event_reminder: '⏰',
    event_started: '🎉',
    event_finished: '🏁',
    achievement_earned: '🏆',
    badge_unlocked: '🎖️',
    level_up: '⬆️',
    trust_increased: '📈',
    organizer_promotion: '🎤',
    business_verified: '🏢',
    premium_activated: '⭐',
    reward_premium_ready: '🎁',
    system_announcement: '📢',
  };
  return icons[type] || '📢';
};

const getNotificationColor = (type: NotificationType): string => {
  const colors: Partial<Record<NotificationType, string>> = {
    join_request: '#3B82F6',
    request_accepted: '#22C55E',
    request_declined: '#EF4444',
    new_message: '#8B5CF6',
    achievement_earned: '#F59E0B',
    badge_unlocked: '#EC4899',
    level_up: '#14B8A6',
    trust_increased: '#10B981',
    premium_activated: '#FFD700',
  };
  return colors[type] || '#6B7280';
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

const NotificationCard: React.FC<{
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
}> = ({ notification, onPress, onDelete }) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const iconColor = getNotificationColor(notification.type);

  return (
    <Animated.View 
      entering={FadeInDown.springify()}
      layout={Layout.springify()}
      exiting={FadeOut.duration(200)}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.notificationCard,
          { backgroundColor: theme.colors.surface.primary },
          !notification.isRead && { borderLeftWidth: 3, borderLeftColor: theme.colors.primary.DEFAULT },
          pressed && { opacity: 0.8 },
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Text style={styles.icon}>{getNotificationIcon(notification.type)}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={[styles.body, { color: theme.colors.text.secondary }]} numberOfLines={2}>
            {notification.body}
          </Text>
          <Text style={[styles.time, { color: theme.colors.text.tertiary }]}>
            {formatTime(notification.createdAt)}
          </Text>
        </View>

        {/* Unread Indicator */}
        {!notification.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary.DEFAULT }]} />
        )}

        {/* Delete Button */}
        <Pressable
          onPress={() => { haptics.light(); onDelete(); }}
          style={styles.deleteButton}
        >
          <Text style={[styles.deleteIcon, { color: theme.colors.text.tertiary }]}>✕</Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  groups,
  onNotificationPress,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onBack,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  
  const totalUnread = groups.reduce((acc, group) => 
    acc + group.data.filter(n => !n.isRead).length, 0
  );

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        {onBack && (
          <Pressable onPress={() => { haptics.light(); onBack?.(); }} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: theme.colors.text.primary }]}>←</Text>
          </Pressable>
        )}
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Notifications
          </Text>
          {totalUnread > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary.DEFAULT }]}>
              <Text style={styles.badgeText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        {totalUnread > 0 && (
          <Pressable onPress={() => { haptics.light(); onMarkAllAsRead(); }}>
            <Text style={[styles.markAllText, { color: theme.colors.primary.DEFAULT }]}>
              Mark all read
            </Text>
          </Pressable>
        )}
      </View>

      {/* Notifications */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
              No notifications
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.text.tertiary }]}>
              You're all caught up!
            </Text>
          </View>
        ) : (
          groups.map((group, groupIndex) => (
            <View key={group.title}>
              {/* Group Header */}
              <Text style={[styles.groupHeader, { color: theme.colors.text.tertiary }]}>
                {group.title}
              </Text>

              {/* Group Notifications */}
              {group.data.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onPress={() => {
                    haptics.light();
                    onMarkAsRead(notification.id);
                    onNotificationPress(notification);
                  }}
                  onDelete={() => onDelete(notification.id)}
                />
              ))}
            </View>
          ))
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
    marginRight: spacing[2],
  },
  backIcon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
  },
  badge: {
    marginLeft: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  groupHeader: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing[4],
    marginBottom: spacing[2],
    marginHorizontal: spacing[5],
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[4],
    marginHorizontal: spacing[5],
    marginBottom: spacing[2],
    borderRadius: 16,
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing[2],
    marginTop: 6,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[1],
  },
  deleteIcon: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[8],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing[3],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  emptyText: {
    fontSize: 14,
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

NotificationCenter.displayName = 'NotificationCenter';

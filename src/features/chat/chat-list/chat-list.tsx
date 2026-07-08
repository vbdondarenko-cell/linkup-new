/**
 * LinkUp Design System 2026
 * Chat List - Premium conversation list
 */

'use client';

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
export type ChatStatus = 'upcoming' | 'active' | 'countdown' | 'expired' | 'deleted';

export interface ChatItem {
  id: string;
  eventId: string;
  eventName: string;
  eventImage?: string;
  organizerName: string;
  organizerAvatar?: string;
  participantCount: number;
  lastMessage?: {
    text: string;
    senderName: string;
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount: number;
  status: ChatStatus;
  countdownEndsAt?: Date;
  eventStartsAt?: Date;
  eventEndsAt?: Date;
  distance?: string;
}

interface ChatListProps {
  chats: ChatItem[];
  onChatPress?: (chatId: string) => void;
  onEventPress?: (eventId: string) => void;
  onOrganizerPress?: (organizerId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  style?: ViewStyle;
}

// Format countdown time
const formatCountdown = (endsAt: Date): string => {
  const now = new Date();
  const diff = endsAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Format relative time
const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Status Badge Component
interface StatusBadgeProps {
  status: ChatStatus;
  countdown?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, countdown }) => {
  const theme = useTheme();
  
  const config = useMemo(() => {
    switch (status) {
      case 'upcoming':
        return { label: 'Upcoming', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'active':
        return { label: 'Active', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'countdown':
        return { label: countdown || 'Ending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'expired':
        return { label: 'Expired', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' };
      case 'deleted':
        return { label: 'Deleted', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default:
        return { label: '', color: '', bg: '' };
    }
  }, [status, countdown]);
  
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

// Chat Item Component
interface ChatItemProps {
  chat: ChatItem;
  onPress?: () => void;
  onEventPress?: () => void;
  onOrganizerPress?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  onPress,
  onEventPress,
  onOrganizerPress,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);
  
  const countdown = chat.countdownEndsAt ? formatCountdown(chat.countdownEndsAt) : undefined;
  
  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  const handlePress = () => {
    haptics.light();
    onPress?.();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const isExpired = chat.status === 'expired' || chat.status === 'deleted';
  
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.chatItem,
        {
          backgroundColor: theme.colors.surface.primary,
          opacity: isExpired ? 0.6 : 1,
        },
        animatedStyle,
      ]}
    >
      {/* Event Image */}
      <Pressable onPress={onEventPress} style={styles.imageContainer}>
        {chat.eventImage ? (
          <Image
            source={{ uri: chat.eventImage }}
            style={styles.eventImage}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surface.secondary }]}>
            <Text style={styles.placeholderIcon}>📅</Text>
          </View>
        )}
        
        {/* Participant Count */}
        <View style={[styles.participantBadge, { backgroundColor: theme.colors.interactive.primary }]}>
          <Text style={styles.participantCount}>{chat.participantCount}</Text>
        </View>
      </Pressable>
      
      {/* Content */}
      <View style={styles.content}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.eventName,
              { color: theme.colors.text.primary },
            ]}
            numberOfLines={1}
          >
            {chat.eventName}
          </Text>
          {chat.lastMessage && (
            <Text
              style={[
                styles.timestamp,
                { color: theme.colors.text.tertiary },
              ]}
            >
              {formatTime(chat.lastMessage.timestamp)}
            </Text>
          )}
        </View>
        
        {/* Organizer Row */}
        <Pressable onPress={onOrganizerPress} style={styles.organizerRow}>
          <Avatar
            src={chat.organizerAvatar}
            name={chat.organizerName}
            size="xs"
          />
          <Text
            style={[
              styles.organizerName,
              { color: theme.colors.text.secondary },
            ]}
            numberOfLines={1}
          >
            {chat.organizerName}
          </Text>
        </Pressable>
        
        {/* Message Row */}
        <View style={styles.messageRow}>
          {chat.lastMessage ? (
            <Text
              style={[
                styles.lastMessage,
                {
                  color: chat.lastMessage.isRead
                    ? theme.colors.text.tertiary
                    : theme.colors.text.primary,
                  fontWeight: chat.lastMessage.isRead ? 'normal' : '500',
                },
              ]}
              numberOfLines={1}
            >
              <Text style={styles.senderName}>{chat.lastMessage.senderName}: </Text>
              {chat.lastMessage.text}
            </Text>
          ) : (
            <Text
              style={[
                styles.noMessages,
                { color: theme.colors.text.tertiary },
              ]}
            >
              No messages yet
            </Text>
          )}
          
          {/* Unread Badge */}
          {chat.unreadCount > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: theme.colors.interactive.primary },
              ]}
            >
              <Text style={styles.unreadCount}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
        
        {/* Status Row */}
        <View style={styles.statusRow}>
          <StatusBadge status={chat.status} countdown={countdown} />
          {chat.distance && (
            <Text
              style={[
                styles.distance,
                { color: theme.colors.text.tertiary },
              ]}
            >
              📍 {chat.distance}
            </Text>
          )}
          {chat.eventStartsAt && (
            <Text
              style={[
                styles.eventTime,
                { color: theme.colors.text.tertiary },
              ]}
            >
              🕐 {chat.eventStartsAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

// Main Chat List Component
export const ChatList: React.FC<ChatListProps> = ({
  chats,
  onChatPress,
  onEventPress,
  onOrganizerPress,
  onDeleteChat,
  style,
}) => {
  const theme = useTheme();
  
  const renderItem = useCallback(
    ({ item, index }: { item: ChatItem; index: number }) => (
      <Animated.View entering={FadeIn.delay(index * 50)}>
        <ChatItem
          chat={item}
          onPress={() => onChatPress?.(item.id)}
          onEventPress={() => onEventPress?.(item.eventId)}
          onOrganizerPress={() => onOrganizerPress?.(item.eventId)}
        />
      </Animated.View>
    ),
    [onChatPress, onEventPress, onOrganizerPress]
  );
  
  const renderSeparator = () => (
    <View
      style={[
        styles.separator,
        { backgroundColor: theme.colors.border.default },
      ]}
    />
  );
  
  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing[2],
  },
  chatItem: {
    flexDirection: 'row',
    padding: spacing[4],
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing[3],
  },
  eventImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  participantBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  participantCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing[2],
  },
  timestamp: {
    fontSize: 12,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  organizerName: {
    fontSize: 13,
    marginLeft: spacing[1],
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
  },
  senderName: {
    fontWeight: '500',
  },
  noMessages: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: spacing[2],
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  distance: {
    fontSize: 12,
  },
  eventTime: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginLeft: spacing[4] + 56 + spacing[3],
  },
});

ChatList.displayName = 'ChatList';

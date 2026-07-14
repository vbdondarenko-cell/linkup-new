/**
 * LinkUp Design System 2026
 * Chat List - Premium conversation list as Event Cards
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
  Layout,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

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
  category?: string;
  categoryIcon?: string;
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

// Format event time
const formatEventTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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

// Event Card Style Chat Item
const EventCardChatItem: React.FC<ChatItemProps> = ({
  chat,
  onPress,
  onEventPress,
  onOrganizerPress,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);
  
  const countdown = chat.countdownEndsAt ? formatCountdown(chat.countdownEndsAt) : undefined;
  const isExpired = chat.status === 'expired' || chat.status === 'deleted';
  
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
  
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      layout={Layout.springify()}
      style={[
        styles.eventCard,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: theme.colors.border.default,
          opacity: isExpired ? 0.6 : 1,
        },
        animatedStyle,
      ]}
    >
      {/* Hero Image */}
      <Pressable onPress={onEventPress}>
        <View style={styles.heroImageContainer}>
          {chat.eventImage ? (
            <Image
              source={{ uri: chat.eventImage }}
              style={styles.heroImage}
            />
          ) : (
            <View style={[styles.heroImagePlaceholder, { backgroundColor: theme.colors.surface.secondary }]}>
              <Text style={styles.heroPlaceholderIcon}>📅</Text>
            </View>
          )}
          
          {/* Category Badge */}
          {chat.categoryIcon && (
            <View style={[styles.categoryBadge, { backgroundColor: theme.colors.surface.primary }]}>
              <Text style={styles.categoryIcon}>{chat.categoryIcon}</Text>
              <Text style={[styles.categoryText, { color: theme.colors.text.secondary }]}>
                {chat.category}
              </Text>
            </View>
          )}
          
          {/* Status Badge */}
          <View style={styles.statusBadgeContainer}>
            <StatusBadge status={chat.status} countdown={countdown} />
          </View>
        </View>
      </Pressable>
      
      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Title */}
        <Text
          style={[styles.cardTitle, { color: theme.colors.text.primary }]}
          numberOfLines={1}
        >
          {chat.eventName}
        </Text>
        
        {/* Event Info Row */}
        <View style={styles.eventInfoRow}>
          {chat.eventStartsAt && (
            <View style={styles.eventInfoItem}>
              <Text style={styles.eventInfoIcon}>🕐</Text>
              <Text style={[styles.eventInfoText, { color: theme.colors.text.secondary }]}>
                {formatEventTime(chat.eventStartsAt)}
              </Text>
            </View>
          )}
          {chat.distance && (
            <View style={styles.eventInfoItem}>
              <Text style={styles.eventInfoIcon}>📍</Text>
              <Text style={[styles.eventInfoText, { color: theme.colors.text.secondary }]}>
                {chat.distance}
              </Text>
            </View>
          )}
          <View style={styles.eventInfoItem}>
            <Text style={styles.eventInfoIcon}>👥</Text>
            <Text style={[styles.eventInfoText, { color: theme.colors.text.secondary }]}>
              {chat.participantCount}
            </Text>
          </View>
        </View>
        
        {/* Organizer */}
        <Pressable onPress={onOrganizerPress} style={styles.organizerRow}>
          <Text style={styles.organizerIcon}>👤</Text>
          <Text
            style={[styles.organizerName, { color: theme.colors.text.tertiary }]}
            numberOfLines={1}
          >
            {chat.organizerName}
          </Text>
        </Pressable>
        
        {/* Message Preview */}
        <View style={[styles.messagePreview, { borderTopColor: theme.colors.border.default }]}>
          {chat.lastMessage ? (
            <View style={styles.messageContent}>
              <Text style={styles.messageSender}>{chat.lastMessage.senderName}</Text>
              <Text
                style={[
                  styles.messageText,
                  {
                    color: chat.lastMessage.isRead
                      ? theme.colors.text.tertiary
                      : theme.colors.text.primary,
                  },
                ]}
                numberOfLines={1}
              >
                {chat.lastMessage.text}
              </Text>
            </View>
          ) : (
            <Text style={[styles.noMessages, { color: theme.colors.text.tertiary }]}>
              No messages yet - start the conversation!
            </Text>
          )}
          
          {/* Unread Badge */}
          {chat.unreadCount > 0 && (
            <View
              style={[styles.unreadBadge, { backgroundColor: theme.colors.interactive.primary }]}
            >
              <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

// Alias for compatibility
const ChatItem = EventCardChatItem;

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
  // Event Card Styles
  eventCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  heroImageContainer: {
    position: 'relative',
    height: 120,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderIcon: {
    fontSize: 40,
    opacity: 0.5,
  },
  cardContent: {
    padding: spacing[3],
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  eventInfoRow: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[2],
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventInfoIcon: {
    fontSize: 13,
    marginRight: spacing[1],
  },
  eventInfoText: {
    fontSize: 13,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[3],
    marginTop: spacing[2],
    borderTopWidth: 1,
  },
  messageContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageSender: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: spacing[1],
  },
  messageText: {
    flex: 1,
    fontSize: 14,
  },
  noMessages: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  categoryText: {
    fontSize: 12,
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
  },
});

ChatList.displayName = 'ChatList';

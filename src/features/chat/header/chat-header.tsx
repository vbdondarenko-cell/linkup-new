/**
 * LinkUp Design System 2026
 * Chat Header - Conversation header with event info
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { CompactCountdown } from '../countdown/countdown';
import { ActionSheet } from '../../../ui/navigation/modals/modals';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ChatStatus = 'upcoming' | 'active' | 'countdown' | 'expired' | 'deleted';

interface ChatHeaderProps {
  eventName: string;
  eventImage?: string;
  participantCount?: number;
  organizerName?: string;
  organizerAvatar?: string;
  status: ChatStatus;
  countdownEndsAt?: Date;
  onBack: () => void;
  onViewEvent?: () => void;
  onViewOrganizer?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onLeaveChat?: () => void;
  style?: ViewStyle;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  eventName,
  eventImage,
  participantCount,
  organizerName,
  organizerAvatar,
  status,
  countdownEndsAt,
  onBack,
  onViewEvent,
  onViewOrganizer,
  onReport,
  onBlock,
  onLeaveChat,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  
  const [showActionSheet, setShowActionSheet] = useState(false);
  const backScale = useSharedValue(1);
  
  // Calculate countdown
  const countdown = countdownEndsAt
    ? {
        hours: Math.floor(
          (countdownEndsAt.getTime() - Date.now()) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          ((countdownEndsAt.getTime() - Date.now()) % (1000 * 60 * 60)) /
            (1000 * 60)
        ),
      }
    : null;
  
  const handleBack = useCallback(() => {
    haptics.light();
    backScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      backScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
    onBack();
  }, [haptics, backScale, onBack]);
  
  const handleMore = useCallback(() => {
    haptics.light();
    setShowActionSheet(true);
  }, [haptics]);
  
  const handleViewEvent = useCallback(() => {
    setShowActionSheet(false);
    onViewEvent?.();
  }, [onViewEvent]);
  
  const handleViewOrganizer = useCallback(() => {
    setShowActionSheet(false);
    onViewOrganizer?.();
  }, [onViewOrganizer]);
  
  const handleReport = useCallback(() => {
    setShowActionSheet(false);
    onReport?.();
  }, [onReport]);
  
  const handleBlock = useCallback(() => {
    setShowActionSheet(false);
    onBlock?.();
  }, [onBlock]);
  
  const handleLeaveChat = useCallback(() => {
    setShowActionSheet(false);
    haptics.warning?.();
    onLeaveChat?.();
  }, [haptics, onLeaveChat]);
  
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));
  
  // Action sheet options
  const actionSheetOptions = [
    { label: 'View Event', icon: '📅', onPress: handleViewEvent },
    ...(organizerName ? [{ label: 'View Organizer', icon: '👤', onPress: handleViewOrganizer }] : []),
    { label: 'Report', icon: '🚩', onPress: handleReport, destructive: true },
    { label: 'Block User', icon: '🚫', onPress: handleBlock, destructive: true },
    { label: 'Leave Chat', icon: '👋', onPress: handleLeaveChat, destructive: true },
  ];
  
  // Get status badge config
  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return { label: 'Upcoming', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'active':
        return { label: 'Active', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'countdown':
        return { label: 'Ending Soon', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'expired':
        return { label: 'Expired', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' };
      case 'deleted':
        return { label: 'Deleted', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default:
        return null;
    }
  };
  
  const statusBadge = getStatusBadge();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderBottomColor: theme.colors.border.default,
        },
        style,
      ]}
    >
      {/* Main Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <AnimatedPressable
          onPress={handleBack}
          style={[styles.backButton, backAnimatedStyle]}
        >
          <Text style={[styles.backIcon, { color: theme.colors.text.primary }]}>
            ←
          </Text>
        </AnimatedPressable>
        
        {/* Event Info */}
        <Pressable onPress={onViewEvent} style={styles.eventInfo}>
          {/* Event Image */}
          {eventImage ? (
            <Image source={{ uri: eventImage }} style={styles.eventImage} />
          ) : (
            <View
              style={[
                styles.eventImagePlaceholder,
                { backgroundColor: theme.colors.surface.secondary },
              ]}
            >
              <Text style={styles.eventImageIcon}>📅</Text>
            </View>
          )}
          
          {/* Text Info */}
          <View style={styles.textInfo}>
            <Text
              style={[styles.eventName, { color: theme.colors.text.primary }]}
              numberOfLines={1}
            >
              {eventName}
            </Text>
            
            {/* Subtitle Row */}
            <View style={styles.subtitleRow}>
              {participantCount !== undefined && (
                <Text
                  style={[
                    styles.participantCount,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  👥 {participantCount}
                </Text>
              )}
              {organizerName && (
                <Text
                  style={[
                    styles.organizerName,
                    { color: theme.colors.text.tertiary },
                  ]}
                  numberOfLines={1}
                >
                  • {organizerName}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
        
        {/* More Button */}
        <Pressable onPress={handleMore} style={styles.moreButton}>
          <Text style={styles.moreIcon}>•••</Text>
        </Pressable>
      </View>
      
      {/* Status Row */}
      <View style={styles.statusRow}>
        {statusBadge && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusBadge.bg },
            ]}
          >
            <Text style={[styles.statusText, { color: statusBadge.color }]}>
              {statusBadge.label}
            </Text>
          </View>
        )}
        
        {status === 'countdown' && countdown && (
          <CompactCountdown
            hours={countdown.hours}
            minutes={countdown.minutes}
          />
        )}
      </View>
      
      {/* Action Sheet */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="Chat Options"
        options={actionSheetOptions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingTop: spacing[2],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  eventInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  eventImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  eventImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventImageIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  textInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  eventName: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  participantCount: {
    fontSize: 13,
  },
  organizerName: {
    fontSize: 13,
    flex: 1,
    marginLeft: spacing[1],
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreIcon: {
    fontSize: 18,
    color: '#666',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[2],
    gap: spacing[2],
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

ChatHeader.displayName = 'ChatHeader';

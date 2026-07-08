/**
 * LinkUp Design System 2026
 * System Message - Automatic system notifications
 */

'use client';

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

export type SystemMessageType =
  | 'user_joined'
  | 'user_left'
  | 'request_accepted'
  | 'event_starts_soon'
  | 'event_started'
  | 'event_finished'
  | 'chat_countdown_started'
  | 'chat_expiring'
  | 'chat_deleted'
  | 'organizer_message';

export interface SystemMessage {
  id: string;
  type: SystemMessageType;
  userName?: string;
  userAvatar?: string;
  eventName?: string;
  countdownHours?: number;
  timestamp: Date;
  customText?: string;
}

interface SystemMessageComponentProps {
  message: SystemMessage;
  style?: ViewStyle;
}

// Get system message config
const getMessageConfig = (message: SystemMessage) => {
  const { type, userName, eventName, countdownHours, customText } = message;
  
  switch (type) {
    case 'user_joined':
      return {
        icon: '👋',
        text: `${userName} joined the chat`,
        variant: 'info' as const,
      };
    
    case 'user_left':
      return {
        icon: '👋',
        text: `${userName} left the chat`,
        variant: 'info' as const,
      };
    
    case 'request_accepted':
      return {
        icon: '✅',
        text: `${userName}'s request was accepted`,
        variant: 'success' as const,
      };
    
    case 'event_starts_soon':
      return {
        icon: '⏰',
        text: `Event "${eventName}" starts in 1 hour`,
        variant: 'warning' as const,
      };
    
    case 'event_started':
      return {
        icon: '🎉',
        text: `Event "${eventName}" has started!`,
        variant: 'success' as const,
      };
    
    case 'event_finished':
      return {
        icon: '✓',
        text: `Event "${eventName}" has finished`,
        variant: 'info' as const,
      };
    
    case 'chat_countdown_started':
      return {
        icon: '⏳',
        text: `Event ended. Chat will be deleted in ${countdownHours || 6} hours`,
        variant: 'warning' as const,
      };
    
    case 'chat_expiring':
      return {
        icon: '⏰',
        text: `Chat will be deleted in ${countdownHours || 0} hours`,
        variant: 'warning' as const,
      };
    
    case 'chat_deleted':
      return {
        icon: '🗑️',
        text: 'This chat has been deleted',
        variant: 'danger' as const,
      };
    
    case 'organizer_message':
      return {
        icon: '📢',
        text: customText || 'Message from the organizer',
        variant: 'organizer' as const,
      };
    
    default:
      return {
        icon: 'ℹ️',
        text: customText || 'System message',
        variant: 'info' as const,
      };
  }
};

const SystemMessageComponent: React.FC<SystemMessageComponentProps> = ({
  message,
  style,
}) => {
  const theme = useTheme();
  
  const config = useMemo(() => getMessageConfig(message), [message]);
  
  const variantStyles = useMemo(() => {
    switch (config.variant) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: theme.colors.text.primary,
          icon: config.icon,
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.3)',
          text: theme.colors.text.primary,
          icon: config.icon,
        };
      case 'danger':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: theme.colors.text.primary,
          icon: config.icon,
        };
      case 'organizer':
        return {
          bg: 'rgba(168, 85, 247, 0.1)',
          border: 'rgba(168, 85, 247, 0.3)',
          text: theme.colors.text.primary,
          icon: config.icon,
        };
      case 'info':
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          border: 'rgba(107, 114, 128, 0.2)',
          text: theme.colors.text.secondary,
          icon: config.icon,
        };
    }
  }, [config, theme]);
  
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
        },
        style,
      ]}
    >
      <Text style={styles.icon}>{variantStyles.icon}</Text>
      <Text
        style={[
          styles.text,
          { color: variantStyles.text },
        ]}
      >
        {config.text}
      </Text>
    </Animated.View>
  );
};

// System Message with countdown progress
interface CountdownSystemMessageProps {
  hoursRemaining: number;
  totalHours: number;
  style?: ViewStyle;
}

export const CountdownSystemMessage: React.FC<CountdownSystemMessageProps> = ({
  hoursRemaining,
  totalHours,
  style,
}) => {
  const theme = useTheme();
  
  const progress = (hoursRemaining / totalHours) * 100;
  
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[
        styles.countdownContainer,
        {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
        },
        style,
      ]}
    >
      <View style={styles.countdownHeader}>
        <Text style={styles.countdownIcon}>⏳</Text>
        <Text
          style={[
            styles.countdownTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Chat ending soon
        </Text>
      </View>
      
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor: '#F59E0B',
            },
          ]}
        />
      </View>
      
      <Text
        style={[
          styles.countdownText,
          { color: theme.colors.text.secondary },
        ]}
      >
        {hoursRemaining > 0
          ? `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} remaining`
          : 'Deleting...'}
      </Text>
    </Animated.View>
  );
};

// Countdown Banner (persistent header)
interface CountdownBannerProps {
  hours: number;
  minutes: number;
  style?: ViewStyle;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  hours,
  minutes,
  style,
}) => {
  const theme = useTheme();
  
  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
        },
        style,
      ]}
    >
      <Text style={styles.bannerIcon}>⏳</Text>
      <Text style={styles.bannerText}>
        Chat deletes in{' '}
        <Text style={styles.bannerHighlight}>
          {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
        </Text>
      </Text>
    </View>
  );
};

// Chat Expired State
interface ChatExpiredStateProps {
  eventName: string;
  onViewEvent?: () => void;
  onExploreEvents?: () => void;
  style?: ViewStyle;
}

export const ChatExpiredState: React.FC<ChatExpiredStateProps> = ({
  eventName,
  onViewEvent,
  onExploreEvents,
  style,
}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.expiredContainer, style]}>
      <Text style={styles.expiredIcon}>🗑️</Text>
      <Text
        style={[
          styles.expiredTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Chat Expired
      </Text>
      <Text
        style={[
          styles.expiredDescription,
          { color: theme.colors.text.secondary },
        ]}
      >
        This chat for "{eventName}" has been automatically deleted as per LinkUp's temporary chat policy.
      </Text>
      
      <View style={styles.expiredActions}>
        <Animated.View style={styles.actionButton}>
          <Text
            style={[
              styles.actionText,
              { color: theme.colors.interactive.primary },
            ]}
            onPress={onViewEvent}
          >
            View Event
          </Text>
        </Animated.View>
        <Animated.View style={styles.actionButton}>
          <Text
            style={[
              styles.actionText,
              { color: theme.colors.interactive.primary },
            ]}
            onPress={onExploreEvents}
          >
            Explore Events
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: spacing[1],
    alignSelf: 'center',
    maxWidth: '90%',
  },
  icon: {
    fontSize: 14,
    marginRight: spacing[2],
  },
  text: {
    fontSize: 13,
    flex: 1,
  },
  countdownContainer: {
    padding: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: spacing[2],
    alignSelf: 'center',
    maxWidth: '90%',
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  countdownIcon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  countdownTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  countdownText: {
    fontSize: 12,
    textAlign: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
  },
  bannerIcon: {
    fontSize: 14,
    marginRight: spacing[2],
  },
  bannerText: {
    fontSize: 13,
    color: '#92400E',
  },
  bannerHighlight: {
    fontWeight: '600',
  },
  expiredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  expiredIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  expiredTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  expiredDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing[6],
  },
  expiredActions: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  actionButton: {
    padding: spacing[2],
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

SystemMessageComponent.displayName = 'SystemMessageComponent';
CountdownSystemMessage.displayName = 'CountdownSystemMessage';
CountdownBanner.displayName = 'CountdownBanner';
ChatExpiredState.displayName = 'ChatExpiredState';

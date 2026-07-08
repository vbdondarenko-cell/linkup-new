/**
 * LinkUp Design System 2026
 * Chat Empty States - No content scenarios
 */

'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';

// Base Empty State
interface ChatEmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      <Text style={styles.icon}>{icon}</Text>

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          style={[
            styles.description,
            { color: theme.colors.text.secondary },
          ]}
        >
          {description}
        </Text>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <View style={styles.actions}>
          {primaryAction && (
            <Button
              variant="primary"
              onPress={primaryAction.onPress}
              style={styles.primaryAction}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="tertiary"
              onPress={secondaryAction.onPress}
              style={styles.secondaryAction}
            >
              {secondaryAction.label}
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

// No Chats
interface NoChatsEmptyProps {
  onExploreEvents?: () => void;
  style?: ViewStyle;
}

export const NoChatsEmpty: React.FC<NoChatsEmptyProps> = ({
  onExploreEvents,
  style,
}) => {
  return (
    <ChatEmptyState
      icon="💬"
      title="No chats yet"
      description="When you join an event, you'll be able to chat with other participants here."
      primaryAction={
        onExploreEvents
          ? { label: 'Explore Events', onPress: onExploreEvents }
          : undefined
      }
      style={style}
    />
  );
};

// Waiting for Acceptance
interface WaitingAcceptanceEmptyProps {
  eventName?: string;
  onViewEvent?: () => void;
  style?: ViewStyle;
}

export const WaitingAcceptanceEmpty: React.FC<WaitingAcceptanceEmptyProps> = ({
  eventName,
  onViewEvent,
  style,
}) => {
  return (
    <ChatEmptyState
      icon="⏳"
      title="Waiting for acceptance"
      description={`Your request to join ${
        eventName || 'this event'
      } is still being reviewed. You'll be notified when accepted.`}
      primaryAction={
        onViewEvent
          ? { label: 'View Event', onPress: onViewEvent }
          : undefined
      }
      style={style}
    />
  );
};

// Chat Expired
interface ChatExpiredEmptyProps {
  onExploreEvents?: () => void;
  style?: ViewStyle;
}

export const ChatExpiredEmpty: React.FC<ChatExpiredEmptyProps> = ({
  onExploreEvents,
  style,
}) => {
  return (
    <ChatEmptyState
      icon="🗑️"
      title="Chat expired"
      description="This chat has been automatically deleted. All temporary chats expire 6 hours after the event ends."
      primaryAction={
        onExploreEvents
          ? { label: 'Find New Events', onPress: onExploreEvents }
          : undefined
      }
      style={style}
    />
  );
};

// Chat Deleted
interface ChatDeletedEmptyProps {
  onExploreEvents?: () => void;
  style?: ViewStyle;
}

export const ChatDeletedEmpty: React.FC<ChatDeletedEmptyProps> = ({
  onExploreEvents,
  style,
}) => {
  return (
    <ChatEmptyState
      icon="✓"
      title="Chat deleted"
      description="This conversation has been removed."
      primaryAction={
        onExploreEvents
          ? { label: 'Explore Events', onPress: onExploreEvents }
          : undefined
      }
      style={style}
    />
  );
};

// Offline
interface OfflineEmptyProps {
  onRetry?: () => void;
  style?: ViewStyle;
}

export const OfflineEmpty: React.FC<OfflineEmptyProps> = ({
  onRetry,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      <Text style={styles.icon}>📡</Text>

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        You're offline
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.description,
          { color: theme.colors.text.secondary },
        ]}
      >
        Check your internet connection and try again. Cached messages are still available.
      </Text>

      {/* Retry Button */}
      {onRetry && (
        <Button
          variant="primary"
          onPress={onRetry}
          style={styles.retryButton}
        >
          Try Again
        </Button>
      )}
    </View>
  );
};

// Loading
interface ChatLoadingProps {
  style?: ViewStyle;
}

export const ChatLoading: React.FC<ChatLoadingProps> = ({ style }) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, styles.loadingContainer, style]}>
      {/* Pulsing dots */}
      <View style={styles.loadingDots}>
        <View
          style={[
            styles.loadingDot,
            { backgroundColor: theme.colors.interactive.primary },
          ]}
        />
        <View
          style={[
            styles.loadingDot,
            { backgroundColor: theme.colors.interactive.primary },
          ]}
        />
        <View
          style={[
            styles.loadingDot,
            { backgroundColor: theme.colors.interactive.primary },
          ]}
        />
      </View>
      <Text
        style={[
          styles.loadingText,
          { color: theme.colors.text.secondary },
        ]}
      >
        Loading conversation...
      </Text>
    </View>
  );
};

// Error
interface ChatErrorProps {
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  style?: ViewStyle;
}

export const ChatError: React.FC<ChatErrorProps> = ({
  message = 'Something went wrong',
  onRetry,
  onBack,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      <Text style={styles.icon}>⚠️</Text>

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        {message}
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.description,
          { color: theme.colors.text.secondary },
        ]}
      >
        We couldn't load this conversation. Please try again.
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        {onBack && (
          <Button
            variant="tertiary"
            onPress={onBack}
            style={styles.secondaryAction}
          >
            Go Back
          </Button>
        )}
        {onRetry && (
          <Button
            variant="primary"
            onPress={onRetry}
            style={styles.primaryAction}
          >
            Try Again
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  title: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing[6],
    maxWidth: 280,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  primaryAction: {
    minWidth: 140,
  },
  secondaryAction: {},
  retryButton: {
    minWidth: 120,
  },
  loadingContainer: {
    backgroundColor: 'transparent',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
  loadingText: {
    fontSize: 14,
  },
});

ChatEmptyState.displayName = 'ChatEmptyState';
NoChatsEmpty.displayName = 'NoChatsEmpty';
WaitingAcceptanceEmpty.displayName = 'WaitingAcceptanceEmpty';
ChatExpiredEmpty.displayName = 'ChatExpiredEmpty';
ChatDeletedEmpty.displayName = 'ChatDeletedEmpty';
OfflineEmpty.displayName = 'OfflineEmpty';
ChatLoading.displayName = 'ChatLoading';
ChatError.displayName = 'ChatError';

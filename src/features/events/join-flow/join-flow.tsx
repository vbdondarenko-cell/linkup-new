/**
 * LinkUp Design System 2026
 * Join Flow - Complete event join experience
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { LinearProgress } from '../../../ui/components/progress';

export type JoinState =
  | 'available'
  | 'loading'
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'full'
  | 'cancelled'
  | 'already_joined';

interface JoinFlowProps {
  state: JoinState;
  eventTitle?: string;
  spotsLeft?: number;
  estimatedWaitTime?: string;
  onJoin: () => void;
  onCancel: () => void;
  onViewChat?: () => void;
  onExploreSimilar?: () => void;
  onReturnToMap?: () => void;
  style?: ViewStyle;
}

// Main Join Button Component
interface JoinButtonProps {
  state: JoinState;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const JoinButton: React.FC<JoinButtonProps> = ({
  state,
  onPress,
  disabled = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);
  const loadingRotation = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    if (state === 'available' || state === 'already_joined') {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    }
  }, [scale, state]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (state === 'available') {
      haptics.medium();
    } else if (state === 'pending') {
      haptics.light();
    }
    onPress();
  }, [haptics, state, onPress]);

  React.useEffect(() => {
    if (state === 'loading') {
      loadingRotation.value = withTiming(360, { duration: 1000 });
      const interval = setInterval(() => {
        loadingRotation.value = 0;
        loadingRotation.value = withTiming(360, { duration: 1000 });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state, loadingRotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getButtonConfig = () => {
    switch (state) {
      case 'loading':
        return {
          label: '',
          icon: '⏳',
          variant: 'primary' as const,
          disabled: true,
        };
      case 'pending':
        return {
          label: 'Pending...',
          icon: '⏳',
          variant: 'secondary' as const,
          disabled: true,
        };
      case 'accepted':
        return {
          label: '✓ Joined',
          icon: '✓',
          variant: 'success' as const,
          disabled: true,
        };
      case 'declined':
        return {
          label: 'Request Declined',
          icon: '✕',
          variant: 'tertiary' as const,
          disabled: true,
        };
      case 'full':
        return {
          label: 'Event Full',
          icon: '👥',
          variant: 'tertiary' as const,
          disabled: true,
        };
      case 'cancelled':
        return {
          label: 'Event Cancelled',
          icon: '✕',
          variant: 'destructive' as const,
          disabled: true,
        };
      case 'already_joined':
        return {
          label: '✓ Already Joined',
          icon: '✓',
          variant: 'success' as const,
          disabled: true,
        };
      case 'available':
      default:
        return {
          label: 'Join Event',
          icon: '→',
          variant: 'primary' as const,
          disabled: false,
        };
    }
  };

  const config = getButtonConfig();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || config.disabled}
      style={[
        styles.joinButton,
        {
          backgroundColor:
            config.variant === 'primary'
              ? theme.colors.interactive.primary
              : config.variant === 'success'
              ? theme.colors.status.success.DEFAULT
              : config.variant === 'destructive'
              ? theme.colors.status.danger.DEFAULT
              : theme.colors.surface.secondary,
          opacity: config.disabled ? 0.7 : 1,
        },
        animatedStyle,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={config.label}
      accessibilityState={{ disabled: config.disabled }}
    >
      <Text
        style={[
          styles.joinButtonIcon,
          { color: config.variant === 'primary' || config.variant === 'success' ? '#FFFFFF' : theme.colors.text.primary },
        ]}
      >
        {config.icon}
      </Text>
      <Text
        style={[
          styles.joinButtonLabel,
          { color: config.variant === 'primary' || config.variant === 'success' ? '#FFFFFF' : theme.colors.text.primary },
        ]}
      >
        {config.label}
      </Text>
    </AnimatedPressable>
  );
};

// Pending State Screen
interface PendingStateProps {
  eventTitle: string;
  estimatedWaitTime?: string;
  onCancel: () => void;
  style?: ViewStyle;
}

export const PendingState: React.FC<PendingStateProps> = ({
  eventTitle,
  estimatedWaitTime,
  onCancel,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleCancel = () => {
    haptics.light();
    onCancel();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.pendingContainer,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
        },
        style,
      ]}
    >
      {/* Icon */}
      <Text style={styles.pendingIcon}>⏳</Text>

      {/* Title */}
      <Text
        style={[
          styles.pendingTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Request Pending
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.pendingDescription,
          { color: theme.colors.text.secondary },
        ]}
      >
        Your request to join "{eventTitle}" is being reviewed by the organizer.
      </Text>

      {/* Wait Time */}
      {estimatedWaitTime && (
        <View style={styles.waitTimeContainer}>
          <Text
            style={[
              styles.waitTimeLabel,
              { color: theme.colors.text.tertiary },
            ]}
          >
            Estimated response time
          </Text>
          <Text
            style={[
              styles.waitTime,
              { color: theme.colors.interactive.primary },
            ]}
          >
            {estimatedWaitTime}
          </Text>
        </View>
      )}

      {/* Progress */}
      <LinearProgress
        progress={50}
        variant="default"
        size="sm"
        showLabel
        label="Processing..."
        style={styles.progress}
      />

      {/* Cancel Button */}
      <Button
        variant="tertiary"
        size="md"
        onPress={handleCancel}
        style={styles.cancelButton}
      >
        Cancel Request
      </Button>
    </Animated.View>
  );
};

// Accepted State Screen
interface AcceptedStateProps {
  eventTitle: string;
  onViewChat: () => void;
  onAddReminder?: () => void;
  style?: ViewStyle;
}

export const AcceptedState: React.FC<AcceptedStateProps> = ({
  eventTitle,
  onViewChat,
  onAddReminder,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleViewChat = () => {
    haptics.success();
    onViewChat();
  };

  const handleAddReminder = () => {
    haptics.light();
    onAddReminder?.();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300).springify()}
      style={[
        styles.acceptedContainer,
        {
          backgroundColor: theme.colors.status.success.bg,
          borderRadius: theme.radius.component.card,
          borderColor: theme.colors.status.success.border,
        },
        style,
      ]}
    >
      {/* Celebration Icon */}
      <Text style={styles.acceptedIcon}>🎉</Text>

      {/* Title */}
      <Text
        style={[
          styles.acceptedTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        You're In!
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.acceptedDescription,
          { color: theme.colors.text.secondary },
        ]}
      >
        Your request to join "{eventTitle}" has been accepted.
      </Text>

      {/* Actions */}
      <View style={styles.acceptedActions}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleViewChat}
          style={styles.chatButton}
        >
          💬 View Chat
        </Button>
        {onAddReminder && (
          <Button
            variant="tertiary"
            size="md"
            onPress={handleAddReminder}
            style={styles.reminderButton}
          >
            🔔 Add Reminder
          </Button>
        )}
      </View>
    </Animated.View>
  );
};

// Declined State Screen
interface DeclinedStateProps {
  onExploreSimilar: () => void;
  onReturnToMap: () => void;
  style?: ViewStyle;
}

export const DeclinedState: React.FC<DeclinedStateProps> = ({
  onExploreSimilar,
  onReturnToMap,
  style,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.declinedContainer,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
        },
        style,
      ]}
    >
      {/* Icon */}
      <Text style={styles.declinedIcon}>👋</Text>

      {/* Title */}
      <Text
        style={[
          styles.declinedTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Request Not Accepted
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.declinedDescription,
          { color: theme.colors.text.secondary },
        ]}
      >
        The organizer has not accepted your request at this time. Don't worry, there are plenty of other events to explore!
      </Text>

      {/* Actions */}
      <View style={styles.declinedActions}>
        <Button
          variant="primary"
          size="md"
          onPress={onExploreSimilar}
          style={styles.exploreButton}
        >
          🔍 Explore Similar
        </Button>
        <Button
          variant="tertiary"
          size="md"
          onPress={onReturnToMap}
          style={styles.returnButton}
        >
          ← Return to Map
        </Button>
      </View>
    </Animated.View>
  );
};

// Full Event State
interface FullEventStateProps {
  onJoinWaitlist?: () => void;
  onExploreSimilar: () => void;
  style?: ViewStyle;
}

export const FullEventState: React.FC<FullEventStateProps> = ({
  onJoinWaitlist,
  onExploreSimilar,
  style,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.fullContainer,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.card,
        },
        style,
      ]}
    >
      {/* Icon */}
      <Text style={styles.fullIcon}>👥</Text>

      {/* Title */}
      <Text
        style={[
          styles.fullTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Event is Full
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.fullDescription,
          { color: theme.colors.text.secondary },
        ]}
      >
        All spots have been taken. You can join the waitlist to be notified if someone cancels.
      </Text>

      {/* Actions */}
      <View style={styles.fullActions}>
        {onJoinWaitlist && (
          <Button
            variant="secondary"
            size="md"
            onPress={onJoinWaitlist}
            style={styles.waitlistButton}
          >
            📋 Join Waitlist
          </Button>
        )}
        <Button
          variant="tertiary"
          size="md"
          onPress={onExploreSimilar}
          style={styles.similarButton}
        >
          🔍 Explore Similar
        </Button>
      </View>
    </Animated.View>
  );
};

// Complete Join Flow Component
export const JoinFlow: React.FC<JoinFlowProps> = ({
  state,
  eventTitle,
  spotsLeft,
  estimatedWaitTime,
  onJoin,
  onCancel,
  onViewChat,
  onExploreSimilar,
  onReturnToMap,
  style,
}) => {
  switch (state) {
    case 'pending':
      return (
        <PendingState
          eventTitle={eventTitle || 'this event'}
          estimatedWaitTime={estimatedWaitTime}
          onCancel={onCancel}
          style={style}
        />
      );
    case 'accepted':
      return (
        <AcceptedState
          eventTitle={eventTitle || 'this event'}
          onViewChat={onViewChat || (() => {})}
          style={style}
        />
      );
    case 'declined':
      return (
        <DeclinedState
          onExploreSimilar={onExploreSimilar || (() => {})}
          onReturnToMap={onReturnToMap || (() => {})}
          style={style}
        />
      );
    case 'full':
      return (
        <FullEventState
          onExploreSimilar={onExploreSimilar || (() => {})}
          style={style}
        />
      );
    case 'available':
    case 'loading':
    case 'already_joined':
    case 'cancelled':
    default:
      return (
        <JoinButton
          state={state}
          onPress={state === 'available' ? onJoin : onCancel}
          style={style}
        />
      );
  }
};

const styles = StyleSheet.create({
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  joinButtonIcon: {
    fontSize: 18,
    marginRight: spacing[2],
  },
  joinButtonLabel: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },
  pendingContainer: {
    padding: spacing[6],
    alignItems: 'center',
  },
  pendingIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  pendingDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  waitTimeContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  waitTimeLabel: {
    fontSize: 12,
    marginBottom: spacing[1],
  },
  waitTime: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
  },
  progress: {
    width: '100%',
    marginBottom: spacing[4],
  },
  cancelButton: {},
  acceptedContainer: {
    padding: spacing[6],
    alignItems: 'center',
    borderWidth: 1,
  },
  acceptedIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  acceptedTitle: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[2],
  },
  acceptedDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  acceptedActions: {
    width: '100%',
  },
  chatButton: {
    marginBottom: spacing[3],
  },
  reminderButton: {},
  declinedContainer: {
    padding: spacing[6],
    alignItems: 'center',
  },
  declinedIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  declinedTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  declinedDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  declinedActions: {
    width: '100%',
  },
  exploreButton: {
    marginBottom: spacing[3],
  },
  returnButton: {},
  fullContainer: {
    padding: spacing[6],
    alignItems: 'center',
  },
  fullIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  fullTitle: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  fullDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  fullActions: {
    width: '100%',
  },
  waitlistButton: {
    marginBottom: spacing[3],
  },
  similarButton: {},
});

JoinButton.displayName = 'JoinButton';
PendingState.displayName = 'PendingState';
AcceptedState.displayName = 'AcceptedState';
DeclinedState.displayName = 'DeclinedState';
FullEventState.displayName = 'FullEventState';
JoinFlow.displayName = 'JoinFlow';

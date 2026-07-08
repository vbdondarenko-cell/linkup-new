/**
 * LinkUp Design System 2026
 * Message Bubble - Chat message component
 */

'use client';

import React, { useCallback, useMemo } from 'react';
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
  FadeIn,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Types
export type MessageType = 'text' | 'image' | 'location' | 'system';

export interface Message {
  id: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  imageUrl?: string;
  location?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  isOwn?: boolean;
}

// Format time
const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

// Text Message Bubble
interface TextBubbleProps {
  message: Message;
  onPress?: () => void;
  onLongPress?: () => void;
}

const TextBubble: React.FC<TextBubbleProps> = ({ message, onPress, onLongPress }) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleLongPress = () => {
    haptics.medium();
    onLongPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isOwn = message.isOwn;

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.bubbleContainer,
        isOwn ? styles.ownBubble : styles.otherBubble,
        animatedStyle,
      ]}
    >
      {!isOwn && (
        <Avatar
          src={message.senderAvatar}
          name={message.senderName}
          size="xs"
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isOwn
              ? theme.colors.interactive.primary
              : theme.colors.surface.secondary,
            borderRadius: isOwn
              ? `${theme.radius.component.card} ${theme.radius.component.card} 4px ${theme.radius.component.card}`
              : `4px ${theme.radius.component.card} ${theme.radius.component.card} ${theme.radius.component.card}`,
          },
        ]}
      >
        {!isOwn && (
          <Text
            style={[
              styles.senderName,
              { color: theme.colors.interactive.primary },
            ]}
          >
            {message.senderName}
          </Text>
        )}
        <Text
          style={[
            styles.messageText,
            {
              color: isOwn ? '#FFFFFF' : theme.colors.text.primary,
            },
          ]}
        >
          {message.content}
        </Text>
        <View style={styles.timestampRow}>
          <Text
            style={[
              styles.timestamp,
              {
                color: isOwn ? 'rgba(255,255,255,0.7)' : theme.colors.text.tertiary,
              },
            ]}
          >
            {formatMessageTime(message.timestamp)}
          </Text>
          {isOwn && message.status && (
            <Text style={styles.statusIcon}>
              {message.status === 'sending' && '○'}
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && '✓✓'}
              {message.status === 'failed' && '⚠️'}
            </Text>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

// Image Message Bubble
interface ImageBubbleProps {
  message: Message;
  onPress?: () => void;
  onLongPress?: () => void;
  onImagePress?: () => void;
}

const ImageBubble: React.FC<ImageBubbleProps> = ({
  message,
  onPress,
  onLongPress,
  onImagePress,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const isOwn = message.isOwn;

  const handleLongPress = () => {
    haptics.medium();
    onLongPress?.();
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={handleLongPress}
      style={[
        styles.imageBubbleContainer,
        isOwn ? styles.ownBubble : styles.otherBubble,
      ]}
    >
      {!isOwn && (
        <Avatar
          src={message.senderAvatar}
          name={message.senderName}
          size="xs"
          style={styles.avatar}
        />
      )}
      <Pressable
        onPress={onImagePress}
        style={[
          styles.imageBubble,
          { borderRadius: theme.radius.component.card },
        ]}
      >
        {message.imageUrl ? (
          <Image
            source={{ uri: message.imageUrl }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surface.tertiary }]}>
            <Text style={styles.placeholderIcon}>📷</Text>
          </View>
        )}
        {message.content && (
          <View
            style={[
              styles.imageCaption,
              { backgroundColor: 'rgba(0,0,0,0.5)' },
            ]}
          >
            <Text style={styles.imageCaptionText}>{message.content}</Text>
          </View>
        )}
        <Text
          style={[
            styles.imageTimestamp,
            {
              color: isOwn ? '#FFFFFF' : theme.colors.text.secondary,
            },
          ]}
        >
          {formatMessageTime(message.timestamp)}
        </Text>
      </Pressable>
    </AnimatedPressable>
  );
};

// Location Message Bubble
interface LocationBubbleProps {
  message: Message;
  onPress?: () => void;
  onLongPress?: () => void;
  onOpenMaps?: () => void;
}

const LocationBubble: React.FC<LocationBubbleProps> = ({
  message,
  onPress,
  onLongPress,
  onOpenMaps,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const isOwn = message.isOwn;

  const handleLongPress = () => {
    haptics.medium();
    onLongPress?.();
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={handleLongPress}
      style={[
        styles.locationBubbleContainer,
        isOwn ? styles.ownBubble : styles.otherBubble,
      ]}
    >
      {!isOwn && (
        <Avatar
          src={message.senderAvatar}
          name={message.senderName}
          size="xs"
          style={styles.avatar}
        />
      )}
      <Pressable
        onPress={onOpenMaps}
        style={[
          styles.locationBubble,
          {
            backgroundColor: isOwn
              ? theme.colors.interactive.primary
              : theme.colors.surface.secondary,
            borderRadius: theme.radius.component.card,
          },
        ]}
      >
        <Text style={styles.locationIcon}>📍</Text>
        {message.location && (
          <View style={styles.locationContent}>
            <Text
              style={[
                styles.locationName,
                { color: isOwn ? '#FFFFFF' : theme.colors.text.primary },
              ]}
              numberOfLines={1}
            >
              {message.location.name}
            </Text>
            <Text
              style={[
                styles.locationAddress,
                {
                  color: isOwn ? 'rgba(255,255,255,0.7)' : theme.colors.text.tertiary,
                },
              ]}
              numberOfLines={1}
            >
              {message.location.address}
            </Text>
          </View>
        )}
        <Text style={styles.directionsIcon}>→</Text>
      </Pressable>
    </AnimatedPressable>
  );
};

// Message Bubble Factory
interface MessageBubbleProps {
  message: Message;
  onPress?: () => void;
  onLongPress?: () => void;
  onImagePress?: () => void;
  onOpenMaps?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onPress,
  onLongPress,
  onImagePress,
  onOpenMaps,
}) => {
  switch (message.type) {
    case 'image':
      return (
        <ImageBubble
          message={message}
          onPress={onPress}
          onLongPress={onLongPress}
          onImagePress={onImagePress}
        />
      );
    case 'location':
      return (
        <LocationBubble
          message={message}
          onPress={onPress}
          onLongPress={onLongPress}
          onOpenMaps={onOpenMaps}
        />
      );
    case 'text':
    default:
      return (
        <TextBubble
          message={message}
          onPress={onPress}
          onLongPress={onLongPress}
        />
      );
  }
};

// Typing Indicator
interface TypingIndicatorProps {
  users: Array<{ name: string; avatar?: string }>;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  const theme = useTheme();

  const names = users.map((u) => u.name).join(', ');
  const isSingular = users.length === 1;

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingAvatars}>
        {users.slice(0, 3).map((user, index) => (
          <Avatar
            key={index}
            src={user.avatar}
            name={user.name}
            size="xs"
            style={[styles.typingAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
          />
        ))}
      </View>
      <View
        style={[
          styles.typingBubble,
          { backgroundColor: theme.colors.surface.secondary },
        ]}
      >
        <Text
          style={[
            styles.typingText,
            { color: theme.colors.text.secondary },
          ]}
        >
          {isSingular ? `${names} is` : `${names} are`} typing
        </Text>
        <View style={styles.typingDots}>
          <View style={[styles.typingDot, { backgroundColor: theme.colors.text.tertiary }]} />
          <View style={[styles.typingDot, { backgroundColor: theme.colors.text.tertiary }]} />
          <View style={[styles.typingDot, { backgroundColor: theme.colors.text.tertiary }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: 'row',
    marginVertical: spacing[1],
    maxWidth: '80%',
  },
  ownBubble: {
    alignSelf: 'flex-end',
    marginLeft: 60,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    marginRight: 60,
  },
  avatar: {
    marginRight: spacing[2],
    alignSelf: 'flex-end',
  },
  bubble: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    maxWidth: '100%',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 11,
  },
  statusIcon: {
    fontSize: 11,
    marginLeft: 4,
    color: 'rgba(255,255,255,0.7)',
  },
  imageBubbleContainer: {
    flexDirection: 'row',
    marginVertical: spacing[1],
  },
  imageBubble: {
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  messageImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    opacity: 0.5,
  },
  imageCaption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[2],
  },
  imageCaptionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  imageTimestamp: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    fontSize: 11,
  },
  locationBubbleContainer: {
    flexDirection: 'row',
    marginVertical: spacing[1],
  },
  locationBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    minWidth: 180,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: spacing[2],
  },
  locationContent: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationAddress: {
    fontSize: 12,
    marginTop: 2,
  },
  directionsIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: spacing[2],
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[2],
  },
  typingAvatars: {
    flexDirection: 'row',
    marginRight: spacing[2],
  },
  typingAvatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 12,
  },
  typingText: {
    fontSize: 13,
    marginRight: spacing[2],
  },
  typingDots: {
    flexDirection: 'row',
    gap: 3,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

TextBubble.displayName = 'TextBubble';
ImageBubble.displayName = 'ImageBubble';
LocationBubble.displayName = 'LocationBubble';
MessageBubble.displayName = 'MessageBubble';
TypingIndicator.displayName = 'TypingIndicator';

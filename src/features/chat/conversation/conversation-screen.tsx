/**
 * LinkUp Design System 2026
 * Conversation Screen - Main chat view
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

// Components
import { ChatHeader } from '../header/chat-header';
import { MessageBubble, Message, TypingIndicator } from '../messages/message-bubble';
import { SystemMessage, SystemMessageComponent, ChatExpiredState } from '../system/system-message';
import { CountdownBanner } from '../countdown/countdown';
import { MessageComposer, QuickReplies } from '../composer/message-composer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Types
import type { ChatStatus } from '../../../shared/types/enums';
export type { ChatStatus };

export interface ConversationData {
  id: string;
  eventId: string;
  eventName: string;
  eventImage?: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  participantCount: number;
  status: ChatStatus;
  eventStartsAt?: Date;
  eventEndsAt?: Date;
  countdownEndsAt?: Date;
}

interface ConversationScreenProps {
  conversation: ConversationData;
  messages: Message[];
  currentUserId: string;
  typingUsers?: Array<{ id: string; name: string; avatar?: string }>;
  quickReplies?: Array<{ id: string; text: string }>;
  onSendMessage: (text: string) => void;
  onSendImage?: (uri: string) => void;
  onSendLocation?: () => void;
  onBack: () => void;
  onViewEvent?: () => void;
  onViewOrganizer?: () => void;
  onReport?: () => void;
  onBlock?: () => void;
  onLeaveChat?: () => void;
  style?: ViewStyle;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({
  conversation,
  messages,
  currentUserId,
  typingUsers = [],
  quickReplies = [],
  onSendMessage,
  onSendImage,
  onSendLocation,
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
  const flatListRef = useRef<FlatList>(null);
  
  const [isDeleted, setIsDeleted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  
  // Check if we should show countdown
  useEffect(() => {
    if (conversation.status === 'countdown' && conversation.countdownEndsAt) {
      setShowCountdown(true);
    }
  }, [conversation.status, conversation.countdownEndsAt]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);
  
  const handleSend = useCallback(
    (text: string) => {
      haptics.light();
      onSendMessage(text);
    },
    [haptics, onSendMessage]
  );
  
  const handleQuickReply = useCallback(
    (reply: { id: string; text: string }) => {
      haptics.light();
      onSendMessage(reply.text);
    },
    [haptics, onSendMessage]
  );
  
  const handleExpire = useCallback(() => {
    haptics.error();
    setIsDeleted(true);
    setShowCountdown(false);
  }, [haptics]);
  
  const handlePhoto = useCallback(() => {
    haptics.light();
    onSendImage?.('');
  }, [haptics, onSendImage]);
  
  const handleLocation = useCallback(() => {
    haptics.light();
    onSendLocation?.();
  }, [haptics, onSendLocation]);
  
  // Render message item
  const renderMessage = useCallback(
    ({ item, index }: { item: Message | SystemMessage; index: number }) => {
      // System message
      if ('type' in item && (item as SystemMessage).type) {
        return (
          <Animated.View entering={FadeIn}>
            <SystemMessageComponent message={item as SystemMessage} />
          </Animated.View>
        );
      }
      
      // Regular message
      const message = item as Message;
      const isOwn = message.senderId === currentUserId;
      
      // Check if we should show sender name (first in group or different sender)
      const prevMessage = messages[index - 1];
      const showSender = !isOwn && (!prevMessage || (prevMessage as Message).senderId !== message.senderId);
      
      return (
        <Animated.View entering={FadeIn.delay(index * 20)}>
          <MessageBubble
            message={message}
            onLongPress={() => {
              // Show message actions
            }}
          />
        </Animated.View>
      );
    },
    [currentUserId, messages]
  );
  
  // Determine key extractor
  const keyExtractor = useCallback(
    (item: Message | SystemMessage) => item.id,
    []
  );
  
  // If chat is deleted, show expired state
  if (isDeleted || conversation.status === 'deleted') {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.colors.surface.background },
          style,
        ]}
      >
        <ChatHeader
          eventName={conversation.eventName}
          eventImage={conversation.eventImage}
          status={conversation.status}
          onBack={onBack}
          onViewEvent={onViewEvent}
        />
        <ChatExpiredState
          eventName={conversation.eventName}
          onViewEvent={onViewEvent}
          onExploreEvents={() => {}}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.background },
        style,
      ]}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface.primary}
      />
      
      {/* Header */}
      <ChatHeader
        eventName={conversation.eventName}
        eventImage={conversation.eventImage}
        participantCount={conversation.participantCount}
        organizerName={conversation.organizerName}
        status={conversation.status}
        countdownEndsAt={conversation.countdownEndsAt}
        onBack={onBack}
        onViewEvent={onViewEvent}
        onViewOrganizer={onViewOrganizer}
        onReport={onReport}
        onBlock={onBlock}
        onLeaveChat={onLeaveChat}
      />
      
      {/* Countdown Banner */}
      {showCountdown && conversation.countdownEndsAt && (
        <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
          <CountdownBanner
            hours={Math.floor(
              (conversation.countdownEndsAt.getTime() - Date.now()) / (1000 * 60 * 60)
            )}
            minutes={Math.floor(
              ((conversation.countdownEndsAt.getTime() - Date.now()) % (1000 * 60 * 60)) /
                (1000 * 60)
            )}
          />
        </Animated.View>
      )}
      
      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages as (Message | SystemMessage)[]}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListFooterComponent={
            typingUsers.length > 0 ? (
              <TypingIndicator users={typingUsers} />
            ) : null
          }
        />
        
        {/* Quick Replies */}
        {quickReplies.length > 0 && messages.length === 0 && (
          <QuickReplies
            replies={quickReplies}
            onReplyPress={handleQuickReply}
            style={styles.quickReplies}
          />
        )}
        
        {/* Composer */}
        <MessageComposer
          onSend={handleSend}
          onPhoto={onSendImage ? handlePhoto : undefined}
          onLocation={onSendLocation ? handleLocation : undefined}
          disabled={conversation.status === 'expired'}
          placeholder={
            conversation.status === 'expired'
              ? 'Chat has expired'
              : 'Type a message...'
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  quickReplies: {
    paddingBottom: spacing[2],
  },
});

ConversationScreen.displayName = 'ConversationScreen';

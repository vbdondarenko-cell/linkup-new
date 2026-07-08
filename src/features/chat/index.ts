/**
 * LinkUp Design System 2026
 * Chat Feature - Main Exports
 */

// Chat List
export { ChatList } from './chat-list/chat-list';
export type { ChatItem, ChatStatus } from './chat-list/chat-list';

// Conversation
export { ConversationScreen } from './conversation/conversation-screen';
export type { ConversationData, ChatStatus as ConversationStatus } from './conversation/conversation-screen';

// Header
export { ChatHeader } from './header/chat-header';
export type { ChatStatus as HeaderStatus } from './header/chat-header';

// Messages
export { MessageBubble, TypingIndicator } from './messages/message-bubble';
export type { Message, MessageType } from './messages/message-bubble';

// Composer
export { MessageComposer, QuickReplies, AttachmentPreview, VoiceInput } from './composer/message-composer';

// Countdown
export { CountdownTimer, CompactCountdown, CountdownRing } from './countdown/countdown';

// System Messages
export {
  SystemMessageComponent,
  CountdownSystemMessage,
  CountdownBanner,
  ChatExpiredState,
} from './system/system-message';
export type { SystemMessage, SystemMessageType } from './system/system-message';

// Empty States
export {
  ChatEmptyState,
  NoChatsEmpty,
  WaitingAcceptanceEmpty,
  ChatExpiredEmpty,
  ChatDeletedEmpty,
  OfflineEmpty,
  ChatLoading,
  ChatError,
} from './states/empty-states';

export interface SendMessageRequest {
  conversationId: string;
  senderId: string;
  type: 'text' | 'image' | 'location' | 'file';
  content: string;
  metadata?: {
    imageUrl?: string;
    location?: { latitude: number; longitude: number };
    fileUrl?: string;
    fileName?: string;
  };
  replyToId?: string;
}

export interface CreateConversationRequest {
  type: 'direct' | 'event' | 'group';
  creatorId: string;
  participantIds: string[];
  eventId?: string;
  title?: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
  replyToId?: string;
  isEdited: boolean;
  createdAt: string;
}

export interface ConversationResponse {
  id: string;
  type: string;
  eventId?: string;
  title?: string;
  participantIds: string[];
  lastMessage?: MessageResponse;
  isActive: boolean;
  createdAt: string;
}

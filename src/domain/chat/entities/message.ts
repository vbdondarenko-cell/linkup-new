import { EntityId, Timestamp } from '../../shared/types';

export type MessageType = 'text' | 'image' | 'location' | 'event' | 'system';

export interface MessageMetadata {
  latitude?: number;
  longitude?: number;
  eventId?: string;
  eventTitle?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export class Message {
  private readonly _id: EntityId;
  private readonly _conversationId: EntityId;
  private readonly _senderId: EntityId;
  private readonly _type: MessageType;
  private readonly _content: string;
  private readonly _metadata: MessageMetadata | null;
  private readonly _replyToId: EntityId | null;
  private readonly _isEdited: boolean;
  private readonly _createdAt: Timestamp;

  private constructor(params: {
    id: EntityId;
    conversationId: EntityId;
    senderId: EntityId;
    type: MessageType;
    content: string;
    metadata?: MessageMetadata;
    replyToId?: EntityId;
    isEdited: boolean;
    createdAt: Timestamp;
  }) {
    this._id = params.id;
    this._conversationId = params.conversationId;
    this._senderId = params.senderId;
    this._type = params.type;
    this._content = params.content;
    this._metadata = params.metadata || null;
    this._replyToId = params.replyToId || null;
    this._isEdited = params.isEdited;
    this._createdAt = params.createdAt;
  }

  static create(params: {
    conversationId: EntityId;
    senderId: EntityId;
    type: MessageType;
    content: string;
    metadata?: MessageMetadata;
    replyToId?: EntityId;
  }): Message {
    return new Message({
      id: crypto.randomUUID(),
      conversationId: params.conversationId,
      senderId: params.senderId,
      type: params.type,
      content: params.content,
      metadata: params.metadata,
      replyToId: params.replyToId,
      isEdited: false,
      createdAt: new Date(),
    });
  }

  get id(): EntityId { return this._id; }
  get conversationId(): EntityId { return this._conversationId; }
  get senderId(): EntityId { return this._senderId; }
  get type(): MessageType { return this._type; }
  get content(): string { return this._content; }
  get metadata(): MessageMetadata | null { return this._metadata; }
  get replyToId(): EntityId | null { return this._replyToId; }
  get isEdited(): boolean { return this._isEdited; }
  get createdAt(): Timestamp { return this._createdAt; }
}

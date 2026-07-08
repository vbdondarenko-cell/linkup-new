import { EntityId } from '../../shared/types';
import { Message } from '../entities/message';

export class Conversation {
  private readonly _id: EntityId;
  private readonly _eventId: EntityId;
  private readonly _participantIds: EntityId[];
  private _lastMessageId: EntityId | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _expiresAt: Date | null;

  constructor(params: {
    id: EntityId;
    eventId: EntityId;
    participantIds: EntityId[];
    lastMessageId?: EntityId;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
  }) {
    this._id = params.id;
    this._eventId = params.eventId;
    this._participantIds = params.participantIds;
    this._lastMessageId = params.lastMessageId || null;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
    this._expiresAt = params.expiresAt || null;
  }

  static create(eventId: EntityId, participantIds: EntityId[]): Conversation {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return new Conversation({
      id: crypto.randomUUID(),
      eventId,
      participantIds,
      createdAt: now,
      updatedAt: now,
      expiresAt,
    });
  }

  isParticipant(userId: EntityId): boolean {
    return this._participantIds.includes(userId);
  }

  updateLastMessage(): void {
    this._updatedAt = new Date();
  }

  get id(): EntityId { return this._id; }
  get eventId(): EntityId { return this._eventId; }
  get participantIds(): EntityId[] { return this._participantIds; }
  get lastMessageId(): EntityId | null { return this._lastMessageId; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get expiresAt(): Date | null { return this._expiresAt; }
}

export interface IConversationRepository {
  findById(id: EntityId): Promise<Conversation | null>;
  findByEventId(eventId: EntityId): Promise<Conversation | null>;
  findByUserId(userId: EntityId): Promise<Conversation[]>;
  save(conversation: Conversation): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

import { EntityId } from '../../shared/types';
import { Message } from '../entities/message';

export interface IMessageRepository {
  findById(id: EntityId): Promise<Message | null>;
  findByConversationId(conversationId: EntityId, limit?: number, offset?: number): Promise<Message[]>;
  save(message: Message): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

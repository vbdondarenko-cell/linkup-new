import { SendMessageRequest, MessageResponse } from '../dto/chat.dto';
import { Message } from '../../../domain/chat/entities/message';
import { IMessageRepository } from '../../../domain/chat/repositories/i-message-repository';
import { IConversationRepository } from '../../../domain/chat/repositories/i-conversation-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { MessageSent } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class SendMessageHandler {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly conversationRepository: IConversationRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: SendMessageRequest): Promise<Result<MessageResponse>> {
    const conversation = await this.conversationRepository.findById(request.conversationId);
    if (!conversation) {
      return { success: false, error: new Error('Conversation not found') };
    }

    if (!conversation.isParticipant(request.senderId)) {
      return { success: false, error: new Error('Not a participant of this conversation') };
    }

    const message = Message.create({
      conversationId: request.conversationId,
      senderId: request.senderId,
      type: request.type,
      content: request.content,
      metadata: request.metadata,
      replyToId: request.replyToId,
    });

    await this.messageRepository.save(message);

    // Update conversation last message
    conversation.updateLastMessage();
    await this.conversationRepository.save(conversation);

    // Dispatch domain event
    await this.eventDispatcher.dispatch(new MessageSent(message.id, message.conversationId, message.senderId));

    return {
      success: true,
      data: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        type: message.type,
        content: message.content,
        metadata: message.metadata || undefined,
        replyToId: message.replyToId,
        isEdited: message.isEdited,
        createdAt: message.createdAt.toISOString(),
      },
    };
  }
}

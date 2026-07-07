import { JoinEventCommand } from '../commands/join-event.command';
import { Participant } from '../../../domain/participants/entities/participant';
import { IParticipantRepository } from '../../../domain/participants/repositories/i-participant-repository';
import { IEventRepository } from '../../../domain/events/repositories/i-event-repository';
import { ITransactionManager } from '../../shared/transaction/transaction-manager';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { ParticipantJoined } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class JoinEventHandler {
  constructor(
    private readonly participantRepository: IParticipantRepository,
    private readonly eventRepository: IEventRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(command: JoinEventCommand): Promise<Result<ParticipantResponse>> {
    return this.transactionManager.executeInTransaction(async () => {
      const { eventId, userId } = command.request;

      // Check if already joined
      const existing = await this.participantRepository.findById(`${eventId}_${userId}`);
      if (existing) {
        return { success: false, error: new Error('Already joined this event') };
      }

      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        return { success: false, error: new Error('Event not found') };
      }

      if (!event.isPublished) {
        return { success: false, error: new Error('Cannot join unpublished event') };
      }

      const participantCount = await this.participantRepository.countApprovedByEventId(eventId);
      if (event.capacity && !event.capacity.canAccept(participantCount)) {
        // Add to waitlist
        const participant = Participant.create(eventId, userId);
        participant.addToWaitlist();
        await this.participantRepository.save(participant);

        return {
          success: true,
          data: {
            id: participant.id,
            eventId: participant.eventId,
            userId: participant.userId,
            status: participant.status,
            isOrganizer: participant.isOrganizer,
            joinedAt: participant.joinedAt.toISOString(),
          },
        };
      }

      const participant = Participant.create(eventId, userId);
      await this.participantRepository.save(participant);

      // Dispatch domain event
      await this.eventDispatcher.dispatch(new ParticipantJoined(eventId, userId));

      return {
        success: true,
        data: {
          id: participant.id,
          eventId: participant.eventId,
          userId: participant.userId,
          status: participant.status,
          isOrganizer: participant.isOrganizer,
          joinedAt: participant.joinedAt.toISOString(),
        },
      };
    });
  }
}

export interface ParticipantResponse {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  isOrganizer: boolean;
  joinedAt: string;
  approvedAt?: string;
  checkedInAt?: string;
}

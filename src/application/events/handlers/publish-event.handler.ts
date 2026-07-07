import { PublishEventCommand } from '../commands/publish-event.command';
import { IEventRepository } from '../../../domain/events/repositories/i-event-repository';
import { EventMapper } from '../mappers/event.mapper';
import { EventResponse } from '../dto/event.dto';
import { IParticipantRepository } from '../../../domain/participants/repositories/i-participant-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { EventPublished } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class PublishEventHandler {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly participantRepository: IParticipantRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(command: PublishEventCommand): Promise<Result<EventResponse>> {
    const event = await this.eventRepository.findById(command.eventId);

    if (!event) {
      return { success: false, error: new Error('Event not found') };
    }

    try {
      event.publish();
    } catch (error) {
      return { success: false, error: error as Error };
    }

    await this.eventRepository.save(event);

    // Dispatch domain event
    await this.eventDispatcher.dispatch(new EventPublished(event.id));

    const participantCount = await this.participantRepository.countApprovedByEventId(event.id);

    return {
      success: true,
      data: EventMapper.toDTO(event, participantCount),
    };
  }
}

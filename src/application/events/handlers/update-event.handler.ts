import { UpdateEventCommand } from '../commands/update-event.command';
import { IEventRepository } from '../../../domain/events/repositories/i-event-repository';
import { EventMapper } from '../mappers/event.mapper';
import { EventResponse } from '../dto/event.dto';
import { IParticipantRepository } from '../../../domain/participants/repositories/i-participant-repository';
import { Result } from '../../../domain/shared/types';

export class UpdateEventHandler {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly participantRepository: IParticipantRepository
  ) {}

  async handle(command: UpdateEventCommand): Promise<Result<EventResponse>> {
    const event = await this.eventRepository.findById(command.request.eventId);

    if (!event) {
      return { success: false, error: new Error('Event not found') };
    }

    const domainInput = EventMapper.toDomainUpdate(command.request);

    if (domainInput.title) event.updateTitle(domainInput.title);
    if (domainInput.description) event.updateDescription(domainInput.description);
    if (domainInput.coverImageUrl) event._coverImageUrl = domainInput.coverImageUrl;
    if (domainInput.location) event.updateLocation({
      coordinates: { latitude: domainInput.location.latitude, longitude: domainInput.location.longitude },
      address: domainInput.location.address,
      city: domainInput.location.city,
      placeId: domainInput.location.placeId,
    });
    if (domainInput.startDate && domainInput.endDate) {
      event.updateDates(domainInput.startDate, domainInput.endDate);
    }
    if (domainInput.visibilit) event._visibility = domainInput.visibility;
    if (domainInput.interests) event._interests = domainInput.interests;

    await this.eventRepository.save(event);

    const participantCount = await this.participantRepository.countApprovedByEventId(event.id);

    return {
      success: true,
      data: EventMapper.toDTO(event, participantCount),
    };
  }
}

import { GetEventQuery, GetEventsNearbyQuery, GetOrganizerEventsQuery } from '../queries/get-event.query';
import { IEventRepository } from '../../../domain/events/repositories/i-event-repository';
import { IParticipantRepository } from '../../../domain/participants/repositories/i-participant-repository';
import { EventMapper } from '../mappers/event.mapper';
import { EventResponse, EventListResponse } from '../dto/event.dto';
import { ICacheService, CacheKeys } from '../../shared/cache/cache-service';
import { NotFoundApplicationError } from '../../shared/errors/application-errors';
import { PAGINATION_DEFAULTS } from '../../../domain/shared/types';

export class GetEventHandler {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly participantRepository: IParticipantRepository,
    private readonly cacheService: ICacheService
  ) {}

  async handle(query: GetEventQuery): Promise<EventResponse> {
    // Try cache first
    const cached = await this.cacheService.get<EventResponse>(CacheKeys.event(query.eventId));
    if (cached) {
      return cached;
    }

    const event = await this.eventRepository.findById(query.eventId);

    if (!event) {
      throw new NotFoundApplicationError('Event', query.eventId);
    }

    const participantCount = await this.participantRepository.countApprovedByEventId(event.id);
    const response = EventMapper.toDTO(event, participantCount);

    // Cache for 5 minutes
    await this.cacheService.set(CacheKeys.event(query.eventId), response, { ttl: 300 });

    return response;
  }

  async handleNearby(query: GetEventsNearbyQuery): Promise<EventListResponse> {
    const events = await this.eventRepository.findNearby(
      query.latitude,
      query.longitude,
      query.radiusKm,
      {
        limit: query.pageSize || PAGINATION_DEFAULTS.DEFAULT_LIMIT,
        offset: ((query.page || 1) - 1) * (query.pageSize || PAGINATION_DEFAULTS.DEFAULT_LIMIT),
      }
    );

    const participantCounts = new Map<string, number>();
    for (const event of events) {
      participantCounts.set(event.id, await this.participantRepository.countApprovedByEventId(event.id));
    }

    return {
      events: EventMapper.toDTOList(events, participantCounts),
      totalCount: events.length,
      page: query.page || 1,
      pageSize: query.pageSize || PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    };
  }

  async handleByOrganizer(query: GetOrganizerEventsQuery): Promise<EventListResponse> {
    const events = await this.eventRepository.findByOrganizer(
      query.organizerId,
      {
        limit: query.pageSize || PAGINATION_DEFAULTS.DEFAULT_LIMIT,
        offset: ((query.page || 1) - 1) * (query.pageSize || PAGINATION_DEFAULTS.DEFAULT_LIMIT),
      }
    );

    const participantCounts = new Map<string, number>();
    for (const event of events) {
      participantCounts.set(event.id, await this.participantRepository.countApprovedByEventId(event.id));
    }

    return {
      events: EventMapper.toDTOList(events, participantCounts),
      totalCount: events.length,
      page: query.page || 1,
      pageSize: query.pageSize || PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    };
  }
}

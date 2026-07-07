import { IEventRepository } from '../../../domain/events/repositories/i-event-repository';
import { IParticipantRepository } from '../../../domain/participants/repositories/i-participant-repository';
import { ITransactionManager } from '../../shared/transaction/transaction-manager';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { ICacheService, CacheKeys } from '../../shared/cache/cache-service';
import { AuthorizationMiddleware, AuthorizationContext } from '../../shared/middleware/authorization-middleware';
import { LoggingMiddleware } from '../../shared/middleware/logging-middleware';
import { EventPolicy } from '../../../domain/events/policies/event-policy';
import { CreateEventHandler } from '../handlers/create-event.handler';
import { UpdateEventHandler } from '../handlers/update-event.handler';
import { PublishEventHandler } from '../handlers/publish-event.handler';
import { CancelEventHandler } from '../handlers/cancel-event.handler';
import { GetEventHandler } from '../handlers/get-event.handler';
import {
  CreateEventRequest,
  UpdateEventRequest,
  EventResponse,
  EventListResponse,
} from '../dto/event.dto';

export class EventService {
  private eventPolicy: EventPolicy;

  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly participantRepository: IParticipantRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly eventDispatcher: IEventDispatcher,
    private readonly cacheService: ICacheService,
    private readonly authorization: AuthorizationMiddleware,
    private readonly logger: LoggingMiddleware
  ) {
    this.eventPolicy = new EventPolicy();
  }

  async createEvent(
    context: AuthorizationContext,
    request: CreateEventRequest
  ): Promise<EventResponse> {
    return this.logger.execute(
      'EventService.createEvent',
      context.userId,
      async () => {
        // Check permission
        if (!this.eventPolicy.canCreateEvent(context)) {
          throw new Error('Permission denied to create event');
        }

        const handler = new CreateEventHandler(
          this.eventRepository,
          this.transactionManager,
          this.eventDispatcher
        );

        const result = await handler.handle({ request } as any);

        if (!result.success) {
          throw result.error;
        }

        // Invalidate nearby events cache
        await this.cacheService.deleteByTags([CacheKeys.tags.event]);

        return result.data;
      }
    );
  }

  async updateEvent(
    context: AuthorizationContext,
    request: UpdateEventRequest
  ): Promise<EventResponse> {
    const event = await this.eventRepository.findById(request.eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (!this.eventPolicy.canEditEvent(context, event)) {
      throw new Error('Permission denied to edit event');
    }

    const handler = new UpdateEventHandler(this.eventRepository, this.participantRepository);
    const result = await handler.handle({ request } as any);

    if (!result.success) {
      throw result.error;
    }

    // Invalidate cache
    await this.cacheService.delete(CacheKeys.event(request.eventId));

    return result.data;
  }

  async publishEvent(
    context: AuthorizationContext,
    eventId: string
  ): Promise<EventResponse> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (!this.eventPolicy.canPublishEvent(context, event)) {
      throw new Error('Permission denied to publish event');
    }

    const handler = new PublishEventHandler(
      this.eventRepository,
      this.participantRepository,
      this.eventDispatcher
    );

    const result = await handler.handle({ eventId } as any);

    if (!result.success) {
      throw result.error;
    }

    await this.cacheService.delete(CacheKeys.event(eventId));
    await this.cacheService.deleteByTags([CacheKeys.tags.event]);

    return result.data;
  }

  async cancelEvent(
    context: AuthorizationContext,
    eventId: string,
    reason?: string
  ): Promise<EventResponse> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (!this.eventPolicy.canCancelEvent(context, event)) {
      throw new Error('Permission denied to cancel event');
    }

    const handler = new CancelEventHandler(
      this.eventRepository,
      this.participantRepository,
      this.eventDispatcher
    );

    const result = await handler.handle({ eventId, reason } as any);

    if (!result.success) {
      throw result.error;
    }

    await this.cacheService.delete(CacheKeys.event(eventId));
    await this.cacheService.deleteByTags([CacheKeys.tags.event]);

    return result.data;
  }

  async getEvent(eventId: string, requestingUserId?: string): Promise<EventResponse> {
    const handler = new GetEventHandler(
      this.eventRepository,
      this.participantRepository,
      this.cacheService
    );

    return handler.handle({ eventId, requestingUserId } as any);
  }

  async getEventsNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EventListResponse> {
    const handler = new GetEventHandler(
      this.eventRepository,
      this.participantRepository,
      this.cacheService
    );

    return handler.handleNearby({ latitude, longitude, radiusKm, page, pageSize } as any);
  }

  async getOrganizerEvents(
    organizerId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<EventListResponse> {
    const handler = new GetEventHandler(
      this.eventRepository,
      this.participantRepository,
      this.cacheService
    );

    return handler.handleByOrganizer({ organizerId, page, pageSize } as any);
  }
}

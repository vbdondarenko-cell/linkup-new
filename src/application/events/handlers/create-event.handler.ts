import { CreateEventCommand } from '../commands/create-event.command';
import { Event } from '../../../domain/events/entities/event';
import { EventFactory } from '../../../domain/events/factories/event-factory';
import { IEventRepository } from '../../../domain/events/repositories/i-event-repository';
import { EventMapper } from '../mappers/event.mapper';
import { EventResponse } from '../dto/event.dto';
import { ITransactionManager } from '../../shared/transaction/transaction-manager';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { EventCreated, EventPublished } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class CreateEventHandler {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(command: CreateEventCommand): Promise<Result<EventResponse>> {
    return this.transactionManager.executeInTransaction(async () => {
      const domainInput = EventMapper.toDomainCreate(command.request);
      const event = EventFactory.create(domainInput);

      await this.eventRepository.save(event);

      // Dispatch domain event
      const domainEvent = new EventCreated(event.id, event.organizerId);
      await this.eventDispatcher.dispatch(domainEvent);

      return {
        success: true,
        data: EventMapper.toDTO(event),
      };
    });
  }
}

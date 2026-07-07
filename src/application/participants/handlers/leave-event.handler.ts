import { LeaveEventCommand } from '../commands/leave-event.command';
import { IParticipantRepository } from '../../../domain/participants/repositories/i-participant-repository';
import { ITransactionManager } from '../../shared/transaction/transaction-manager';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { ParticipantLeft } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class LeaveEventHandler {
  constructor(
    private readonly participantRepository: IParticipantRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(command: LeaveEventCommand): Promise<Result<void>> {
    return this.transactionManager.executeInTransaction(async () => {
      const { eventId, userId } = command.request;

      const participant = await this.participantRepository.findById(`${eventId}_${userId}`);
      if (!participant) {
        return { success: false, error: new Error('Not a participant') };
      }

      try {
        participant.cancel();
      } catch (error) {
        return { success: false, error: error as Error };
      }

      await this.participantRepository.save(participant);

      // Dispatch domain event
      await this.eventDispatcher.dispatch(new ParticipantLeft(eventId, userId));

      return { success: true, data: undefined };
    });
  }
}

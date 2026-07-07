import { UnlockOrganizerRequest } from '../dto/organizer.dto';
import { Organizer } from '../../../domain/organizer/entities/organizer';
import { IOrganizerRepository } from '../../../domain/organizer/repositories/i-organizer-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { OrganizerUnlocked } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class UnlockOrganizerHandler {
  constructor(
    private readonly organizerRepository: IOrganizerRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: UnlockOrganizerRequest): Promise<Result<OrganizerResponse>> {
    const existing = await this.organizerRepository.findByUserId(request.userId);
    if (existing) {
      return { success: false, error: new Error('User is already an organizer') };
    }

    const organizer = Organizer.create(request.userId, request.displayName);
    organizer.unlock();

    await this.organizerRepository.save(organizer);

    // Dispatch domain event
    await this.eventDispatcher.dispatch(new OrganizerUnlocked(organizer.id, organizer.userId));

    return {
      success: true,
      data: {
        id: organizer.id,
        userId: organizer.userId,
        displayName: organizer.displayName,
        bio: organizer.bio,
        avatarUrl: organizer.avatarUrl,
        status: organizer.status,
        totalEvents: organizer.totalEvents,
        successfulEvents: organizer.successfulEvents,
        averageRating: organizer.averageRating,
        totalParticipants: organizer.totalParticipants,
        isFeatured: organizer.isFeatured,
        createdAt: organizer.createdAt.toISOString(),
      },
    };
  }
}

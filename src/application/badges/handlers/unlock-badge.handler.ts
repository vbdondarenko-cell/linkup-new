import { UnlockBadgeRequest } from '../dto/badge.dto';
import { UserBadge } from '../../../domain/badges/entities/badge';
import { IBadgeRepository } from '../../../domain/badges/repositories/i-badge-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { BadgeUnlocked } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class UnlockBadgeHandler {
  constructor(
    private readonly badgeRepository: IBadgeRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: UnlockBadgeRequest): Promise<Result<BadgeResponse>> {
    const existing = await this.badgeRepository.findByType(request.userId, request.badgeType as any);
    if (existing) {
      return { success: false, error: new Error('Badge already earned') };
    }

    const badge = UserBadge.create(request.userId, request.badgeType as any);

    await this.badgeRepository.save(badge);

    // Dispatch domain event
    await this.eventDispatcher.dispatch(new BadgeUnlocked(badge.id, badge.userId, badge.badgeType));

    return {
      success: true,
      data: {
        id: badge.id,
        userId: badge.userId,
        badgeType: badge.badgeType,
        earnedAt: badge.earnedAt.toISOString(),
        displayName: badge.displayName,
      },
    };
  }
}

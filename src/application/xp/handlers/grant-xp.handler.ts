import { GrantXPRequest, XPProgressResponse } from '../dto/xp.dto';
import { XPService } from '../../../domain/xp/services/xp-service';
import { IXPRepository } from '../../../domain/xp/repositories/i-xp-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { LevelUp, XPGranted } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class GrantXPHandler {
  constructor(
    private readonly xpRepository: IXPRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: GrantXPRequest): Promise<Result<XPProgressResponse>> {
    const xpService = new XPService(this.xpRepository);

    const result = await xpService.grantXP(
      { userId: request.userId },
      request.action as any,
      request.description,
      request.eventId
    );

    // Dispatch domain events
    await this.eventDispatcher.dispatch(new XPGranted(request.userId, result.newTotal, request.action));

    if (result.leveledUp) {
      await this.eventDispatcher.dispatch(new LevelUp(request.userId, result.previousLevel, result.level.level));
    }

    return {
      success: true,
      data: {
        userId: request.userId,
        totalXP: result.newTotal,
        level: result.level.level,
        levelTitle: result.level.title,
        progress: result.level.getProgressPercentage(result.newTotal),
        xpToNextLevel: result.level.getXPToNextLevel(result.newTotal),
      },
    };
  }
}

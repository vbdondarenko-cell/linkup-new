import { XPRecord, XP_VALUES, XPAction } from '../entities/xp';
import { Level } from '../entities/level';
import { IXPRepository } from '../repositories/i-xp-repository';
import { EntityId } from '../../shared/types';

export interface XPServiceContext {
  userId: EntityId;
}

export interface GrantXPResult {
  newTotal: number;
  level: Level;
  leveledUp: boolean;
  previousLevel: number;
}

export class XPService {
  constructor(private readonly xpRepository: IXPRepository) {}

  async grantXP(context: XPServiceContext, action: XPAction, description: string, eventId?: EntityId): Promise<GrantXPResult> {
    const amount = XP_VALUES[action];
    const previousTotal = await this.xpRepository.getTotalXP(context.userId);
    const previousLevel = Level.fromXP(previousTotal).level;

    const record = XPRecord.create({
      userId: context.userId,
      action,
      amount,
      description,
      eventId,
    });

    await this.xpRepository.save(record);

    const newTotal = previousTotal + amount;
    const newLevel = Level.fromXP(newTotal);
    const leveledUp = newLevel.level > previousLevel;

    return {
      newTotal,
      level: newLevel,
      leveledUp,
      previousLevel,
    };
  }

  async calculateProgress(userId: EntityId): Promise<{
    totalXP: number;
    level: Level;
    progress: number;
    xpToNextLevel: number;
  }> {
    const totalXP = await this.xpRepository.getTotalXP(userId);
    const level = Level.fromXP(totalXP);

    return {
      totalXP,
      level,
      progress: level.getProgressPercentage(totalXP),
      xpToNextLevel: level.getXPToNextLevel(totalXP),
    };
  }

  async getLeaderboard(pagination: { limit: number; offset: number }): Promise<Array<{ userId: EntityId; totalXP: number; level: Level }>> {
    // This would need a specialized query in the repository
    // For now, return empty array as it requires aggregation
    return [];
  }
}
import { ActivatePremiumRequest } from '../dto/premium.dto';
import { PremiumSubscription } from '../../../domain/premium/entities/premium-subscription';
import { IPremiumRepository } from '../../../domain/premium/repositories/i-premium-repository';
import { IUserRepository } from '../../../domain/users/repositories/i-user-repository';
import { ITransactionManager } from '../../shared/transaction/transaction-manager';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { PremiumActivated } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class ActivatePremiumHandler {
  constructor(
    private readonly premiumRepository: IPremiumRepository,
    private readonly userRepository: IUserRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: ActivatePremiumRequest): Promise<Result<PremiumResponse>> {
    return this.transactionManager.executeInTransaction(async () => {
      const existing = await this.premiumRepository.findActiveByUserId(request.userId);
      if (existing) {
        return { success: false, error: new Error('User already has active subscription') };
      }

      const subscription = PremiumSubscription.create(
        request.userId,
        request.tier,
        request.period
      );

      await this.premiumRepository.save(subscription);

      // Update user premium status
      const user = await this.userRepository.findById(request.userId);
      if (user) {
        user.setPremium(true);
        await this.userRepository.save(user);
      }

      // Dispatch domain event
      await this.eventDispatcher.dispatch(new PremiumActivated(request.userId, request.tier));

      return {
        success: true,
        data: {
          id: subscription.id,
          userId: subscription.userId,
          tier: subscription.tier,
          period: subscription.period,
          startDate: subscription.startDate.toISOString(),
          endDate: subscription.endDate.toISOString(),
          isAutoRenew: subscription.isAutoRenew,
          isActive: subscription.isActive,
          daysRemaining: subscription.daysRemaining,
        },
      };
    });
  }
}

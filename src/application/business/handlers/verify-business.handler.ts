import { VerifyBusinessRequest } from '../dto/business.dto';
import { IBusinessRepository } from '../../../domain/business/repositories/i-business-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { BusinessVerified } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class VerifyBusinessHandler {
  constructor(
    private readonly businessRepository: IBusinessRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: VerifyBusinessRequest): Promise<Result<void>> {
    const business = await this.businessRepository.findById(request.businessId);

    if (!business) {
      return { success: false, error: new Error('Business not found') };
    }

    if (business.isVerified) {
      return { success: false, error: new Error('Business already verified') };
    }

    business.verify();
    await this.businessRepository.save(business);

    // Dispatch domain event
    await this.eventDispatcher.dispatch(new BusinessVerified(business.id, business.ownerId));

    return { success: true, data: undefined };
  }
}

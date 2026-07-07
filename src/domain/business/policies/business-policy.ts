import { Business } from '../entities/business';

export interface BusinessPolicyContext {
  userId: string;
  role: string;
  business?: Business | null;
}

export class BusinessPolicy {
  canCreateBusiness(context: BusinessPolicyContext): boolean {
    return context.role !== 'guest';
  }

  canEditBusiness(context: BusinessPolicyContext, business: Business): boolean {
    if (context.role === 'admin') return true;
    return business.ownerId === context.userId;
  }

  canDeleteBusiness(context: BusinessPolicyContext, business: Business): boolean {
    if (context.role === 'admin') return true;
    return business.ownerId === context.userId;
  }

  canPublishOfficialEvent(context: BusinessPolicyContext, business?: Business | null): boolean {
    if (!business) return false;
    if (context.role === 'admin') return true;
    if (business.ownerId !== context.userId) return false;
    return business.isVerified && business.isActive;
  }

  canViewAnalytics(context: BusinessPolicyContext, business: Business): boolean {
    if (context.role === 'admin') return true;
    return business.ownerId === context.userId;
  }

  canVerifyBusiness(context: BusinessPolicyContext): boolean {
    return context.role === 'admin';
  }
}

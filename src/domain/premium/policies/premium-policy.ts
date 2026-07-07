import { PremiumSubscription } from '../entities/premium-subscription';
import { PremiumRequiredError } from '../errors/premium-errors';

export interface PremiumPolicyContext {
  userId: string;
  subscription?: PremiumSubscription | null;
}

export class PremiumPolicy {
  hasPermission(context: PremiumPolicyContext, permission: string): boolean {
    if (!context.subscription?.isActive) {
      return false;
    }
    return context.subscription.getTierPermissions().includes(permission);
  }

  requirePermission(context: PremiumPolicyContext, permission: string): void {
    if (!this.hasPermission(context, permission)) {
      throw new PremiumRequiredError();
    }
  }

  requireActiveSubscription(context: PremiumPolicyContext): void {
    if (!context.subscription?.isActive) {
      throw new PremiumRequiredError();
    }
  }

  getMaxEvents(context: PremiumPolicyContext): number {
    if (!context.subscription?.isActive) {
      return 3; // Free tier limit
    }

    const permissions = context.subscription.getTierPermissions();
    if (permissions.includes('events.create_unlimited')) {
      return Infinity;
    }
    if (permissions.includes('events.create_limit_50')) {
      return 50;
    }
    if (permissions.includes('events.create_limit_10')) {
      return 10;
    }
    return 3;
  }

  canUseFeature(context: PremiumPolicyContext, feature: string): boolean {
    const premiumFeatures: Record<string, string[]> = {
      'featured_badge': ['badges.featured'],
      'advanced_analytics': ['analytics.full'],
      'verified_business': ['business.verified'],
      'unlimited_events': ['events.create_unlimited'],
      'priority_support': ['pro', 'business'],
    };

    const requiredPermissions = premiumFeatures[feature] || [];
    
    if (!context.subscription?.isActive) {
      return requiredPermissions.length === 0;
    }

    return requiredPermissions.some(perm => {
      if (perm === 'pro' || perm === 'business') {
        return context.subscription!.tier === perm;
      }
      return this.hasPermission(context, perm);
    });
  }
}
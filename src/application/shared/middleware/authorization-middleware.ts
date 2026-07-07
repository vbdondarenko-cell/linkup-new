import { AuthorizationApplicationError } from '../errors/application-errors';
import { EntityId } from '../../domain/shared/types';

export interface AuthorizationContext {
  userId: EntityId;
  role: string;
  isPremium: boolean;
  isOrganizer: boolean;
  organizationIds?: string[];
}

export interface AuthorizationRule {
  resource: string;
  action: string;
  check: (context: AuthorizationContext) => boolean;
}

export class AuthorizationMiddleware {
  private rules: Map<string, AuthorizationRule> = new Map();

  registerRule(rule: AuthorizationRule): void {
    const key = `${rule.resource}:${rule.action}`;
    this.rules.set(key, rule);
  }

  authorize(context: AuthorizationContext, resource: string, action: string): void {
    const key = `${resource}:${action}`;
    const rule = this.rules.get(key);

    if (!rule) {
      return; // No rule means allowed
    }

    if (!rule.check(context)) {
      throw new AuthorizationApplicationError(
        `Access denied for ${action} on ${resource}`
      );
    }
  }

  can(context: AuthorizationContext, resource: string, action: string): boolean {
    try {
      this.authorize(context, resource, action);
      return true;
    } catch {
      return false;
    }
  }

  requirePremium(context: AuthorizationContext, feature: string): void {
    if (!context.isPremium) {
      throw new AuthorizationApplicationError(
        `Premium required for ${feature}`
      );
    }
  }

  requireOrganizer(context: AuthorizationContext): void {
    if (!context.isOrganizer && context.role !== 'admin') {
      throw new AuthorizationApplicationError(
        'Organizer status required'
      );
    }
  }

  requireAdmin(context: AuthorizationContext): void {
    if (context.role !== 'admin') {
      throw new AuthorizationApplicationError(
        'Admin access required'
      );
    }
  }
}

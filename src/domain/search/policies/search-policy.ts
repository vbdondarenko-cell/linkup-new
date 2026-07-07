import { SearchableType } from '../entities/search-result';

export interface SearchPolicyContext {
  userId?: string;
  role: string;
  isPremium: boolean;
}

export class SearchPolicy {
  canSearch(context: SearchPolicyContext): boolean {
    return true; // All users can search
  }

  canSearchType(context: SearchPolicyContext, type: SearchableType): boolean {
    if (context.role === 'admin') return true;

    switch (type) {
      case 'user':
      case 'organizer':
        return context.isPremium || context.role !== 'guest';
      default:
        return true;
    }
  }

  canViewResult(context: SearchPolicyContext, result: { type: SearchableType }): boolean {
    return this.canSearchType(context, result.type);
  }

  getSearchLimit(context: SearchPolicyContext): number {
    if (context.isPremium || context.role === 'admin') {
      return 100;
    }
    return 20;
  }

  getFilterPermissions(context: SearchPolicyContext): string[] {
    if (context.role === 'admin') {
      return ['location', 'date', 'interests', 'category'];
    }

    const permissions = ['location', 'date'];

    if (context.isPremium) {
      permissions.push('interests', 'category');
    }

    return permissions;
  }
}

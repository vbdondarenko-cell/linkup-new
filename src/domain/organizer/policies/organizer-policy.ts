import { Organizer } from '../entities/organizer';
import { OrganizerError } from '../errors/organizer-errors';

export interface OrganizerPolicyContext {
  userId: string;
  role: string;
  organizer?: Organizer | null;
  isPremium: boolean;
}

export class OrganizerPolicy {
  private readonly EVENT_THRESHOLD = 5;
  private readonly RATING_THRESHOLD = 4.0;

  canBecomeOrganizer(context: OrganizerPolicyContext, userStats: { totalEvents: number; averageRating: number }): boolean {
    if (context.role === 'admin') return true;
    if (context.organizer) return false;
    return userStats.totalEvents >= this.EVENT_THRESHOLD && userStats.averageRating >= this.RATING_THRESHOLD;
  }

  canCreateEvent(context: OrganizerPolicyContext): boolean {
    if (!context.organizer) return false;
    if (context.role === 'admin') return true;
    return context.organizer.isActive;
  }

  canEditEvent(context: OrganizerPolicyContext, eventOrganizerId: string): boolean {
    if (context.role === 'admin') return true;
    return context.organizer?.userId === eventOrganizerId && context.organizer.isActive;
  }

  canFeatureOrganizer(context: OrganizerPolicyContext): boolean {
    return context.role === 'admin';
  }

  canSuspendOrganizer(context: OrganizerPolicyContext): boolean {
    return context.role === 'admin';
  }

  canViewStatistics(context: OrganizerPolicyContext, organizerId: string): boolean {
    if (context.role === 'admin') return true;
    return context.organizer?.id === organizerId;
  }

  getEventCreationLimit(context: OrganizerPolicyContext): number {
    if (context.role === 'admin') return Infinity;
    if (context.isPremium) return 50;
    if (context.organizer?.isActive) return 10;
    return 3;
  }

  checkEventCreation(context: OrganizerPolicyContext, currentEventCount: number): void {
    const limit = this.getEventCreationLimit(context);
    if (currentEventCount >= limit) {
      throw new OrganizerError(`Event creation limit reached: ${limit}`);
    }
  }
}

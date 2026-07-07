import { EntityId } from '../../shared/types';
import { Event } from '../entities/event';
import { PermissionDeniedError } from '../errors/event-errors';

export interface PolicyContext {
  userId: EntityId;
  role: string;
  isPremium: boolean;
  isOrganizer: boolean;
}

export class EventPolicy {
  canCreateEvent(context: PolicyContext): boolean {
    return context.isOrganizer || context.isPremium || context.role === 'admin';
  }

  canEditEvent(context: PolicyContext, event: Event): boolean {
    if (context.role === 'admin') return true;
    return event.organizerId === context.userId;
  }

  canDeleteEvent(context: PolicyContext, event: Event): boolean {
    if (context.role === 'admin') return true;
    return event.organizerId === context.userId;
  }

  canPublishEvent(context: PolicyContext, event: Event): boolean {
    if (context.role === 'admin') return true;
    if (event.organizerId !== context.userId) return false;
    return context.isOrganizer || context.isPremium;
  }

  canCancelEvent(context: PolicyContext, event: Event): boolean {
    if (context.role === 'admin') return true;
    return event.organizerId === context.userId && !event.isCompleted;
  }

  canJoinEvent(context: PolicyContext, event: Event, participantCount: number): boolean {
    if (!event.isPublished) return false;
    if (event.organizerId === context.userId) return false;
    
    if (event.capacity) {
      return event.capacity.canAccept(participantCount);
    }
    return true;
  }

  canLeaveEvent(context: PolicyContext, event: Event): boolean {
    if (event.isCompleted || event.isCancelled) return false;
    return true;
  }

  canViewEvent(context: PolicyContext, event: Event): boolean {
    if (event.visibility === 'public') return true;
    if (context.role === 'admin') return true;
    if (event.organizerId === context.userId) return true;
    if (event.visibility === 'private') {
      // Would need to check if user is invited
      return false;
    }
    return false;
  }

  checkPermission(context: PolicyContext, action: string, event?: Event): void {
    switch (action) {
      case 'create':
        if (!this.canCreateEvent(context)) throw new PermissionDeniedError('create event');
        break;
      case 'edit':
        if (!event || !this.canEditEvent(context, event)) throw new PermissionDeniedError('edit event');
        break;
      case 'delete':
        if (!event || !this.canDeleteEvent(context, event)) throw new PermissionDeniedError('delete event');
        break;
      case 'publish':
        if (!event || !this.canPublishEvent(context, event)) throw new PermissionDeniedError('publish event');
        break;
      case 'cancel':
        if (!event || !this.canCancelEvent(context, event)) throw new PermissionDeniedError('cancel event');
        break;
      case 'join':
        if (!event || !this.canJoinEvent(context, event, 0)) throw new PermissionDeniedError('join event');
        break;
    }
  }
}

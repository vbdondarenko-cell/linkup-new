import { BaseDomainEvent } from './domain-event';
import { EntityId } from '../types';

// User Events
export class UserCreated extends BaseDomainEvent {
  constructor(userId: EntityId, public readonly telegramId?: string) {
    super('UserCreated', userId);
  }
}

export class UserUpdated extends BaseDomainEvent {
  constructor(userId: EntityId) {
    super('UserUpdated', userId);
  }
}

// Profile Events
export class ProfileCreated extends BaseDomainEvent {
  constructor(profileId: EntityId, public readonly userId: EntityId) {
    super('ProfileCreated', profileId);
  }
}

export class ProfileUpdated extends BaseDomainEvent {
  constructor(profileId: EntityId) {
    super('ProfileUpdated', profileId);
  }
}

// Event Events
export class EventCreated extends BaseDomainEvent {
  constructor(eventId: EntityId, public readonly organizerId: EntityId) {
    super('EventCreated', eventId);
  }
}

export class EventPublished extends BaseDomainEvent {
  constructor(eventId: EntityId) {
    super('EventPublished', eventId);
  }
}

export class EventStarted extends BaseDomainEvent {
  constructor(eventId: EntityId) {
    super('EventStarted', eventId);
  }
}

export class EventFinished extends BaseDomainEvent {
  constructor(eventId: EntityId) {
    super('EventFinished', eventId);
  }
}

export class EventCancelled extends BaseDomainEvent {
  constructor(eventId: EntityId, public readonly reason?: string) {
    super('EventCancelled', eventId);
  }
}

// Participant Events
export class ParticipantJoined extends BaseDomainEvent {
  constructor(eventId: EntityId, public readonly userId: EntityId) {
    super('ParticipantJoined', `${eventId}_${userId}`);
  }
}

export class ParticipantLeft extends BaseDomainEvent {
  constructor(eventId: EntityId, public readonly userId: EntityId) {
    super('ParticipantLeft', `${eventId}_${userId}`);
  }
}

export class ParticipantApproved extends BaseDomainEvent {
  constructor(eventId: EntityId, public readonly userId: EntityId) {
    super('ParticipantApproved', `${eventId}_${userId}`);
  }
}

export class ParticipantDeclined extends BaseDomainEvent {
  constructor(eventId: EntityId, public readonly userId: EntityId) {
    super('ParticipantDeclined', `${eventId}_${userId}`);
  }
}

// Chat Events
export class ChatCreated extends BaseDomainEvent {
  constructor(conversationId: EntityId, public readonly type: string) {
    super('ChatCreated', conversationId);
  }
}

export class MessageSent extends BaseDomainEvent {
  constructor(messageId: EntityId, public readonly conversationId: EntityId, public readonly senderId: EntityId) {
    super('MessageSent', messageId);
  }
}

// Premium Events
export class PremiumActivated extends BaseDomainEvent {
  constructor(userId: EntityId, public readonly tier: string) {
    super('PremiumActivated', userId);
  }
}

export class PremiumExpired extends BaseDomainEvent {
  constructor(userId: EntityId) {
    super('PremiumExpired', userId);
  }
}

// Badge Events
export class BadgeUnlocked extends BaseDomainEvent {
  constructor(badgeId: EntityId, public readonly userId: EntityId, public readonly badgeType: string) {
    super('BadgeUnlocked', badgeId);
  }
}

// XP Events
export class LevelUp extends BaseDomainEvent {
  constructor(userId: EntityId, public readonly previousLevel: number, public readonly newLevel: number) {
    super('LevelUp', userId);
  }
}

export class XPGranted extends BaseDomainEvent {
  constructor(userId: EntityId, public readonly amount: number, public readonly action: string) {
    super('XPGranted', userId);
  }
}

// Trust/Reputation Events
export class TrustUpdated extends BaseDomainEvent {
  constructor(userId: EntityId, public readonly newScore: number) {
    super('TrustUpdated', userId);
  }
}

export class ReportCreated extends BaseDomainEvent {
  constructor(reportId: EntityId, public readonly reporterId: EntityId, public readonly targetId: EntityId) {
    super('ReportCreated', reportId);
  }
}

export class ReportResolved extends BaseDomainEvent {
  constructor(reportId: EntityId, public readonly reviewerId: EntityId) {
    super('ReportResolved', reportId);
  }
}

// Business Events
export class BusinessVerified extends BaseDomainEvent {
  constructor(businessId: EntityId, public readonly ownerId: EntityId) {
    super('BusinessVerified', businessId);
  }
}

export class BusinessCreated extends BaseDomainEvent {
  constructor(businessId: EntityId, public readonly ownerId: EntityId) {
    super('BusinessCreated', businessId);
  }
}

// Organizer Events
export class OrganizerUnlocked extends BaseDomainEvent {
  constructor(organizerId: EntityId, public readonly userId: EntityId) {
    super('OrganizerUnlocked', organizerId);
  }
}

export class OrganizerPromoted extends BaseDomainEvent {
  constructor(organizerId: EntityId) {
    super('OrganizerPromoted', organizerId);
  }
}

// Notification Events
export class NotificationCreated extends BaseDomainEvent {
  constructor(notificationId: EntityId, public readonly userId: EntityId) {
    super('NotificationCreated', notificationId);
  }
}

export type DomainEventType =
  | UserCreated
  | UserUpdated
  | ProfileCreated
  | ProfileUpdated
  | EventCreated
  | EventPublished
  | EventStarted
  | EventFinished
  | EventCancelled
  | ParticipantJoined
  | ParticipantLeft
  | ParticipantApproved
  | ParticipantDeclined
  | ChatCreated
  | MessageSent
  | PremiumActivated
  | PremiumExpired
  | BadgeUnlocked
  | LevelUp
  | XPGranted
  | TrustUpdated
  | ReportCreated
  | ReportResolved
  | BusinessVerified
  | BusinessCreated
  | OrganizerUnlocked
  | OrganizerPromoted
  | NotificationCreated;

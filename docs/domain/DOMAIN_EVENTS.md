# Domain Events Reference

## Overview

Domain Events represent significant state changes in the domain model. They enable:
- Loose coupling between bounded contexts
- Event-driven architectures
- Audit trails
- Real-time notifications
- Consistency maintenance

## Event Structure

All events extend `BaseDomainEvent`:

```typescript
abstract class BaseDomainEvent implements DomainEvent {
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly aggregateId: string;
}
```

## User Events

### UserCreated
Fired when a new user registers via Telegram.

```typescript
new UserCreated(userId: EntityId, telegramId?: string)
```

**Payload:**
- `aggregateId`: userId
- `telegramId`: Telegram user ID (optional)

---

### UserUpdated
Fired when user profile is updated.

```typescript
new UserUpdated(userId: EntityId)
```

---

## Profile Events

### ProfileCreated
Fired when a user creates their profile.

```typescript
new ProfileCreated(profileId: EntityId, userId: EntityId)
```

---

### ProfileUpdated
Fired when profile details change.

```typescript
new ProfileUpdated(profileId: EntityId)
```

---

## Event Events

### EventCreated
Fired when a new event is created.

```typescript
new EventCreated(eventId: EntityId, organizerId: EntityId)
```

---

### EventPublished
Fired when an event transitions from draft to published.

```typescript
new EventPublished(eventId: EntityId)
```

**Side Effects:**
- Event appears in search
- Notifications sent to followers

---

### EventStarted
Fired when an event begins.

```typescript
new EventStarted(eventId: EntityId)
```

---

### EventFinished
Fired when an event ends.

```typescript
new EventFinished(eventId: EntityId)
```

**Side Effects:**
- Participants marked as attended/no-show
- XP awarded
- Trust scores updated

---

### EventCancelled
Fired when an event is cancelled.

```typescript
new EventCancelled(eventId: EntityId, reason?: string)
```

**Side Effects:**
- Participants notified
- Refunds initiated
- Event removed from recommendations

---

## Participation Events

### ParticipantJoined
Fired when a user joins an event.

```typescript
new ParticipantJoined(eventId: EntityId, userId: EntityId)
```

**Payload:**
- `aggregateId`: `${eventId}_${userId}`

---

### ParticipantLeft
Fired when a user leaves/cancels participation.

```typescript
new ParticipantLeft(eventId: EntityId, userId: EntityId)
```

---

### ParticipantApproved
Fired when a join request is approved.

```typescript
new ParticipantApproved(eventId: EntityId, userId: EntityId)
```

---

### ParticipantDeclined
Fired when a join request is declined.

```typescript
new ParticipantDeclined(eventId: EntityId, userId: EntityId)
```

---

## Chat Events

### ChatCreated
Fired when a new conversation is created.

```typescript
new ChatCreated(conversationId: EntityId, type: string)
```

---

### MessageSent
Fired when a message is sent.

```typescript
new MessageSent(messageId: EntityId, conversationId: EntityId, senderId: EntityId)
```

---

## Premium Events

### PremiumActivated
Fired when premium subscription starts.

```typescript
new PremiumActivated(userId: EntityId, tier: string)
```

**Side Effects:**
- User flagged as premium
- Permissions updated
- Badge unlocked (if first time)

---

### PremiumExpired
Fired when premium subscription ends.

```typescript
new PremiumExpired(userId: EntityId)
```

---

## Gamification Events

### BadgeUnlocked
Fired when a user earns a badge.

```typescript
new BadgeUnlocked(badgeId: EntityId, userId: EntityId, badgeType: string)
```

---

### LevelUp
Fired when a user reaches a new level.

```typescript
new LevelUp(userId: EntityId, previousLevel: number, newLevel: number)
```

---

### XPGranted
Fired when XP is awarded.

```typescript
new XPGranted(userId: EntityId, amount: number, action: string)
```

---

## Trust & Reputation Events

### TrustUpdated
Fired when user's trust score changes.

```typescript
new TrustUpdated(userId: EntityId, newScore: number)
```

---

## Moderation Events

### ReportCreated
Fired when content is reported.

```typescript
new ReportCreated(reportId: EntityId, reporterId: EntityId, targetId: EntityId)
```

---

### ReportResolved
Fired when a report is resolved.

```typescript
new ReportResolved(reportId: EntityId, reviewerId: EntityId)
```

---

## Business Events

### BusinessCreated
Fired when a business account is created.

```typescript
new BusinessCreated(businessId: EntityId, ownerId: EntityId)
```

---

### BusinessVerified
Fired when a business is verified.

```typescript
new BusinessVerified(businessId: EntityId, ownerId: EntityId)
```

---

## Organizer Events

### OrganizerUnlocked
Fired when a user becomes an organizer.

```typescript
new OrganizerUnlocked(organizerId: EntityId, userId: EntityId)
```

---

### OrganizerPromoted
Fired when an organizer is featured/promoted.

```typescript
new OrganizerPromoted(organizerId: EntityId)
```

---

## Notification Events

### NotificationCreated
Fired when a notification is created.

```typescript
new NotificationCreated(notificationId: EntityId, userId: EntityId)
```

---

## Event Bus Integration

Events are designed to be published to an event bus:

```typescript
interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): Promise<void>;
}
```

## Example Usage

```typescript
// Publishing an event
const event = new EventPublished(eventId);
eventBus.publish(event);

// Subscribing to events
eventBus.subscribe('EventPublished', async (event) => {
  await notificationService.notifyFollowers(event.aggregateId);
});
```

## Best Practices

1. **Immutability**: Events are immutable records
2. **Past Tense**: Event names are past tense (Created, Updated)
3. **Include Context**: Include relevant IDs and data
4. **One Event Type**: Each change = one event
5. **No Responses**: Events don't expect return values
6. **Async Processing**: Event handlers run asynchronously

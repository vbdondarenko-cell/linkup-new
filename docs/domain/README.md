# LinkUp Domain Layer

## Phase 4.0 - Domain & Business Logic

This document covers the complete Domain Layer implementation for LinkUp V5.

## Overview

The Domain Layer implements **Domain-Driven Design (DDD)** principles using **Clean Architecture**. It contains all business logic, rules, and domain knowledge, completely independent from any external frameworks or infrastructure.

## Key Characteristics

✅ **Framework Independent** - Zero dependencies on React, Supabase, Telegram SDK
✅ **Reusable** - Works with Web, Mobile, Desktop, API clients
✅ **Testable** - Pure business logic, no mocks needed for unit tests
✅ **Type-Safe** - Strict TypeScript typing throughout
✅ **Immutable VOs** - Value objects are immutable where appropriate

## Directory Structure

```
src/domain/
├── shared/                    # Shared infrastructure
│   ├── entities/              # BaseEntity
│   ├── events/                # Domain events
│   ├── errors/                # Base errors
│   ├── types/                 # Common types
│   └── validators/            # Validation utilities
│
├── auth/                      # Authentication
├── users/                     # User management
├── profiles/                  # User profiles
├── roles/                     # Role management
├── permissions/               # Permission management
├── interests/                 # Interest categories
├── events/                    # Event management (core)
├── event-series/              # Recurring events
├── participants/              # Event participation
├── chat/                      # Messaging
├── notifications/             # Notifications
├── premium/                   # Premium subscriptions
├── xp/                        # Experience points
├── badges/                    # Badges & achievements
├── reputation/                # Trust & reputation
├── recommendations/           # Event recommendations
├── search/                    # Search functionality
├── business/                  # Business accounts
├── organizer/                 # Organizer accounts
├── reports/                   # Content moderation
├── ratings/                   # User ratings
└── analytics/                 # Analytics
```

## Module Contents

Each module contains:

| Component | Purpose |
|-----------|---------|
| Entities | Domain objects with identity and behavior |
| Value Objects | Immutable objects defined by attributes |
| Domain Services | Operations that don't belong to entities |
| Repository Interfaces | Data access contracts (no implementation) |
| Use Cases | Application-level business operations |
| Validators | Input validation rules |
| Policies | Authorization and business rules |
| Factories | Entity creation logic |
| Errors | Domain-specific error types |
| Events | Module-specific domain events |

## Quick Start

### Importing Domain

```typescript
import { Event, EventCapacity, EventValidator } from './domain';
import { PremiumPolicy } from './domain/premium';
import { UserCreated } from './domain/shared/events/domain-events';
```

### Creating an Event

```typescript
const event = Event.create({
  organizerId: 'org_123',
  title: 'Tech Meetup',
  description: 'Join us for an evening of tech talks',
  startDate: new Date('2024-03-15T18:00:00'),
  endDate: new Date('2024-03-15T21:00:00'),
  capacity: EventCapacity.create(10, 100),
  isFree: true,
  visibility: 'public',
  interests: ['tech', 'networking'],
});

event.publish();
```

### Using Policies

```typescript
const policy = new EventPolicy();
const context = {
  userId: 'user_123',
  role: 'organizer',
  isPremium: false,
  isOrganizer: true,
};

if (policy.canEditEvent(context, event)) {
  event.updateTitle('Updated Title');
}
```

### Handling Domain Events

```typescript
const event = new EventPublished(eventId);

// Publish to event bus
await eventBus.publish(event);

// Subscribe to events
eventBus.subscribe('EventPublished', async (e) => {
  await notifyService.notifyFollowers(e.aggregateId);
});
```

## Testing

Domain entities and use cases are fully testable without infrastructure:

```typescript
describe('Event Entity', () => {
  it('should publish a draft event', () => {
    const event = Event.create({...});
    event.publish();
    expect(event.isPublished).toBe(true);
  });
});
```

Run tests:
```bash
npm test -- --testPathPattern="domain/__tests__"
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [ENTITIES.md](./ENTITIES.md) - Entity reference
- [USE_CASES.md](./USE_CASES.md) - Use case documentation
- [DOMAIN_EVENTS.md](./DOMAIN_EVENTS.md) - Event catalog
- [BUSINESS_RULES.md](./BUSINESS_RULES.md) - Rules and limits

## What's Next

### Phase 5: Application Layer & API Integration

The next phase will implement:
1. Repository implementations (Supabase)
2. Telegram SDK integration
3. Event bus infrastructure
4. Transaction management
5. API controllers

## Success Criteria ✅

- [x] Complete Domain Layer exists
- [x] Every business rule is in Domain
- [x] All Use Cases are UI-independent
- [x] No framework dependencies in Domain
- [x] Validation is centralized
- [x] Policies are centralized
- [x] Domain Events implemented
- [x] Repository interfaces defined
- [ ] Unit tests (in progress)
- [ ] Phase 5 preparation

## Contributing

When adding new domain logic:
1. Add entity/value object in appropriate module
2. Define repository interface (no implementation)
3. Add use cases for operations
4. Create/update validators
5. Define domain events for significant changes
6. Add policies for authorization rules
7. Write unit tests
8. Update documentation

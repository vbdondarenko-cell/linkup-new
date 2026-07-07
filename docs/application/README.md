# LinkUp Application Layer

## Phase 5.0 - Application Layer + API Integration

This document covers the complete Application Layer implementation for LinkUp V5.

## Overview

The Application Layer orchestrates the Domain Layer and Infrastructure using **CQRS (Command Query Responsibility Segregation)** pattern. It implements use cases, handles transactions, dispatches events, and coordinates all external integrations.

## Architecture

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│    (React, React Native, Desktop, API)       │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│            Application Layer                 │
│  (Commands, Queries, Handlers, Services)    │
│  ⚠️ Depends on Domain and Infrastructure     │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│                 Domain Layer                 │
│    (Entities, Value Objects, Use Cases)     │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│          Infrastructure Layer                │
│      (Supabase, Telegram, Storage)         │
└─────────────────────────────────────────────┘
```

## Module Structure

```
src/application/
├── shared/                    # Shared utilities
│   ├── errors/              # Application errors
│   ├── middleware/           # Auth, Validation, Logging
│   ├── cache/               # Caching service
│   ├── transaction/         # Transaction manager
│   ├── dispatcher/          # Event dispatcher
│   └── api-clients/         # External API clients
│
├── auth/                     # Authentication
├── profiles/                 # User profiles
├── events/                   # Event management
├── participants/             # Event participation
├── chat/                     # Messaging
├── notifications/             # Notifications
├── premium/                  # Premium subscriptions
├── xp/                       # Experience points
├── badges/                   # Achievement badges
├── business/                 # Business accounts
├── organizer/                # Organizer accounts
├── analytics/                # Analytics tracking
└── reports/                  # Content moderation
```

## Each Module Contains

| Component | Purpose |
|-----------|---------|
| Commands | Write operations (Create, Update, Delete) |
| Queries | Read operations (Get, List, Search) |
| Handlers | Execute commands and queries |
| DTO | Data transfer objects for API |
| Mappers | Convert between DTO and Domain |
| Services | Application services orchestrating handlers |

## CQRS Pattern

### Commands (Write)
```typescript
// Commands change state
CreateEventCommand
UpdateProfileCommand
JoinEventCommand
PublishEventCommand
```

### Queries (Read)
```typescript
// Queries read state
GetEventQuery
GetProfileQuery
SearchEventsQuery
GetRecommendationsQuery
```

## Key Components

### 1. Error Handling

```typescript
// Centralized application errors
ValidationApplicationError
AuthorizationApplicationError
NotFoundApplicationError
ConflictApplicationError
NetworkApplicationError
RetryableApplicationError
TransactionApplicationError
```

### 2. Authorization Middleware

```typescript
// Check permissions before execution
authorization.authorize(context, 'profile', 'update');
authorization.requirePremium(context, 'featured_badge');
authorization.requireOrganizer(context);
```

### 3. Validation Middleware

```typescript
// Validate input before processing
validation.validate(rules, data);
// Rules: required, type, minLength, maxLength, pattern, custom
```

### 4. Caching

```typescript
// Cache frequently accessed data
cache.get(key);
cache.set(key, value, { ttl: 300, tags: ['event'] });
cache.deleteByTags(['event']);
```

### 5. Transaction Manager

```typescript
// Ensure data consistency
transactionManager.executeInTransaction(async () => {
  // Multiple operations in single transaction
  await eventRepository.save(event);
  await participantRepository.save(participant);
});
```

### 6. Event Dispatcher

```typescript
// Publish domain events
eventDispatcher.dispatch(new EventCreated(eventId, organizerId));
eventDispatcher.dispatch(new ParticipantJoined(eventId, userId));
```

### 7. Logging

```typescript
// Log all operations
logger.execute('OperationName', userId, async (correlationId) => {
  // Operation with correlation tracking
});
```

## Command Flow

```
Client Request
    ↓
DTO Validation (Middleware)
    ↓
Authorization Check (Middleware)
    ↓
Command Handler
    ↓
Transaction Start
    ↓
Domain Use Case
    ↓
Repository Operations
    ↓
Domain Events Dispatched
    ↓
Transaction Commit
    ↓
Cache Invalidation
    ↓
Response DTO
```

## Query Flow

```
Client Query
    ↓
DTO Validation
    ↓
Authorization Check
    ↓
Query Handler
    ↓
Cache Check
    ↓
Repository Query
    ↓
Cache Store (optional)
    ↓
Response DTO
```

## API Clients

### Supabase Client
```typescript
// Database operations
supabase.select('events', { eq: { status: 'published' } });
supabase.insert('profiles', { userId, bio });
supabase.update('events', { title }, { eq: { id } });
```

### Telegram Client
```typescript
// Bot operations
telegram.sendMessage({ chatId, text });
telegram.sendPhoto({ chatId, photo, caption });
telegram.answerCallbackQuery(callbackQueryId);
```

### Notification Client
```typescript
// Push, Email, SMS
notification.sendPush(userId, { title, body });
notification.sendEmail({ to, subject, html });
```

## Dependency Rules

```
Application Layer CAN use:
✓ Domain Layer
✓ Infrastructure Interfaces
✓ Shared Utilities

Application Layer CANNOT use:
✗ React / Vue / Svelte
✗ CSS / HTML / UI Components
✗ Direct Database Access
✗ Direct External APIs
```

## Testing

Application layer is testable with mocks:

```typescript
describe('CreateEventHandler', () => {
  it('should create event in transaction', async () => {
    const handler = new CreateEventHandler(
      mockEventRepository,
      mockTransactionManager,
      mockEventDispatcher
    );

    const result = await handler.handle(new CreateEventCommand(request));

    expect(result.success).toBe(true);
    expect(mockEventRepository.save).toHaveBeenCalled();
    expect(mockEventDispatcher.dispatch).toHaveBeenCalled();
  });
});
```

## What's Next (Phase 6)

### Presentation Layer + Design System

The next phase will implement:
1. React components
2. Design system
3. Screens
4. State management
5. Routing

## Success Criteria ✅

- [x] Complete Application Layer implemented
- [x] CQRS architecture implemented
- [x] Commands and Queries separated
- [x] Transactions centralized
- [x] Authorization centralized
- [x] DTO mapping complete
- [x] Event dispatching implemented
- [x] Caching implemented
- [ ] Offline synchronization (Phase 6)
- [ ] Application Layer tests

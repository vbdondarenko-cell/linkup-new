# LinkUp Domain Layer - Architecture

## Overview

The Domain Layer is the core of the LinkUp application, implementing **Domain-Driven Design (DDD)** principles following **Clean Architecture** patterns. This layer is completely independent from any external frameworks, UI, or infrastructure concerns.

## Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│    (React, React Native, Desktop, API)       │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│             Application Layer                 │
│        (Use Cases, Application Services)      │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│                Domain Layer                   │
│    (Entities, Value Objects, Services)       │
│         ⚠️ NO FRAMEWORK DEPENDENCIES         │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│            Infrastructure Layer               │
│     (Supabase, Telegram SDK, Mapbox)          │
└─────────────────────────────────────────────┘
```

## Domain Layer Structure

```
src/domain/
├── shared/                    # Shared types, base classes, utilities
│   ├── entities/              # BaseEntity
│   ├── events/                # Domain events, event infrastructure
│   ├── errors/                # Domain errors
│   ├── types/                 # Common TypeScript types
│   └── validators/            # Validation utilities
│
├── auth/                      # Authentication
│   ├── entities/              # Session
│   ├── value-objects/         # TelegramInitData
│   ├── errors/                # Auth errors
│   ├── repositories/          # ISessionRepository
│   ├── services/              # AuthService
│   └── use-cases/             # LoginWithTelegram, Logout, RefreshSession
│
├── users/                     # User management
│   ├── entities/              # User
│   └── repositories/          # IUserRepository
│
├── profiles/                  # User profiles
│   ├── entities/              # Profile
│   ├── value-objects/         # Coordinates, Location, Radius, Language
│   ├── errors/
│   ├── repositories/
│   ├── services/
│   └── use-cases/             # CreateProfile, UpdateProfile, ChangeLanguage
│
├── roles/                     # Role management
├── permissions/               # Permission management
├── interests/                 # Interest categories
├── events/                    # Event management (core)
├── event-series/              # Recurring events
├── participants/               # Event participation
├── chat/                      # Messaging
├── notifications/              # User notifications
├── premium/                   # Premium subscriptions
├── xp/                        # Experience points
├── badges/                    # Achievement badges
├── reputation/                # Trust & reputation
├── recommendations/           # Event recommendations
├── search/                    # Search functionality
├── business/                  # Business accounts
├── organizer/                 # Organizer accounts
├── reports/                   # Content moderation
├── ratings/                  # User ratings
└── analytics/                # Analytics & metrics
```

## Module Structure

Each module follows a consistent structure:

```
module/
├── entities/              # Domain entities (aggregate roots)
├── value-objects/         # Immutable value objects
├── services/              # Domain services
├── repositories/          # Repository interfaces (no implementation)
├── use-cases/             # Application use cases
├── validators/            # Input validation
├── policies/              # Business rules & policies
├── factories/             # Entity factories
├── errors/                # Domain-specific errors
├── events/                # Module-specific domain events
└── index.ts               # Public exports
```

## Key Design Principles

### 1. Independence from Infrastructure

The Domain Layer has **zero dependencies** on:
- Supabase / Database
- Telegram SDK
- Mapbox / Maps
- React / UI Frameworks
- CSS / Styling
- HTML / DOM

### 2. Entities & Aggregate Roots

- All entities extend `BaseEntity<T>`
- Have unique identity (`id`)
- Track `createdAt` and `updatedAt`
- Support `toJSON()` serialization

### 3. Value Objects

- Immutable
- Equality based on value, not identity
- Examples: `Coordinates`, `Money`, `Language`, `Radius`

### 4. Repository Interfaces

Only **interfaces** are defined in Domain:
```typescript
export interface IEventRepository {
  findById(id: EntityId): Promise<Event | null>;
  findByOrganizer(organizerId: EntityId): Promise<Event[]>;
  save(event: Event): Promise<void>;
  delete(id: EntityId): Promise<void>;
}
```

**Implementation** belongs in Infrastructure Layer.

### 5. Domain Events

All significant state changes publish domain events:
- `EventCreated`
- `EventPublished`
- `ParticipantJoined`
- `LevelUp`
- `BadgeUnlocked`
- etc.

### 6. Validation

Validation rules are centralized in the Domain:
- `EventValidator`
- Entity-specific rules
- Value object constructors

### 7. Policies

Business rules encapsulated in policies:
- `EventPolicy` - Event access rules
- `ChatPolicy` - Messaging rules
- `PremiumPolicy` - Feature access
- `OrganizerPolicy` - Organizer permissions

## Dependency Rules

```
Domain ──────────────────────────► Shared
  │                                    ▲
  │                                    │
  └────────────────────────────────────┘
  
Domain ──────────────────────────✗ Infrastructure (forbidden)
Domain ──────────────────────────✗ Presentation (forbidden)
```

## Entity Lifecycle

```
Created ──► Draft ──► Published ──► Ongoing ──► Completed
                │           │
                │           └──► Cancelled ──► Archived
                │
                └──► Archived
```

## Testing Strategy

Domain entities and use cases are **unit testable** without:
- Database
- Network
- External services

```typescript
describe('Event Entity', () => {
  it('should publish a draft event', () => {
    const event = Event.create({...});
    event.publish();
    expect(event.isPublished).toBe(true);
  });
});
```

## Next Steps: Application Layer

The Domain Layer is ready for the **Application Layer** which will:
1. Implement repository interfaces
2. Orchestrate use cases
3. Handle transactions
4. Integrate with Supabase
5. Connect to Telegram SDK

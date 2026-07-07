# Application Module Reference

## Auth Module

### Commands
- `LoginCommand` - Authenticate user via Telegram
- `LogoutCommand` - End user session
- `RefreshSessionCommand` - Extend session validity

### Queries
- `GetSessionQuery` - Retrieve session information

### Service
- `AuthService` - Orchestrates authentication operations

### Flow
```
LoginRequest → LoginCommand → LoginHandler → LoginWithTelegramUseCase
                                                    ↓
                                              ISessionRepository
                                              IUserRepository
                                                    ↓
                                              Session + User created
                                                    ↓
                                              LoginResponse
```

---

## Profiles Module

### Commands
- `CreateProfileCommand` - Create user profile
- `UpdateProfileCommand` - Update profile details
- `ChangeLanguageCommand` - Change preferred language
- `UpdateLocationCommand` - Update user location

### Queries
- `GetProfileQuery` - Get profile by ID
- `GetProfileByUserIdQuery` - Get profile by user ID

### Service
- `ProfileService` - Orchestrates profile operations with caching

### Flow
```
CreateProfileRequest → CreateProfileCommand → CreateProfileHandler
                                                       ↓
                                                 CreateProfileUseCase
                                                       ↓
                                                 IProfileRepository
                                                       ↓
                                                 Cache invalidation
                                                       ↓
                                                 ProfileResponse
```

---

## Events Module

### Commands
- `CreateEventCommand` - Create new event (draft)
- `UpdateEventCommand` - Update event details
- `PublishEventCommand` - Publish draft event
- `CancelEventCommand` - Cancel event
- `ArchiveEventCommand` - Archive event

### Queries
- `GetEventQuery` - Get event by ID
- `GetEventsNearbyQuery` - Get events near location
- `GetOrganizerEventsQuery` - Get events by organizer
- `SearchEventsQuery` - Search events

### Service
- `EventService` - Orchestrates event operations with caching

### Flow
```
CreateEventRequest → CreateEventCommand → CreateEventHandler
                                                  ↓
                                            Transaction Start
                                                  ↓
                                            EventFactory.create()
                                                  ↓
                                            IEventRepository.save()
                                                  ↓
                                            EventCreated dispatch
                                                  ↓
                                            Transaction Commit
                                                  ↓
                                            Cache invalidation
                                                  ↓
                                            EventResponse
```

---

## Participants Module

### Commands
- `JoinEventCommand` - Request to join event
- `LeaveEventCommand` - Cancel participation
- `ApproveRequestCommand` - Approve join request
- `DeclineRequestCommand` - Decline join request
- `CheckInCommand` - Check in participant

### Queries
- `GetParticipantsQuery` - Get event participants
- `GetUserEventsQuery` - Get events user joined

### Handler
- `JoinEventHandler` - Handles join with waitlist logic
- `LeaveEventHandler` - Handles leave

### Flow
```
JoinEventRequest → JoinEventCommand → JoinEventHandler
                                             ↓
                                       Transaction Start
                                             ↓
                                 Check capacity + existing
                                             ↓
                              Participant.create() or waitlist
                                             ↓
                                 IParticipantRepository.save()
                                             ↓
                                 ParticipantJoined dispatch
                                             ↓
                                       Transaction Commit
```

---

## Chat Module

### Commands
- `CreateConversationCommand` - Create chat
- `SendMessageCommand` - Send message
- `DeleteMessageCommand` - Delete message

### Queries
- `GetConversationQuery` - Get conversation
- `GetMessagesQuery` - Get messages

### Handlers
- `SendMessageHandler` - Sends message and updates conversation

### Flow
```
SendMessageRequest → SendMessageHandler
                            ↓
                    IConversationRepository
                            ↓
                    Message.create()
                            ↓
                    IMessageRepository.save()
                            ↓
                    MessageSent dispatch
                            ↓
                    MessageResponse
```

---

## Notifications Module

### Commands
- `CreateNotificationCommand` - Create notification
- `MarkReadCommand` - Mark as read

### Queries
- `GetNotificationsQuery` - Get user notifications
- `GetUnreadCountQuery` - Get unread count

### Handler
- `CreateNotificationHandler` - Creates and dispatches

---

## Premium Module

### Commands
- `ActivatePremiumCommand` - Start subscription
- `ExpirePremiumCommand` - End subscription
- `CancelPremiumCommand` - Cancel auto-renewal

### Queries
- `GetSubscriptionQuery` - Get current subscription

### Handler
- `ActivatePremiumHandler` - Activates with transaction

### Flow
```
ActivatePremiumRequest → ActivatePremiumHandler
                                         ↓
                                   Transaction Start
                                         ↓
                         Check no existing subscription
                                         ↓
                         PremiumSubscription.create()
                                         ↓
                         IUserRepository.setPremium(true)
                                         ↓
                         PremiumActivated dispatch
                                         ↓
                                   Transaction Commit
```

---

## XP Module

### Commands
- `GrantXPCommand` - Award XP to user
- `RecalculateLevelCommand` - Recalculate level

### Queries
- `GetXPProgressQuery` - Get user's XP progress

### Handler
- `GrantXPHandler` - Grants XP and checks for level up

### Flow
```
GrantXPRequest → GrantXPHandler
                        ↓
                  XPService.grantXP()
                        ↓
                  IXPRepository.save()
                        ↓
                  Check level up
                        ↓
                  LevelUp dispatch (if leveled)
                        ↓
                  XPProgressResponse
```

---

## Badges Module

### Commands
- `UnlockBadgeCommand` - Award badge
- `RevokeBadgeCommand` - Remove badge

### Queries
- `GetUserBadgesQuery` - Get user badges

### Handler
- `UnlockBadgeHandler` - Unlocks with duplicate check

### Flow
```
UnlockBadgeRequest → UnlockBadgeHandler
                                      ↓
                            Check not already earned
                                      ↓
                            UserBadge.create()
                                      ↓
                            IBadgeRepository.save()
                                      ↓
                            BadgeUnlocked dispatch
                                      ↓
                            BadgeResponse
```

---

## Business Module

### Commands
- `CreateBusinessCommand` - Create business account
- `VerifyBusinessCommand` - Verify business
- `UpdateBusinessCommand` - Update business

### Handler
- `VerifyBusinessHandler` - Verifies and dispatches

---

## Organizer Module

### Commands
- `UnlockOrganizerCommand` - Unlock organizer status
- `PromoteOrganizerCommand` - Feature organizer

### Handler
- `UnlockOrganizerHandler` - Creates and unlocks organizer

---

## Analytics Module

### Commands
- `TrackEventCommand` - Track analytics event
- `TrackConversionCommand` - Track conversion

### Handler
- `TrackEventHandler` - Records analytics

---

## Reports Module

### Commands
- `CreateReportCommand` - Submit report
- `ResolveReportCommand` - Resolve report

### Handler
- `CreateReportHandler` - Creates report with duplicate check

---

## Shared Infrastructure

### Authorization Middleware
```typescript
authorization.authorize(context, 'profile', 'update');
authorization.requirePremium(context, 'feature');
authorization.requireOrganizer(context);
```

### Validation Middleware
```typescript
validation.validate([
  { field: 'title', required: true, type: 'string', minLength: 3 },
  { field: 'maxCapacity', type: 'number', min: 1, max: 100000 }
], data);
```

### Transaction Manager
```typescript
transactionManager.executeInTransaction(async (tx) => {
  await eventRepository.save(event);
  await participantRepository.save(participant);
});
```

### Event Dispatcher
```typescript
eventDispatcher.dispatch(new EventCreated(eventId, organizerId));
```

### Cache Service
```typescript
cache.get(key);                              // Read
cache.set(key, value, { ttl: 300 });         // Write with TTL
cache.delete(key);                           // Delete
cache.deleteByTags(['event', 'profile']);   // Tag invalidation
```

### Logger
```typescript
logger.execute('OperationName', userId, async (correlationId) => {
  // Operation with correlation tracking
});
```

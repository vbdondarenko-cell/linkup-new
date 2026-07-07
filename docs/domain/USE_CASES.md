# Domain Use Cases

## Authentication

### LoginWithTelegram
Validates Telegram init data and creates/retrieves user session.

```
Input: TelegramInitData (hash, queryId, user, authDate)
Output: { userId, sessionId, isNewUser }
Preconditions: Telegram data must be recent (< 24h)
Postconditions: User exists, Session is created
```

### Logout
Revokes user session.

```
Input: sessionId
Output: void
Preconditions: Session exists and is valid
Postconditions: Session is revoked
```

### RefreshSession
Extends session validity.

```
Input: sessionId
Output: { sessionId, expiresAt }
Preconditions: Session exists and not expired
Postconditions: Session has new expiry date
```

---

## Profile Management

### CreateProfile
Creates user profile with initial settings.

```
Input: { userId, username?, bio?, language?, radius?, location?, interests? }
Output: { profileId }
Preconditions: User exists, username not taken
Postconditions: Profile created with defaults
```

### UpdateProfile
Updates profile information.

```
Input: { profileId, username?, bio?, avatarUrl? }
Output: void
Preconditions: Profile exists, username unique if changed
Postconditions: Profile updated
```

### ChangeLanguage
Updates user's preferred language.

```
Input: { profileId, language }
Output: void
Preconditions: Valid language code
Postconditions: Language updated
```

### UpdateLocation
Updates user's current location.

```
Input: { profileId, latitude, longitude, address?, city?, country? }
Output: void
Preconditions: Valid coordinates
Postconditions: Location updated
```

---

## Event Management

### CreateEvent
Creates a new event (draft).

```
Input: { organizerId, title, description, startDate, endDate, location?, ... }
Output: { eventId }
Preconditions: Organizer is active, valid dates, valid location
Postconditions: Event created in draft status
```

### EditEvent
Updates event details.

```
Input: { eventId, title?, description?, dates?, location?, ... }
Output: void
Preconditions: Event exists, user has permission
Postconditions: Event updated
```

### PublishEvent
Publishes a draft event.

```
Input: eventId
Output: void
Preconditions: Event is draft, valid data
Postconditions: Event is published, visible to users
Side effects: EventCreated event published
```

### CancelEvent
Cancels an event.

```
Input: eventId, reason?
Output: void
Preconditions: Event is not completed
Postconditions: Event is cancelled
Side effects: Participants notified
```

### ArchiveEvent
Archives an event (soft delete).

```
Input: eventId
Output: void
Preconditions: Event exists
Postconditions: Event is archived
```

### DeleteEvent
Permanently deletes an event.

```
Input: eventId
Output: void
Preconditions: Event is archived or user is admin
Postconditions: Event deleted
```

### DuplicateEvent
Creates a copy of an event.

```
Input: eventId
Output: { newEventId }
Preconditions: Event exists
Postconditions: New event created as draft
```

---

## Event Series

### CreateSeries
Creates recurring event series.

```
Input: { organizerId, title, schedule, maxOccurrences?, ... }
Output: { seriesId }
Preconditions: Organizer is active
Postconditions: Series created
```

### GenerateOccurrences
Generates event occurrences from series.

```
Input: { seriesId, startDate, count }
Output: [ { date, startTime, endTime } ]
Preconditions: Series is active
Postconditions: Occurrences generated
```

### PauseSeries / ResumeSeries
Controls series generation.

```
Input: seriesId
Output: void
Preconditions: Series exists
Postconditions: Series paused/resumed
```

---

## Participation

### JoinEvent
Requests to join an event.

```
Input: { eventId, userId }
Output: { participantId, status: pending|waitlisted }
Preconditions: User not already joined, event not full
Postconditions: Participant created
Side effects: Organizer notified
```

### LeaveEvent
Withdraws from an event.

```
Input: { eventId, userId }
Output: void
Preconditions: User is participant
Postconditions: Participant cancelled
Side effects: Waitlist promoted if applicable
```

### ApproveRequest
Approves join request.

```
Input: { eventId, userId }
Output: void
Preconditions: Request is pending
Postconditions: Participant approved
Side effects: User notified, XP granted
```

### DeclineRequest
Declines join request.

```
Input: { eventId, userId, reason? }
Output: void
Preconditions: Request is pending
Postconditions: Participant declined
Side effects: User notified
```

### StartEvent
Marks event as started.

```
Input: eventId
Output: void
Preconditions: Event is published, has started
Postconditions: Event status → ongoing
```

### FinishEvent
Marks event as completed.

```
Input: eventId
Output: void
Preconditions: Event is ongoing
Postconditions: Event status → completed
Side effects: Attendees marked, stats updated
```

---

## Chat

### CreateConversation
Creates a chat conversation.

```
Input: { type, participantIds, eventId? }
Output: { conversationId }
Preconditions: Valid participants
Postconditions: Conversation created
```

### SendMessage
Sends a message in conversation.

```
Input: { conversationId, senderId, type, content, metadata? }
Output: { messageId }
Preconditions: Sender is participant, conversation active
Postconditions: Message created
Side effects: Recipients notified
```

### DeleteMessage
Deletes a message.

```
Input: { messageId, userId }
Output: void
Preconditions: User is sender or admin
Postconditions: Message deleted
```

---

## Premium

### ActivatePremium
Activates premium subscription.

```
Input: { userId, tier, period }
Output: { subscriptionId }
Preconditions: No active subscription
Postconditions: Subscription active, user premium flag set
Side effects: Badge unlocked, permissions updated
```

### ExpirePremium
Expires premium subscription.

```
Input: userId
Output: void
Preconditions: Subscription exists
Postconditions: Subscription expired, user premium flag cleared
Side effects: Permissions revoked, user notified
```

### CheckPremiumAccess
Checks if user has premium feature access.

```
Input: { userId, feature }
Output: boolean
Preconditions: None
Postconditions: None (read-only)
```

---

## XP & Leveling

### GrantXP
Awards XP to user.

```
Input: { userId, action, description, eventId? }
Output: { newTotal, level, leveledUp }
Preconditions: Valid XP action
Postconditions: XP record created, total updated
Side effects: LevelUp event if threshold crossed
```

### CalculateProgress
Calculates user's level progress.

```
Input: userId
Output: { totalXP, level, progress, xpToNextLevel }
Preconditions: None
Postconditions: None (read-only)
```

---

## Badges

### UnlockBadge
Awards badge to user.

```
Input: { userId, badgeType }
Output: { badgeId }
Preconditions: User doesn't have badge
Postconditions: Badge earned
Side effects: BadgeUnlocked event, notification
```

### RecalculateBadges
Checks and awards earned badges.

```
Input: userId
Output: [ { badgeId, badgeType } ] (newly earned)
Preconditions: None
Postconditions: New badges unlocked
```

---

## Trust & Reputation

### CalculateTrust
Calculates user trust score.

```
Input: userId
Output: { overall, events, social, verified }
Preconditions: None
Postconditions: Reputation updated
```

### ApplyAttendance
Updates trust for event attendance.

```
Input: { userId, eventId, attended: boolean }
Output: void
Preconditions: User participated in event
Postconditions: Trust score adjusted
```

---

## Recommendations

### GenerateRecommendations
Generates personalized event recommendations.

```
Input: { userId, limit? }
Output: [ { eventId, score, reasons } ]
Preconditions: User has profile
Postconditions: Recommendations saved
```

### RefreshRecommendations
Invalidates and regenerates recommendations.

```
Input: userId
Output: void
Preconditions: User has recommendations
Postconditions: Old recommendations deleted
```

---

## Search

### SearchEvents
Searches events by query and filters.

```
Input: { query, filters?, pagination }
Output: { results, totalCount }
Preconditions: Valid query
Postconditions: None (read-only)
```

### SearchProfiles / SearchBusinesses / SearchSeries
Similar pattern for other entity types.

---

## Reports

### CreateReport
Creates content report.

```
Input: { reporterId, type, targetId, reason, description? }
Output: { reportId }
Preconditions: User hasn't reported target
Postconditions: Report created
```

### ResolveReport
Resolves a report.

```
Input: { reportId, reviewerId, action, resolution }
Output: void
Preconditions: Report is pending
Postconditions: Report resolved/dismissed
Side effects: Action taken on target if needed
```

---

## Analytics

### TrackView
Records content view.

```
Input: { type, targetId, userId?, metadata? }
Output: void
Preconditions: None
Postconditions: View recorded
```

### TrackJoin / TrackAttendance
Records participation events.

### TrackRetention / TrackConversion
Records user engagement metrics.

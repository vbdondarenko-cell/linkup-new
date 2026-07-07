# Domain Entities Reference

## Core Entities

### User
Represents a user in the system with Telegram integration.

**Properties:**
- `id`: Unique identifier
- `telegramId`: Telegram user ID
- `firstName`, `lastName`, `username`: User profile info
- `isPremium`: Premium status flag
- `status`: Entity status (active, archived, deleted)

**Lifecycle:**
```
User.create() → Active → Archived/Deleted
```

---

### Profile
Extended user profile with location and interests.

**Properties:**
- `id`: Unique identifier
- `userId`: Reference to User
- `username`: Public username
- `bio`: User biography
- `avatarUrl`: Profile picture
- `language`: Preferred language
- `radius`: Search radius (1-100km)
- `location`: Current location
- `interests`: Array of interest IDs
- `isPublic`: Profile visibility

**Relationships:**
- Belongs to one User
- Has many Interests (many-to-many)

---

### Event
The core entity representing an event/activity.

**Properties:**
- `id`: Unique identifier
- `organizerId`: Creator's organizer ID
- `title`, `description`: Event content
- `coverImageUrl`: Event banner
- `location`: Event location
- `startDate`, `endDate`: Event timing
- `capacity`: Participant capacity
- `isFree`, `price`: Pricing
- `visibility`: public/private/followers
- `interests`: Event categories
- `seriesId`: Parent series (if recurring)
- `status`: Event lifecycle status

**Status Flow:**
```
draft → published → ongoing → completed
                ↘ cancelled → archived
```

**Aggregate Root:** Yes - owns Participants

---

### EventSeries
Template for recurring events.

**Properties:**
- `id`: Unique identifier
- `organizerId`: Creator's organizer ID
- `title`, `description`: Series content
- `schedule`: Recurrence pattern
- `maxOccurrences`: Limit occurrences
- `location`, `interests`: Default values
- `isPaused`: Pause flag

---

### Participant
User's participation in an event.

**Properties:**
- `id`: Composite key (eventId + userId)
- `eventId`: Event reference
- `userId`: User reference
- `status`: Participation status
- `isOrganizer`: Organizer flag
- `joinedAt`, `approvedAt`, `checkedInAt`: Timestamps

**Status Values:**
- `pending` - Awaiting approval
- `approved` - Confirmed participant
- `waitlisted` - Waiting for spot
- `declined` - Request denied
- `cancelled` - Withdrew
- `attended` - Checked in
- `no_show` - Didn't attend

---

### Conversation
Chat conversation (direct or event-based).

**Types:**
- `direct` - User-to-user chat
- `event` - Event participants chat
- `group` - Group chat

**Properties:**
- `id`: Unique identifier
- `type`: Conversation type
- `eventId`: Event reference (for event chats)
- `participantIds`: Array of user IDs
- `lastMessageAt`: Last activity

---

### Message
Individual chat message.

**Types:**
- `text` - Plain text
- `image` - Photo/image
- `location` - Shared location
- `file` - File attachment
- `system` - System notification

**Properties:**
- `id`: Unique identifier
- `conversationId`: Parent conversation
- `senderId`: Author user ID
- `type`: Message type
- `content`: Message text
- `metadata`: Type-specific data
- `replyToId`: Reply reference
- `isEdited`: Edit flag

---

### Notification
User notification.

**Types:**
- Event-related (invite, reminder, update)
- Social (new follower, message)
- Gamification (badge, level up)
- System notifications

---

### PremiumSubscription
Premium membership.

**Tiers:**
- `basic` - Limited features
- `pro` - Extended features
- `business` - Full access

**Properties:**
- `userId`: Subscriber
- `tier`: Subscription level
- `period`: monthly/yearly
- `startDate`, `endDate`: Validity
- `isAutoRenew`: Auto-renewal flag

---

### XPRecord
Experience points record.

**Actions & Values:**
| Action | XP |
|--------|-----|
| event_join | 10 |
| event_create | 50 |
| event_attend | 100 |
| profile_complete | 25 |
| referral | 200 |
| streak | 50 |
| badge_earned | 100 |

---

### UserBadge
Earned achievement badge.

**Badge Types:**
- `first_event` - Created first event
- `event_organizer` - Created 10 events
- `social_butterfly` - Joined 20 events
- `streak_7/30/100` - Activity streaks
- `premium_member` - Premium subscriber
- `verified_business` - Verified business
- `top_rated` - High ratings
- `early_adopter` - Beta user

**Tiers:** Bronze, Silver, Gold, Platinum

---

### Reputation
User trust and reputation score.

**Trust Score Components:**
- `events` - Event-related trust
- `social` - Social interactions
- `verified` - Verification bonus

**Range:** 0-100 for each component

---

### Organizer
Organizer account profile.

**Properties:**
- `userId`: User reference
- `displayName`: Public name
- `status`: locked/active/suspended
- `totalEvents`, `successfulEvents`
- `averageRating`
- `totalParticipants`
- `isFeatured`: Featured status

---

### Business
Business account.

**Properties:**
- `ownerId`: Business owner
- `name`, `description`
- `website`, `email`, `phone`
- `address`: Physical location
- `verificationStatus`: pending/verified/rejected
- `isVerified`: Verification flag

---

### Report
Content moderation report.

**Types:**
- event, user, message, business, content

**Reasons:**
- spam, inappropriate, harassment, fake, scam

**Status:** pending → reviewed → resolved/dismissed

---

### Rating
User rating for events/organizers/businesses.

**Properties:**
- `userId`, `targetId`, `targetType`
- `score`: 1-5 stars
- `review`: Optional text review
- `aspects`: Detailed ratings

**Aspects:**
- organization, communication, punctuality
- value, atmosphere

---

### AnalyticsEvent
Tracking event for analytics.

**Types:**
- page_view, event_view, event_join
- event_leave, event_start, event_finish
- profile_view, search, button_click
- form_submit, message_sent, notification_open

## Value Objects

### Coordinates
Geographic coordinates (latitude, longitude)

### Location
Location with coordinates + address details

### Radius
Search/filter radius (1-100km)

### Language
Supported language (en, uk, ru)

### EventCapacity
Participant capacity with waitlist support

### Money
Currency amount with arithmetic

### TrustScore
Reputation score (0-100)

### Level
User level (1-10) with perks

## Entity Relationships

```
User (1) ───── (1) Profile
  │
  │ (1)
  ├──── (many) Event (as organizer)
  ├──── (many) Participant (as participant)
  ├──── (1) PremiumSubscription
  ├──── (1) Reputation
  ├──── (many) XPRecord
  ├──── (many) UserBadge
  ├──── (1) Organizer (optional)
  └──── (many) Business (optional)

Event (1) ───── (many) Participant
  │
  ├──── (1) Conversation (event chat)
  ├──── (many) Rating
  ├──── (many) Report
  ├──── (0..1) EventSeries (parent)
  └──── (many) Event (occurrences)

Organizer (1) ───── (many) Event
                 ├──── (many) EventTemplate
                 └──── (1) Business (optional)

Conversation (1) ───── (many) Message
```

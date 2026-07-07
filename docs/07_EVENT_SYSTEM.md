# Event System

## Purpose

This document defines the complete event lifecycle, creation, management, and business rules for LinkUp V5. It serves as the authoritative guide for all event-related functionality.

## Scope

- Event creation and editing
- Event states and transitions
- Event capacity and attendance
- Event series and recurring events
- Event templates
- Event cancellation and archiving

## Event Lifecycle

### Event States

```
DRAFT ──→ PUBLISHED ──→ LIVE ──→ COMPLETED ──→ ARCHIVED
   │          │            │
   │          │            └──> CANCELLED
   │          │
   │          └──> CANCELLED
   │
   └──> DELETED
```

| State | Description | User Actions Allowed |
|-------|-------------|----------------------|
| DRAFT | Being created, not visible | Edit, Delete |
| PUBLISHED | Visible and accepting joiners | Edit (limited), Cancel |
| LIVE | Event is happening now | Check-in, Chat, View attendees |
| COMPLETED | Event has ended | Rate, Review |
| CANCELLED | Event will not happen | View (with notice) |
| ARCHIVED | Past event, moved to history | View |
| DELETED | Removed from system | None (hard delete) |

### State Transitions

| From | To | Trigger | Actor |
|------|-----|---------|-------|
| DRAFT | PUBLISHED | Organizer publishes | Organizer |
| DRAFT | DELETED | Organizer deletes | Organizer |
| PUBLISHED | LIVE | Event start time | System |
| PUBLISHED | CANCELLED | Organizer cancels | Organizer |
| PUBLISHED | DELETED | System (if flagged) | System |
| LIVE | COMPLETED | Event end time | System |
| LIVE | CANCELLED | Emergency cancel | Organizer/Admin |
| COMPLETED | ARCHIVED | 7 days after end | System |
| CANCELLED | ARCHIVED | Immediate | System |

---

## Event Creation

### Creation Flow

| Step | User Action | System Response |
|------|------------|-----------------|
| 1 | Tap "Create Event" | Open creation wizard |
| 2 | Enter basic info | Validate input |
| 3 | Set date and time | Check for conflicts |
| 4 | Set location | Geocode address |
| 5 | Add cover image | Compress and upload |
| 6 | Configure settings | Save preferences |
| 7 | Preview event | Show full preview |
| 8 | Publish | Transition to PUBLISHED |

### Required Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Title | String | 3-100 chars | ✓ |
| Description | String | 10-5000 chars | ✓ |
| Category | Enum | From category list | ✓ |
| Start DateTime | DateTime | Future, > now | ✓ |
| End DateTime | DateTime | > Start, < Start + 24h | ✓ |
| Location | GeoJSON | Valid coordinates | ✓ |
| Address | String | Structured format | ✓ |

### Optional Fields

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Cover Image | Image | No cover | Max 5MB, JPG/PNG |
| Max Capacity | Integer | 50 | 1-1000 |
| Requires Approval | Boolean | Event-dependent | - |
| Minimum Age | Integer | 0 (any) | 13-99 |
| Price | Decimal | 0 (free) | 0-9999.99 |
| Tags | Array | Empty | Max 5 tags |

### Event Categories

| Category | Subcategories |
|----------|---------------|
| Sports & Fitness | Running, Cycling, Yoga, Gym, Team Sports, Martial Arts, Swimming, Hiking |
| Arts & Culture | Painting, Photography, Music, Theater, Dance, Writing, Film |
| Food & Drink | Restaurants, Cooking, Wine, Coffee, Craft Beer, Food Tours |
| Music | Concerts, Open Mic, DJ, Live Music, Jam Sessions |
| Technology | Meetups, Hackathons, Workshops, Tech Talks, Startup Events |
| Games | Board Games, Video Games, Card Games, RPG, Esports |
| Outdoors & Nature | Hiking, Camping, Nature Walks, Birdwatching, Gardening |
| Books & Learning | Book Clubs, Workshops, Lectures, Language Exchange |
| Social & Networking | Mixers, Professional Networking, Community Building |
| Health & Wellness | Meditation, Mental Health, Spa, Nutrition, Self-Care |
| Travel & Adventure | Day Trips, Weekend Getaways, Backpacking, Road Trips |
| Pets & Animals | Dog Parks, Pet Meetups, Animal Shelters, Training |

### Location Requirements

**Address Format:**
```
{
  "street": "123 Main Street",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94102",
  "country": "US",
  "coordinates": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

**Location Validation:**
- Coordinates must be valid (-90 to 90, -180 to 180)
- Address must be geocodable
- Indoor locations should include floor/unit
- Venue names encouraged for recognizability

---

## Event Editing

### Editable Fields by State

| Field | Draft | Published | Live | Completed |
|-------|-------|-----------|------|-----------|
| Title | ✓ | ✗ | ✗ | ✗ |
| Description | ✓ | ✓ | ✗ | ✗ |
| Category | ✓ | ✓ | ✗ | ✗ |
| Cover Image | ✓ | ✓ | ✗ | ✗ |
| Date/Time | ✓ | ✗ | ✗ | ✗ |
| Location | ✓ | ✓ | ✗ | ✗ |
| Capacity | ✓ | ✓ | ✗ | ✗ |
| Approval Settings | ✓ | ✓ | ✗ | ✗ |
| Custom Questions | ✓ | ✓ | ✗ | ✗ |
| Price | ✓ | ✓ | ✗ | ✗ |

### Edit Limitations

**Published Events:**
- Title cannot be changed after first joiner
- Date/time cannot be changed (cancel and recreate)
- Location can be updated but attendees notified
- Capacity can only increase, not decrease below current

**Live Events:**
- No edits allowed
- Errors handled through cancellation/rescheduling

**Completed Events:**
- Description can be edited for accuracy
- Cannot change attendance records

---

## Event Capacity

### Capacity Rules

| Parameter | Default | Min | Max |
|-----------|---------|-----|-----|
| Max Attendees | 50 | 1 | 1000 |
| Waitlist Capacity | 20% of max | 0 | 200 |
| Min Age | 0 | 0 | 99 |

### Capacity States

| State | Description |
|-------|-------------|
| OPEN | Below capacity, accepting joiners |
| ALMOST_FULL | >80% capacity, show warning |
| FULL | At capacity, waitlist only |
| WAITLIST_ONLY | Waitlist active |

### Capacity Transitions

| Transition | Trigger | Action |
|------------|---------|--------|
| OPEN → ALMOST_FULL | Attendee count > 80% | Show indicator |
| ALMOST_FULL → FULL | Attendee count = max | Enable waitlist |
| FULL → WAITLIST_ONLY | Waitlist has entries | Show waitlist position |
| FULL → OPEN | Attendee leaves | Disable waitlist |

---

## Join Requests

### Approval Types

| Type | Description | User Flow |
|------|-------------|-----------|
| OPEN | Anyone can join | Join → Immediate |
| APPROVAL_REQUIRED | Organizer approves | Request → Wait → Approved/Rejected |
| INVITE_ONLY | Organizer invites only | Organizer sends invite |

### Request Flow (Approval Required)

| Step | User Action | System Response |
|------|------------|-----------------|
| 1 | Tap "Request to Join" | Open request form |
| 2 | Fill optional message | - |
| 3 | Submit request | Create request record |
| 4 | - | Send notification to organizer |
| 5 | Organizer reviews | - |
| 6 | Organizer approves | Notify user, add to event |
| 6 | Organizer rejects | Notify user with reason |

### Request Expiry

- Requests expire after 7 days
- Auto-reject if event fills during wait
- Cannot request if blocked by organizer

### Custom Questions

Organizers can add up to 3 custom questions:

| Question Type | Validation |
|---------------|------------|
| Text | Max 500 characters |
| Single Choice | Up to 10 options |
| Multi Choice | Up to 10 options |
| Number | Range validation |
| Yes/No | Boolean |

---

## Event Series

### Series Definition

A series is a template for recurring events with a common theme.

**Series Properties:**
- Title template
- Description template
- Category
- Default location (can vary)
- Recurrence pattern
- Default settings

### Recurrence Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| DAILY | Every N days | Every 2 days |
| WEEKLY | Same day every N weeks | Every Monday |
| BIWEEKLY | Every 2 weeks on day | Biweekly Thursday |
| MONTHLY | Same date monthly | 15th of each month |
| MONTHLY_WEEKDAY | Same weekday, week of month | 2nd Tuesday |

### Series Generation

| Setting | Options |
|---------|---------|
| Generate Ahead | 4/8/12 weeks |
| Generate Duration | Until series end date |
| Auto-generate | On/off |

### Series Management

| Action | Description |
|--------|-------------|
| Pause Series | Stop generating events temporarily |
| Resume Series | Continue generation |
| Edit Future | Change template for future events |
| Edit All | Change template for all events |
| End Series | Stop all future events |

---

## Event Templates

### Template Properties

Templates save event configurations for reuse.

| Property | Included |
|----------|----------|
| Title | ✓ |
| Description | ✓ (with variables) |
| Category | ✓ |
| Default Capacity | ✓ |
| Approval Settings | ✓ |
| Custom Questions | ✓ |
| Cover Image | ✓ |

### Template Variables

Templates can include dynamic content:

| Variable | Replacement |
|----------|-------------|
| {month} | Current month |
| {date} | Current date |
| {year} | Current year |
| {day} | Day name |
| {week} | Week number |

---

## Event Cancellation

### Cancellation Reasons

| Reason | Notify Attendees | Refund |
|--------|------------------|--------|
| Organizer Cancelled | Yes | If paid |
| Low Attendance | Organizer choice | If paid |
| Weather | Yes | If applicable |
| Venue Issues | Yes | If applicable |
| Emergency | Yes | If paid |
| Platform Violation | Yes | No |

### Cancellation Process

| Step | Action |
|------|--------|
| 1 | Organizer selects cancellation reason |
| 2 | System prepares notification |
| 3 | Attendees notified immediately |
| 4 | Attendees removed from event |
| 5 | Event marked as CANCELLED |
| 6 | Event archived after 7 days |

### Cancellation Notifications

**Attendee Notification:**
```
[Event Name] has been cancelled

Organizer: [Name]
Original Date: [Date/Time]
Reason: [If provided by organizer]

[If refund eligible]: Refund information

We're sorry for any inconvenience.
```

---

## Event Archiving

### Archive Criteria

Events are automatically archived when:
- Completed for 7+ days
- Cancelled for 7+ days
- Not edited for 90+ days

### Archived Event Access

- Viewable by original attendees
- Viewable by organizer
- Not shown in new searches
- Statistics preserved

### Archive Retention

- Archived events kept indefinitely
- Can be restored by administrator
- Statistics available indefinitely

---

## Organizer Ownership

### Ownership Rules

| Rule | Description |
|------|-------------|
| Single Owner | Each event has one primary organizer |
| Co-Organizers | Optional, designated by owner |
| Transfer | Ownership can be transferred |
| Deletion | Only owner can delete |

### Ownership Transfer

| Condition | Allowed |
|-----------|---------|
| To another organizer | ✓ |
| To user (demotion) | ✓ |
| To business account | ✓ |
| To self (undo) | ✓ |

---

## Business Rules

### Event Limits by Organizer Tier

| Tier | Concurrent Published | Draft | Series | Templates |
|------|--------------------|-------|--------|-----------|
| Starter | 3 | 10 | 5 | 10 |
| Growing | 10 | 25 | 20 | 50 |
| Established | 25 | 100 | Unlimited | Unlimited |
| Premium | Unlimited | Unlimited | Unlimited | Unlimited |

### Event Duration

| Rule | Limit |
|------|-------|
| Minimum Duration | 15 minutes |
| Maximum Duration | 24 hours |
| Default Duration | 2 hours |

### Event Scheduling

| Rule | Requirement |
|------|-------------|
| Advance Notice | Minimum 1 hour before start |
| Maximum Advance | 1 year |
| Recurrence End | Must be before 1 year |

### Event Visibility

| Setting | Description |
|---------|-------------|
| PUBLIC | Visible in search and map |
| UNLISTED | Only with direct link |
| PRIVATE | Only for invitees |

---

## Edge Cases

### Duplicate Events
- System detects similar events by title and date
- Warning shown, not blocked
- No automatic action

### Conflicting Events
- User can attend overlapping events
- Attendance tracked regardless
- No conflict warnings

### No-Show Handling
- Organizer can mark no-shows
- No-shows affect trust score
- No-shows not eligible for ratings

### Late Join Requests
- Can request until 1 hour before start
- Organizer can enable late join
- Chat access based on join time

---

## Future Expansion

1. **Event Duplication API**: Programmatic event copying
2. **Event Bundles**: Multiple related events
3. **Event Waitlist Priority**: First-come-first-served vs. trust-based
4. **Event Transfers**: User can transfer ticket to another
5. **Dynamic Pricing**: Tiered pricing based on demand

---

## Open Questions

1. Should we implement event referral bonuses?
2. How do we handle multi-day events?
3. Should events have minimum attendance thresholds?
4. How do we validate venue availability?

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*

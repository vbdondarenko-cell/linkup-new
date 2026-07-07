# Chat System

## Purpose

This document defines the chat system architecture, features, and business rules for LinkUp V5. Chat serves a specific, limited purpose—it facilitates communication between event participants, not as a general messaging platform.

## Scope

- Chat creation and lifecycle
- Message types and features
- Permissions and access control
- Ephemeral message handling
- Moderation capabilities

## Core Principles

### Not a Messenger

LinkUp chat is fundamentally different from messaging apps:

| Aspect | Traditional Messenger | LinkUp Chat |
|--------|---------------------|-------------|
| Duration | Permanent | Ephemeral |
| Scope | Global | Event-specific |
| Participants | Self-selected | Event-defined |
| Purpose | Communication | Event coordination |
| History | Searchable | Deleted |

### Chat Lifecycle

```
EVENT PUBLISHED
      ↓
[24h BEFORE EVENT]
      ↓
CHAT ENABLED ←────────────┐
      ↓                   │
EVENT LIVE                │
      ↓                   │
EVENT COMPLETED           │
      ↓                   │
[6h POST-EVENT]           │
      ↓                   │
CHAT DISABLED             │
      ↓                   │
[6h+ POST-EVENT]          │
      ↓                   │
MESSAGES DELETED ─────────┘
```

---

## Chat States

### State Definitions

| State | Description | Can Send | Can Read |
|-------|-------------|----------|----------|
| INACTIVE | Event not within window | ✗ | ✗ |
| ENABLED | Chat active for participants | ✓ | ✓ |
| READ_ONLY | Post-event archive period | ✗ | ✓ |
| DELETED | Messages purged | ✗ | ✗ |

### State Transitions

| From | To | Trigger |
|------|-----|---------|
| INACTIVE | ENABLED | 24 hours before event start |
| ENABLED | READ_ONLY | Event end time |
| READ_ONLY | DELETED | 6 hours after event end |
| DELETED | INACTIVE | Event rescheduled |

---

## Access Control

### Chat Eligibility

| Role | Can Access Chat |
|------|----------------|
| Approved Attendee | ✓ |
| Organizer | ✓ |
| Co-Organizer | ✓ |
| Pending Request | ✗ |
| Waitlisted | ✗ |
| Non-Participant | ✗ |
| Guest | ✗ |

### Access Rules

1. **Join-Based Access**: Users gain chat access when their attendance is approved
2. **Immediate Revocation**: Users lose access when removed from event
3. **No Pre-Event Chat**: Chat unavailable until 24h before
4. **Post-Event Read**: Limited read access for 6h after event

### Organizer Privileges

Organizers (and co-organizers) have additional capabilities:

| Capability | Description |
|------------|-------------|
| Pin Messages | Pin important messages to top |
| Mute Users | Prevent specific users from posting |
| Delete Any Message | Remove inappropriate content |
| View Muted Users | See muted user list |

---

## Message Types

### Supported Types

| Type | Description | Max Length | Features |
|------|-------------|------------|----------|
| Text | Plain text message | 1000 chars | Reactions, replies |
| Image | Photo attachment | 5 images | Compression, preview |
| Location | Event-context location | - | Mini-map view |
| System | Automated messages | - | No reactions |

### Text Messages

**Structure:**
```json
{
  "id": "uuid",
  "eventId": "uuid",
  "senderId": "uuid",
  "content": "string",
  "timestamp": "datetime",
  "edited": false,
  "replyTo": "uuid | null",
  "reactions": [
    { "emoji": "👏", "userIds": ["uuid", "uuid"] }
  ]
}
```

**Features:**
- Emoji reactions (6 supported: 👏 🔥 ❤️ 😊 🤔 👍)
- Reply threads (one level deep)
- Read receipts (sent, delivered, read)
- Typing indicators

### Image Messages

**Specifications:**
- Format: JPEG, PNG
- Max size: 5MB original, 1MB compressed
- Dimensions: Max 4096x4096, auto-resized
- Quantity: Up to 5 images per message
- Thumbnails: 200x200 auto-generated

**Features:**
- Lightbox view
- Pinch to zoom
- Download option
- Gallery view

### Location Messages

**Structure:**
```json
{
  "type": "location",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "label": "Meeting point",
  "accuracy": 50
}
```

**Features:**
- Mini-map preview
- Tap to open in maps app
- Walking distance from event
- Useful for coordination

### System Messages

**Types:**

| Type | Trigger |
|------|---------|
| USER_JOINED | Attendee approved |
| USER_LEFT | Attendee left event |
| USER_MUTED | User muted by organizer |
| USER_REMOVED | Attendee removed |
| EVENT_REMINDER | 1h before event |
| EVENT_STARTED | Event time reached |
| EVENT_ENDED | Event completed |
| EVENT_CANCELLED | Event cancelled |

**Format:**
```
[System] @Username joined the event
```

---

## Message Features

### Reactions

**Available Reactions:**
| Emoji | Meaning |
|-------|---------|
| 👏 | Applause/Agreement |
| 🔥 | Hot/Exciting |
| ❤️ | Love/Like |
| 😊 | Happy/Smiling |
| 🤔 | Thinking |
| 👍 | Thumbs Up |

**Rules:**
- One reaction per user per message
- Tap to add, tap again to remove
- No custom reactions
- Max 100 reactions per message

### Reply Threads

**Structure:**
- One level of nesting only
- Original message always visible
- Collapse/expand threads
- Max 50 replies per thread

**Display:**
```
┌─ Original Message ─────────────────────┐
│ @Maria: See you all at the north entrance │
│                                          │
│ ├─ @John: Great, I'll be there!          │
│ │                                          │
│ └─ @Sarah: Same here                      │
└──────────────────────────────────────────┘
```

### Read Receipts

**States:**
| State | Description |
|-------|-------------|
| Sent | Message sent to server |
| Delivered | Received by all participants |
| Read | Opened by recipient |

**Privacy Note:**
- Sender sees their own read status
- Read counts shown (not individual status)
- Organizers see read statistics

---

## Ephemeral Message Handling

### Deletion Timeline

| Phase | Action | Timing |
|-------|--------|--------|
| 1 | Chat disabled | Event end time |
| 2 | Read-only mode | Event end → +6h |
| 3 | Messages deleted | +6h exactly |

### Deletion Process

1. **Chat Disabled**: No new messages, read-only view
2. **Archive Phase**: Messages viewable for 6 hours
3. **Deletion**: All messages permanently removed
4. **Cleanup**: Media files purged
5. **Audit**: Deletion logged for compliance

### Data Retention

| Data | Retention | Notes |
|------|-----------|-------|
| Messages | Until 6h post-event | Then deleted |
| Images | Until 6h post-event | Then deleted |
| Location Data | Until 6h post-event | Then deleted |
| Metadata | 90 days | Anonymized stats |
| System Logs | 1 year | Security logging |

---

## Moderation

### Moderation Capabilities

| Action | Who Can Do | Target |
|--------|-----------|--------|
| Pin Message | Organizer | Any message |
| Unpin Message | Organizer | Pinned message |
| Delete Message | Organizer | Any message |
| Delete Own | Any user | Own messages |
| Mute User | Organizer | Any participant |
| Unmute User | Organizer | Muted user |

### Mute Behavior

**When Muted:**
- Cannot send messages
- Can still read messages
- Mute expires with event
- Organizer sees muted indicator

**Mute Display:**
```
@John [Muted by organizer]
```

### Auto-Moderation

**Patterns Flagged for Review:**
- Repeated messages (spam)
- Excessive caps
- Suspicious links
- Blocked words (configurable)

**Action:**
- Flag for organizer review
- No automatic deletion
- Pattern logged

---

## Notifications

### Chat Notifications

| Event | Notification |
|-------|---------------|
| New message | Push notification (if enabled) |
| Reply to your message | Push + mention |
| @Mention | Push notification |
| Reaction on your message | In-app only |

### Notification Settings

| Setting | Default | Options |
|---------|---------|---------|
| All Messages | On | On/Off |
| Mentions Only | Off | On/Off |
| Muted Hours | None | 8h block |

**Quiet Hours:**
- Respects device Do Not Disturb
- Custom quiet hours per user
- Batch notifications during quiet

---

## Technical Implementation

### Message Flow

```
USER COMPOSES
      ↓
CLIENT VALIDATES
      ↓
SEND TO SERVER ──────────────────────────┐
      ↓                                   │
SERVER VALIDATES                          │
      ↓                                   │
REALTIME BROADCAST ───────────────────────┼──→ OTHER CLIENTS
      ↓                                   │
STORE IN DATABASE                         │
      ↓                                   │
CONFIRM TO SENDER ────────────────────────┘
```

### Realtime Architecture

**Technology:** Supabase Realtime (WebSocket)

**Channels:**
- `event:{eventId}:chat` - Main chat channel
- `event:{eventId}:presence` - Online users
- `event:{eventId}:typing` - Typing indicators

### Message Queue

**For Offline Users:**
- Messages queued in local storage
- Delivered on reconnection
- Read receipts updated retroactively

### Storage

**Database:** Supabase PostgreSQL

**Tables:**
- `messages` - All message data
- `message_reactions` - Reaction tracking
- `message_attachments` - Media metadata
- `chat_settings` - User preferences

---

## Business Rules

### Message Limits

| Limit | Value | Notes |
|-------|-------|-------|
| Message Length | 1000 chars | Text only |
| Image Count | 5 per message | - |
| Image Size | 5MB original | Compressed to 1MB |
| Messages per Minute | 10 | Rate limit |
| Max Attachments | 20 per hour | Per user |

### Chat Availability Windows

| Window | Start | End |
|--------|-------|-----|
| Pre-Event | 24h before | Event start |
| Live Event | Event start | Event end |
| Post-Event | Event end | +6 hours |

### Rate Limiting

| Action | Limit | Window |
|--------|-------|--------|
| Send Message | 10 | Per minute |
| Send Image | 5 | Per minute |
| Add Reaction | 30 | Per minute |
| Typing Indicator | 1 | Per 3 seconds |

---

## Edge Cases

### User Removed Mid-Chat
- Immediate loss of write access
- Read access for 1 hour
- No notification to other users

### Event Cancelled
- Chat immediately disabled
- No new messages
- 24-hour read access
- Deletion accelerated

### Multiple Events Same Time
- Separate chats per event
- No cross-event communication
- No event merging

### User Joins Late
- Full chat history visible
- No missed message notifications
- Read receipts not retroactive

---

## Future Expansion

1. **Event Polls**: Quick voting during events
2. **Speaker Mode**: Q&A format for workshops
3. **Voice Messages**: Short audio clips
4. **Stickers**: Event-specific stickers
5. **Event Memories**: Save highlight messages

---

## Open Questions

1. Should we implement message editing?
2. How do we handle translated messages?
3. Should we support message reactions beyond emoji?
4. How do we handle extremely large events (>500)?

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*

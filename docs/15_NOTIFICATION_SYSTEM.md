# Notification System

## Purpose

This document defines the notification system for LinkUp V5, covering push notifications, in-app notifications, notification preferences, and delivery logic.

## Scope

- Push notification types
- In-app notifications
- Notification preferences
- Delivery timing
- Privacy controls

---

## Notification Categories

### Event Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| Event Reminder | 1 hour before joined event | High |
| Event Starting | At event start time | High |
| Event Ended | At event end time | Medium |
| Event Update | Organizer changes event | High |
| Event Cancelled | Organizer cancels | High |
| Event Reminder (24h) | 24 hours before | Medium |

### Request Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| Request Approved | Organizer approves | High |
| Request Rejected | Organizer rejects | High |
| Waitlist Promoted | Off waitlist | High |
| Invite Received | Organizer invites | High |

### Chat Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| New Message | Message in joined event | Medium |
| @Mention | User mentioned | High |
| Reply to You | Reply to your message | Medium |
| Message from Organizer | Organizer message | High |

### Social Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| Badge Earned | New badge awarded | Low |
| Level Up | User levels up | Low |
| Rating Received | Rating on hosted event | Medium |

### System Notifications

| Type | Trigger | Priority |
|------|---------|----------|
| Security Alert | Login from new device | High |
| Privacy Notice | Policy changes | Medium |
| Account Notice | Trust score change | Low |

---

## Notification Channels

### Push Notifications

**Delivery:**
- Via Telegram for Telegram Mini App
- Via system push for native app

**Features:**
| Feature | Description |
|---------|-------------|
| Rich Notifications | Title, body, image |
| Actions | Quick actions in notification |
| Grouping | Bundle similar notifications |

### In-App Notifications

**Location:** Notification center/bell icon

**Display:**
| Element | Description |
|---------|-------------|
| Icon | Notification type |
| Title | Brief description |
| Body | Full message |
| Timestamp | Relative time |
| Action | Tap to navigate |

### Email Notifications

**Reserved For:**
- Security alerts
- Billing notifications
- Account verification
- Weekly digest (opt-in)

**NOT sent via email:**
- Event updates
- Chat messages
- General notifications

---

## Notification Preferences

### Default Settings

| Category | Push | In-App |
|----------|------|--------|
| Event Reminders | On | On |
| Request Updates | On | On |
| Chat Messages | On | On |
| @Mentions | On | On |
| Social | Off | On |
| System | On | On |
| Recommendations | Off | On |

### Quiet Hours

**Configuration:**
- Start time
- End time
- Override for urgent

**Behavior During Quiet:**
| Type | During Quiet | Urgent Override |
|------|--------------|-----------------|
| Event Reminder | Delayed | ✓ Delivered |
| Request Update | Delayed | ✓ Delivered |
| Chat Message | Delayed | ✗ |
| Security Alert | ✓ Delivered | - |

### Granular Controls

**Per Event:**
- Mute notifications for specific event
- Keep notifications for others

**Per User:**
- Block notifications from specific users
- Block notifications from specific organizers

---

## Notification Delivery

### Timing Rules

| Notification Type | Delay | Reason |
|-------------------|-------|--------|
| Event Reminder | Exactly 1 hour before | Optimal timing |
| Event Starting | At start time | Immediate relevance |
| Request Approved | Immediate | Time-sensitive |
| Chat Message | Immediate | Conversational flow |
| Badge Earned | Immediate | Celebration |

### Batching Rules

**Batch When:**
- Multiple similar notifications
- Same event, short timeframe
- User actively in app

**Batch Display:**
```
3 new notifications from [Event Name]
├── @Maria joined
├── @John joined  
└── @Sarah commented
[View All]
```

### Retry Logic

| Failure | Action |
|---------|--------|
| Device offline | Queue, deliver when online |
| Token invalid | Remove from push list |
| Rate limited | Exponential backoff |
| User opted out | Stop sending |

---

## Notification Content

### Content Templates

**Event Reminder:**
```
⏰ [Event Name] starts in 1 hour

📍 [Address]
👥 [X] attending

[View Event]
```

**Request Approved:**
```
✅ Approved!

You're in for [Event Name]
📅 [Date/Time]
📍 [Location]

[View Event] [Get Directions]
```

**New Message:**
```
💬 @[Username] in [Event Name]

[Message preview...]

[Reply]
```

### Content Rules

| Rule | Description |
|------|-------------|
| Max Length | 100 characters |
| No PII | Don't include sensitive data |
| Localization | User's preferred language |
| Personalization | Include relevant names/places |

---

## Privacy Considerations

### Data Minimization

| Practice | Implementation |
|----------|----------------|
| Minimal Storage | Notifications stored 30 days |
| No Message Content | Only notification metadata |
| Secure Delivery | TLS encrypted |
| No Third-Party | Direct delivery only |

### User Control

| Control | Description |
|---------|-------------|
| Opt-Out | Can disable any category |
| Quiet Hours | Time-based snooze |
| Per-Event | Event-specific mute |
| Block User | Block specific senders |

---

## Technical Implementation

### Push Architecture

```
Event Triggered
      ↓
Notification Service
      ↓
[Push Provider]
Telegram / FCM / APNs
      ↓
User Device
```

### Queue Management

| Queue | TTL | Priority |
|-------|-----|----------|
| Immediate | 5 minutes | High |
| Delayed | 24 hours | Medium |
| Batched | 1 hour | Low |

---

## Edge Cases

### User Offline
- Notifications queued
- Delivered on reconnection
- Stale notifications cleaned up

### Multiple Devices
- Sent to all user devices
- Marked read on any device
- Sync state across devices

### Notification Conflicts
- High priority wins
- Similar notifications batched
- Older notifications archived

---

## Future Features

1. **Smart Timing**: ML-based optimal send time
2. **Digest Mode**: Daily/weekly summary emails
3. **SMS Fallback**: Critical alerts via SMS
4. **Rich Actions**: Interactive buttons

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*

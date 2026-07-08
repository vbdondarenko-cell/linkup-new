# Realtime System & Engagement Experience

## Purpose

This document describes the Realtime System, Notifications, XP Engine, Achievements, and Reputation Engine for LinkUp V6, creating a comprehensive engagement layer that rewards real-world participation.

## Scope

- Realtime Engine
- Notification Center
- XP Engine
- Level Engine
- Achievement Engine
- Badge Engine
- Reputation Engine
- Streak System
- Activity Timeline
- Celebrations
- Background Tasks

---

## Core Philosophy

### Reward Real Life

- **Not screen time** — rewards earned through offline participation
- **Not scrolling** — achievements unlocked through real events
- **Not popularity** — trust earned through consistent behavior
- **Not vanity** — community built through genuine connections

### Key Principles

1. Every reward must encourage offline activity
2. Notifications should feel useful, not spammy
3. Achievements should feel earned
4. XP should motivate community participation
5. The entire system must remain calm and premium

---

## Realtime Engine

### Architecture

Supports multiple realtime providers:
- Supabase Realtime
- Realtime subscriptions
- Presence
- Optimistic updates
- Background synchronization

### Supported Events

| Event Type | Description |
|------------|-------------|
| new_event | New event created |
| updated_event | Event details changed |
| deleted_event | Event removed |
| join_request | User requested to join |
| accepted_request | Request accepted |
| declined_request | Request declined |
| new_message | New chat message |
| participant_count | Participant count changed |
| organizer_change | Organizer updated |
| business_update | Business profile changed |
| notification | New notification |
| achievement | Achievement unlocked |
| xp_update | XP changed |
| trust_update | Trust score changed |
| premium_status | Premium status changed |

### Connection Management

- Automatic reconnect
- Connection recovery
- Offline queue
- Conflict resolution
- Multi-device sync

---

## Notification Center

### Sections

| Section | Condition |
|---------|-----------|
| Today | Events from today |
| Yesterday | Events from yesterday |
| Earlier | Older events |

### Notification Types

| Type | Icon | Priority |
|------|------|----------|
| join_request | 👋 | High |
| request_accepted | ✅ | High |
| request_declined | ❌ | Medium |
| new_message | 💬 | High |
| upcoming_event | 📅 | Medium |
| event_reminder | ⏰ | Medium |
| event_started | 🎉 | High |
| event_finished | 🏁 | Low |
| achievement_earned | 🏆 | Medium |
| badge_unlocked | 🎖️ | Medium |
| level_up | ⬆️ | Medium |
| trust_increased | 📈 | Low |
| organizer_promotion | 🎤 | Medium |
| business_verified | 🏢 | Medium |
| premium_activated | ⭐ | Medium |
| reward_premium_ready | 🎁 | Medium |
| system_announcement | 📢 | Low |

### Smart Notifications

- Avoid spam
- Group similar events
- Respect Focus Mode
- Respect Quiet Hours
- Prioritize important notifications
- No duplicate notifications

### Reminders

| Time | Trigger |
|------|---------|
| 24 hours | Before event |
| 3 hours | Before event |
| 30 minutes | Before event |
| Event start | Event begins |
| Chat expires | 1 hour warning |
| Reward ready | Premium reward available |

---

## XP Engine

### XP Rules

| Action | XP Amount | Cooldown |
|--------|-----------|----------|
| Join event | 10 | — |
| Complete event | 50 | 24h |
| Host event | 100 | 24h |
| Rate organizer | 5 | — |
| Rate event | 5 | — |
| Maintain attendance | 25 | 7d |
| Earn badge | 20 | — |
| Earn achievement | 50 | — |
| Organizer milestone | 100 | — |
| Community participation | 15 | — |
| 7-day streak | 75 | 7d |
| 30-day streak | 200 | 30d |

### XP State

```typescript
interface XPState {
  currentXP: number;      // XP in current level
  totalXP: number;        // Total XP earned
  level: number;          // Current level
  levelProgress: number;  // 0-100 progress
  recentGains: XPGain[]; // Last 10 gains
}
```

---

## Level Engine

### Levels

| Level | Name | Required XP | Rewards |
|-------|------|-------------|---------|
| 1 | Explorer | 0 | Welcome badge |
| 2 | Connector | 100 | Connector badge |
| 3 | Host | 300 | Host events feature |
| 4 | Leader | 750 | Leadership badge |
| 5 | Ambassador | 1500 | Verified organizer |
| 6 | Legend | 3000 | Legendary theme |

### Level Rewards

- **Badges** — Visual recognition
- **Features** — Unlock capabilities
- **Cosmetics** — Profile customization

---

## Achievement Engine

### Achievement Categories

| Category | Icon | Description |
|----------|------|-------------|
| community | 🤝 | Social achievements |
| coffee | ☕ | Coffee-related |
| sports | ⚽ | Sports activities |
| travel | ✈️ | Travel experiences |
| music | 🎵 | Music events |
| food | 🍽️ | Food & dining |
| gaming | 🎮 | Gaming activities |
| volunteer | 🤝 | Volunteering |
| business | 💼 | Business events |
| culture | 🏛️ | Cultural events |
| education | 🎓 | Learning |
| nightlife | 🌃 | Night activities |
| organizer | 🎤 | Hosting |
| explorer | 🌍 | Exploration |
| premium | ⭐ | Premium features |

### Achievement States

| State | Description |
|-------|-------------|
| locked | Not started |
| in_progress | Partially completed |
| unlocked | Fully completed |

### Featured Achievements

| ID | Name | Requirement |
|----|------|-------------|
| first_event | First Step | Join first event |
| attend_10 | Getting Started | Attend 10 events |
| attend_50 | Regular | Attend 50 events |
| attend_100 | Dedicated | Attend 100 events |
| first_host | Host Debut | Host first event |
| streak_7 | Week Warrior | 7-day streak |
| streak_30 | Month Master | 30-day streak |

---

## Badge Engine

### Badge Types

| Type | Description |
|------|-------------|
| community | General community |
| verified | Identity verified |
| organizer | Event host |
| premium | Premium subscriber |
| business | Business verified |
| legend | Legendary member |
| ambassador | Community ambassador |
| seasonal | Limited time |
| milestone | Achievement milestone |
| special | Special events |

### Rarity Levels

| Rarity | Color | Description |
|--------|-------|-------------|
| common | Gray | Easy to earn |
| rare | Blue | Moderately rare |
| epic | Purple | Very rare |
| legendary | Gold | Extremely rare |

---

## Reputation Engine

### Reputation Levels

| Level | Score Range | Color |
|-------|-------------|-------|
| new | 0-20 | Gray |
| low | 20-40 | Red |
| medium | 40-60 | Orange |
| high | 60-80 | Green |
| trusted | 80-95 | Blue |
| elite | 95-100 | Purple |

### Hidden Factors

The reputation algorithm includes hidden factors:
- Attendance history
- Trust signals
- Ratings received
- Reports filed
- Successful meetings
- Event completion
- Organizer history
- Business verification
- Consistency
- Late cancellations
- Fraud signals

**Never expose internal calculations.**

---

## Streak System

### Tracked Metrics

| Metric | Description |
|--------|-------------|
| currentStreak | Consecutive days |
| longestStreak | All-time best |
| lastEventDate | Last event attended |
| monthlyEvents | Events this month |
| yearlyEvents | Events this year |
| missedEvents | Events missed |
| completedEvents | Events completed |

### Streak Rewards

- 7-day streak: 75 XP
- 30-day streak: 300 XP

---

## Activity Timeline

### Activity Types

| Type | Icon |
|------|------|
| joined_event | 🎉 |
| hosted_event | 🎤 |
| achievement | 🏆 |
| badge | 🎖️ |
| level_up | ⬆️ |
| trust_increase | 📈 |
| premium_activated | ⭐ |
| streak | 🔥 |

---

## Celebrations

### Principles

Keep celebrations elegant:
- Minimal
- Premium
- No confetti
- No excessive animation
- Small success overlay

### Celebration Types

| Type | Trigger |
|------|---------|
| xp_gain | XP earned |
| level_up | Level increased |
| achievement | Achievement unlocked |
| badge | Badge earned |
| streak | Streak milestone |

---

## Event Reward Flow

```
Event Completed
    ↓
Rate Organizer
    ↓
Rate Event
    ↓
XP Awarded
    ↓
Achievement Check
    ↓
Badge Check
    ↓
Trust Updated
    ↓
Level Check
    ↓
Celebration
```

---

## File Structure

```
src/features/realtime/
├── components/
│   ├── index.ts
│   ├── notification-center.tsx
│   ├── xp-bar.tsx
│   └── achievements-list.tsx
├── hooks/
│   ├── index.ts
│   └── use-realtime-state.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## Components

### NotificationCenter

- Grouped notifications
- Unread indicator
- Mark all read
- Delete notification
- Deep link support

### XPBar

- Level display
- Progress bar
- XP counter
- Animated updates

### XPGainToast

- XP gain notification
- Auto-dismiss
- Animated appearance

### LevelUpCelebration

- Level up overlay
- Rewards display
- Continue button

### AchievementsList

- Filter by category
- Progress display
- Locked/unlocked states
- XP rewards

### BadgeGrid

- Earned/locked badges
- Rarity display
- Badge details

---

## Animations

### XP Bar
- Smooth progress updates
- Spring animations

### Achievements
- Unlock celebration
- Progress increments

### Notifications
- Soft card appearance
- Subtle updates

### Celebrations
- Elegant overlays
- Minimal motion

---

## Accessibility

### VoiceOver
- Achievement descriptions
- XP progress
- Badge names
- Notification content

### Touch Targets
- Minimum 44px
- Adequate spacing

---

*Last Updated: V6.0*
*Owner: Engineering Team*
*Review Frequency: Per Release*

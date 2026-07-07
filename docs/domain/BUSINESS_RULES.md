# Business Rules Reference

## Validation Rules

### Event Validation

| Rule | Constraint | Error Message |
|------|------------|---------------|
| Title length | 3-100 chars | Title must be 3-100 characters |
| Description length | 10-5000 chars | Description must be 10-5000 characters |
| Start date | ≥1 hour from now | Event must start at least 1 hour from now |
| Start date | ≤365 days ahead | Cannot schedule more than 365 days ahead |
| End date | > Start date | End date must be after start date |
| Coordinates | Lat: -90 to 90 | Invalid latitude |
| Coordinates | Lon: -180 to 180 | Invalid longitude |
| Interests | 1-10 required | At least one interest required |

### Profile Validation

| Rule | Constraint |
|------|-----------|
| Username | 3-30 chars, alphanumeric + underscore |
| Bio | Max 500 characters |
| Radius | 1-100 km |
| Language | en, uk, or ru |

### Rating Validation

| Rule | Constraint |
|------|-----------|
| Score | 1-5 stars |
| Review | Max 2000 characters |

---

## Capacity Rules

### Event Capacity

```
Min participants: 1
Max participants: 100,000
Default max: 50
Waitlist: Optional
Waitlist limit: Configurable
```

### Premium Event Limits

| Tier | Event Creation Limit |
|------|---------------------|
| Free | 3 events |
| Basic | 10 events |
| Pro | 50 events |
| Business | Unlimited |

---

## XP Rules

### XP Actions

| Action | XP Value | Frequency Limit |
|--------|----------|-----------------|
| event_join | 10 | Once per event |
| event_create | 50 | Per event |
| event_attend | 100 | Once per event |
| profile_complete | 25 | Once |
| referral | 200 | Per user |
| streak | 50 | Daily |
| badge_earned | 100 | Per badge |
| report_submit | 25 | - |

### Level Progression

| Level | Title | Min XP | Perks |
|-------|-------|--------|-------|
| 1 | Newcomer | 0 | basic_features |
| 2 | Regular | 100 | create_events |
| 3 | Explorer | 300 | badges |
| 4 | Enthusiast | 600 | analytics |
| 5 | Active | 1000 | featured |
| 6 | Dedicated | 1500 | priority |
| 7 | Expert | 2100 | exclusive |
| 8 | Master | 2800 | - |
| 9 | Legend | 3600 | - |
| 10 | Elite | 4500 | - |

---

## Trust Score Rules

### Score Range
All scores: 0-100

### Score Components
- `events` (40%): Event-related trust
- `social` (30%): Social interaction trust
- `verified` (30%): Verification bonus

### Score Adjustments

| Action | Adjustment |
|--------|------------|
| Attend event | +1 events score |
| Rating ≥ 4.5 | +5 events score |
| Rating < 3 | -5 events score |
| Submit report | -5 social score |
| Severe report | -20 overall |
| Business verified | 100 verified |

---

## Permission Rules

### Default Roles

| Role | Priority | Permissions |
|------|----------|-------------|
| admin | 100 | * (all) |
| business | 50 | events.create, events.publish, analytics.view, business.manage |
| organizer | 40 | events.create, events.edit, events.delete, events.publish |
| user | 10 | profile.view, profile.edit, events.join, chat.send |
| guest | 1 | profile.view.public |

### Premium Permissions

| Tier | Permissions |
|------|-------------|
| basic | events.create_limit_10, analytics.basic |
| pro | events.create_limit_50, badges.featured, premium.badge |
| business | events.create_unlimited, analytics.full, business.verified |

---

## Event Lifecycle Rules

### State Transitions

```
draft ──publish()──> published ──start()──> ongoing ──finish()──> completed
  │                        │                                      │
  │                        └──cancel()──> cancelled ──archive()──>┘
  │                                                               │
  └───────────────────────archive()────────────────────────────────┘
```

### Business Rules by State

| State | Can Join | Can Leave | Can Edit | Can Cancel |
|-------|---------|----------|---------|-----------|
| draft | No | No | Yes (owner) | Yes (owner) |
| published | Yes | Yes | Yes (owner) | Yes (owner) |
| ongoing | No | No | No | No |
| completed | No | No | No | No |
| cancelled | No | No | No | No |

---

## Premium Subscription Rules

### Subscription Period
- Monthly: 30 days
- Yearly: 365 days

### Auto-Renewal
- Enabled by default
- User can disable
- Cancellation at any time
- Access continues until end of period

### Upgrade/Downgrade
- Immediate effect
- Proration not implemented (full period)
- Downgrade applies at next renewal

---

## Badge Criteria

| Badge | Criteria | Tier |
|-------|----------|------|
| first_event | Create 1 event | Bronze |
| event_organizer | Create 10 events | Silver |
| social_butterfly | Join 20 events | Bronze |
| consistent | 5 consecutive events | Silver |
| premium_member | Purchase premium | Gold |
| verified_business | Business verified | Gold |
| top_rated | 4.5+ avg rating | Gold |
| streak_7 | 7-day streak | Bronze |
| streak_30 | 30-day streak | Silver |
| streak_100 | 100-day streak | Platinum |
| event_master | Create 100 events | Platinum |
| community_pillar | Refer 10 users | Gold |
| early_adopter | Beta signup | Gold |
| featured_creator | Event featured | Silver |

---

## Search Rules

### Result Limits

| User Type | Max Results |
|-----------|-------------|
| Guest | 20 |
| User | 20 |
| Premium | 100 |
| Admin | Unlimited |

### Filter Permissions

| Filter | Guest | User | Premium | Admin |
|--------|-------|------|---------|-------|
| Location | ✓ | ✓ | ✓ | ✓ |
| Date | ✓ | ✓ | ✓ | ✓ |
| Interests | ✗ | ✗ | ✓ | ✓ |
| Category | ✗ | ✗ | ✓ | ✓ |

---

## Rate Limiting Rules

| Action | Limit |
|--------|-------|
| API requests | 100/min |
| Messages | 30/min |
| Event creation | 1/min |
| Reports | 10/day |

---

## Data Retention Rules

| Data Type | Retention |
|-----------|-----------|
| Messages | Forever |
| Events | Forever |
| Deleted users | 30 days |
| Analytics | 2 years |
| Session logs | 90 days |

---

## Error Codes

### Auth Errors
- `INVALID_CREDENTIALS`
- `SESSION_EXPIRED`
- `SESSION_NOT_FOUND`
- `INVALID_TELEGRAM_DATA`

### Event Errors
- `EVENT_FULL`
- `ALREADY_JOINED`
- `NOT_PARTICIPANT`
- `INVALID_DATE`
- `INVALID_LOCATION`
- `PERMISSION_DENIED`

### Business Errors
- `BUSINESS_NOT_FOUND`
- `VERIFICATION_REQUIRED`
- `ALREADY_VERIFIED`
- `ORGANIZER_LOCKED`

### Premium Errors
- `PREMIUM_REQUIRED`
- `SUBSCRIPTION_NOT_FOUND`
- `ALREADY_SUBSCRIBED`

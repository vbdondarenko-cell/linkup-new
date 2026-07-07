# Organizer System

## Purpose

This document defines the organizer platform for LinkUp V5, including progression tiers, dashboard features, tools, and analytics.

## Scope

- Organizer roles and tiers
- Dashboard features
- Event management tools
- Templates and series
- Analytics and insights
- Progression system

## Organizer Roles

### Role Hierarchy

| Role | Description | Requirements |
|------|-------------|--------------|
| User | Basic participant | Telegram auth |
| Organizer Candidate | Applied, pending | 5 events, trust 60+ |
| Starter Organizer | Entry-level | Application approved |
| Growing Organizer | Intermediate | 25 events, 4.0 rating |
| Established Organizer | Advanced | 100 events, 4.5 rating |
| Premium Organizer | Top tier | Premium + metrics |

---

## Organizer Dashboard

### Dashboard Home

**Overview Cards:**
| Metric | Description |
|--------|-------------|
| Total Events | Events created (all time) |
| Upcoming Events | Events in next 30 days |
| Total Attendees | Sum of all attendance |
| This Month | Events and attendees this month |

**Quick Actions:**
- Create Event
- View Requests
- Messages
- Analytics

### Event Management

**Event List View:**
| Column | Description |
|--------|-------------|
| Event | Title, date, status |
| Status | Draft/Published/Live/Complete |
| Capacity | Current / Max |
| Requests | Pending requests |
| Attendance | Checked-in / Joined |

**Bulk Actions:**
- Cancel multiple events
- Duplicate events
- Export data

---

## Event Creation Tools

### Quick Create

Streamlined creation for experienced organizers.

**Flow:**
1. Title + Category
2. Date/Time picker
3. Location (recent or new)
4. Capacity + Settings
5. Publish

**Time:** ~2 minutes for repeat organizers

### Full Create

Complete event creation with all options.

**Sections:**
- Basic Info (title, description, category)
- Media (cover image, gallery)
- Schedule (date, time, duration)
- Location (address, map, indoor details)
- Capacity (max, waitlist, approval)
- Questions (custom join questions)
- Settings (visibility, age, price)
- Preview

### Template Creation

Save configuration as reusable template.

**Template Fields:**
| Included | Not Included |
|----------|--------------|
| Title template | Dates/times |
| Description | Location |
| Category | Specific capacity |
| Approval settings | Attendee data |
| Custom questions | Cover image |

---

## Event Series

### Series Creation

**Recurrence Options:**
| Pattern | Description |
|---------|-------------|
| Daily | Every N days |
| Weekly | Same day, every N weeks |
| Biweekly | Every 2 weeks |
| Monthly (Date) | Same date monthly |
| Monthly (Day) | Same weekday/week |

**Generate Options:**
| Option | Values |
|--------|--------|
| Generate Ahead | 4, 8, 12 weeks |
| Duration | Until date or count |
| Auto-generate | On/Off |

### Series Management

**Edit Options:**
| Action | Scope |
|--------|-------|
| Edit This | Single event |
| Edit Future | This and subsequent |
| Edit All | Entire series |
| Pause Series | Stop generating |
| End Series | No more events |

---

## Calendar View

### Calendar Features

**Views:**
- Month
- Week
- Day
- Agenda (list)

**Event Display:**
- Event title
- Time
- Capacity indicator
- Status badge

**Interactions:**
- Tap to view event
- Drag to reschedule (draft only)
- Color coding by category

---

## Analytics Dashboard

### Basic Analytics (All Organizers)

**Event Performance:**
| Metric | Description |
|--------|-------------|
| Views | Profile/listing views |
| Clicks | Join button clicks |
| Conversion | Views to joins |
| Attendance Rate | Joined vs attended |

**Time Ranges:**
- Last 7 days
- Last 30 days
- Last 90 days
- All time

### Advanced Analytics (Premium)

**Attendee Insights:**
| Metric | Description |
|--------|-------------|
| Demographics | Age, location distribution |
| Interests | Top attendee interests |
| First-Timers | % new to your events |
| Returning | % repeat attendees |

**Behavior Patterns:**
| Metric | Description |
|--------|-------------|
| Peak Times | Best performing days/times |
| Series Performance | Series vs one-time events |
| Capacity Optimization | Fill rate analysis |
| Waitlist Conversion | Waitlist to attendance |

**Trend Analysis:**
- Month-over-month comparison
- Year-over-year comparison
- Category performance
- Geographic reach

---

## Community Insights

### Health Metrics

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Attendance Rate | >85% | 70-85% | <70% |
| Rating Average | >4.5 | 4.0-4.5 | <4.0 |
| Cancellation Rate | <2% | 2-5% | >5% |
| Response Time | <24h | 24-48h | >48h |

### Retention Analysis

**Metrics:**
- First-time attendee return rate
- Repeat attendee frequency
- Churn prediction indicators

---

## Communication Tools

### Attendee Messaging

**Message Types:**
| Type | Use Case | Limit |
|------|----------|-------|
| Event Update | Time/location change | Unlimited |
| Reminder | Day before event | Auto-sent |
| Follow-up | Thank you, feedback | 3 per event |
| Custom | Special announcements | 5 per event |

### Message Guidelines

| Rule | Reason |
|------|--------|
| No marketing | Keep community-focused |
| No external links | Security, spam prevention |
| No personal contact | Privacy protection |
| No selling | Not a marketplace |

---

## Progression System

### Organizer Tiers

| Tier | Events | Rating | Benefits |
|------|--------|--------|----------|
| Starter | 0 | Any | 3 concurrent, 50 cap |
| Growing | 25 | 4.0+ | 10 concurrent, 200 cap |
| Established | 100 | 4.5+ | 25 concurrent, 500 cap |
| Premium | 200 | 4.7+ | Unlimited all |

### Tier Upgrades

**Automatic Upgrades:**
- System evaluates monthly
- All criteria must be met
- No action required
- Notification on upgrade

**Tier Benefits:**
| Benefit | Starter | Growing | Established | Premium |
|---------|---------|---------|-------------|---------|
| Concurrent Events | 3 | 10 | 25 | Unlimited |
| Event Capacity | 50 | 200 | 500 | Unlimited |
| Series | 5 | 20 | Unlimited | Unlimited |
| Templates | 10 | 50 | Unlimited | Unlimited |
| Analytics | Basic | Standard | Advanced | Advanced+ |
| Featured Slots | 0 | 1 | 3 | 5 |

---

## Limits and Quotas

### Rate Limits

| Action | Limit | Window |
|--------|-------|--------|
| Create Event | 10 | Per hour |
| Send Messages | 50 | Per hour |
| View Analytics | 100 | Per hour |

### Storage Limits

| Type | Starter | Growing | Established | Premium |
|------|---------|---------|-------------|---------|
| Event Photos | 10 | 25 | 100 | Unlimited |
| Templates | 10 | 50 | 200 | Unlimited |
| Analytics History | 30 days | 90 days | 1 year | 2 years |

---

## Edge Cases

### Event Conflicts
- System warns of scheduling conflicts
- No blocking—organizer decides
- Duplicate events allowed

### Capacity Issues
- Cannot reduce below current attendees
- Waitlist auto-promotes if space opens
- Notification sent to waitlist

### Rating Manipulation
- Organizers cannot remove ratings
- Ratings verified by attendance
- Fraud detection active

---

## Future Features

1. **Co-Organizers**: Share management duties
2. **Event Cloning**: Copy successful events
3. **A/B Testing**: Test different descriptions
4. **Audience Building**: Followers for organizers
5. **Monetization**: Ticket sales, fees

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*

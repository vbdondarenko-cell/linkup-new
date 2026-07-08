# Organizer Experience

## Purpose

This document describes the Organizer Experience for LinkUp V6, a premium control center for event management that helps organizers build real communities.

## Scope

- Organizer Dashboard
- Event Management
- Join Request Management
- Calendar View
- Analytics
- Templates
- Community Section
- Notifications

---

## Philosophy

### Automatic Role Activation

Users become Organizers automatically based on backend logic:

```
User (New)
    ↓
After reaching requirements:
- 5+ completed events attended
- 4.0+ average rating
    ↓
Organizer (Rising)
    ↓
After verification:
- Business ID
- Physical location check
    ↓
Verified Business
```

### Design Principles

The Organizer Dashboard follows Apple Human Interface guidelines:
- **Premium** - Clean, refined aesthetics
- **Professional** - Business-ready tools
- **Minimal** - No clutter, only essentials
- **Powerful** - Full feature set
- **Calm** - No overwhelming animations

### What We DON'T Do

- No Notion-style interfaces
- No Trello boards
- No Eventbrite copies
- No Facebook Events look-alikes

---

## Organizer Dashboard

### Welcome Header

**Elements:**
- Organizer Avatar with verification badge
- Display name
- Organizer rank badge with icon
- Level indicator
- Trust Score
- Current streak 🔥
- Longest streak
- Rank progress bar
- Today's date
- Notification bell with count

**Rank System:**

| Rank | Icon | Color | Requirements |
|------|------|-------|-------------|
| Rising | 🌱 | Gray | 5 events, 4.0 rating, 70% attendance |
| Pro | ⭐ | Blue | 25 events, 4.5 rating, 85% attendance |
| Community | 🎯 | Purple | 50 events, 4.5 rating, 90% attendance |
| Elite | 💫 | Gold | 100 events, 4.7 rating, 92% attendance |
| Legend | 👑 | Green | 250 events, 4.8 rating, 95% attendance |

### Summary Cards

**Metrics:**
- Hosted Events (total count)
- Upcoming Events (next 30 days)
- Total Participants (all events)
- Attendance Rate (%)
- Average Rating (⭐)
- Community Growth (%)

**Card Design:**
- Minimal white cards
- Icon with colored background
- Large value number
- Trend indicator (↑/↓ %)
- Easy to scan at a glance

### Quick Actions

**Actions:**
1. Create Event ➕
2. Duplicate Event 📋
3. Calendar 📅
4. Manage Requests 👥
5. Statistics 📊
6. Templates 📝

**Layout:**
- Horizontal scrollable
- Icon + label
- Tappable cards
- Subtle animations

---

## Event Management

### Event Status Types

| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Not published yet |
| Published | Green | Live and accepting |
| Ongoing | Blue | Currently happening |
| Completed | Purple | Past event |
| Cancelled | Red | Cancelled by organizer |
| Archived | Dark Gray | Hidden from public |

### Event Card

**Display:**
- Cover image (if available)
- Status badge
- Premium/Featured badges
- Event title
- Date & time
- Location
- Participants count / capacity
- Pending requests badge
- Full indicator
- Rating with count

**Actions:**
- Edit
- Duplicate
- Participants
- Publish/Pause
- Archive
- Delete

### Filters

**Categories:**
- All
- Draft
- Published
- Ongoing
- Completed
- Archived

**Search:**
- By event title
- By category
- Real-time filtering

### Bulk Actions

- Select multiple events
- Bulk publish
- Bulk archive
- Bulk delete

---

## Join Requests

### Request Card

**User Info:**
- Avatar
- Display name
- Trust level (High/Medium/Low)
- Time since request

**Request Info:**
- Event being requested
- Optional message

**Status:**
- Pending (yellow)
- Accepted (green)
- Declined (red)
- Expired (gray)

**Actions:**
- Accept
- Decline
- View Profile

### Request Management

**Filters:**
- All
- Pending
- Accepted
- Declined
- Expired

**Bulk Actions:**
- Accept All
- Decline All

**Search:**
- By user name
- By event title

---

## Calendar

### View Modes

1. **Month View** - Full month calendar grid
2. **Week View** - 7-day detailed view
3. **Agenda View** - List of upcoming events

### Calendar Features

**Navigation:**
- Previous/Next buttons
- Today button
- Month/Year title

**Event Indicators:**
- Colored dots by status
- Up to 3 visible dots
- "+X" for more

**Summary Stats:**
- Total events this month
- Published count
- Live count
- Total expected guests

### Status Colors

- Draft: Gray (#9CA3AF)
- Published: Green (#10B981)
- Ongoing: Blue (#3B82F6)
- Completed: Purple (#8B5CF6)

---

## Analytics

### Overview Metrics

- Total Events
- Average Attendance (%)
- Average Rating (⭐)
- Completion Rate (%)

### Growth Indicators

- Participants growth (%)
- Events growth (%)
- Rating growth (%)

### Charts

**Events Over Time:**
- Bar chart
- Monthly breakdown
- 6-month view

**Participants Over Time:**
- Line chart
- Cumulative growth
- Monthly comparison

**Events by Status:**
- Pie or bar chart
- Breakdown by status

### Retention

- Participant Return Rate (%)
- Visual progress bar
- Contextual description

### Top Performing Events

Ranked list with:
- Rank badge
- Event title
- Attendee count
- Rating

---

## Templates

### Template Categories

- All
- Social (👥)
- Tech (💻)
- Arts (🎨)
- Sports (⚽)
- Food (🍽️)
- Wellness (🧘)

### Template Card

**Display:**
- Cover image
- Category badge
- Favorite heart
- Title
- Description
- Duration
- Max capacity
- Usage count
- Last used date

**Actions:**
- Use Template
- Edit Template
- Delete Template
- Toggle Favorite

### Template Features

- Save event as template
- Reusable across events
- Favorites system
- Recently used
- Category filtering

---

## Community

### Community Stats

- Returning Participants
- New Members
- Growth Rate (%)

### Top Attendees

**Display:**
- Rank badge (#1, #2, etc.)
- Avatar with verification
- Display name
- Events attended
- Trust score

**Special Recognition:**
- #1: Crown badge 👑

### Community Health

**Metrics:**
- Return Rate - % of participants who return
- Engagement - Level of interaction
- Satisfaction - Average rating

**Visual:**
- Progress bars
- Color-coded indicators
- Descriptive text

### Future Features

- Community badges
- Member milestones
- Enhanced engagement tools

---

## Notifications

### Notification Types

| Type | Icon | Color |
|------|------|-------|
| Join Request | 👋 | Blue |
| Participant Accepted | ✅ | Green |
| Participant Declined | ❌ | Red |
| Event Reminder | ⏰ | Yellow |
| Event Started | 🚀 | Purple |
| Event Finished | 🏁 | Green |
| Statistics Ready | 📊 | Pink |

### Notification Card

**Elements:**
- Unread indicator (colored dot)
- Type icon in colored container
- Title
- Body text (2 lines max)
- Relative time
- Chevron arrow

### Features

- Unread filter
- All notifications
- Mark all as read
- Settings access

---

## File Structure

```
src/features/organizer/
├── dashboard/
│   └── organizer-dashboard.tsx
├── events/
│   └── event-management-screen.tsx
├── requests/
│   └── requests-screen.tsx
├── calendar/
│   └── calendar-screen.tsx
├── analytics/
│   └── analytics-screen.tsx
├── templates/
│   └── templates-screen.tsx
├── community/
│   └── community-screen.tsx
├── notifications/
│   └── notifications-panel.tsx
├── components/
│   ├── index.ts
│   ├── stat-card.tsx
│   ├── welcome-header.tsx
│   ├── event-card.tsx
│   ├── quick-actions.tsx
│   ├── request-card.tsx
│   ├── mini-calendar.tsx
│   └── analytics-chart.tsx
├── hooks/
│   ├── index.ts
│   └── use-organizer-state.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## Microinteractions

### Cards
- Elevate naturally on press
- Scale to 0.98 on press
- Spring animation

### Buttons
- Compress gently on press
- Haptic feedback

### Charts
- Animate on appearance
- Fade in with stagger
- Smooth transitions

### Calendar
- Instant response
- Day selection feedback
- Event dots animate in

---

## Animations

### Entrance
- FadeIn for main containers
- FadeInDown for lists
- Springify for bounce effect

### Transitions
- Layout.springify() for reordering
- FadeInUp for elevated content
- Staggered delays (50ms)

### Loading
- Skeleton states
- Smooth refresh
- Pull-to-refresh

---

## Accessibility

### VoiceOver
- Semantic labels
- Meaningful descriptions
- Proper order

### Dynamic Type
- Flexible font sizes
- Scalable layouts
- Min/max constraints

### Reduced Motion
- Respect system setting
- Simplify animations
- Maintain functionality

### Touch Targets
- Minimum 44px
- Proper spacing
- Easy tap areas

---

## Responsive Design

### Breakpoints
- Phone: Default
- Large Phone: Adjusted padding
- Tablet: Side-by-side layouts
- Desktop Web: Admin dashboard ready

### Layout Adaptations
- Flexible grid
- Conditional rendering
- Platform-specific UI

---

## Performance

### Optimizations
- Memoized calculations
- Lazy loading
- Virtual scrolling
- Image optimization

### Offline Support
- Cached dashboard
- Cached analytics
- Queued updates
- Auto-sync

---

*Last Updated: V6.0*
*Owner: Engineering Team*
*Review Frequency: Per Release*

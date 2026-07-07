# Reputation System

## Purpose

This document defines the trust and reputation system for LinkUp V5. The system builds community trust through verified identities, attendance history, ratings, and accountability mechanisms.

## Scope

- Trust score calculation
- Attendance tracking
- Rating aggregation
- Report handling
- Verification systems
- Score visibility and display

## Core Principles

### Trust Over Engagement

LinkUp prioritizes trust metrics over engagement metrics:

| We Track | We Don't Track |
|----------|----------------|
| Attendance rate | Time spent in app |
| Rating quality | Messages sent |
| Verification status | Events created |
| Report history | Swipes/likes |
| Offline meetings | Follower counts |

### Transparency Without Formula Exposure

We show users their trust indicators without revealing exact calculation methods:

**Visible to Users:**
- Trust score (0-100)
- Member since date
- Attendance percentage
- Average rating given/received
- Verification badges
- Incident history (warnings, bans)

**Not Visible:**
- Exact formula
- Individual rating values
- Weighting factors
- Aggregation methods

---

## Trust Score

### Score Overview

| Metric | Range | Default | Description |
|--------|-------|---------|-------------|
| Trust Score | 0-100 | 50 | Overall trust rating |
| Attendance Score | 0-100 | 100 | Historical attendance |
| Rating Score | 0-5 | N/A | Rating quality |
| Verification Level | 0-3 | 0 | Identity verification |

### Trust Score Components

**Contributing Factors (Not Formula):**

| Factor | Weight | Description |
|--------|--------|-------------|
| Identity Verification | High | Telegram + optional ID |
| Attendance History | High | Shows follow-through |
| Rating History | Medium | Quality of participation |
| Report History | High | Negative accountability |
| Account Age | Low | Established presence |
| Event Hosting | Medium | Community contribution |

### Trust Score Display

**Score Tiers:**

| Score | Tier | Badge | Color |
|-------|------|-------|-------|
| 0-20 | New | Gray | #9CA3AF |
| 21-40 | Developing | Bronze | #CD7F32 |
| 41-60 | Established | Silver | #C0C0C0 |
| 61-80 | Trusted | Gold | #FFD700 |
| 81-100 | Highly Trusted | Platinum | #E5E4E2 |

**Display Rules:**
- Score visible on profile
- Score shown to organizers on request
- Score visible in event attendee list
- Score updates within 24 hours of changes

---

## Attendance Tracking

### Attendance States

| State | Description | Trust Impact |
|-------|-------------|--------------|
| CHECKED_IN | User attended and checked in | Positive |
| ATTENDED | Organizer confirmed attendance | Positive |
| LATE_CHECKIN | Arrived after start | Slightly positive |
| NO_SHOW | Did not attend without notice | Negative |
| CANCELLED_EARLY | Cancelled before event | Neutral |
| WAITLISTED | Never got off waitlist | Neutral |

### Attendance Rate Calculation

**Definition:**
```
Attendance Rate = (Confirmed Attendances) / (Total Committed Events)
```

**Committed Events:**
- Events user joined (approved or open)
- Excludes waitlist-only
- Excludes cancelled events

**Positive Attendance:**
- CHECKED_IN
- ATTENDED
- LATE_CHECKIN (with reason)

**Negative Attendance:**
- NO_SHOW (without valid reason)
- Repeated cancellations

### Attendance Thresholds

| Threshold | Meaning | Trust Impact |
|-----------|---------|--------------|
| >95% | Exceptional | +2 per event |
| 90-95% | Excellent | +1 per event |
| 80-90% | Good | 0 |
| 70-80% | Acceptable | -1 per event |
| <70% | Concerning | -2 per event |

### Late Cancellation Policy

**Cancellation Windows:**
| Time Before Event | Impact |
|-------------------|--------|
| >48 hours | No penalty |
| 24-48 hours | Minor penalty |
| <24 hours | Significant penalty |
| <1 hour | Severe penalty |

---

## Rating System

### Rating Components

Users can rate:
1. **Event Overall** (required): 1-5 stars
2. **Organizer** (required): 1-5 stars
3. **Written Review** (optional): Up to 500 characters

### Rating Collection

**When Rated:**
- Prompt sent 1 hour after event end
- Rating window: 7 days
- Reminder sent after 3 days if no rating

**Rating Requirements:**
- Must have attended to rate
- Cannot rate without attendance confirmation
- Can update within 24 hours

### Rating Aggregation

**For Organizers:**
- Average of all received ratings
- Only completed events count
- Recent ratings weighted higher
- Minimum 3 ratings for public display

**For Users:**
- Average of ratings given
- Shown on profile
- Contributes to trust score

### Rating Display

**On Organizer Profile:**
```
⭐ 4.7 (124 ratings)
Last 30 days: ⭐ 4.9
```

**Rating Categories:**
- Excellent: 5 stars
- Great: 4 stars
- Good: 3 stars
- Fair: 2 stars
- Poor: 1 star

---

## Report System

### Reportable Content

| Type | Examples |
|------|----------|
| User Behavior | Harassment, spam, inappropriate |
| Event Content | Fake event, misleading, cancelled |
| Message | Abusive, inappropriate, spam |
| Profile | Fake, impersonation, inappropriate |

### Report Process

| Step | Action |
|------|--------|
| 1 | User taps report on content |
| 2 | Select category |
| 3 | Optional description |
| 4 | Submit report |
| 5 | Confirmation shown |
| 6 | Report queued for review |

### Report Review

**Review Process:**
1. Reports assigned to Moderators
2. Evidence reviewed
3. Decision made within 48 hours
4. Reporter notified of outcome
5. Action taken if warranted

**Review Outcomes:**
| Outcome | Action |
|---------|--------|
| No Violation | Dismiss report |
| Minor Violation | Warning to user |
| Major Violation | Temporary mute |
| Severe Violation | Permanent ban |
| False Report | Warn reporter |

### Report Impact on Trust

| Violation | Trust Score Impact |
|-----------|-------------------|
| Warning | -5 |
| Temporary Mute | -10 |
| Permanent Ban | -50 |
| False Report | -5 |

---

## Verification Systems

### Verification Levels

| Level | Verification | Badge | Display |
|-------|--------------|-------|---------|
| 0 | None | None | None |
| 1 | Telegram | Gray check | @telegram |
| 2 | Phone | Blue check | @verified |
| 3 | ID | Gold check | @verified+ |

### Level 1: Telegram Verification

**Requirements:**
- Valid Telegram account
- Telegram authentication completed

**Display:**
- @username shown
- Gray verification badge
- Default for all authenticated users

### Level 2: Phone Verification

**Requirements:**
- Phone number verification
- SMS code confirmation
- Unique number (not previously used)

**Display:**
- Blue check badge
- "Verified" label
- Required for Organizer status

### Level 3: Identity Verification

**Requirements:**
- Government ID upload
- Selfie verification
- Address verification (optional)

**Display:**
- Gold check badge
- "ID Verified" label
- Required for Verified Business

### Verification Benefits

| Level | Benefits |
|-------|----------|
| Level 1 | Basic participation |
| Level 2 | Organizer eligible |
| Level 3 | Business verification, priority support |

---

## Organizer Reputation

### Organizer-Specific Metrics

| Metric | Description |
|--------|-------------|
| Events Hosted | Total events created |
| Total Attendees | Sum of all attendance |
| Completion Rate | Events that happened / created |
| Average Rating | Mean of all event ratings |
| Response Rate | Requests responded within 48h |
| Attendance Rate | % of capacity attended |

### Organizer Quality Indicators

**Super Organizer** (Auto-calculated):
- 25+ events hosted
- 4.5+ average rating
- 90%+ attendance rate
- <1% cancellation rate
- Response rate >95%

**Display:**
- Super Organizer badge
- Priority in recommendations
- Featured in category pages

### New Organizer Support

**Soft Launch Period:**
- Limited concurrent events
- New organizer badge
- Additional moderation
- Training resources

---

## Business Reputation

### Business-Specific Metrics

| Metric | Description |
|--------|-------------|
| Business Rating | From official event attendees |
| Customer Satisfaction | Survey responses |
| Response Rate | Inquiries responded |
| Offer Redemption | Special offer usage |
| Repeat Customers | Return visitors |

### Business Verification

**Verification Requirements:**
1. Business registration document
2. Business address verification
3. Owner identity verification
4. Physical location check

**Verified Business Badge:**
- Green business badge
- "Official" label
- Business category tag
- Link to business profile

---

## Trust Score Updates

### Update Frequency

| Component | Update Timing |
|-----------|---------------|
| Trust Score | Real-time, displayed daily |
| Attendance Rate | After each event |
| Rating Score | After each rating |
| Verification | Instant on verification |

### Score Boundaries

| Rule | Value |
|------|-------|
| Minimum Score | 0 |
| Maximum Score | 100 |
| New User Default | 50 |
| Organizer Minimum | 60 |

### Score Recovery

**Improving Score:**
- Attend events consistently (+1-2 per event)
- Receive positive ratings (+1-5)
- Complete verification (+5-10)
- Host events as organizer (+2-5)
- No violations for 6 months (+5)

**Declining Score:**
- No-shows (-2 to -5)
- Reports upheld (-5 to -10)
- Violations (-10 to -50)
- Inactivity 6+ months (-5)

---

## Edge Cases

### New Users with No History
- Default score: 50
- Score can go up or down based on first events
- Organizers see "New User" indicator

### Long-term Inactive Users
- Score frozen at last value
- Warning at 6 months inactive
- Auto-archive at 1 year

### Trust Score Appeals
- Users can appeal score impacts
- Appeals reviewed by human
- Score may be restored if error

### Coordinated Manipulation
- Detection algorithms flag patterns
- Rating rings investigated
- Action taken if confirmed
- Appeals available

---

## Future Expansion

1. **Peer Endorsements**: Trusted users can endorse others
2. **Community Badges**: Earned through community voting
3. **Skill Verification**: Verify specific skills/expertise
4. **Reference Letters**: Written by trusted community members
5. **Trust Circles**: Mutual trust networks

---

## Open Questions

1. Should trust score impact search rankings?
2. How do we handle cross-platform trust?
3. Should trust scores be visible to all users?
4. How do we weight recent vs. historical behavior?

---

*Last Updated: Phase 1.0*
*Owner: Trust & Safety Team*
*Review Frequency: Quarterly*

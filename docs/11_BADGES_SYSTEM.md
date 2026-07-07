# Badges System

## Purpose

This document defines the achievement badges system for LinkUp V5. Badges recognize user accomplishments, encourage positive behaviors, and display community standing.

## Scope

- Badge categories
- Badge requirements
- Rarity tiers
- Display rules
- Award process

## Badge Philosophy

### Recognition, Not Gamification

Badges should:
- Celebrate genuine achievements
- Encourage positive behaviors
- Build community pride
- Provide social proof

Badges should NOT:
- Create addictive loops
- Encourage badge farming
- Create status anxiety
- Be purchasable

---

## Badge Categories

### 1. Explorer Category

Recognizes event discovery and attendance.

| Badge | Name | Requirement | Rarity |
|-------|------|-------------|--------|
| 🧭 | First Steps | Attend first event | Common |
| 🌍 | Explorer | Attend 5 events | Common |
| 🗺️ | World Traveler | Attend 10 events | Uncommon |
| ⛰️ | Adventurer | Attend 25 events | Rare |
| 🚀 | Trailblazer | Attend 50 events | Epic |
| 🌟 | Legend | Attend 100 events | Legendary |

### 2. Social Category

Recognizes community building and connection.

| Badge | Name | Requirement | Rarity |
|-------|------|-------------|--------|
| 🤝 | Social Butterfly | Meet 10 people | Common |
| 👥 | Connector | Meet 25 people | Uncommon |
| 🏘️ | Community | Meet 50 people | Rare |
| 🌐 | Networker | Meet 100 people | Epic |
| 👑 | Super Connector | Meet 250 people | Legendary |

### 3. Creator Category

Recognizes event creation and organizing.

| Badge | Name | Requirement | Rarity |
|-------|------|-------------|--------|
| 📝 | First Host | Create first event | Common |
| 🏠 | Organizer | Host 5 events | Uncommon |
| 🎯 | Series Starter | Create first series | Uncommon |
| 🏆 | Veteran Host | Host 25 events | Rare |
| 💎 | Master Organizer | Host 50 events | Epic |
| 👑 | Community Leader | Host 100 events | Legendary |

### 4. Quality Category

Recognizes consistent, positive participation.

| Badge | Name | Requirement | Rarity |
|-------|------|-------------|--------|
| ⭐ | Rater | Rate 3 events | Common |
| 🎖️ | Consistent | 90%+ attendance, 10 events | Uncommon |
| 🏅 | Quality Contributor | 4.5+ avg rating given | Rare |
| 💯 | Perfect Record | 100% attendance, 20 events | Epic |
| 🥇 | Elite Participant | 4.9+ avg rating, 50 events | Legendary |

### 5. Special Category

Recognizes unique achievements or milestones.

| Badge | Name | Requirement | Rarity |
|-------|------|-------------|--------|
| 🌅 | Early Bird | Join during beta | Epic |
| ✅ | Verified | Complete phone verification | Common |
| 🛡️ | Guardian | Submit 10 valid reports | Rare |
| 🎓 | Mentor | Help 10 newcomers | Rare |
| 💎 | Ambassador | Referred 25 users | Epic |
| 🔒 | Private | 100% privacy settings | Uncommon |

---

## Rarity Tiers

### Tier Definitions

| Tier | % of Eligible Users | Color | Effect |
|------|-------------------|-------|--------|
| Common | 50% | Gray | Standard |
| Uncommon | 25% | Green | Highlighted |
| Rare | 15% | Blue | Prominent |
| Epic | 8% | Purple | Shimmer |
| Legendary | 2% | Gold | Animated |

### Rarity Calculation

Rarity is calculated dynamically:
- When badge criteria met
- Based on current eligible users
- Recalculated monthly
- A badge can change rarity

**Example:**
If 10,000 users attend 5 events, but only 2,500 also have 90%+ attendance, the "Consistent" badge is Uncommon.

---

## Badge Requirements Detail

### Explorer Badges

| Badge | Criteria | Verification |
|-------|----------|--------------|
| First Steps | Event attendance count = 1 | Confirmed attendance |
| Explorer | Event attendance count >= 5 | Confirmed attendance |
| World Traveler | Event attendance count >= 10 | Confirmed attendance |
| Adventurer | Event attendance count >= 25 | Confirmed attendance |
| Trailblazer | Event attendance count >= 50 | Confirmed attendance |
| Legend | Event attendance count >= 100 | Confirmed attendance |

### Social Badges

| Badge | Criteria | Verification |
|-------|----------|--------------|
| Social Butterfly | Unique event co-attendees >= 10 | System tracked |
| Connector | Unique co-attendees >= 25 | System tracked |
| Community | Unique co-attendees >= 50 | System tracked |
| Networker | Unique co-attendees >= 100 | System tracked |
| Super Connector | Unique co-attendees >= 250 | System tracked |

*Note: "Met" defined as attended same event, not necessarily interacted*

### Creator Badges

| Badge | Criteria | Verification |
|-------|----------|--------------|
| First Host | Events created >= 1 | Publish event |
| Organizer | Events hosted >= 5 | Complete events |
| Series Starter | Series created >= 1 | Series published |
| Veteran Host | Events hosted >= 25 | Complete events |
| Master Organizer | Events hosted >= 50 | Complete events |
| Community Leader | Events hosted >= 100 | Complete events |

### Quality Badges

| Badge | Criteria | Verification |
|-------|----------|--------------|
| Rater | Ratings given >= 3 | Submit ratings |
| Consistent | Attendance rate >= 90% AND events >= 10 | Calculated |
| Quality Contributor | Avg rating given >= 4.5 | Calculated |
| Perfect Record | Attendance rate = 100% AND events >= 20 | Calculated |
| Elite Participant | Avg rating >= 4.9 AND events >= 50 | Calculated |

### Special Badges

| Badge | Criteria | Verification |
|-------|----------|--------------|
| Early Bird | Join date before launch | System date |
| Verified | Phone verified | Verification |
| Guardian | Valid reports >= 10 | Moderation approval |
| Mentor | Help actions >= 10 | Tracked |
| Ambassador | Successful referrals >= 25 | Referral tracking |
| Private | All privacy options enabled | System check |

---

## Badge Award Process

### Automatic Awards

| Step | Action |
|------|--------|
| 1 | User completes qualifying action |
| 2 | System checks all badges |
| 3 | If criteria met → Award badge |
| 4 | Record badge to user profile |
| 5 | Show notification |
| 6 | Update badge catalog |

### Badge Award Notification

```
🏅 New Badge Earned!

[Rare] Adventurer
You've attended 25 events!
That's [X]% of LinkUp users.

[Share] [View Profile]
```

---

## Badge Display

### Profile Display

**Badge Showcase (3 slots):**
```
[Badge] [Badge] [Badge]
Most meaningful to you
```

**Full Badge Collection:**
```
Badges (24 / 36 earned)

🧭 First Steps    ✅ Verified
🌍 Explorer       🎖️ Consistent
🤝 Social Butterfly
... (view all)
```

### Event Attendance Display

Organizers can see attendee badges:
```
Attendees (47)

👤 Maria ⭐⭐⭐⭐⭐ [Explorer] [Verified]
👤 John 🏅 [Consistent]
👤 Sarah [Newcomer]
... (view all)
```

### Featured Badges

Users can feature 3 badges:
- Shown on profile card
- Shown in event attendee lists
- Can be changed anytime

---

## Badge Rules

### Ownership Rules

| Rule | Description |
|------|-------------|
| Permanent | Badges never expire |
| Irreversible | Cannot lose earned badges |
| Unique | One badge per type |
| Stackable | Can earn all badges |

### Display Rules

| Rule | Description |
|------|-------------|
| Minimum | 3 badges shown on profile |
| Maximum | 3 featured at a time |
| Order | User chooses featured order |
| Privacy | Badges private until featured |

### Badge Integrity

| Rule | Description |
|------|-------------|
| No Purchasing | Badges cannot be bought |
| No Trading | Badges cannot be transferred |
| No Gaming | Fraudulent actions void badges |
| Appeals | Can appeal badge revocation |

---

## Edge Cases

### Badge Recalculation
- Criteria met after initial failure
- System checks monthly
- Badge awarded if now eligible

### Duplicate Events
- Multiple same-day events count separately
- Same event, different dates count

### Badge Display Limits
- Only 3 featured at a time
- Full collection viewable
- Search results show featured only

---

## Future Badge Ideas

1. **Seasonal Badges**: Limited-time event badges
2. **Collaborative Badges**: Badge chains across users
3. **Skill Badges**: Specific skill verification
4. **Location Badges**: Visit specific areas
5. **Challenge Badges**: Complete themed challenges

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*

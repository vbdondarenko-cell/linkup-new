# Recommendation Engine

## Purpose

This document defines the recommendation system for LinkUp V5. The engine personalizes event discovery based on user preferences, behavior, and contextual factors.

## Scope

- Ranking signals
- Recommendation types
- Scoring algorithms
- Personalization factors
- Fairness considerations

---

## Core Philosophy

### Trust-Enhancing Recommendations

Recommendations should:
- Surface quality events users will enjoy
- Reduce discovery friction
- Respect user privacy
- Not manipulate user behavior

Recommendations should NOT:
- Maximize engagement at all costs
- Create filter bubbles
- Surface deceptive or low-quality events
- Manipulate user attention

---

## Ranking Signals

### Signal Categories

| Category | Weight | Description |
|----------|--------|-------------|
| Relevance | 40% | User-event match |
| Proximity | 25% | Distance factor |
| Quality | 20% | Event/organizer reputation |
| Recency | 10% | Time-based freshness |
| Social | 5% | Community signals |

### Signal Details

#### Relevance Signals

| Signal | Type | Description |
|--------|------|-------------|
| Interest Match | Explicit | User's selected interests vs event category |
| Past Attendance | Implicit | Events similar to attended events |
| Rating Correlation | Implicit | Events similar to highly-rated attendances |
| Search Match | Intent | Matching search queries |

#### Proximity Signals

| Signal | Type | Description |
|--------|------|-------------|
| Distance | Primary | User location to event location |
| Transit Time | Secondary | Estimated travel time |
| Popularity Area | Tertiary | Event density in area |

#### Quality Signals

| Signal | Type | Description |
|--------|------|-------------|
| Organizer Rating | Primary | Average rating of organizer |
| Event Rating | Secondary | Average rating of similar events |
| Trust Score | Tertiary | Organizer's trust score |
| Completion Rate | Factor | % of events completed |

#### Recency Signals

| Signal | Type | Description |
|--------|------|-------------|
| Event Publish Date | Primary | Newer events slightly preferred |
| Last Update | Secondary | Recently updated events |
| Seasonality | Context | Time of year factors |

#### Social Signals

| Signal | Type | Description |
|--------|------|-------------|
| Popularity | Primary | Number of attendees |
| Waitlist | Secondary | Interest shown |
| Community | Tertiary | Events popular in user's area |

---

## Recommendation Types

### 1. For You

Personalized events based on user profile and history.

**Display Location:** Home screen, For You tab

**Ranking Factors:**
1. Interest match (required)
2. Distance (max 25km default)
3. Quality signals
4. Availability (spots open)

**Rules:**
- Never shows events user already joined
- Respects user filters
- Mix of categories required

### 2. Nearby

Geographic-based discovery without personalization.

**Display Location:** Map view, Nearby tab

**Ranking Factors:**
1. Distance (primary)
2. Recency
3. Availability

**Rules:**
- No personalization
- Based on map viewport
- Clusters expand on zoom

### 3. Trending

Events gaining momentum in user's area.

**Display Location:** Discover tab

**Ranking Factors:**
1. Recent joins (velocity)
2. Waitlist activity
3. Profile views

**Rules:**
- Localized to user's area
- Excludes past events
- Recalculated hourly

### 4. Starting Soon

Events happening within the next few hours.

**Display Location:** Home screen banner

**Ranking Factors:**
1. Time to start (sooner = higher)
2. Distance
3. Available spots

**Rules:**
- Within 4 hours of start
- Must have available spots
- User hasn't joined

### 5. For Series

Events in series user follows.

**Display Location:** Following tab

**Ranking Factors:**
1. Series subscription (required)
2. Event date
3. Previous attendance

---

## Scoring Algorithm

### Base Score Calculation

```
Score = (Relevance × 0.40) + (Proximity × 0.25) + (Quality × 0.20) + (Recency × 0.10) + (Social × 0.05)
```

### Normalization

| Signal | Method |
|--------|--------|
| Distance | Inverse (1/distance) capped |
| Ratings | Scale 0-1 from 1-5 stars |
| Popularity | Log scale to prevent outliers |
| Time | Decay function |

### Final Ranking

```
Ranked Events = Sort(Events, Score, [Distance Filter])
```

### Filtering

**Applied Before Ranking:**
- Distance (max configurable)
- Category (user-selected)
- Date range
- Availability (spots > 0)

**Applied After Ranking:**
- Already joined (removed)
- Blocked organizer (removed)
- Duplicate events (deduplicated)

---

## Personalization Factors

### User Profile

| Factor | Source | Update Frequency |
|--------|--------|------------------|
| Interests | Explicit selection | On change |
| Location | Geolocation | Real-time |
| Language | Device/API | On login |

### User Behavior

| Factor | Source | Decay |
|--------|--------|-------|
| Recent attends | Event history | 30 days |
| Recent searches | Search history | 7 days |
| Clicks | Engagement | 7 days |
| Ratings | Event ratings | 90 days |

### Context

| Factor | Source | Scope |
|--------|--------|-------|
| Time of day | System time | Per request |
| Day of week | System time | Per request |
| Weather | Weather API | Hourly |
| Seasonality | Calendar | Per request |

---

## Fairness in Recommendations

### Non-Manipulation Rules

| Rule | Description |
|------|-------------|
| No Fake Popularity | Cannot boost based on payment alone |
| Quality Floor | Events below 3.0 rating not recommended |
| Trust Floor | Organizers below trust score 40 not recommended |
| Geographic Diversity | Always include diverse locations |

### Visibility Rules

| Type | Limit |
|------|-------|
| Premium Featured | Max 10% of results |
| Business Events | Clearly labeled, not in top 3 |
| Own Events | Never in recommendations to self |

### Anti-Gaming Measures

| Measure | Description |
|---------|-------------|
| Bot Detection | Filter suspicious join patterns |
| Fake Reviews | Detection and removal |
| Popularity Inflation | Anomaly detection |
| Click Farming | Engagement pattern analysis |

---

## Recommendation Display

### Card Information

```
┌─────────────────────────────────┐
│ [Image]                         │
│ Sports & Fitness                │
│                                 │
│ Weekend Hiking Adventure         │
│ ⭐ 4.8 · 🧭 2.3km                │
│                                 │
│ 📅 Tomorrow, 8:00 AM             │
│ 👥 12/20 spots                  │
│                                 │
│ [Organizer Avatar] John S.       │
│ 🏅 Super Organizer               │
└─────────────────────────────────┘
```

### Empty States

| State | Message | Action |
|-------|---------|--------|
| No matches | "No events match your interests nearby" | Suggest expanding |
| All joined | "You're all caught up!" | Offer nearby |
| Filters too strict | "Try adjusting your filters" | Show filter reset |

---

## Technical Architecture

### Recommendation Pipeline

```
[Event Store]
      ↓
[Feature Extraction]
      ↓
[Model Inference]
      ↓
[Ranking]
      ↓
[Diversity Filter]
      ↓
[Caching Layer]
      ↓
[API Response]
```

### Caching Strategy

| Cache Type | TTL | Invalidation |
|------------|-----|--------------|
| User Recommendations | 1 hour | Event join, filter change |
| Trending Events | 1 hour | New joins |
| Nearby Events | 5 minutes | Map pan |
| Series Events | 1 day | New event in series |

### Performance Requirements

| Metric | Target |
|--------|--------|
| Recommendation Latency | <100ms |
| API Response Time | <200ms |
| Freshness | Hourly updates |
| Coverage | >80% of active events |

---

## Future Enhancements

1. **Collaborative Filtering**: Users like you attended
2. **Sequential Patterns**: Event chains
3. **Contextual Bandits**: A/B testing framework
4. **Explainability**: Why this event recommended
5. **Control**: User adjustment of weights

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*

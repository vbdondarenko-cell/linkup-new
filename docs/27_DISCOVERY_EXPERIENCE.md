# Discovery Experience

## Purpose

This document describes the Discovery Experience for LinkUp V6, the intelligent layer that surfaces relevant events and helps users connect with their community.

## Scope

- Universal Search
- Recommendation Engine
- Smart Filters
- Trending System
- Favorites
- Recent Activity
- Location Intelligence
- Similar Events

---

## Core Philosophy

### LinkUp is NOT a Social Feed

LinkUp is NOT TikTok.

LinkUp is NOT Instagram.

There is NO infinite scrolling feed.

Discovery exists to help people meet offline.

Everything must encourage real-world interaction.

---

## Discovery Sources

Recommendations are generated from:

- Nearby Events
- Official Business Events
- Organizer Events
- Shared Interests
- Distance
- Language
- Trust Score
- Event Rating
- Available Seats
- Time Until Event
- Past Activity
- Attendance History
- Favorite Categories
- Saved Events
- Future AI Recommendations

---

## Discovery Priority

| Priority | Content Type |
|----------|-------------|
| 1 | Nearby events matching interests |
| 2 | High Trust organizers |
| 3 | Events starting soon |
| 4 | Verified Businesses |
| 5 | Trending events nearby |
| 6 | Recommended categories |
| 7 | New organizers |
| 8 | Popular events |

**Never recommend low-quality or unsafe events above trusted ones.**

---

## Universal Search

### Concept

Create ONE global search system that works across the entire application.

### Searchable Content

| Type | Description |
|------|-------------|
| Events | All public events |
| Businesses | Verified business profiles |
| Organizers | Event organizer profiles |
| Categories | Event categories |
| Interests | User interests |
| Addresses | Locations & venues |
| Cities | Geographic areas |
| Saved Places | User's saved locations |
| Templates | Event templates |

### Search Experience

- Opens instantly
- Animated expansion
- Recent searches
- Popular searches
- Trending categories
- Suggested results
- Instant results
- No loading screen

---

## Search Results

### Grouped Sections

| Section | Card Type |
|---------|-----------|
| Events | EventCard |
| Businesses | BusinessCard |
| Organizers | OrganizerCard |
| Categories | CategoryChip |
| Addresses | LocationCard |

---

## Smart Filters

### Filter Types

| Filter | Options |
|--------|---------|
| Distance | 1km, 2km, 5km, 10km, 25km, 50km |
| Category | 20+ categories |
| Date | Today, Tomorrow, This Week, This Month |
| Time | Morning, Afternoon, Evening, Night |
| Language | Multiple options |
| Trust Score | Range slider |
| Rating | 1-5 stars |
| Price | Free, Paid, All |
| Available Seats | Minimum threshold |
| Organizer | Specific organizer |
| Business | Specific business |
| Premium | Premium only |
| Verified | Verified only |
| Open Now | Boolean |

### Filter Architecture

Filters are additive. Multiple filters narrow results. No complex logic needed.

---

## Sorting

### Sort Options

| Option | Icon | Description |
|--------|------|-------------|
| Recommended | ✨ | AI-weighted ranking |
| Nearest | 📍 | By distance |
| Starting Soon | ⏰ | By start time |
| Highest Rated | ⭐ | By rating |
| Most Popular | 🔥 | By attendance |
| Newest | 🆕 | By creation date |
| Most Trusted | 🛡️ | By organizer trust |

---

## Recommendation Engine

### Architecture

Backend supports weighted scoring with multiple factors.

### Weight Factors

| Factor | Default Weight | Description |
|--------|---------------|-------------|
| Distance | 25% | Proximity to user |
| Interest Match | 20% | Category alignment |
| Trust Score | 15% | Organizer trustworthiness |
| Attendance Rate | 10% | Historical participation |
| Past Participation | 8% | User's history |
| Language Match | 5% | Preferred language |
| Category Match | 7% | Category preferences |
| Event Quality | 5% | Rating & reviews |
| Freshness | 3% | Recency of event |
| Capacity | 2% | Available spots |

### Hidden Algorithm

Recommendation formulas are never exposed. The algorithm evolves over time.

---

## Trending

### Trending Types

| Type | Description |
|------|-------------|
| Trending Events | Most activity in area |
| Trending Categories | Popular category growth |
| Trending Businesses | Active business profiles |
| Trending Organizers | Rising organizer profiles |
| Trending Areas | Active geographic zones |

### Trending Metrics

- Trend Score (0-100)
- Change percentage
- Time period (day/week/month)

---

## Personalization

### Learning Sources

| Source | Data Used |
|--------|-----------|
| Joined Events | Attendance history |
| Skipped Events | Disinterest signals |
| Favorites | Saved interests |
| Search History | Topic preferences |
| Interest Changes | Evolving taste |
| Organizer Preferences | Trusted organizers |
| Business Preferences | Preferred venues |
| Time of Day | Preferred event times |
| Preferred Radius | Location settings |

### Continuous Improvement

Recommendations improve automatically as users interact with the platform.

---

## Similar Events

### Algorithm

Every Event Detail page shows related events.

### Similarity Factors

| Factor | Weight |
|--------|--------|
| Category | High |
| Distance | Medium |
| Organizer | Medium |
| Interests | High |
| Price | Low |
| Time | Low |

### Display

- "You May Also Like" section
- Maximum 5 similar events
- Horizontal scrollable list

---

## Favorites

### Saveable Items

- Events
- Businesses
- Organizers

### Future

- Collections
- Folders
- Shared favorites

---

## Recent Activity

### Tracked Items

| Type | Description |
|------|-------------|
| Recent Searches | Query history |
| Viewed Events | Event views |
| Viewed Businesses | Business views |
| Viewed Organizers | Organizer views |
| Recently Joined | Attendance history |
| Recently Hosted | Hosted events |

### Display

- Recent tab in Discovery
- Chronologically sorted
- Quick re-access

---

## Location Intelligence

### Auto-Update Triggers

| Trigger | Action |
|---------|--------|
| Location change | Recalculate nearby |
| Radius change | Update filters |
| Time change | Refresh "Open Now" |
| New events | Add to recommendations |

### Offline Support

- Cache recent recommendations
- Display last-known nearby
- Sync when online

---

## Empty States

### Types

| State | Message | Action |
|-------|---------|--------|
| No Results | "No events found" | Suggest broader search |
| No Nearby | "No nearby events" | Offer radius expansion |
| No Categories | "No matching categories" | Suggest exploring |
| No Favorites | "No saved items" | Suggest discovery |

### Actions

- Expand Radius
- Browse Categories
- Create Event

---

## Performance

### Optimizations

- Instant search (< 100ms)
- Debounced input (300ms)
- Virtualized results
- Cached recommendations
- Incremental loading
- Optimized queries

---

## File Structure

```
src/features/discovery/
├── discovery-screen.tsx
├── components/
│   ├── index.ts
│   ├── search-bar.tsx
│   ├── event-card.tsx
│   └── filter-sheet.tsx
├── hooks/
│   ├── index.ts
│   └── use-discovery-state.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## Components

### SearchBar

- Animated expansion
- Debounced search
- Recent searches
- Trending categories
- Result previews

### EventCard

- Cover image
- Category badge
- Distance indicator
- Price badge
- Favorite button
- Rating & attendance
- Organizer info

### FilterSheet

- Sort options
- Distance slider
- Category chips
- Price filter
- Toggle filters
- Clear all

---

## Animations

### Search

- Open: Scale + Fade
- Close: Reverse
- Results: Staggered fade

### Filters

- Sheet: Slide up
- Chips: Scale press
- Apply: Pulse

### Recommendations

- Refresh: Pull-to-refresh
- Update: Fade transition

---

## Accessibility

### VoiceOver

- All interactive elements labeled
- Results announced properly
- Filter states clear

### Touch Targets

- Minimum 44px
- Adequate spacing

### Dynamic Type

- Flexible layouts
- Scalable text

---

*Last Updated: V6.0*
*Owner: Engineering Team*
*Review Frequency: Per Release*

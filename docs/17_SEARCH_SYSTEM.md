# Search System

## Purpose

This document defines the search functionality for LinkUp V5, covering universal search, filtering, and result ranking.

## Scope

- Search types
- Search features
- Filtering options
- Result ranking
- Performance requirements

---

## Search Overview

### Search Types

| Type | Scope | Primary Use |
|------|-------|--------------|
| Universal | All content | Main search bar |
| Events | Events only | Event discovery |
| Organizers | Organizers only | Find hosts |
| Businesses | Businesses only | Find verified businesses |
| Series | Event series | Recurring events |

---

## Universal Search

### Searchable Content

| Content Type | Searchable Fields |
|--------------|-------------------|
| Events | Title, description, tags, category |
| Organizers | Name, bio, location |
| Businesses | Name, description, category |
| Series | Title, description |
| Categories | Name, related terms |
| Interests | Name, synonyms |

### Search Input

| Feature | Specification |
|---------|----------------|
| Minimum Query | 2 characters |
| Maximum Query | 100 characters |
| Debounce | 300ms |
| Suggestions | Up to 5 |
| Recent Searches | 10 stored |

### Search Suggestions

**Types:**
| Type | Trigger | Display |
|------|---------|---------|
| Recent | User searched before | Clock icon |
| Popular | High search volume | Trending icon |
| Category | Match category | Category icon |
| Autocomplete | Partial typing | Real-time |

---

## Search Filters

### Event Filters

| Filter | Type | Options |
|--------|------|---------|
| Category | Multi-select | All categories |
| Date | Range | Today, Tomorrow, This Week, This Month, Custom |
| Time | Multi-select | Morning, Afternoon, Evening, Night |
| Distance | Single | 1km, 5km, 10km, 25km, 50km |
| Price | Single | Free, Paid, Any |
| Availability | Single | Spots Available, Any |
| Format | Single | In-Person, Online, Hybrid |

### Organizer Filters

| Filter | Type | Options |
|--------|------|---------|
| Trust Score | Range | Slider 0-100 |
| Rating | Range | 1-5 stars |
| Verified | Boolean | Verified Only |
| Category | Multi-select | Event categories |

### Business Filters

| Filter | Type | Options |
|--------|------|---------|
| Category | Multi-select | Business categories |
| Verified | Boolean | Verified Only |
| Has Offers | Boolean | Special Offers Only |
| Distance | Single | 1km-50km |

---

## Result Ranking

### Default Ranking

**Factors:**
| Factor | Weight | Description |
|--------|--------|--------------|
| Relevance | Primary | Text match score |
| Popularity | Secondary | View/join metrics |
| Rating | Tertiary | Average rating |
| Recency | Quaternary | Publish date |

### Relevance Scoring

**Text Matching:**
| Method | Description |
|--------|-------------|
| Exact Match | Full query match |
| Prefix Match | Query prefix |
| Fuzzy Match | Typo tolerance |
| Synonym Match | Category synonyms |

**Field Weights:**
| Field | Boost |
|-------|-------|
| Title | 3.0x |
| Category | 2.0x |
| Tags | 1.5x |
| Description | 1.0x |

---

## Search Display

### Result Card: Events

```
┌─────────────────────────────────┐
│ [Image]                         │
│                                 │
│ Weekend Photography Walk        │ ← Title
│ 📍 Downtown · 🧭 1.2km          │ ← Location
│ ⭐ 4.7 (23) · 📅 Sat, 2 PM      │ ← Rating, Date
│ 👥 8/15 spots                   │ ← Capacity
│                                 │
│ by @JohnPhotography             │ ← Organizer
└─────────────────────────────────┘
```

### Result Card: Organizer

```
┌─────────────────────────────────┐
│ [Avatar]                        │
│                                 │
│ John Photography               │ ← Name
│ ⭐ 4.8 · 🏅 Super Organizer     │ ← Rating, Badge
│ 📸 Photography · 127 events    │ ← Specialties, Experience
│ 🧭 San Francisco                │ ← Location
└─────────────────────────────────┘
```

### Result Card: Business

```
┌─────────────────────────────────┐
│ [Logo]                          │
│                                 │
│ Café Bella ☕                  │ ← Name
│ 🏢 Coffee Shop · ✅ Verified   │ ← Category, Badge
│ ⭐ 4.6 (89) · 🧭 0.8km          │ ← Rating, Distance
│ 🎁 20% off first visit          │ ← Active Offer
└─────────────────────────────────┘
```

---

## Search Features

### Advanced Search

**Modifiers:**
| Modifier | Example | Effect |
|----------|---------|--------|
| Category | category:music | Filter by category |
| Organizer | organizer:@john | Filter by organizer |
| Date | date:today | Filter by date |
| Price | price:free | Filter by price |
| Distance | distance:<5km | Filter by distance |

### Search History

**Stored Data:**
| Data | Retention |
|------|-----------|
| Queries | 30 days |
| Filters | 30 days |
| Results clicked | 30 days |

**Privacy:**
- Private to user
- Can be cleared
- Not shared

### Save Searches

**Features:**
| Feature | Free | Premium |
|---------|------|--------|
| Saved searches | 5 | 25 |
| Alerts | ✗ | ✓ |
| Auto-notify | ✗ | On new matches |

---

## Performance Requirements

### Speed Targets

| Metric | Target |
|--------|--------|
| Search latency (P50) | <100ms |
| Search latency (P95) | <300ms |
| Suggestion latency | <50ms |
| Autocomplete | <100ms |

### Scale

| Metric | Requirement |
|--------|-------------|
| Max results | 200 per search |
| Concurrent searches | 10,000/s |
| Index size | Millions of events |
| Update latency | <1 minute |

---

## Technical Implementation

### Search Infrastructure

```
[Query Input]
      ↓
[Query Parser]
      ↓
[Filter Application]
      ↓
[Elasticsearch Query]
      ↓
[Result Aggregation]
      ↓
[Ranker]
      ↓
[Response]
```

### Indexing

**Indexed Fields:**
| Field | Type | Analyzer |
|-------|------|----------|
| Title | text | standard + autocomplete |
| Description | text | standard |
| Category | keyword | exact |
| Tags | keyword[] | exact |
| Location | geo_point | geo_distance |
| Date | date | range |
| Price | float | range |
| Organizer | keyword | exact |

---

## Edge Cases

### No Results
- Suggest alternative queries
- Offer filter relaxation
- Show nearby events

### Very Long Query
- Truncate at 100 characters
- Search with truncated query
- No error shown

### Special Characters
- Escape special chars
- Search with escaped version
- Handle gracefully

---

## Future Enhancements

1. **Voice Search**: Natural language queries
2. **Image Search**: Find events by photo
3. **Similar Events**: "More like this"
4. **Search Analytics**: Popular queries dashboard
5. **Personalization Tuning**: User-adjustable weights

---

*Last Updated: Phase 1.0*
*Owner: Product Team*
*Review Frequency: Quarterly*

# Recommendation System

## Purpose

The Recommendation Engine generates personalized event suggestions based on user preferences, behavior, and context. Recommendations make event discovery intuitive and serendipitous.

## Scoring Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Interest Match | 25% | Overlap with user interests |
| Location | 20% | Distance from user |
| Time | 10% | When event occurs |
| Trust Score | 10% | Event/organizer rating |
| Popularity | 8% | Current attendance |
| Recency | 8% | How soon event is |
| Organizer Quality | 10% | Organizer track record |
| Business Quality | 4% | Business health score |
| Language | 3% | Preferred language |
| Diversity | 2% | Avoid echo chambers |

## Discovery Categories

### Recommended Today
Events happening today, personalized.

### Perfect For You
Based on interests and past activity.

### Starting Soon
Events within 24 hours.

### Hidden Gems
High quality, low attendance events.

### Trending Nearby
Popular events in user's area.

### Weekend Ideas
Saturday/Sunday events.

### After Work
Events between 5-9 PM.

### New Organizers
Recently active, quality organizers.

## Explainable Reasons

Users see simple, clear reasons:

| Reason | Display |
|--------|---------|
| shared_interests | "Based on your interests" |
| nearby | "Close to you" |
| starting_soon | "Starting soon" |
| trusted_organizer | "Trusted organizer" |
| popular | "Popular event" |
| highly_rated | "Highly rated" |

**Never shown:**
- Exact score
- Algorithm details
- Personal behavior data

## Privacy

- Recommendations use only:
  - Interests (user-provided)
  - Location (when permitted)
  - Event metadata
  - Aggregated behavior

- Never used:
  - Personal messages
  - Private profile data
  - Social connections
  - Browsing history

## Diversity

The system avoids echo chambers by:
- Mixing categories
- Including new organizers
- Showing hidden gems
- Balancing popularity with relevance

## Performance

| Metric | Target |
|--------|--------|
| Generation | <150ms |
| Category count | 8 categories |
| Events per category | 5-10 |
| Cache TTL | 24 hours |

## Learning

Recommendations improve from:
- Events joined
- Events ignored
- Events saved
- Categories explored
- Feedback (future)

---

*Last Updated: V6.0*
*Owner: AI Team*

# Trust Intelligence

## Purpose

Trust Intelligence evaluates user reliability and builds a trust score based on their behavior in the platform. This score helps create a safer community and enables better recommendations.

## Trust Signals

| Signal | Weight | Description |
|--------|--------|-------------|
| Attendance Rate | 25% | Percentage of joined events attended |
| Completion Rate | 20% | Events stayed until completion |
| Average Rating | 25% | Ratings received from organizers |
| Account Age | 10% | Time since account creation |
| Verification | 10% | Verification level (0-5) |
| Community | 10% | Social connections and engagement |

## Trust Levels

| Level | Score Range | Badge |
|-------|-------------|-------|
| Verified | 90-100 | 🏆 Verified |
| High | 70-89 | ⭐ Trusted |
| Medium | 40-69 | ✓ Active |
| Low | 20-39 | ○ New |
| Untrusted | 0-19 | ⚠️ Limited |

## Trust Factors

```typescript
interface TrustFactors {
  reliability: number;    // Based on attendance/completion
  consistency: number;    // Based on account age and activity
  reputation: number;      // Based on ratings and reports
  verification: number;    // Based on verification level
  community: number;       // Based on social connections
}
```

## Calculation Algorithm

```
Score = (attendanceRate × 0.25) +
        (completionRate × 0.20) +
        (avgRating × 0.25) +
        (min(accountAge/365, 1) × 0.10) +
        (verificationLevel × 0.10) +
        (min(socialConnections/50, 1) × 0.10)

Score -= min(30, reportsReceived × 5)
```

## User-Facing Display

Users see only:
- Trust Level (badge)
- Simple description (e.g., "Trusted user with consistent history")

**Never exposed:**
- Exact score
- Individual factor values
- Calculation methodology

## Privacy

- Trust calculations use only behavioral signals
- No personal information accessed
- Score updates are anonymous to other users
- User can see what actions improve trust

## Recommendations

When trust is low, users receive actionable suggestions:
- "Attend more events to improve your attendance rate"
- "Complete verification steps to increase trust"
- "Rate events and organizers to build reputation"

---

*Last Updated: V6.0*
*Owner: AI Team*

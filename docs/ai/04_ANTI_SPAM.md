# Anti-Spam System

## Purpose

Anti-Spam prevents platform abuse through event flooding, message spam, and other abusive patterns while maintaining a good experience for legitimate users.

## Rate Limits

| Action | Per Hour | Per Day |
|--------|----------|---------|
| Event Creation | 3 | 10 |
| Messages | 30 | 200 |
| Event Joins | 20 | 50 |
| Reports Filed | 5 | 20 |

## Adaptive Limits

Rate limits scale based on trust level:

| Trust Level | Multiplier |
|-------------|------------|
| Verified | 3.0x |
| High | 2.5x |
| Medium | 2.0x |
| Low | 1.5x |
| Untrusted | 1.0x |

## Spam Violations

### Event Flooding
- Creating too many events in short period
- Repeatedly creating similar events
- Mass event creation

### Message Spam
- Sending identical messages to many users
- Excessive messaging frequency
- Promotional content flooding

### Join Spam
- Joining and leaving events rapidly
- Mass-joining without intention to attend

### Repeated Reports
- Filing excessive reports
- Filing false reports

## Violation Types

```typescript
type SpamViolationType =
  | 'event_flooding'
  | 'message_spam'
  | 'join_spam'
  | 'notification_spam'
  | 'repeated_reports'
  | 'mass_account_creation';
```

## Actions

| Score | Action | Duration |
|-------|--------|----------|
| 0-39 | Allow | - |
| 40-59 | Warn | - |
| 60-79 | Limit | 1 hour |
| 80-100 | Block | 24 hours |

## Violation Severity

| Violation | Base Severity |
|------------|---------------|
| Event Flooding | 30 |
| Message Spam | 20 |
| Join Spam | 15 |
| Report Spam | 40 |
| Mass Account | 80 |

## Escalation

Multiple violations escalate severity:
```
TotalScore = Σ(violation.severity × violation.count)
```

## User Feedback

When limited:
- Clear message explaining the restriction
- Time remaining until limit resets
- Appeal option available

## Privacy

- Rate limit checks are internal
- Users don't see their spam score
- Limits are applied transparently

---

*Last Updated: V6.0*
*Owner: AI Team*

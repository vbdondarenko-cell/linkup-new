# Fraud Detection

## Purpose

Fraud Detection identifies fake accounts, bot behavior, and suspicious patterns to protect the community and maintain platform integrity.

## Risk Signals

| Signal | Description | Risk Weight |
|--------|-------------|-------------|
| Account Age | Days since account creation | High for new |
| Event Creation Rate | Events created per day | High for rapid |
| Join Rate | Events joined per day | Medium |
| Message Rate | Messages sent per day | Medium |
| Report Rate | Reports received per day | High |
| Location Changes | Location updates in period | High |
| Device Count | Unique devices used | Medium |
| IP Variety | Unique IP addresses | Medium |

## Suspicious Patterns

- New account with high activity
- Multiple events created in short period
- Mass joining of events
- Rapid location changes
- Many devices from same account
- Large IP variety (possible account sharing)

## Risk Levels

| Level | Score | Action |
|-------|-------|--------|
| Critical | 80-100 | Block, investigate |
| High | 60-79 | Limit, review |
| Medium | 30-59 | Monitor, flag |
| Low | 0-29 | Allow, log |

## Detection Rules

### Fake Account Detection
```
if (accountAge < 7 days AND (
    eventCreationRate > 10/day OR
    joinRate > 50/day OR
    locationChanges > 10
)) → flag(fake_account, 30)
```

### Bot Behavior Detection
```
if (messageRate > 100/hour OR
    joinRate > 50/hour AND
    avgSessionDuration < 30 seconds
) → flag(bot_behavior, 25)
```

### Location Spoofing Detection
```
if (locationChanges > 10 in 24h OR
    distance > 500km in < 1 hour
) → flag(location_spoofing, 50)
```

## Actions by Risk Level

### Low Risk
- Allow all actions
- Log for monitoring

### Medium Risk
- Allow with increased monitoring
- Flag for periodic review

### High Risk
- Limit creation capabilities
- Require additional verification
- Priority human review

### Critical Risk
- Immediate temporary suspension
- Investigation required
- May lead to permanent action

## Privacy

- Fraud detection is internal only
- Users are not informed of specific flags
- Risk scores are not exposed
- Investigation is confidential

## Logging

All risk assessments logged with:
- Entity ID and type
- All signals analyzed
- Flags triggered
- Final risk score
- Confidence level
- Processing time

---

*Last Updated: V6.0*
*Owner: AI Team*

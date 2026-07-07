# Privacy

## Purpose

This document defines the privacy controls, data handling practices, and user rights for LinkUp V5.

## Scope

- Privacy controls
- Data collection
- User rights
- Data retention
- Future compliance

---

## Privacy Principles

### Core Principles

1. **Privacy by Default**: Settings default to most private
2. **Data Minimization**: Collect only necessary data
3. **User Control**: Users own their data
4. **Transparency**: Clear data practices
5. **Security**: Protect data at all costs

---

## Privacy Controls

### Profile Visibility

| Setting | Description |
|---------|-------------|
| Public | Anyone can view profile |
| Followers | Only followed by me |
| Private | Only me |

**Default:** Followers

### Location Privacy

| Setting | Description |
|---------|-------------|
| Exact | Precise coordinates |
| Approximate | City/neighborhood only |
| None | Not shared |

**Default:** Approximate

### Event Visibility

| Setting | Description |
|---------|-------------|
| Public Events | Visible in discovery |
| Joined Events | Only for attendees |
| No Events | Hidden from profile |

**Default:** Joined Events

### Data Sharing

| Setting | Description |
|---------|-------------|
| Analytics | Usage analytics |
| Improvements | Product improvements |
| Marketing | Promotional communications |

**Default:** Analytics only

---

## Data Collection

### Required Data

| Data Type | Purpose | Retention |
|-----------|---------|----------|
| Telegram ID | Authentication | Permanent |
| Username | Display | Until deleted |
| Location | Event discovery | Until location cleared |
| Interests | Recommendations | Until changed |

### Optional Data

| Data Type | Purpose | Retention |
|-----------|---------|----------|
| Phone Number | Verification | Until removed |
| Email | Contact | Until removed |
| Profile Photo | Identity | Until removed |
| Events Attended | History | Permanent |

### Not Collected

| Data Type | Reason |
|-----------|--------|
| Contacts | Not needed |
| SMS/Messages | Not accessed |
| Calendar | Not synced |
| Camera/Gallery | Not accessed |

---

## User Rights

### Data Access

**Right to Access:**
- View all personal data
- Download data export
- Receive data in portable format

### Data Correction

**Right to Rectification:**
- Edit profile information
- Update preferences
- Correct inaccurate data

### Data Deletion

**Right to Deletion:**
- Delete account
- Remove specific data
- Automatic deletion options

### Restriction

**Right to Restrict:**
- Limit processing
- Pause account
- Object to specific uses

---

## Data Retention

### Retention Schedule

| Data Type | Retention | Deletion Method |
|-----------|-----------|-----------------|
| Messages | 6 hours post-event | Automatic purge |
| Location History | Not stored | Not collected |
| Event Attendance | Permanent | On account deletion |
| Analytics | 90 days | Aggregated, anonymized |
| Logs | 1 year | Automatic purge |

### Account Deletion

**Process:**
1. User requests deletion
2. 30-day grace period
3. Data anonymized or deleted
4. Confirmation sent

**Exceptions:**
- Legal hold
- Active investigations
- Financial records (7 years)

---

## Third-Party Sharing

### Never Shared

| Data | Policy |
|------|--------|
| Personal data | Never sold |
| Location data | Never sold |
| Event history | Never sold |
| Messages | Never shared |

### Shared When Required

| Data | Recipient | Purpose |
|------|-----------|---------|
| Payment info | Payment processor | Transaction |
| Phone number | Verification service | SMS verification |

### Analytics

| Type | Shared | Format |
|------|--------|--------|
| App crashes | Analytics provider | Anonymous |
| Usage patterns | Internal analytics | Aggregated |
| Errors | Monitoring | De-identified |

---

## Location Privacy

### Location Usage

**Used For:**
- Event discovery nearby
- Distance calculation
- Event check-in verification

**Not Used For:**
- Tracking
- History logging
- Profiling

### Location Sharing

**With Organizers:**
- After join approval
- Approximate location only
- For event coordination

**With Other Users:**
- Never exact location
- Never shared automatically
- Manual sharing only

---

## Future Compliance

### GDPR Preparation

| Requirement | Status |
|-------------|--------|
| Consent management | Planned |
| Data portability | Planned |
| Right to erasure | Planned |
| Data Protection Officer | Planned |

### CCPA Preparation

| Requirement | Status |
|-------------|--------|
| "Do Not Sell" link | Planned |
| Data disclosure | Planned |
| Non-discrimination | ✓ Implemented |
| Deletion rights | ✓ Implemented |

---

## Privacy by Design

### Product Decisions

Every feature considers:
1. Is this data necessary?
2. Can we use less precise data?
3. How is data protected?
4. Can users control this?
5. What happens when deleted?

### Default Settings

| Setting | Default |
|---------|---------|
| Profile visibility | Followers |
| Location precision | Approximate |
| Notifications | Minimal |
| Analytics | Basic only |

---

## Open Questions

1. Should we support data residency requirements?
2. How do we handle data for users under 13?
3. What's our breach notification timeline?

---

*Last Updated: Phase 1.0*
*Owner: Privacy Team*
*Review Frequency: Quarterly*

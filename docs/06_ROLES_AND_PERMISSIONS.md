# Roles and Permissions

## Purpose

This document defines the Role-Based Access Control (RBAC) system for LinkUp V5. It specifies all roles, their associated permissions, and how permissions are enforced throughout the system.

## Scope

- Role definitions
- Permission specifications
- Role assignment rules
- Permission enforcement mechanisms
- Access control patterns

## Role Hierarchy

```
Administrator
    ↑
Moderator
    ↑
Verified Business
    ↑
Organizer
    ↑
User
    ↑
Guest
```

## Roles

### 1. Guest

**Description:** Users who have installed the app but have not authenticated.

**Access Level:** Minimal

**Capabilities:**
| Capability | Permission |
|------------|------------|
| View app store listing | ✓ |
| Read public privacy policy | ✓ |
| View public events (limited) | ✓ |
| Create account | ✗ |
| View detailed event info | ✗ |
| Contact organizers | ✗ |

**Transition:** Guest → User via Telegram authentication

**Business Rules:**
- Guest sessions expire after 7 days
- No personal data stored for guests
- Guest activity not tracked

---

### 2. User

**Description:** Authenticated users who can participate in events.

**Access Level:** Standard

**Capabilities:**
| Capability | Permission | Notes |
|------------|------------|-------|
| Authenticate via Telegram | ✓ | Primary auth method |
| View events | ✓ | All public events |
| Search events | ✓ | Full search access |
| View event details | ✓ | Including attendee count |
| Join events | ✓ | Based on event settings |
| Leave events | ✓ | Before event starts |
| Participate in chat | ✓ | Joined events only |
| Rate events | ✓ | After attendance |
| Create events | ✗ | Requires Organizer role |
| View other profiles | Limited | Basic info only |
| Send reports | ✓ | All content types |
| Manage notifications | ✓ | Full control |
| Download offline maps | ✓ | Limited area |

**Transition:** 
- New users start as User role
- User → Organizer via application and approval
- User → Verified Business via business verification

**Business Rules:**
- Trust score starts at 50
- XP starts at 0
- Default interests: empty (required to select 3+)
- Profile visibility: followers only

---

### 3. Organizer

**Description:** Users who create and manage events.

**Access Level:** Elevated

**Capabilities:**
| Capability | Permission | Notes |
|------------|------------|-------|
| Create events | ✓ | Based on organizer tier |
| Edit own events | ✓ | Before publishing |
| Publish events | ✓ | After creation |
| Cancel events | ✓ | With notification |
| Delete events | ✓ | Draft events only |
| View join requests | ✓ | Own events only |
| Approve/reject requests | ✓ | Own events only |
| Remove attendees | ✓ | Own events only |
| Pin messages | ✓ | Own event chats |
| Mute users | ✓ | Own events only |
| View attendee list | ✓ | Own events only |
| Create event templates | ✓ | Limited |
| Create event series | ✓ | Limited |
| View own analytics | ✓ | Basic analytics |
| Report users | ✓ | Global |

**Transition:**
- User → Organizer via application
- Requires: 18+ age, 5+ events attended, trust score 60+
- Approval by Moderator

**Business Rules:**
- Can create up to 3 concurrent published events
- Events limited to 50 capacity each (default)
- Can create up to 5 series
- Can create up to 10 templates
- Analytics available for past 30 days
- Trust score influences event visibility

**Organizer Tier Limits:**

| Tier | Concurrent Events | Event Capacity | Series | Templates |
|------|------------------|----------------|--------|----------|
| Starter | 3 | 50 | 5 | 10 |
| Growing | 10 | 200 | 20 | 50 |
| Established | 25 | 500 | Unlimited | Unlimited |
| Premium | Unlimited | Unlimited | Unlimited | Unlimited |

**Premium Organizer Requirements:**
- Trust score 85+
- 50+ events hosted
- 90%+ attendance rate
- 4.5+ average rating

---

### 4. Verified Business

**Description:** Commercial entities that have been verified.

**Access Level:** Commercial

**Capabilities:**
| Capability | Permission | Notes |
|------------|------------|-------|
| Create business profile | ✓ | Verification required |
| Create official events | ✓ | Business branded |
| Business analytics | ✓ | Extended analytics |
| Create offers | ✓ | Special promotions |
| Partner tools | ✓ | Partner integrations |
| Business badge | ✓ | Visible verification |
| Organizer features | ✓ | All organizer features |

**Transition:**
- User → Verified Business via business verification
- Requires: Business registration, identity verification, address verification

**Business Rules:**
- Business profile visible on all events
- Official event badge on all events
- Business analytics dashboard access
- Monthly subscription fee
- Separate trust score (business)

---

### 5. Moderator

**Description:** Community moderators who enforce community guidelines.

**Access Level:** Elevated + Moderation

**Capabilities:**
| Capability | Permission | Notes |
|------------|------------|-------|
| View reported content | ✓ | All reports |
| Review reports | ✓ | Assigned categories |
| Dismiss reports | ✓ | With reason |
| Issue warnings | ✓ | Any user |
| Temporarily mute | ✓ | Any user |
| Remove content | ✓ | Any content |
| View user history | ✓ | Limited detail |
| Approve organizers | ✓ | Assigned region |
| Access moderation queue | ✓ | Full access |
| View moderation stats | ✓ | Own performance |

**Transition:**
- Appointed by Administrator
- Based on: Trust score, community standing, absence of violations

**Business Rules:**
- Moderation actions logged
- Appeal process exists for all actions
- Moderator actions reviewed quarterly
- Cannot moderate own content

**Moderation Scope:**
- Geographic: Assigned regions
- Category: Assigned content types
- Temporal: Active moderation shifts

---

### 6. Administrator

**Description:** Platform administrators with full system access.

**Access Level:** Full

**Capabilities:**
| Capability | Permission | Notes |
|------------|------------|-------|
| User management | ✓ | Read/write all users |
| Content management | ✓ | All content |
| Role assignment | ✓ | All roles except Admin |
| System configuration | ✓ | Feature flags, limits |
| Analytics | ✓ | Full platform analytics |
| Moderation oversight | ✓ | All moderation actions |
| Business verification | ✓ | Approve businesses |
| Organizer approval | ✓ | Appeal decisions |
| Platform settings | ✓ | All settings |
| API management | ✓ | API keys, rate limits |
| Audit logs | ✓ | Full access |
| Support tools | ✓ | Impersonation, overrides |

**Business Rules:**
- Minimum 2 administrators
- All actions logged and auditable
- Separation of duties for sensitive actions
- Quarterly access review

---

## Permission Reference

### Authentication Permissions

| Permission | Guest | User | Organizer | Business | Moderator | Admin |
|------------|-------|------|-----------|----------|-----------|-------|
| VIEW_PUBLIC_EVENTS | Limited | ✓ | ✓ | ✓ | ✓ | ✓ |
| AUTHENTICATE | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| REFRESH_TOKEN | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| VIEW_OWN_PROFILE | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| VIEW_OTHER_PROFILES | ✗ | Limited | ✓ | ✓ | ✓ | ✓ |

### Event Permissions

| Permission | User | Organizer | Business | Moderator | Admin |
|------------|------|-----------|----------|-----------|-------|
| VIEW_EVENT_DETAILS | ✓ | ✓ | ✓ | ✓ | ✓ |
| JOIN_EVENT | ✓ | ✓ | ✓ | ✓ | ✓ |
| LEAVE_EVENT | ✓ | ✓ | ✓ | ✗ | ✓ |
| CREATE_EVENT | ✗ | ✓ | ✓ | ✗ | ✓ |
| EDIT_OWN_EVENT | ✗ | ✓ | ✓ | ✗ | ✓ |
| DELETE_OWN_DRAFT | ✗ | ✓ | ✓ | ✗ | ✓ |
| CANCEL_OWN_EVENT | ✗ | ✓ | ✓ | ✓ | ✓ |
| VIEW_OWN_REQUESTS | ✓ | ✓ | ✓ | ✓ | ✓ |
| MANAGE_OWN_REQUESTS | ✗ | ✓ | ✓ | ✗ | ✓ |
| REMOVE_ATTENDEE | ✗ | Own | Own | ✓ | ✓ |
| PIN_MESSAGE | ✗ | Own | Own | ✓ | ✓ |
| MUTE_USER | ✗ | Own | Own | ✓ | ✓ |
| CREATE_SERIES | ✗ | ✓ | ✓ | ✗ | ✓ |
| CREATE_TEMPLATE | ✗ | ✓ | ✓ | ✗ | ✓ |

### Chat Permissions

| Permission | User | Organizer | Business | Moderator | Admin |
|------------|------|-----------|----------|-----------|-------|
| SEND_MESSAGES | Event | Event | Event | Event | ✓ |
| VIEW_EVENT_CHAT | Joined | Own | Own | ✓ | ✓ |
| SHARE_LOCATION | Joined | Event | Event | Event | ✓ |
| ADD_REACTIONS | ✓ | ✓ | ✓ | ✓ | ✓ |
| CREATE_THREAD | ✓ | ✓ | ✓ | ✓ | ✓ |
| DELETE_MESSAGES | ✗ | Own | Own | ✓ | ✓ |
| PIN_MESSAGE | ✗ | Own | Own | ✓ | ✓ |
| MUTE_USER | ✗ | Own | Own | ✓ | ✓ |

### Moderation Permissions

| Permission | User | Organizer | Business | Moderator | Admin |
|------------|------|-----------|----------|-----------|-------|
| REPORT_CONTENT | ✓ | ✓ | ✓ | ✓ | ✓ |
| VIEW_REPORTS | ✗ | Own | Own | ✓ | ✓ |
| REVIEW_REPORTS | ✗ | ✗ | ✗ | ✓ | ✓ |
| DISMISS_REPORTS | ✗ | ✗ | ✗ | ✓ | ✓ |
| REMOVE_CONTENT | ✗ | ✗ | ✗ | ✓ | ✓ |
| WARN_USER | ✗ | ✗ | ✗ | ✓ | ✓ |
| MUTE_USER_GLOBAL | ✗ | ✗ | ✗ | ✓ | ✓ |
| BAN_USER | ✗ | ✗ | ✗ | ✗ | ✓ |

### Business Permissions

| Permission | User | Organizer | Business | Moderator | Admin |
|------------|------|-----------|----------|-----------|-------|
| VERIFY_BUSINESS | ✗ | ✗ | ✗ | ✗ | ✓ |
| CREATE_OFFER | ✗ | ✗ | ✓ | ✗ | ✓ |
| VIEW_BUSINESS_ANALYTICS | ✗ | ✗ | Own | ✗ | ✓ |
| ACCESS_PARTNER_TOOLS | ✗ | ✗ | ✓ | ✗ | ✓ |

---

## Permission Enforcement

### Client-Side Enforcement

**Purpose:** Improve UX by hiding/disabling unauthorized features

**Implementation:**
```typescript
// Example permission check
const canCreateEvent = hasPermission(user.role, 'CREATE_EVENT');
```

**Rules:**
- Never trust client-side checks alone
- Use for UI optimization only
- Hide unauthorized features completely
- Never show error states from client checks

### Server-Side Enforcement

**Purpose:** Security-critical authorization

**Implementation:**
```typescript
// Middleware example
app.post('/events', requirePermission('CREATE_EVENT'), createEvent);
```

**Rules:**
- All endpoints require authorization
- Default to deny
- Validate role before any action
- Log all authorization decisions

### Database-Level Enforcement

**Purpose:** Prevent direct database manipulation

**Implementation:**
- Row-level security policies
- Column-level permissions
- View permissions
- Trigger-based validation

**Rules:**
- Supabase RLS enabled for all tables
- Service role never used in app code
- Admin operations require additional auth

---

## Role Assignment

### Automatic Assignments

| Transition | Trigger | Verification |
|------------|---------|--------------|
| Guest → User | Telegram auth success | Telegram SDK |
| User → Organizer | Application + approval | Moderator review |

### Manual Assignments

| Action | Who Can Assign | Required Role |
|--------|----------------|---------------|
| User → Organizer | Moderator | Moderator |
| User → Verified Business | Administrator | Business verification |
| Organizer → Moderator | Administrator | Application |
| Any → Administrator | Administrator | Board approval |

### Role Revocation

| Reason | Auto-Action | Manual Action |
|--------|-------------|---------------|
| Trust score drops below threshold | Warning at 30 days | Moderator review |
| Violation | Case-by-case | Admin required |
| User request | Immediate | Self-removal |
| Inactivity (1 year) | Warning at 30 days | Auto-demotion to User |

---

## Permission Management

### Permission Changes

All permission changes follow this process:

1. **Proposal**: Document proposed change
2. **Review**: Security team review
3. **Test**: Update test cases
4. **Deploy**: Staged rollout
5. **Monitor**: Track impact
6. **Rollback**: If issues detected

### Permission Audits

- Monthly: Automated permission checks
- Quarterly: Manual permission review
- Annually: Full RBAC audit
- Ad-hoc: After security incidents

---

## Open Questions

1. Should we implement hierarchical permissions (e.g., Organizer inherits User)?
2. How do we handle cross-organizational permissions?
3. Should permissions be time-limited for sensitive roles?

---

*Last Updated: Phase 1.0*
*Owner: Security Team*
*Review Frequency: Quarterly*

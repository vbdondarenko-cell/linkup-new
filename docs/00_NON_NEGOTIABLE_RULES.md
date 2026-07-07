# Non-Negotiable Rules

## Purpose

This document establishes the foundational rules that govern every decision in LinkUp V5. These rules are absolute and cannot be overridden by any team, stakeholder, or business pressure. They represent the constitutional foundation of the platform.

## Scope

These rules apply to:
- All product decisions
- All engineering implementations
- All design choices
- All business strategies
- All documentation
- All future development

## Foundational Rules

### 1. Offline-First Platform

LinkUp operates as an offline-first platform. Critical features must function without internet connectivity.

**Implementation Requirements:**
- All event data must be cached locally for offline access
- User's own events and chats must be available offline
- Queued actions must sync when connectivity returns
- Offline mode must display clear status indicators
- Map tiles must be downloadable for offline use

**Forbidden:**
- Features that require constant connectivity to function
- Blocking user actions when offline
- Losing user data due to connectivity issues

### 2. Not a Social Network

LinkUp is NOT a social network. It does not seek to maximize time spent online or create dependency.

**Definition:**
- No follower/following mechanics
- No social graphs or friend lists
- No news feeds or content discovery through friends
- No "likes" or public engagement metrics
- No user-generated content feeds

**What It Is Instead:**
- Event-focused interactions
- Temporary connections around shared interests
- Connections that end when events end
- Relationships formed in the physical world

### 3. Not a Dating App

LinkUp is NOT a dating application. It facilitates community building and genuine friendships.

**Explicit Prohibitions:**
- No dating-oriented features or language
- No romantic matching algorithms
- No filtering by relationship status
- No features designed for romantic attraction

**What It Supports Instead:**
- Platonic friendships
- Professional networking
- Community building
- Activity-based connections

### 4. Not a Messenger

LinkUp is NOT a messaging application. Chat serves a specific, limited purpose.

**Chat Limitations:**
- Chat is only available for event participants
- Chat is automatically deleted 6 hours after event completion
- No group creation outside of events
- No persistent chat threads
- No voice or video calls

**Rationale:**
- Prevents LinkUp from becoming a communication dependency
- Keeps focus on real-world connections
- Reduces data retention concerns
- Maintains event-centric purpose

### 5. The Map Is the Heart

The interactive map is the primary interface of LinkUp. Everything centers around geographic discovery.

**Map Requirements:**
- Map loads by default on app launch
- Events are primarily discovered through map exploration
- All navigation leads through or returns to the map
- Map must be fast, responsive, and visually clear

**Design Implications:**
- Search can filter map results but cannot replace map view
- List views are secondary to map discovery
- Event cards must show clear geographic context

### 6. Three-Tap Maximum

Every important user action requires no more than three taps from the default state.

**Measurement:**
- From app launch (map view) to any core action
- From any standard screen to completion of action
- Complex flows may require more taps but must be justified

**Core Actions to Optimize:**
- Join event (approve → join → confirm)
- Create event (create → details → publish)
- Send message (open event → chat → send)
- View profile (map → pin → profile)

### 7. Premium Cannot Create Unfair Advantages

Premium features enhance the experience but never create pay-to-win mechanics.

**Allowed Premium Features:**
- Appearance customization (profile themes, badges)
- Increased limits (more events, larger capacity)
- Enhanced visibility (featured placement options)
- Advanced tools (analytics, bulk operations)
- Priority support

**Forbidden Premium Features:**
- Exclusive events that free users cannot attend
- Visibility boosts that appear as organic popularity
- Reduced waiting times for approvals
- Access to locked user information
- Any feature that gives paying users advantages in non-premium contexts

### 8. Trust Over Engagement

Building genuine trust between users takes priority over maximizing engagement metrics.

**Priorities:**
- Quality of connections over quantity of interactions
- Verified identities over anonymous participation
- Meaningful attendance over event RSVPs
- Long-term relationships over short-term spikes

**Metrics We Don't Optimize:**
- Daily active users (DAU)
- Time spent in app
- Number of messages sent
- Event creation volume
- Swipe/tap frequency

**Metrics We Do Track:**
- Offline meeting completion rate
- Return user rate
- Event completion rate
- User satisfaction (post-event ratings)
- Trust score distribution
- Community health indicators

### 9. Privacy Before Growth

User privacy takes absolute precedence over growth and revenue objectives.

**Privacy Principles:**
- Minimum data collection by default
- Location data used only when necessary
- No third-party data sharing
- No advertising networks
- No data sold to third parties
- Clear retention policies
- User control over all data

**Decisions That Favor Privacy:**
- Ephemeral chat (6-hour auto-deletion)
- Limited profile visibility
- No public event attendance lists
- Optional location sharing
- No location history tracking

### 10. Business Logic Independence

Business logic must never depend on UI state or presentation.

**Architecture Rules:**
- All business rules exist in backend services
- UI receives data through well-defined APIs
- Validation happens server-side and client-side
- Business state changes are atomic and transactional
- No UI-dependent conditional logic in business rules

**Forbidden Patterns:**
- Client-side-only access control
- UI state that controls permissions
- Presentation logic that modifies business rules
- Hidden features based on UI state

### 11. Role-Based Access Control (RBAC)

All permissions are managed through explicit role assignments.

**Requirements:**
- Every user action requires permission validation
- Permissions are checked server-side
- No feature flags based on user ID
- No hardcoded user exceptions
- All role assignments are auditable

**Permission Management:**
- Roles: Guest, User, Organizer, Verified Business, Moderator, Administrator
- Permissions are additive per role
- Custom permission sets per organizational context
- Audit log for all permission changes

### 12. No Duplication Policy

Code, components, and business logic must not be duplicated.

**Single Source of Truth:**
- Each feature has one authoritative implementation
- Shared components are extracted and reused
- Business rules exist in exactly one place
- APIs are not duplicated across endpoints

**Enforcement:**
- Regular code reviews for duplication
- Automated tooling to detect copied code
- Shared libraries for common functionality
- Clear ownership of each component

## Responsibilities

| Role | Responsibility |
|------|----------------|
| Product Team | Ensure all features align with non-negotiable rules |
| Engineering | Implement rules in code and architecture |
| Design | Follow rules in all interface decisions |
| QA | Verify rule compliance in testing |
| Leadership | Enforce rules in business decisions |

## Business Rules Summary

| Rule | Description |
|------|-------------|
| OFFLINE_FIRST | Critical features work without connectivity |
| NOT_SOCIAL | No social graph, followers, or engagement feeds |
| NOT_DATING | No romantic features or matching |
| NOT_MESSENGER | Chat is event-specific and ephemeral |
| MAP_CENTRIC | Map is always the primary interface |
| TAP_LIMIT | Maximum three taps for important actions |
| FAIR_PREMIUM | Premium enhances but never advantages |
| TRUST_MATTERS | Trust metrics override engagement metrics |
| PRIVACY_FIRST | Privacy never sacrificed for features |
| SEPARATION | Business logic independent of UI |
| RBAC_ONLY | All access through explicit roles |
| NO_DUPLICATION | Single source for all logic |

## Edge Cases

### When Rules Conflict
In rare cases where rules may conflict, the following hierarchy applies:

1. **Privacy Before Growth** takes highest priority
2. **Trust Over Engagement** is secondary
3. **Premium Cannot Create Unfair Advantages** is third
4. All other rules have equal weight

### Exceptions Process
No exceptions to these rules can be made without:
1. Written approval from the founding team
2. Documented rationale
3. Security and privacy review
4. Customer Advisory Board notification

## Future Expansion

These rules are designed to be eternal principles of LinkUp. They will be:
- Referenced in all future planning documents
- Included in new team member onboarding
- Verified in all architectural reviews
- Enforced through automated testing
- Protected by governance processes

## Dependencies

| Dependency | Purpose |
|------------|---------|
| Supabase Auth | Telegram authentication integration |
| Supabase Database | RBAC and permission storage |
| Local Storage | Offline data caching |
| Map SDK | Offline map tile support |

## Open Questions

None. These rules are absolute and final for V5.

---

*Last Updated: Phase 1.0*
*Owner: Founding Team*
*Review Frequency: Annual*

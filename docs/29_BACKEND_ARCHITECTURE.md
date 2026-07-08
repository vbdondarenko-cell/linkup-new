# Backend Architecture

## Purpose

This document describes the enterprise-grade backend architecture for LinkUp V6, built on Supabase with PostgreSQL, PostGIS, and a comprehensive security model.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT APPS                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   iOS    │  │ Android │  │   Web    │  │ Desktop  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
└───────┼──────────────┼──────────────┼──────────────┼──────────┘
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE LAYER                         │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  Supabase Auth                         │  │
│  │            (Telegram Authentication)                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                              │                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                   API Gateway                         │  │
│  │              (RLS + RBAC + RPC)                     │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┴─────────────────────────────┐
│                      POSTGRESQL                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │   PostGIS   │  │  pg_trgm    │     │
│  │  (Database)  │  │   (Geo)     │  │  (Search)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┴─────────────────────────────┐
│                      SERVICES LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Edge     │  │    Cron     │  │   Storage   │     │
│  │  Functions  │  │    Jobs     │  │   (Images)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────────────────────────────────────────┘

```

---

## Database Design

### Core Tables

| Table | Description | Key Indexes |
|-------|-------------|--------------|
| profiles | User profiles | telegram_id, location |
| roles | RBAC roles | name |
| permissions | RBAC permissions | resource, action |
| user_roles | Role assignments | user_id, role_id |
| interests | Interest categories | category_id |
| user_interests | User interests | user_id |
| events | Event listings | location, start_date, organizer |
| event_participants | Event attendance | event_id, user_id |
| event_requests | Join requests | event_id, user_id |
| business_profiles | Business accounts | location, rank |
| organizer_profiles | Organizer profiles | rank, trust_score |
| chats | Chat rooms | type |
| chat_members | Chat membership | chat_id, user_id |
| messages | Chat messages | chat_id, created_at |
| notifications | User notifications | user_id, is_read |
| achievements | Achievement definitions | category |
| user_achievements | User progress | user_id |
| badges | Badge definitions | type, rarity |
| user_badges | Earned badges | user_id |
| xp_history | XP transactions | user_id |
| reputation_history | Trust changes | user_id |
| reports | User reports | status |
| blocks | Blocked users | blocker_id |
| favorites | Saved items | user_id |
| saved_places | Saved locations | user_id, location |
| premium | Premium subscriptions | user_id |
| devices | Device registrations | user_id |
| sessions | User sessions | token_hash |
| analytics_events | Usage analytics | event_type, created_at |
| audit_logs | Security audit | user_id, resource |

### Spatial Support (PostGIS)

- `location GEOGRAPHY(POINT, 4326)` for all location data
- `ST_DWithin()` for radius searches
- `ST_Distance()` for sorting by distance
- `ST_MakePoint()` for coordinate conversion

### Full-Text Search (pg_trgm)

- GIN indexes on searchable text fields
- `to_tsvector()` and `plainto_tsquery()` for search
- Trigram similarity for typo tolerance

---

## RBAC (Role-Based Access Control)

### Roles

| Role | Priority | Description |
|------|----------|-------------|
| guest | 0 | Non-authenticated users |
| user | 10 | Standard authenticated users |
| organizer | 20 | Can create and manage events |
| business | 25 | Verified business accounts |
| moderator | 50 | Community moderation |
| admin | 75 | System administration |
| super_admin | 100 | Full system access |

### Permission Structure

```
permissions
├── events
│   ├── create
│   ├── read
│   ├── update
│   ├── delete
│   └── approve
├── users
│   ├── create
│   ├── read
│   ├── update
│   └── delete
├── business
│   ├── create
│   ├── read
│   ├── update
│   └── verify
├── moderation
│   ├── read
│   ├── update
│   └── ban
└── admin
    ├── settings
    ├── roles
    └── users
```

### Default Role Assignments

| Role | Permissions |
|------|-------------|
| guest | events.read, users.read |
| user | All event/user CRUD + business.read |
| organizer | user + event management |
| business | organizer + business management |
| moderator | user + moderation tools |
| admin | moderator + admin tools |
| super_admin | All permissions |

---

## Row Level Security (RLS)

### RLS Policies

All tables have RLS enabled with policies:

- **Profiles**: Users can view own + public profiles
- **Events**: Anyone can view published, users can manage own
- **Notifications**: Users only see their own
- **Chats**: Members only see their chats
- **Reports**: Users create, moderators manage

### RLS Best Practices

1. Service role bypasses RLS (server-side only)
2. Auth.uid() used for user identification
3. Service role key never exposed to clients
4. All policies use SECURITY DEFINER for RPC functions

---

## RPC Functions

### Discovery

| Function | Description |
|----------|-------------|
| get_discovery_feed() | Personalized event recommendations |
| get_events_nearby() | Radius-based event search |
| get_event_details() | Full event information |
| search_everything() | Universal search |

### Event Actions

| Function | Description |
|----------|-------------|
| join_event() | Join or request to join |
| leave_event() | Leave an event |
| accept_request() | Accept join request |
| decline_request() | Decline join request |

### Engagement

| Function | Description |
|----------|-------------|
| award_xp() | Add XP to user |
| check_achievements() | Check and unlock achievements |
| update_reputation() | Update trust score |

### Moderation

| Function | Description |
|----------|-------------|
| submit_report() | Create user report |
| get_unread_notification_count() | Get notification count |
| mark_all_notifications_read() | Mark all as read |
| get_user_stats() | Get user statistics |

---

## Security

### SQL Injection Prevention

- Parameterized queries via Supabase client
- No string concatenation in SQL
- Input validation at API level

### XSS Prevention

- Content sanitization for user-generated content
- Content Security Policy headers
- React's built-in escaping

### CSRF Prevention

- Supabase handles via auth tokens
- SameSite cookies
- CORS configuration

### Rate Limiting

- Supabase built-in rate limits
- Edge function rate limiting
- API endpoint throttling

---

## Performance Targets

| Metric | Target |
|--------|--------|
| App Launch | < 2 seconds |
| Map Load | < 300ms |
| Search | < 150ms |
| Nearby Events | < 200ms |
| Chat | < 100ms |
| Notifications | < 100ms |
| Realtime Latency | < 100ms |
| Frame Rate | 60 FPS |

### Optimization Strategies

1. **Database**
   - GIN indexes for full-text search
   - PostGIS indexes for geo queries
   - Partial indexes for common filters
   - Connection pooling

2. **Caching**
   - Query result caching
   - Edge caching
   - Redis for session cache

3. **API**
   - Debounced requests
   - Virtualized lists
   - Lazy loading

---

## File Structure

```
supabase/
├── config/
│   └── supabase-config.ts
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── 003_rpc_functions.sql
└── functions/
    └── (Edge Functions)

src/backend/
├── types/
│   └── index.ts
├── services/
├── repositories/
├── rpc/
├── validators/
├── middleware/
├── utils/
└── analytics/

.github/
└── workflows/
    └── ci.yml
```

---

## CI/CD Pipeline

### Pipeline Stages

1. **Lint & Type Check**
   - ESLint
   - TypeScript compiler

2. **Unit Tests**
   - Jest
   - Coverage reports

3. **Database Tests**
   - Migration validation
   - Constraint tests

4. **Build**
   - Next.js build
   - Artifact upload

5. **E2E Tests**
   - Playwright
   - Cross-browser

6. **Security Scan**
   - npm audit
   - Snyk

7. **Performance Tests**
   - Lighthouse CI

8. **Deployment**
   - Supabase migration push
   - Edge function deploy

---

## Monitoring

### Metrics

- API latency (p50, p95, p99)
- Error rates
- Database query times
- Realtime connection count
- Active users

### Alerts

- Error rate > 1%
- Latency > 500ms
- Database connections > 80%
- Disk usage > 85%

### Logging

- Error logs with stack traces
- Access logs
- Security events
- Performance metrics

---

*Last Updated: V6.0*
*Owner: Engineering Team*
*Review Frequency: Per Release*

# Architecture Overview

## Purpose

This document provides a comprehensive overview of the technical architecture for LinkUp V5, including client, backend, infrastructure, and data systems.

## Scope

- System architecture
- Technology stack
- Database design
- API structure
- Infrastructure

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Mobile    │  │    Web      │  │    Telegram Mini App    │  │
│  │   (React    │  │   (React    │  │     (React + TG SDK)     │  │
│  │    Native)  │  │    Web)     │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Supabase / FastAPI                       ││
│  │         REST API + GraphQL + Realtime + Storage              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   DATA LAYER    │ │  SERVICES      │ │  EXTERNAL       │
│                 │ │                 │ │  SERVICES       │
│ ┌─────────────┐ │ │ ┌─────────────┐ │ │                 │
│ │  PostgreSQL │ │ │ │ Notifications│ │ ┌─────────────┐ │
│ │  (Supabase) │ │ │ └─────────────┘ │ │ │ Telegram    │ │
│ └─────────────┘ │ │ ┌─────────────┐ │ │ │   API       │ │
│ ┌─────────────┐ │ │ │Recommendations│ │ └─────────────┘ │
│ │    Redis    │ │ │ └─────────────┘ │ │ ┌─────────────┐ │
│ │  (Cache)    │ │ │ ┌─────────────┐ │ │ │ Map Tiles   │ │
│ └─────────────┘ │ │ │ Search      │ │ │ │ (Mapbox)    │ │
│ ┌─────────────┐ │ │ └─────────────┘ │ │ └─────────────┘ │
│ │  Storage    │ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │
│ │  (Supabase) │ │ │ │ Analytics   │ │ │ │ Weather API │ │
│ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Technology Stack

### Frontend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Mobile App | React Native | Cross-platform mobile |
| Web App | React | Web client |
| Telegram | React + TG SDK | Mini app integration |
| State Management | Zustand | Client state |
| Navigation | React Navigation | Screen navigation |
| Maps | Mapbox/MapKit | Map display |
| Styling | Tailwind CSS | UI styling |

### Backend

| Component | Technology | Purpose |
|-----------|------------|---------|
| API | FastAPI | REST API |
| Database | PostgreSQL | Primary data store |
| Cache | Redis | Session and data cache |
| Realtime | Supabase Realtime | WebSocket connections |
| Storage | Supabase Storage | File storage |
| Search | Elasticsearch | Full-text search |

### Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Hosting | AWS/GCP | Cloud infrastructure |
| Containers | Docker | Application packaging |
| Orchestration | Kubernetes | Container management |
| CI/CD | GitHub Actions | Deployment automation |
| Monitoring | Datadog | Performance monitoring |
| Logging | CloudWatch | Log aggregation |

---

## Database Design

### Core Tables

```
users
├── id (UUID, PK)
├── telegram_id (VARCHAR, UNIQUE)
├── username (VARCHAR)
├── display_name (VARCHAR)
├── avatar_url (VARCHAR)
├── trust_score (INTEGER)
├── verification_level (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

events
├── id (UUID, PK)
├── organizer_id (UUID, FK → users)
├── title (VARCHAR)
├── description (TEXT)
├── category (VARCHAR)
├── location (JSONB)
├── start_time (TIMESTAMP)
├── end_time (TIMESTAMP)
├── capacity (INTEGER)
├── approval_required (BOOLEAN)
├── status (VARCHAR)
├── cover_image_url (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

attendances
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── event_id (UUID, FK → events)
├── status (VARCHAR)
├── checked_in_at (TIMESTAMP)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

messages
├── id (UUID, PK)
├── event_id (UUID, FK → events)
├── sender_id (UUID, FK → users)
├── content (TEXT)
├── type (VARCHAR)
├── created_at (TIMESTAMP)
└── deleted_at (TIMESTAMP)

series
├── id (UUID, PK)
├── organizer_id (UUID, FK → users)
├── title (VARCHAR)
├── description (TEXT)
├── category (VARCHAR)
├── recurrence_pattern (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

badges
├── id (UUID, PK)
├── name (VARCHAR)
├── category (VARCHAR)
├── description (TEXT)
├── icon_url (VARCHAR)
└── criteria (JSONB)

user_badges
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── badge_id (UUID, FK → badges)
├── earned_at (TIMESTAMP)
└── UNIQUE(user_id, badge_id)
```

### Row-Level Security

All tables have RLS enabled with policies:

```sql
-- Example: Users can only read their own profile
CREATE POLICY "Users read own profile"
ON users FOR SELECT
USING (auth.uid() = id);
```

---

## API Structure

### REST Endpoints

| Resource | Endpoints |
|----------|-----------|
| /users | GET, PATCH |
| /events | GET, POST |
| /events/:id | GET, PATCH, DELETE |
| /events/:id/join | POST |
| /events/:id/leave | POST |
| /events/:id/requests | GET |
| /messages | GET, POST |
| /series | GET, POST |
| /badges | GET |
| /notifications | GET, PATCH |

### GraphQL

For complex queries:
- User profiles with relationships
- Event aggregations
- Analytics queries

### WebSocket

For realtime features:
- Chat messages
- Typing indicators
- Online presence
- Notification updates

---

## Offline Architecture

### Client-Side Storage

```
┌─────────────────────────────────────┐
│         Local Database              │
│  ┌───────────────────────────────┐   │
│  │         IndexedDB            │   │
│  │  ┌─────────┐ ┌─────────────┐  │   │
│  │  │ Events  │ │  Messages   │  │   │
│  │  └─────────┘ └─────────────┘  │   │
│  │  ┌─────────┐ ┌─────────────┐  │   │
│  │  │ Profile │ │  Settings   │  │   │
│  │  └─────────┘ └─────────────┘  │   │
│  └───────────────────────────────┘   │
│  ┌───────────────────────────────┐   │
│  │         Service Worker        │   │
│  │  ┌─────────────────────────┐  │   │
│  │  │  Background Sync Queue  │  │   │
│  │  │  Push Notifications     │  │   │
│  │  │  Offline Fallback       │  │   │
│  │  └─────────────────────────┘  │   │
│  └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Sync Strategy

| Phase | Action |
|-------|--------|
| Online | Real-time sync |
| Offline | Queue actions locally |
| Reconnect | Sync queue, resolve conflicts |
| Conflict | Server wins, notify user |

---

## Scalability

### Horizontal Scaling

```
                    ┌─────────────┐
                    │ Load Balancer│
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
   │  API 1  │        │  API 2  │        │  API 3  │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Database  │
                    │  (Read     │
                    │  Replicas) │
                    └────────────┘
```

### Caching Strategy

| Layer | Technology | TTL |
|-------|------------|-----|
| API Cache | Redis | 5 minutes |
| Query Cache | PostgreSQL | 1 minute |
| CDN | CloudFront | 24 hours |
| Local Cache | IndexedDB | Varies |

---

## Security Architecture

### Authentication Flow

```
User → Telegram Auth → Validate Token → Issue JWT → Store Session
                              │
                              ▼
                    Supabase Auth Service
```

### Authorization Flow

```
Request → JWT Validation → Load User → Check RBAC → Execute Action
                    │                    │
                    ▼                    ▼
              Token Valid?         Permission OK?
                    │                    │
                    └──────┬─────────────┘
                           ▼
                     Allow / Deny
```

---

## Monitoring

### Metrics

| Category | Metrics |
|----------|---------|
| Performance | Latency, throughput, errors |
| Business | DAU, events, joins |
| Technical | CPU, memory, disk |
| Security | Auth failures, suspicious activity |

### Alerting

| Severity | Examples | Response |
|----------|----------|----------|
| Critical | Downtime, breach | Immediate |
| Warning | High latency, errors spiking | 1 hour |
| Info | Metrics anomaly | Daily review |

---

## Future Scalability

### Phase 2 Additions

1. **Microservices**: Break into specialized services
2. **CDN**: Global content delivery
3. **Multi-Region**: Geographic distribution
4. **Event Streaming**: Kafka for event processing

### Phase 3 Additions

1. **ML Pipeline**: Recommendation model training
2. **Data Lake**: Analytics and warehousing
3. **Graph Database**: Social graph analysis

---

*Last Updated: Phase 1.0*
*Owner: Engineering Team*
*Review Frequency: Quarterly*

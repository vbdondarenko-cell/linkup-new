# Infrastructure Overview

## Architecture

LinkUp uses a modern, cloud-native architecture designed for scale, reliability, and developer productivity.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN (Cloudflare)                        │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Load Balancer / WAF                         │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│   Frontend (React)      │       │   Edge Functions         │
│   - Render/Vercel      │       │   - Supabase Edge        │
│   - Global CDN          │       │   - API Gateway          │
└─────────────────────────┘       └─────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Supabase                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ PostgreSQL  │  │ Realtime   │  │     Storage         │   │
│  │ + PostGIS   │  │ WebSocket  │  │  (Avatars, Events)   │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐ │
│  │ Mapbox    │  │ Telegram  │  │ Sentry    │  │ PostHog   │ │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Environments

| Environment | Purpose | URL | Auto-Deploy |
|------------|---------|-----|-------------|
| Development | Local development | localhost:3000 | N/A |
| Preview | Feature preview | preview.linkup.app | On PR |
| Staging | Pre-production testing | staging.linkup.app | On develop |
| Production | Live users | linkup.app | Manual approval |

## Infrastructure Components

### Frontend
- **Framework**: Next.js with React
- **Hosting**: Render / Vercel
- **CDN**: Cloudflare
- **Deployment**: GitHub Actions

### Backend
- **API**: Supabase (PostgreSQL + Edge Functions)
- **Database**: PostgreSQL 15 with PostGIS
- **Realtime**: Supabase Realtime (WebSocket)
- **Storage**: Supabase Storage (S3-compatible)

### Monitoring
- **Error Tracking**: Sentry
- **Analytics**: PostHog
- **Uptime**: GitHub Actions scheduled checks
- **Logs**: Supabase + CloudWatch

## Scalability

### Horizontal Scaling
- Frontend auto-scales via CDN edge
- Supabase handles connection pooling automatically
- Edge Functions scale to zero

### Caching Strategy
- Static assets: CDN (1 year)
- API responses: Redis (5 min)
- Database queries: Query caching

### Performance Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Cold Start | <1s | 2s |
| API Response | <100ms | 200ms |
| Page Load | <2s | 3s |
| LCP | <2.5s | 4s |
| FID | <100ms | 200ms |
| CLS | <0.1 | 0.2 |

---

*Last Updated: V6.0*
*Owner: DevOps Team*

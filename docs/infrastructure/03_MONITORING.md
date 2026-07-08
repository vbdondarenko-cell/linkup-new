# Monitoring & Observability

## Overview

LinkUp uses comprehensive monitoring to ensure system health, performance, and reliability.

## Monitoring Stack

| Tool | Purpose | Access |
|------|---------|--------|
| Sentry | Error tracking | Dashboard |
| PostHog | Analytics | Dashboard |
| Supabase | Database logs | Dashboard |
| GitHub Actions | Health checks | Actions tab |
| Render | Deployment logs | Dashboard |

## Health Checks

### Endpoint
```
GET /api/health
```

### Response
```json
{
  "status": "healthy",
  "timestamp": "2026-07-08T09:00:00Z",
  "version": "1.0.0",
  "uptime": 86400,
  "checks": {
    "api": { "status": "healthy", "latency": 5 },
    "database": { "status": "healthy", "latency": 12 },
    "realtime": { "status": "healthy", "latency": 8 },
    "storage": { "status": "healthy", "latency": 15 },
    "edgeFunctions": { "status": "healthy", "latency": 25 }
  }
}
```

### Check Frequencies
- API health: Every 5 minutes
- Database health: Every 5 minutes
- Performance: Daily
- Full audit: Weekly

## Metrics

### Application Metrics
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Active users
- API calls

### Database Metrics
- Query latency
- Connection count
- Cache hit rate
- Replication lag
- Storage usage

### Infrastructure Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network traffic
- Container health

## Alerts

### Critical Alerts
| Alert | Condition | Response |
|-------|-----------|----------|
| API Down | HTTP 503 | Immediate |
| Database Down | Connection fail | Immediate |
| High Error Rate | >5% errors | 5 min |
| Memory > 90% | Memory usage | 10 min |

### Warning Alerts
| Alert | Condition | Response |
|-------|-----------|----------|
| High Latency | p95 > 500ms | 15 min |
| Disk > 80% | Storage usage | 30 min |
| Failed Deploy | Any | 15 min |

## Logging

### Log Levels
- **DEBUG**: Development, troubleshooting
- **INFO**: Normal operations
- **WARN**: Potential issues
- **ERROR**: Failures
- **CRITICAL**: System down

### Log Format
```json
{
  "timestamp": "2026-07-08T09:00:00Z",
  "level": "error",
  "message": "Database connection failed",
  "correlation_id": "req_123",
  "user_id": "user_456",
  "context": {
    "host": "db.supabase.co",
    "error": "Connection timeout"
  }
}
```

### Log Retention
- Development: 7 days
- Staging: 30 days
- Production: 90 days

## Performance Monitoring

### Core Web Vitals
| Metric | Target | Action |
|--------|--------|--------|
| LCP | <2.5s | Optimize images, CDN |
| FID | <100ms | Reduce JS, defer loading |
| CLS | <0.1 | Reserve space |

### Lighthouse Scores
| Category | Minimum |
|----------|---------|
| Performance | 80 |
| Accessibility | 90 |
| Best Practices | 90 |
| SEO | 90 |

## Dashboard Links

- **Sentry**: https://sentry.io/organizations/linkup
- **PostHog**: https://app.posthog.com
- **Supabase**: https://supabase.com/dashboard
- **Render**: https://dashboard.render.com

---

*Last Updated: V6.0*
*Owner: DevOps Team*

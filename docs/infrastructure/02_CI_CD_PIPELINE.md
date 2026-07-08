# CI/CD Pipeline

## Overview

LinkUp uses GitHub Actions for continuous integration and deployment with a focus on quality, security, and reliability.

## Pipeline Stages

### 1. Code Quality
- ESLint linting
- TypeScript type checking
- Prettier format check
- Unused code detection
- Circular dependency check

### 2. Unit Tests
- Jest test runner
- Code coverage with Codecov
- Coverage threshold: 70%

### 3. Integration Tests
- PostgreSQL with PostGIS
- Database migrations
- API integration tests

### 4. Security Scan
- npm audit
- Snyk vulnerability scan
- Trivy container scan
- Secret detection

### 5. Build
- Next.js production build
- Bundle size analysis
- Artifact upload

### 6. E2E Tests
- Playwright tests
- Cross-browser testing
- Critical path coverage

### 7. Performance Tests
- Lighthouse CI
- Core Web Vitals validation
- Performance budget enforcement

### 8. Deployment
- Environment-specific
- Manual approval for production
- Automatic rollback on failure

## Workflow Files

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `01-ci.yml` | Push, PR | Code quality and testing |
| `02-deploy.yml` | Push to main/develop | Deployment |
| `03-monitor.yml` | Schedule | Health checks |
| `04-release.yml` | Tags | Release management |
| `05-disaster-recovery.yml` | Manual, Schedule | DR procedures |

## Branch Strategy

```
feature/*  ──────►  develop  ──────►  main  ──────►  Production
                     │                   │
                     │                   └─── Tag ──► Release
                     │
                     └───► Preview Deploy (auto)
```

### Branch Protection
- **main**: Require PR, 2 approvals, passing checks
- **develop**: Require PR, 1 approval, passing checks
- **feature/***: PR to develop, passing checks

## Environment Variables

All secrets stored in GitHub Secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `POSTHOG_KEY`
- `MAPBOX_TOKEN`
- `RENDER_API_KEY`
- `RENDER_STAGING_SERVICE_ID`
- `RENDER_PRODUCTION_SERVICE_ID`
- `CODECOV_TOKEN`

## Deployment Process

### Staging (Automatic)
1. Push to `develop`
2. CI pipeline runs
3. Auto-deploy on success

### Production (Manual)
1. Create PR from `develop` to `main`
2. Review and approve
3. Merge to `main`
4. Manual approval in GitHub Actions
5. Deployment with health checks

### Rollback
1. Go to GitHub Actions
2. Find last successful deployment
3. Click "Re-run jobs"
4. Or use disaster recovery workflow

## Quality Gates

| Gate | Threshold |
|------|-----------|
| ESLint | 0 errors |
| TypeScript | 0 errors |
| Unit Test Coverage | ≥70% |
| E2E Tests | All must pass |
| Security | No high vulnerabilities |
| Performance | Meet budget |

## Notifications

- **Slack**: Deployment status, failures
- **Email**: Production deployments, critical failures
- **GitHub**: PR status, review requests

---

*Last Updated: V6.0*
*Owner: DevOps Team*

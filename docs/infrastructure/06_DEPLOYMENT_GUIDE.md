# Deployment Guide

## Overview

This guide covers the deployment process for LinkUp across all environments.

## Prerequisites

1. GitHub account with repository access
2. Supabase account with project
3. Render account (for frontend hosting)
4. Required secrets configured

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/vbdondarenko-cell/linkup-new.git
cd linkup-new
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp infrastructure/environments/development/.env.example .env.local
# Edit .env.local with your values
```

### 4. Setup Supabase
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>
```

## Local Development

### Start Development Server
```bash
npm run dev
```

### Database Migrations
```bash
# Create migration
npm run db:migrate:create -- <migration-name>

# Apply migrations
npm run db:migrate

# Reset database
npm run db:reset
```

### Type Generation
```bash
# Generate Supabase types
npm run db:generate-types
```

## Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### All Tests
```bash
npm run test:all
```

## Build

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run build:preview
```

## Deployment

### Staging (Automatic)
Push to `develop` branch:
```bash
git checkout develop
git merge feature/your-feature
git push origin develop
```

### Production (Manual)
1. Create PR from `develop` to `main`
2. Review and approve
3. Merge to `main`
4. Go to GitHub Actions
5. Approve production deployment
6. Monitor deployment

### Via GitHub Actions

#### Deploy Staging
```bash
git tag -a v1.0.0-develop -m "Deploy to staging"
git push origin develop
```

#### Deploy Production
```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## Rollback

### Automatic Rollback
If deployment fails health checks, GitHub Actions automatically rolls back.

### Manual Rollback
1. Go to GitHub Actions
2. Select "Deployment Pipeline"
3. Find last successful deployment
4. Click "Re-run all jobs"

## Post-Deployment

### 1. Verify Deployment
```bash
curl https://linkup.app/api/health
```

### 2. Check Logs
```bash
# View deployment logs in Render dashboard
```

### 3. Monitor Errors
```bash
# Check Sentry for errors
https://sentry.io/organizations/linkup/issues/
```

## Troubleshooting

### Build Fails
1. Check TypeScript errors: `npm run type-check`
2. Check ESLint: `npm run lint`
3. Verify environment variables

### Database Migration Fails
1. Check Supabase status
2. Verify credentials
3. Run with verbose: `npm run db:migrate -- --verbose`

### Deployment Fails
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Check Supabase configuration

## Useful Commands

```bash
# Clean build
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Analyze bundle
npm run analyze:bundle
```

---

*Last Updated: V6.0*
*Owner: DevOps Team*

# Production Runbook

## Emergency Contacts

| Role | Name | Contact | Hours |
|------|------|---------|-------|
| On-Call Engineer | - | oncall@linkup.app | 24/7 |
| Tech Lead | - | tech@linkup.app | Business hours |
| DBA | - | dba@linkup.app | Business hours |
| Security | - | security@linkup.app | 24/7 |

## Incident Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| SEV1 | Complete outage | 15 min | API down, DB down |
| SEV2 | Major feature down | 30 min | Chat broken, payments down |
| SEV3 | Minor feature down | 2 hours | Search slow, notifications delayed |
| SEV4 | Non-critical | 24 hours | UI glitch, analytics delayed |

## Common Issues

### 1. High Error Rate

**Symptoms:** Sentry alerts, user reports

**Diagnosis:**
```bash
# Check error details
curl https://sentry.io/api/...

# Check logs
supabase logs --project-id <id> --table logs
```

**Resolution:**
1. Identify error pattern
2. Check recent deployments
3. If deployment-related, rollback
4. Fix and deploy hotfix

### 2. Database Performance

**Symptoms:** Slow queries, timeouts

**Diagnosis:**
```sql
-- Check active queries
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Check slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

**Resolution:**
1. Check for missing indexes
2. Analyze query plans
3. Kill long-running queries if needed
4. Scale database if necessary

### 3. Storage Full

**Symptoms:** Upload failures, storage errors

**Diagnosis:**
```bash
# Check storage usage
supabase storage ls
```

**Resolution:**
1. Identify large files
2. Clean up old files
3. Implement lifecycle policies
4. Scale storage if needed

### 4. Realtime Issues

**Symptoms:** Chat not working, delayed updates

**Diagnosis:**
```bash
# Check realtime connections
curl https://api.supabase.com/projects/<id>/realtime/stats
```

**Resolution:**
1. Check Supabase status
2. Restart realtime service
3. Scale realtime capacity

### 5. High Memory Usage

**Symptoms:** OOM errors, slow performance

**Diagnosis:**
```bash
# Check container memory
docker stats
```

**Resolution:**
1. Identify memory leaks
2. Restart affected services
3. Scale horizontally

## Rollback Procedures

### Automatic Rollback
If CI/CD health checks fail, automatic rollback occurs.

### Manual Rollback

1. **Go to GitHub Actions**
2. **Find last successful deployment**
3. **Click "Re-run all jobs"**

Or via command:
```bash
# Revert to previous version
git revert <commit>
git push origin main
```

### Database Rollback

1. **Create backup first**
2. **Use disaster recovery workflow**
3. **Verify data integrity**

## Recovery Procedures

### Complete Outage

1. **Assess scope** - What's affected?
2. **Communicate** - Update status page
3. **Mitigate** - Apply fix or rollback
4. **Restore** - Confirm service recovery
5. **Review** - Post-mortem analysis

### Data Corruption

1. **Stop writes** - Prevent further damage
2. **Backup** - Create current backup
3. **Restore** - From last known good backup
4. **Verify** - Check data integrity
5. **Resume** - Re-enable writes

## Monitoring Commands

```bash
# Health check
curl https://linkup.app/api/health

# Database health
curl https://linkup.app/api/health/db

# Realtime health
curl https://linkup.app/api/health/realtime

# Storage health
curl https://linkup.app/api/health/storage
```

## Useful Links

- [Sentry Dashboard](https://sentry.io/organizations/linkup)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Render Dashboard](https://dashboard.render.com)
- [GitHub Actions](https://github.com/vbdondarenko-cell/linkup-new/actions)
- [Status Page](https://status.linkup.app)

## Escalation Path

1. **On-Call Engineer** - Initial response
2. **Tech Lead** - SEV1/SEV2
3. **CTO** - Extended outages
4. **CEO** - PR/Communication issues

## Post-Incident

1. Write incident report
2. Identify root cause
3. Implement fix
4. Add monitoring
5. Update runbook
6. Schedule post-mortem

---

*Last Updated: V6.0*
*Owner: Engineering Team*

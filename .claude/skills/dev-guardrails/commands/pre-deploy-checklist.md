---
description: Production readiness gate — checks operational foundations before deployment. Covers backups, logging, health probes, connection pooling, PII handling, and error monitoring.
category: operations
---

# Pre-Deploy Checklist

You are gating a deployment against operational readiness. Every item below was a production incident or near-miss in a real project. Missing any one can cause data loss, debugging blindness, or downtime.

## Instructions

Scan the codebase and configuration for each operational foundation. Report what's in place and what's missing.

### 1. Database

**Backups:**
- [ ] Automated backup schedule configured (provider-level or cron)
- [ ] Backup retention policy defined
- [ ] Restore process tested at least once

**Connection Pooling:**
- [ ] Pool max connections configured (not default)
- [ ] Idle timeout set (prevent stale connections)
- [ ] Connection lifetime set (prevent long-lived connections)
- [ ] Pool size appropriate for deployment target (Railway: ~10-20, dedicated: higher)

Search for: database client initialization, pool configuration, `max`, `idle_timeout`, `connection_limit`

**Migrations:**
- [ ] Migration tool runs in production start script (not manual)
- [ ] Migration tool is in `dependencies` (not `devDependencies`)
- [ ] All pending migrations committed and tested

### 2. Logging

- [ ] Structured JSON logging in production (not console.log)
- [ ] Request correlation IDs (X-Request-Id or generated)
- [ ] Log levels used appropriately (error, warn, info, debug)
- [ ] Sensitive data NOT logged (tokens, passwords, PII)
- [ ] Request/response logging at info level (method, path, status, duration)

Search for: `console.log`, `console.error`, logger initialization, pino/winston config

### 3. Health Endpoints

- [ ] Liveness probe exists (`/health/live` — returns 200, no dependency checks)
- [ ] Readiness probe exists (`/health/ready` — checks DB connectivity)
- [ ] Container orchestrator configured to use health endpoints
- [ ] Probes don't require authentication

Search for: `/health`, `liveness`, `readiness`, health route definitions

### 4. Graceful Shutdown

- [ ] SIGTERM handler registered
- [ ] Handler stops accepting new requests
- [ ] Handler waits for in-flight requests to complete
- [ ] Handler closes database connections cleanly
- [ ] Shutdown timeout configured (kill after N seconds if drain stalls)

Search for: `SIGTERM`, `SIGINT`, `process.on`, `server.close`, graceful shutdown

### 5. Error Monitoring

- [ ] Sentry/equivalent configured with DSN from environment variable
- [ ] PII scrubbing in `beforeSend` hook (tokens, passwords, emails)
- [ ] Sample rate appropriate for traffic (not 100% in production)
- [ ] Source maps uploaded for meaningful stack traces
- [ ] Environment tag set (production, staging, development)
- [ ] Release version tagged for regression tracking

Search for: Sentry init, `beforeSend`, `tracesSampleRate`, DSN configuration

### 6. Environment Configuration

- [ ] `.env.example` exists documenting all required variables
- [ ] No hardcoded secrets in source code
- [ ] Secrets loaded from environment variables only
- [ ] Different configs for development vs production (especially: debug mode off, HTTPS required, secure cookies)

Search for: `.env`, environment variable usage, hardcoded URLs/keys/tokens

### 7. Dependencies

- [ ] All production-required packages in `dependencies` (not `devDependencies`)
- [ ] Lock file (`package-lock.json`, `bun.lockb`) committed
- [ ] No known security vulnerabilities (`npm audit` / `bun audit`)
- [ ] Unused dependencies removed

### 8. Start Script

- [ ] Start script runs migrations before app start
- [ ] Start script is deterministic (no interactive prompts)
- [ ] Start script handles init tasks (seed data, file system setup) idempotently
- [ ] Process manager configured if needed (PM2, cluster mode)

Search for: `package.json` start script, Dockerfile/Procfile/nixpacks config

## Output Format

```
## Pre-Deploy Readiness Report

**Overall:** 6/8 sections passing | 2 issues to resolve before deploy

| Section | Status | Issues |
|---------|--------|--------|
| Database | WARN | Backups not configured |
| Logging | PASS | Pino JSON logging in place |
| Health endpoints | PASS | /health/live and /health/ready exist |
| Graceful shutdown | FAIL | No SIGTERM handler found |
| Error monitoring | PASS | Sentry configured with PII scrubbing |
| Environment | PASS | .env.example exists |
| Dependencies | WARN | drizzle-kit in devDependencies but used in start |
| Start script | PASS | Migrations run on start |

### FAIL: Graceful Shutdown
No SIGTERM handler found. In-flight requests will be killed on deploy.

**Recommended fix:**
[Concrete code snippet for this project's runtime]

### WARN: Database Backups
No backup configuration found. Data loss risk on provider failure.

**Recommended fix:**
[Provider-specific backup setup instructions]
```

Block the deploy recommendation if any FAIL items exist. WARN items should be flagged but don't block.

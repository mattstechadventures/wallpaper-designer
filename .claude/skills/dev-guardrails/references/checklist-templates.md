---
description: Reusable checklist fragments composed by dev-guardrails commands. Each section is a standalone checklist that can be mixed into different contexts.
category: quality
---

# Checklist Templates

Atomic checklists referenced by commands. Each is self-contained and composable.

---

## AUTH: Route Authorization

- [ ] Route has authentication middleware (rejects unauthenticated requests with 401)
- [ ] Route checks authorization — caller has permission for this action (403 if not)
- [ ] If route takes an entity ID param, ownership/tenancy is verified before any operation
- [ ] Role check uses centralized permission system, not inline string comparison
- [ ] Privilege escalation blocked — users cannot grant themselves higher roles
- [ ] Sensitive data (tokens, secrets, invite codes) not returned in response body

---

## INPUT: Request Validation

- [ ] Request body validated against schema (Zod, Joi, etc.) before processing
- [ ] URL/path params validated (type, format, allowed characters)
- [ ] Query params validated with defaults for missing values
- [ ] Array inputs have max length bounds
- [ ] File uploads have max size and count limits
- [ ] No user input interpolated into shell commands (use array args with spawn)
- [ ] No user input interpolated into SQL (use parameterized queries)
- [ ] URLs from user input validated before server-side fetch (block private IPs, metadata endpoints)
- [ ] File paths from user input sanitized (reject `..`, absolute paths, null bytes)

---

## TENANT: Multi-Tenancy Isolation

- [ ] Database queries include tenant scope (WHERE business_id = ?)
- [ ] Cross-tenant access returns 404 (not 403) to prevent enumeration
- [ ] Tenant context derived from auth token, never from request params
- [ ] Bulk operations scoped to caller's tenant
- [ ] Cascading operations (delete user, delete business) respect tenant boundaries
- [ ] Test exists: User A cannot read/modify User B's resources

---

## SCHEMA: Database Changes

- [ ] Migration file committed alongside schema change
- [ ] Foreign key constraints defined with explicit ON DELETE behavior
- [ ] CASCADE vs SET NULL vs RESTRICT chosen intentionally per relationship
- [ ] Self-referencing FKs use deferred/AnyPgColumn pattern if needed
- [ ] Indexes added on columns used in WHERE clauses (especially auth-path: tokenHash, email)
- [ ] Nullable columns have CHECK constraint if mutually exclusive with another column
- [ ] Enum changes are additive (don't rename/remove values in production)
- [ ] Migration tested: up and down both work
- [ ] Large table changes use concurrent index creation or batched backfill

---

## SECURITY: Headers and Transport

- [ ] Content-Security-Policy header configured
- [ ] CSRF protection middleware on state-changing endpoints
- [ ] HSTS header set (Strict-Transport-Security)
- [ ] X-Frame-Options set to DENY or SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] Cookies: HttpOnly, Secure, SameSite=Lax (or Strict)
- [ ] Host header not used to construct URLs (use configured base URL)
- [ ] Email templates escape all user-provided content
- [ ] Secrets (tokens, passwords) not logged or included in error responses
- [ ] Sentry/error reporting scrubs PII and credentials before sending

---

## RATE: Abuse Protection

- [ ] Login: max 5 attempts per 15min per IP
- [ ] Signup: max 3 per hour per IP
- [ ] Password reset: max 3 per hour per email
- [ ] API endpoints: sliding window per token or IP
- [ ] Account lockout after N consecutive failures (progressive backoff)
- [ ] Bot protection (CAPTCHA/Turnstile) on public auth forms
- [ ] Resource quotas per tenant (max users, max tokens, max entities)

---

## OPS: Production Readiness

- [ ] Structured logging (JSON in production, correlation IDs per request)
- [ ] Health endpoints: `/health/live` (no deps) and `/health/ready` (DB check)
- [ ] Graceful shutdown handles SIGTERM (drain connections, finish requests)
- [ ] Database connection pooling configured (max connections, idle timeout, lifetime)
- [ ] Database backups automated and tested
- [ ] .env.example documents all required environment variables
- [ ] Error monitoring configured with appropriate sampling (not 100%)
- [ ] PII scrubbing in error reports (tokens, passwords, emails)
- [ ] All production dependencies in `dependencies` (not `devDependencies`)
- [ ] Git/file storage backed up to object storage

---

## TEST: Coverage Requirements

- [ ] Unit tests for business logic and utility functions
- [ ] Integration tests for API routes (happy path + error cases)
- [ ] Auth tests: unauthenticated request returns 401
- [ ] Auth tests: unauthorized request returns 403
- [ ] Tenant isolation tests: cross-tenant access returns 404
- [ ] Input validation tests: malformed input returns 400 with safe error message
- [ ] Race condition tests: concurrent operations don't corrupt data
- [ ] E2E tests for critical user flows (signup, login, core CRUD)

---

## DONE: Definition of Done

- [ ] Code merged to target branch
- [ ] All CI checks pass (lint, typecheck, tests)
- [ ] New/changed routes have tests (see TEST checklist)
- [ ] No TypeScript errors introduced (`tsc --noEmit` clean)
- [ ] Manual E2E verification completed in staging/preview
- [ ] No stale references from renames (grep for old names)
- [ ] Migration file committed if schema changed
- [ ] No secrets committed (.env, credentials, tokens)
- [ ] PR description explains the "why", not just the "what"

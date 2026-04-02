---
description: Day-1 foundations checklist for a new project. Ensures security, auth, ops, and quality infrastructure is set up before feature development begins.
category: scaffold
---

# New Project Scaffold

You are setting up the foundational infrastructure for a new project. This prevents the most expensive class of bugs — those that require retroactive redesign across every file.

## Instructions

Analyze the current project and check which foundations are in place. For each missing foundation, provide concrete implementation guidance tailored to the project's stack.

### Phase 1: Security Foundations (do these FIRST)

**1. Centralized Authorization Module**
Check if the project has a centralized permission/RBAC system.

Look for:
- A `can(auth, permission)` or `authorize(auth, action, resource)` function
- A role-to-permissions mapping (not scattered `role === "admin"` checks)
- A `requireOwnership(auth, entityType, entityId)` middleware

If missing, recommend creating one immediately. Even a simple map:
```ts
const PERMISSIONS = {
  admin: ['manage:users', 'manage:settings', ...],
  user: ['read:own', 'write:own', ...],
}
export function can(auth, permission) {
  return PERMISSIONS[auth.role]?.includes(permission)
}
```

**Why this is #1:** In the reference project, skipping this caused 37 issues including every critical security vulnerability.

**2. Input Validation Layer**
Check if the project validates request input at the boundary.

Look for:
- Zod/Joi/Yup schemas on route handlers
- A validation middleware pattern
- Shell command construction (should use array args, never interpolation)

**3. Security Headers**
Check for CSP, CSRF, HSTS, X-Frame-Options configuration.

### Phase 2: Quality Infrastructure

**4. Test Framework**
Check if test infrastructure exists and is wired to CI.

Look for:
- Test runner configured (vitest, jest, bun test)
- At least one test file exists
- CI pipeline runs tests on PR

**5. Type Checking**
Check for TypeScript strict mode and CI typecheck step.

**6. Pre-commit Hooks**
Check for lint-staged, husky, or similar pre-commit quality gates.

### Phase 3: Operational Foundations

**7. Structured Logging**
Check for JSON logging with correlation IDs (not bare console.log).

**8. Health Endpoints**
Check for `/health/live` (no deps) and `/health/ready` (DB check).

**9. Graceful Shutdown**
Check for SIGTERM handler that drains connections.

**10. Database Setup**
Check for:
- Connection pooling configured
- .env.example documenting DB vars
- Migration tool configured
- Backup strategy documented

**11. Error Monitoring**
Check for Sentry/equivalent with:
- PII scrubbing before send
- Appropriate sampling rates (not 100%)
- Environment-specific configuration

### Phase 4: Auth Hardening

**12. Rate Limiting**
Check for rate limiting middleware on public endpoints.

**13. Session Security**
Check for HttpOnly + Secure + SameSite cookies, session invalidation on password change.

## Output Format

Present findings as a scored report card:

```
## Project Scaffold Report

| Foundation | Status | Priority |
|-----------|--------|----------|
| Centralized auth | missing | CRITICAL |
| Input validation | partial | HIGH |
| ...

### Missing: Centralized Auth (CRITICAL)
[Specific implementation guidance for this project's stack]

### Partial: Input Validation (HIGH)
[What's there, what's missing, how to complete it]
```

Prioritize by the pattern severity from `references/lessons-learned.md`. CRITICAL items should block feature development.

---
description: Nine vulnerability and bug patterns extracted from 128 production issues, ranked by frequency and severity. The core knowledge base for all dev-guardrails commands.
category: security
---

# Lessons Learned — Production Issue Pattern Analysis

Extracted from 128 completed issues across a multi-tenant SaaS build (Prism Hub). These patterns are **not project-specific** — they recur across any web application with auth, multi-tenancy, and API routes.

---

## Pattern 1: Missing Tenant Boundary / Authorization Checks

**Frequency:** 11 issues | **Severity:** CRITICAL
**What happened:** API routes accepted entity IDs (business, user, token, service, plugin) without verifying the caller owned or had access to that entity. Any authenticated user could read/modify another tenant's data by guessing IDs.

**Root cause:** Authorization was hand-coded per route. When new endpoints or roles were added, developers had to remember to add ownership checks. There was no centralized "does this user own this resource?" layer.

**Specific examples:**
- Cross-tenant business modification via PATCH /api/businesses/:id
- Cross-tenant service config overwrite via PUT /api/services/:slug/user-config
- Cross-tenant token creation via POST /api/tokens
- Self-promotion to platform_admin via PATCH /api/users/:id
- Per-plugin git route missing access check after feature addition

**Prevention:** Every route that takes an entity ID parameter MUST call a tenant verification function. A centralized `requireOwnership(auth, entityType, entityId)` middleware should be mandatory.

---

## Pattern 2: Scattered Role Checks (No Centralized RBAC)

**Frequency:** 26 issues (full 4-phase redesign) | **Severity:** HIGH
**What happened:** Authorization started as `auth.role === "business_admin"` string comparisons scattered across 50+ route handlers. Adding new roles (MSP admin, platform admin) required touching every file. Impossible to audit.

**Root cause:** No upfront investment in a permission model. Role checks were copy-pasted rather than abstracted.

**Prevention:** Build a centralized RBAC module from day one — even a simple `can(auth, 'manage:plugins')` function with a role-to-permissions map. Takes 2-3 hours, saves months of refactoring.

---

## Pattern 3: Missing Input Validation at Boundaries

**Frequency:** 9 issues | **Severity:** HIGH
**What happened:** User-supplied data from URL params, request bodies, and headers was trusted and passed directly to shell commands, git operations, server-side fetches, and file system paths.

**Specific vulnerabilities found:**
- **SSRF:** Unrestricted URL in server-side fetch (private IPs, cloud metadata endpoints)
- **Command injection:** `execSync` with string interpolation from user input
- **Path traversal:** `..` sequences in file path parameters accessing `.git/` internals
- **Git argument injection:** Unsanitized commit hashes passed to git CLI
- **Unbounded arrays:** No limits on file uploads, member lists, bulk operations

**Prevention:**
- Zod schema validation on every route (params, body, query)
- Never interpolate into shell commands — use `spawnSync` with array args
- URL allowlist validator for any server-side fetch
- Path sanitization: reject `..`, absolute paths, null bytes
- Input bounds: max array sizes, max file sizes

---

## Pattern 4: No Rate Limiting or Abuse Protection

**Frequency:** 5 issues | **Severity:** HIGH
**What happened:** Auth endpoints (login, signup, password reset) had no rate limiting, enabling credential stuffing, account enumeration, and brute-force attacks.

**Prevention:** Rate limiting middleware on all public endpoints from day one:
- Login: 5 attempts per 15 minutes per IP
- Signup: 3 per hour per IP
- API: sliding window per token/IP
- Account lockout after N failed attempts with progressive backoff

---

## Pattern 5: Security Headers and Crypto Gaps

**Frequency:** 6 issues | **Severity:** HIGH
**What happened:** No CSP header, no CSRF protection, host header injection in email templates, HTML injection in emails, weak token hashing.

**Specific issues:**
- Host header used to construct password reset URLs (attacker-controlled)
- Email templates rendered user input without escaping
- No Content-Security-Policy header
- Session tokens not invalidated on password change

**Prevention:** Security headers starter template at project init: CSP, CSRF middleware, HSTS, X-Frame-Options. Always `escapeHtml()` in email templates. Crypto review checklist (salt, HMAC, key derivation) when writing any token/hashing code.

---

## Pattern 6: Code Shipped Without Tests

**Frequency:** 8+ issues | **Severity:** MEDIUM
**What happened:** The entire codebase was built feature-first with zero test infrastructure. Tests were added as a separate retroactive work track. All security vulnerabilities above could have been caught by tests asserting cross-tenant operations return 403.

**Prevention:** Test framework is task #1 in any new project. Every PR includes tests for the code it adds. Cross-tenant test cases (user A tries to access user B's resource) are mandatory for any authenticated endpoint.

---

## Pattern 7: Operational Foundations Deferred

**Frequency:** 11 issues | **Severity:** MEDIUM
**What happened:** Infrastructure concerns were deferred until after feature completion:
- No database backups
- Unstructured console.log (no correlation IDs, no log levels)
- No health endpoints for container orchestration
- Default connection pool settings (exhausted under load)
- No graceful shutdown (SIGTERM killed mid-request)
- devDependencies used in production (drizzle-kit)
- 100% Sentry sampling in production
- No .env.example documenting required variables

**Prevention:** Production readiness checklist applied before first deploy, not after launch.

---

## Pattern 8: Stale References After Rename/Refactor

**Frequency:** 3 issues | **Severity:** MEDIUM
**What happened:** Variable renames, function moves, and feature flag changes left stale references causing `ReferenceError` crashes in production.

**Examples:**
- `markerCount` renamed to `markerNum` but one reference missed
- `isFeedbackEnabled` used without import after module move
- Email origin calculation changed but old path still hit

**Prevention:** TypeScript strict mode + CI typecheck catches most of these. Pre-commit hooks with type checking prevent shipping broken references.

---

## Pattern 9: Features Shipped Without E2E Verification

**Frequency:** 12 issues | **Severity:** LOW (individually)
**What happened:** Features were marked "done" when code merged, but never manually verified end-to-end. 12 separate audit issues were created just to verify features 1-12 actually worked.

**Prevention:** Definition of done checklist on every feature issue: code merged + tests pass + manual E2E walkthrough documented. Don't mark "done" until someone has used the feature in a browser/client.

---

## Impact Summary

| Investment | Time | Issues Prevented | Severity |
|-----------|------|-----------------|----------|
| Centralized RBAC from day 1 | 2-3 hours | ~37 issues | CRITICAL + HIGH |
| Test infrastructure as task #1 | 1 day | ~20 issues | MEDIUM-CRITICAL |
| Input validation + security scaffold | 1 day | ~15 issues | HIGH |
| **Total** | **~3 days** | **~72 / 128 (56%)** | |

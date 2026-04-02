---
description: Audit a newly added API route for auth, tenant isolation, input validation, rate limiting, and injection vectors. Run after adding any endpoint.
category: security
---

# New Route Audit

You are auditing a newly added or modified API route. This catches the single most common category of production bugs — missing authorization and validation on endpoints.

## Instructions

The user will point you at a route file or you should detect recently changed route files via git diff.

For each route handler found, check every item below. A single missing check is a potential vulnerability.

### 1. Authentication (Pattern 1 — CRITICAL)

- [ ] Route requires authentication (middleware or guard at top of handler)
- [ ] Unauthenticated requests return 401, not 500 or a data leak
- [ ] If public endpoint: explicitly marked/documented as intentionally public

**Red flag:** Handler accesses `auth.userId` or `auth.businessId` but has no auth middleware.

### 2. Authorization & Tenant Isolation (Pattern 1+2 — CRITICAL)

- [ ] Route checks caller has permission for this specific action
- [ ] If route takes an entity ID (`:id`, `:slug`), ownership verified before operation
- [ ] Ownership derived from auth context, NOT from request params
- [ ] Cross-tenant access returns 404 (not 403) to prevent enumeration
- [ ] No privilege escalation path (user cannot set own role, grant own permissions)
- [ ] Bulk/list endpoints scoped to caller's tenant

**Red flag:** `db.select().where(eq(table.id, params.id))` without tenant scope.

### 3. Input Validation (Pattern 3 — HIGH)

- [ ] Request body validated against a schema before use
- [ ] Path params validated (type, format, allowed chars)
- [ ] Query params have defaults and type validation
- [ ] Array inputs have max length bounds
- [ ] File inputs have max size and count limits
- [ ] No string interpolation into shell commands
- [ ] No string interpolation into SQL queries
- [ ] URLs validated before server-side fetch (block private IPs, metadata)
- [ ] File paths sanitized (reject `..`, absolute paths, null bytes, `.git/`)

**Red flag:** `req.body` destructured and used without validation. `execSync(\`git ${userInput}\`)`.

### 4. Error Handling (Pattern 8 — MEDIUM)

- [ ] Async errors caught (try/catch or error middleware)
- [ ] Error responses don't leak internal details (stack traces, DB errors, schema info)
- [ ] 400 returned for malformed input (not 500)
- [ ] Concurrent operations handled (Promise.allSettled where appropriate)

**Red flag:** `JSON.parse(body)` without try/catch. Raw Drizzle error messages in response.

### 5. Rate Limiting (Pattern 4 — HIGH for public routes)

- [ ] Public endpoints have rate limiting
- [ ] Auth endpoints have strict limits (5/15min login, 3/hr signup)
- [ ] Expensive operations (file upload, bulk create) have per-tenant limits

### 6. Response Hygiene (Pattern 1 — HIGH)

- [ ] Response doesn't include secrets (tokens, hashed passwords, invite codes)
- [ ] Response scoped to caller's tenant data only
- [ ] Pagination on list endpoints (no unbounded SELECT *)
- [ ] Sensitive fields excluded (use explicit select, not select *)

**Red flag:** `return user` instead of `return { id, name, email }`.

## Output Format

```
## Route Audit: [filename]

### [METHOD] [path] — [handler name]

| Check | Status | Detail |
|-------|--------|--------|
| Authentication | PASS | auth middleware applied |
| Authorization | FAIL | no ownership check on :id param |
| Input validation | WARN | body validated, but path params not |
| ...

**Issues Found:**
1. [CRITICAL] No tenant ownership verification on line XX — any user can access any entity by ID
2. [HIGH] Request body used without schema validation on line XX

**Suggested Fixes:**
[Concrete code changes]
```

If no route is specified, check `git diff --name-only` for recently changed route files and audit those.

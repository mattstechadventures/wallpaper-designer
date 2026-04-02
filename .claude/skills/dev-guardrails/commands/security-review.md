---
description: Scan the codebase for known vulnerability classes — SSRF, path traversal, command injection, missing CSRF, secrets in URLs, info leaks, missing auth. Based on real vulnerabilities found in production.
category: security
---

# Security Review

You are performing a targeted security review of the codebase, scanning for the specific vulnerability classes most commonly found in web applications. Every pattern below was discovered in a real production codebase.

## Instructions

Scan the codebase systematically for each vulnerability class. Use grep/glob to find relevant code patterns, then analyze each match.

### Scan 1: Command Injection (CRITICAL)

Search for shell execution with string interpolation:

```
grep for: execSync, exec(, spawnSync, spawn(, child_process
```

**Vulnerable pattern:**
```ts
execSync(`git log ${userInput}`)     // INJECTABLE
exec(`rm -rf ${path}`)               // INJECTABLE
```

**Safe pattern:**
```ts
spawnSync('git', ['log', userInput]) // Safe — array args
```

Flag any shell execution where arguments include variables that could originate from user input (request params, body, query, headers, database values from user-created records).

### Scan 2: SSRF (HIGH)

Search for server-side HTTP requests:

```
grep for: fetch(, axios, http.get, http.request, got(, request(
```

Check if the URL is user-controlled or derived from user input. Verify:
- Private IP ranges blocked (10.x, 172.16-31.x, 192.168.x, 127.x, 169.254.x)
- Cloud metadata endpoints blocked (169.254.169.254)
- HTTPS required in production
- URL scheme restricted (no file://, gopher://, etc.)

### Scan 3: Path Traversal (HIGH)

Search for file system operations with dynamic paths:

```
grep for: readFile, writeFile, createReadStream, fs., path.join, path.resolve
```

Check if any path component comes from user input. Verify:
- `..` sequences rejected
- Absolute paths rejected
- Null bytes rejected
- Sensitive directories blocked (`.git/`, `.env`, `node_modules/`)
- Path normalized before use

### Scan 4: SQL/ORM Injection (HIGH)

Search for raw SQL or unsafe query construction:

```
grep for: sql`, .raw(, .execute(, query(, $queryRaw
```

Verify all user input goes through parameterized queries or ORM methods, never string concatenation.

### Scan 5: Missing CSRF Protection (MEDIUM)

Check if state-changing endpoints (POST, PUT, DELETE, PATCH) have CSRF protection:
- CSRF token middleware present
- Or SameSite=Strict/Lax cookies with origin checking
- API-only routes with token auth are exempt (no cookies = no CSRF)

### Scan 6: Secrets in URLs/Logs (MEDIUM)

Search for sensitive data in URL paths or query params:

```
grep for: token, secret, password, apiKey, api_key in URL patterns and route definitions
```

Tokens in URL paths get logged by proxies, CDNs, browser history, and analytics. Prefer headers (Authorization, custom X- headers) or POST bodies.

### Scan 7: Information Leaks (MEDIUM)

Check API error responses and success responses for oversharing:
- Stack traces in production error responses
- Database error messages exposed to clients
- Internal IDs, email addresses, or user details in public endpoints
- Version headers revealing framework/runtime versions
- Overly detailed 404 messages

### Scan 8: Missing Security Headers (LOW)

Check for presence of:
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security
- Referrer-Policy

### Scan 9: Crypto Weaknesses (MEDIUM)

Search for:
```
grep for: createHash, md5, sha1, Math.random, crypto.random
```

Flag:
- MD5 or SHA1 for password hashing (use bcrypt/scrypt/argon2)
- Math.random() for tokens/secrets (use crypto.randomBytes)
- Hardcoded secrets or keys
- Missing salt on hashes

## Output Format

```
## Security Review Report

**Scan date:** [date]
**Files scanned:** [count]
**Issues found:** [count by severity]

### CRITICAL
1. **Command Injection** in `src/lib/git/exec.ts:42`
   Pattern: execSync with interpolated commit hash
   Fix: Use spawnSync with array arguments

### HIGH
2. **SSRF** in `src/lib/api/routes/services.ts:118`
   ...

### MEDIUM
...

### Summary
| Category | Issues | Highest Severity |
|----------|--------|-----------------|
| Command injection | 2 | CRITICAL |
| SSRF | 1 | HIGH |
| Path traversal | 0 | — |
| ... | | |
```

Be thorough — scan every file, not just routes. Utility functions, background jobs, and scripts are common hiding spots.

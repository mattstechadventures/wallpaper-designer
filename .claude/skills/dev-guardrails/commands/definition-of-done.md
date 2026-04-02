---
description: Pre-completion checklist before marking work as done. Ensures tests, type safety, E2E verification, no stale references, and proper documentation.
category: quality
---

# Definition of Done

You are verifying that a piece of work is truly complete — not just "code written" but "shippable with confidence." This catches the class of bugs that slip through when developers mark tasks done at merge time without verification.

## Instructions

Determine what work was just completed by checking:
1. Recent git commits on the current branch
2. Staged/unstaged changes
3. The user's description of what they just finished

Then run through every check below.

### 1. Code Completeness

- [ ] All acceptance criteria from the issue/task are implemented
- [ ] No TODO/FIXME/HACK comments left in the changed code (unless explicitly deferred)
- [ ] No commented-out code left behind
- [ ] No placeholder implementations (throw new Error('not implemented'))

### 2. Type Safety

Run `tsc --noEmit` (or equivalent) and verify:
- [ ] No new TypeScript errors introduced
- [ ] No `any` types added without justification
- [ ] Renamed symbols have no stale references (grep for the old name)
- [ ] Removed exports have no remaining imports

**Why:** 3 production crashes in the reference project were caused by stale references after rename/move that TypeScript would have caught.

### 3. Tests

- [ ] New code has tests (unit and/or integration)
- [ ] Tests pass locally
- [ ] For auth-related changes: test that unauthenticated returns 401
- [ ] For auth-related changes: test that unauthorized returns 403
- [ ] For multi-tenant changes: test that cross-tenant access returns 404
- [ ] For input-handling changes: test that malformed input returns 400
- [ ] Edge cases covered (empty arrays, null values, boundary conditions)

### 4. Database (if schema changed)

- [ ] Migration file committed
- [ ] Migration tested (fresh DB + upgrade both work)
- [ ] Seed data updated for new required columns
- [ ] Indexes added for new query patterns

### 5. Security Quick-Check

- [ ] No secrets in committed code
- [ ] No user input passed to shell commands via interpolation
- [ ] New endpoints have auth middleware
- [ ] New endpoints validate input
- [ ] Response doesn't leak sensitive fields

### 6. Manual Verification

- [ ] Feature works end-to-end in browser/client (not just unit tests)
- [ ] Happy path verified
- [ ] Error path verified (what happens when things go wrong?)
- [ ] UI renders correctly (no layout breaks, no console errors)

### 7. Git Hygiene

- [ ] Commit messages explain "why", not just "what"
- [ ] No unrelated changes bundled in
- [ ] No sensitive files staged (.env, credentials, keys)
- [ ] Branch is up to date with target branch

## Output Format

Run the automated checks (typecheck, tests, grep for stale refs) and present results:

```
## Done Check: [branch name or description]

### Automated Checks
| Check | Status | Detail |
|-------|--------|--------|
| TypeScript | PASS | No errors |
| Tests | PASS | 47 pass, 0 fail |
| Stale refs | WARN | Found 2 references to old name `getUser` |
| Secrets scan | PASS | No secrets detected |
| Migration | PASS | Migration 0015 committed |

### Manual Checks Required
- [ ] Verify signup flow in browser
- [ ] Verify error state when API is down
- [ ] Check mobile responsive layout

### Issues to Fix Before Done
1. [WARN] `getUser` renamed to `getUserById` but 2 references remain:
   - src/lib/api/routes/users.ts:42
   - src/components/user-card.tsx:18
```

If automated checks find issues, fix them before presenting the report. Only flag manual checks as action items for the user.

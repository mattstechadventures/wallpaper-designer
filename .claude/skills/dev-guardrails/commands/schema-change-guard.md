---
description: Validate database schema changes have proper FK constraints, cascading behavior, migration files, indexes, and CHECK constraints. Run when touching schema or migrations.
category: database
---

# Schema Change Guard

You are reviewing database schema changes for safety and completeness. Schema mistakes are expensive — they require migrations, backfills, and sometimes downtime to fix after the fact.

## Instructions

Detect schema changes by checking:
1. `git diff` on schema files (e.g., `schema.ts`, `schema.prisma`, migration files)
2. If no diff, ask the user which schema changes to review
3. Also check for new migration files that haven't been reviewed

### Check 1: Foreign Key Constraints

For every relationship between tables:

- [ ] FK constraint is explicitly defined (not just a convention of matching column names)
- [ ] ON DELETE behavior specified:
  - `CASCADE` — child rows deleted when parent deleted (use for owned resources)
  - `SET NULL` — FK set to null when parent deleted (use for optional references like `createdBy`)
  - `RESTRICT` — block parent deletion if children exist (use for billing/audit records)
- [ ] Self-referencing FKs use deferred constraint or `AnyPgColumn` pattern
- [ ] No orphaned rows possible if parent is deleted

**Common mistake:** Forgetting ON DELETE means the DB defaults to `RESTRICT`, which blocks deletion and causes unexpected 500s in delete flows.

### Check 2: Migration File

- [ ] Migration file exists and is committed alongside schema change
- [ ] Migration filename follows project convention (sequential number or timestamp)
- [ ] Migration journal/metadata updated (e.g., Drizzle `_journal.json`)
- [ ] Migration is idempotent or uses IF NOT EXISTS / IF EXISTS guards
- [ ] Migration handles both new deployments and upgrades from previous version
- [ ] For large tables: uses `CREATE INDEX CONCURRENTLY` (not blocking)
- [ ] For column renames: considers a two-phase approach (add new, migrate, drop old) if table is large

**Common mistake:** Schema change in code but migration file not committed — works locally (auto-push), breaks in production.

### Check 3: Indexes

- [ ] Columns used in WHERE clauses have indexes (especially auth-path columns)
- [ ] Columns used in JOIN conditions have indexes
- [ ] Unique constraints exist where business logic requires uniqueness
- [ ] Composite indexes ordered by selectivity (most selective column first)
- [ ] No duplicate indexes (check for overlapping index definitions)

**High-priority columns to index:**
- Token hashes (looked up on every authenticated request)
- Email addresses (looked up on login, invite, uniqueness check)
- Foreign key columns (joined on every related query)
- Slug/identifier columns (looked up by URL params)
- Status columns used in filtered queries

### Check 4: Nullable Columns and Constraints

- [ ] New nullable columns have a clear reason for being nullable
- [ ] Mutually exclusive columns have a CHECK constraint (e.g., user has businessId OR mspId, not both)
- [ ] Enum columns use database-level enum types (not unconstrained strings)
- [ ] Enum changes are additive (never rename or remove values in a running system)
- [ ] Default values set where appropriate

### Check 5: Data Safety

- [ ] Destructive changes (DROP COLUMN, DROP TABLE) are intentional and data is backed up or migrated
- [ ] Column type changes won't lose precision (e.g., int → smallint, varchar(255) → varchar(50))
- [ ] NOT NULL additions on existing columns have a backfill strategy
- [ ] No breaking changes to columns referenced by application code

### Check 6: Cascading Impact

- [ ] Application code updated for new/changed columns
- [ ] Queries updated for renamed columns
- [ ] API responses updated (no stale field names)
- [ ] Seed data updated for new required columns
- [ ] Related ORM model/type definitions updated

## Output Format

```
## Schema Change Review

**Files changed:**
- src/lib/db/schema.ts (3 tables modified)
- drizzle/migrations/0015_xxx.sql (new)

### Table: users
| Check | Status | Detail |
|-------|--------|--------|
| FK constraints | PASS | All FKs have ON DELETE |
| Migration | PASS | 0015 committed |
| Indexes | WARN | New `mspId` column missing index |
| Nullable | PASS | CHECK constraint on businessId/mspId |
| Data safety | PASS | Additive change only |

### Issues Found:
1. [HIGH] `users.mspId` needs an index — will be used in WHERE clauses for MSP staff queries
2. [MEDIUM] Migration should use CONCURRENTLY for index on large table

### Suggested Migration Addition:
[Concrete SQL]
```

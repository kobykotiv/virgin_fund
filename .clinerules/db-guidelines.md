## Brief overview
- Project-specific database and migration guidelines for the virgin_fund repo.
- Purpose: ensure schema changes are auditable, safe to apply, and testable across environments (dev / staging / prod).

## Schema & migrations
- Place SQL migration files under `supabase/migrations/` with a timestamped filename and a short descriptive summary (e.g., `20250822_add_api_keys_table.sql`).
- Each migration must include a short comment at the top describing intent and rollback considerations where applicable.
- Prefer additive changes (new tables, columns) over destructive ones; when destructive changes are required, create a phased migration plan.
- Example filename pattern: `YYYYMMDD_HHMMSS__brief-summary.sql`.

## Migration workflow & approvals
- Do not run migrations on production without explicit approval and access credentials.
- Provide the exact SQL and step-by-step instructions for running migrations in staging and prod as part of the PR description.
- Include any required index creation or data backfills in the same migration or in a follow-up migration with a clear comment explaining ordering and downtime expectations.

## Table & column conventions
- Use clear, descriptive names (snake_case) for tables and columns.
- Timestamps: use `created_at timestamptz default now()` and `updated_at timestamptz default now()` where appropriate.
- Use explicit constraints (foreign keys, not null, unique) and CHECK constraints for small domain constraints (e.g., enum-like text checks).
- Add indexes for foreign keys and common query predicates; name indexes with a clear prefix (e.g., `idx_<table>_<column>`).

## Indexing & performance
- Add indexes based on observed query patterns, not preemptively.
- For high-write tables, consider partial or covering indexes to reduce overhead.
- Document reasoning for non-obvious indexes in migration comments or PR description.

## Access control & secrets
- Keep DB credentials and Superuser/service-role keys out of the repo.
- Use environment variables for connection strings and admin keys (e.g., SUPABASE_SERVICE_ROLE_KEY).
- For admin operations (revokes, token rotations), gate logic behind explicit env vars and treat admin API calls as best-effort.

## Testing & CI
- Unit test DB-dependent logic with mocks or ephemeral in-memory fixtures where possible.
- For integration tests touching the DB, use a dedicated test database and gate these tests behind CI flags or run in a separate job.
- Include simple verification SQL in staging runs (e.g., column exists, expected index present) as part of deploy checks.

## Backfills & data migrations
- When doing data migrations/backfills:
  - Break large backfills into chunked jobs to avoid long locks.
  - Add a migration comment describing duration expectations and any maintenance windows.
  - Prefer background jobs that update rows incrementally if downtime must be avoided.

## Trigger cases
- Adding a user-facing feature that requires new columns: add migration + default values and a small follow-up migration to remove defaults if needed.
- Renaming a column: create a new column, backfill data, update application code to write both, then remove old column in a later migration.
- Removing a column with dependent data: document rationale, back up data if needed, and provide an audit SQL snippet in the PR.

## Communication & PR expectations
- Every PR that changes DB schema must include:
  - Files modified (migration files)
  - Rationale for schema change
  - Any required env vars or runtime flags
  - Rollback instructions or mitigation steps
- Add a short "Summary of Changes" entry to PROGRESS.md or TASKS.md for visibility.

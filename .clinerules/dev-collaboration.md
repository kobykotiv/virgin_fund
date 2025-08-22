## Brief overview
  - Project-specific collaboration and development rules for the "virgin_fund" repo.
  - Purpose: ensure changes follow the project's tech choices (Bun, Next.js, TypeScript, Tailwind, Supabase), keep edits safe for the codebase, and make collaboration predictable and testable.

## Communication style
  - Keep messages concise, technical, and action-oriented.
  - When requesting a change, specify exact file(s), the intended behavior, and whether automated installs/commands are permitted.
  - When a tool run (install/migration/test) may mutate the environment, request explicit approval first.

## Package manager & tooling
  - Always use Bun for installs and scripts (e.g., `bun install`, `bun add`, `bun run`).
  - Do not use npm, pnpm, or yarn unless the user explicitly authorizes it.
  - When proposing dependency changes, list the package, version, and the reason (compatibility, security, tests).

## Tech stack & coding conventions
  - Language: TypeScript only for new code. Prefer strict typing and explicit return types on exported functions.
  - Frameworks: Next.js (app dir), React, Tailwind CSS for styling.
  - UI libs: shadcn/ui or Radix UI when component libraries are needed.
  - State: React hooks / Context API. Avoid Redux unless explicitly requested.
  - Keep components modular and accessible; favor small focused hooks for data fetching.

## Auth, sessions & security
  - Use Supabase for backend/auth where requested; keep service-role keys server-side only.
  - Implement secure HTTPOONLY cookies for sessions (cookie name: `vf_session`) with SameSite=Strict and Secure in production.
  - Use environment variables for all secrets; never expose keys in client code or checked-in files.
  - For encryption helpers (e.g., AES-256-GCM), expect a single, respected lib/crypto.ts entrypoint and document required env keys.

## Database migrations & schema work
  - Create explicit SQL migration files under `supabase/migrations/` with clear timestamps and descriptive filenames.
  - Do not run migrations without the user's approval or explicit access credentials. Provide the SQL and instructions for running it in staging.
  - Add indexes only when justified by query patterns; include the rationale in migration comments or PR description.

## Testing & CI
  - Use Vitest for unit tests; be prepared to adjust vitest/vite versions to resolve ESM/CJS interop issues.
  - When tests require new dev dependencies (types or libraries), request permission to install via Bun before changing package.json.
  - Mock external services (Supabase admin client, external APIs) in server-side tests to avoid running live network calls in CI.

## File edits and automation rules
  - Prefer targeted edits using replace-in-file style operations for minimal risk. Use full-file writes only when creating new files or when a full overwrite is explicitly necessary.
  - When editing files programmatically, include a concise "Summary of Changes" at the end of modified files or in the PR description.
  - If a tooling action might auto-format files (prettier, TS formatter), note that and base subsequent replace/search blocks on the post-formatted content.

## Progress reporting & task management
  - Maintain a concise TASKS.md or PROGRESS.md with checklist-style progress updates after major iterations.
  - After any multi-file change, add a short "Summary of Changes" and the next planned step in PROGRESS.md.

## When uncertain or blocked
  - Ask a single clear question that lists the options and the recommended choice.
  - For environment-specific failures (e.g., ESM errors in vitest), document the exact error text, versions tried, and propose 2 concrete remediation steps (upgrade, config tweak, or run-locally instruction).

## Other guidelines
  - Avoid making broad architectural changes without a short design note and the user's explicit approval.
  - Do not overwrite existing .clinerules files; add new concise rule files when needed.
  - Keep new rule files short and focused; prefer one main topic per file.

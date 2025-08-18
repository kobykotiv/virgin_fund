# Release cycles: Alpha → Beta → MVP → Production

Purpose
- Define clear goals, gates, and checklists for progressing from an internal demo to a hardened production release.

Stages and goals
- Alpha (internal): demo data replaced by realistic mocked data; core flows (auth, bots CRUD, backtest, paper trading) verified by devs.
- Beta (limited external): invited testers, paper trading stable, metrics & alerts configured, CI enforced for merges.
- MVP (public): optionally allow live trading behind strict gates, full test coverage and backup/rollback tested.
- Production release: versioned, audited, SLOs and monitoring, routine security scans and compliance checks.

Branching & workflow
- Trunk-based: `main` (prod), `develop` (integration), short-lived `feature/*` branches.
- PR policy: every PR must have at least one approver, pass CI, and include migration files if DB changes.
- Release branches: create `release/x.y.z` from `develop` when preparing a release candidate.

CI gates
- Required checks on PRs: lint, typecheck, unit tests, minimal integration tests, build.
- Merge blocks if tests fail or if migrations are unreviewed.
- Use preview deployments (Vercel) for visual verification.

DB migrations
- Keep SQL migrations idempotent where possible; add reverse migration when non-destructive rollback is feasible.
- Run migrations on staging and verify with smoke tests before applying to production.
- Snapshot and backup production DB before any prod migration.

Feature flags & gradual rollout
- Protect risky features (live trading) behind feature flags and role checks.
- Use staged enablement: internal -> beta cohorts -> full rollout.
- Keep kill-switches and quick rollback paths ready.

Release checklist (per stage)
- Alpha
  - Auth integrated and scoped per user
  - Mock/paper adapter implemented and defaulted
  - Unit tests for core logic
  - Runbook drafted for deploys
- Beta
  - Monitoring + Sentry configured
  - Scheduled run-bots deployed and validated
  - E2E smoke tests added and passing
  - Onboarding flow documented for testers
- MVP
  - Backup & restore tested
  - Security review & dependency audit passed
  - Live-trading gating and idempotency verified

Rollout & rollback
- Deploy to staging; run automated smoke tests and manual sanity checks.
- Promote to prod only after monitoring shows healthy metrics in staging for at least one window.
- Rollback: revert to previous tag, or disable feature flag and run compensating migration if needed.

Post-release
- Monitor error rates and latency closely for 24–72 hours.
- Create release notes and changelog; tag the release and increment semantic version.

Operational responsibilities
- Assign release owner for each release (executes deploy, monitors, and coordinates rollback if needed).
- Keep contact list and escalation matrix within the `ops/runbook.md` file.

Automation priorities
- Automate tests, builds, deploys, DB migrations and scheduled jobs.
- Use IaC (Terraform/CloudFormation) for infra when moving beyond small staging setups.

Security & compliance
- Never store service-role secrets in client code; use secret stores and server-only code paths.
- Rotate keys regularly and store least-privileged secrets for runtime.

This document is a lightweight, actionable guide. Add environment-specific details (project refs, deploy scripts, healthcheck endpoints) to `ops/runbook.md`.

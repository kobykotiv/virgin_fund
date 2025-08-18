# From Alpha to MVP — Tactical Plan

This document outlines a pragmatic step-by-step plan to progress from an internal alpha to a public MVP for the trading web app.

Phase 0 — Pre-Alpha (current)
- Demo frontend exists; basic components and mock data working.
- Goals: consolidate structure, add migrations, and create a safety-first runtime config.

Phase 1 — Alpha (internal)
- Implement server-side adapters and persist data flows (bots, backtests, orders) to Supabase.
- Deploy `run-bots` Edge Function to staging and exercise with mock orders.
- Create minimal CI pipeline with lint, typecheck, and unit tests.
- Provide onboarding docs for internal testers.

Phase 2 — Beta (invite-only)
- Stabilize paper trading, audit order handling paths, create alerting for failures.
- Add scheduled job and runbook; begin load testing on staging.
- Build onboarding flow and disable `live` trading by default.

Phase 3 — MVP
- Implement audit logging, payment (if applicable), compliance checks.
- Finalize feature flags for live trading gating, enable rotation of API keys and secret management.
- Harden monitoring, define SLOs, and test backup/restore.

Deliverables per phase
- Alpha: running staging deploy, run-bots deployed, dev runbook, basic CI.
- Beta: stable paper trading, user onboarding, Sentry+metrics, scheduled jobs running.
- MVP: production deployment possibility, reviewed security, rollback plan.

Decision gates
- Move forward only when critical metrics are green: error rate < 1%, critical flows pass regression tests, and manual review completed.

Timeline guidance (example)
- Alpha: 2–4 weeks (depending on team size)
- Beta: 4–8 weeks
- MVP: 4–12 weeks

Appendix: risk matrix
- Live trading without monitoring: high risk — keep disabled until fully audited.
- Database migrations without backups: high risk — always snapshot before prod migration.

This is a tactical list. Adapt timelines and priority to your team and risk tolerance.

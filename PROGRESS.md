# Type-Check Error Triage (2025-08-21)

## Top 10 Failing Files (by error count)
1. components/enhanced-dashboard.tsx
2. types/portfolio.ts
3. services/backtest-service.ts
4. services/bot-strategy-executor.ts
5. lib/demo-portfolios.ts
6. app/portfolio/[id]/page.tsx
7. components/animated-background.tsx
8. components/dashboard.tsx
9. components/dashboard/analytics-tab.tsx
10. lib/utils/portfolio-generator.ts

## Next Steps
- Prioritize fixes in these files to reduce the majority of type-check errors.
- Address missing modules, type mismatches, and implicit anys as encountered.

**Summary of Changes:**  
Documented the top 10 files with the most type-check errors for focused triage and resolution.

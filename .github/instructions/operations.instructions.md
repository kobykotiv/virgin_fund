---
applyTo: '**/*.ts'
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

1. **Project Structure**: Understand the overall structure of the project, including key directories and files.
2. **Coding Standards**: Follow established coding standards and best practices for TypeScript and Node.js.
3. **Error Handling**: Implement robust error handling and input validation throughout the codebase.
4. **Testing**: Write unit tests for new features and ensure existing tests pass before submitting changes.
5. **Documentation**: Update API documentation and inline comments to reflect code changes.
6. **Performance**: Consider performance implications of code changes and optimize where necessary.

Self-Hosting Instructions: Virgin Fund Personal Finance App
Prerequisites
Node.js (v18+ recommended)
npm or yarn
Git

Optional: Docker (for containerized deployment)
1. Clone the Repository
2. Install Dependencies
3. Configure Environment Variables
Copy .env.example to .env and fill in any required values (API keys, database URLs, etc).

4. Run Database Migrations (if applicable)
If the app uses a database, run migrations:

5. Start the App
Visit http://localhost:3000 in your browser.

6. Build for Production
7. Docker Deployment (Optional)
Build and run with Docker:

8. Customization
Edit /config/sections.ts to customize dashboard sections.
Update theme and branding in components and public.
9. Security & Updates
Keep dependencies up to date.
Secure your environment variables.
Use HTTPS in production.
10. Support
For issues or feature requests, open an issue on GitHub or contact the maintainer.

# Virgin Fund Personal Finance App Setup Instructions

---

## Progress Report Template

### Section: [SECTION NAME]
**Status**: [X% complete] [🟢 / 🟡 / 🔴]

#### Completed:
- [List of implemented features]

#### In Progress:
- [Current development tasks with expected completion dates]

#### Pending / Not Started:
- [Features or tasks not yet started]

#### Blockers / Risks:
- [Technical or business risks, dependencies, or integration challenges]

#### Next Steps:
- [Immediate priorities for the next sprint or dev cycle]

#### Notes:
- [Additional comments or context from developers]

---

### Example Output

#### Section: Backtest Module
**Status**: 65% complete 🟡

#### Completed:
- Core backtesting engine implemented
- Historical market data ingestion working
- Basic P&L and drawdown calculations ready

#### In Progress:
- UI chart integration with TradingView API (ETA: Aug 15)
- Parameter optimization UI form

#### Pending / Not Started:
- Multi-strategy comparison view
- Monte Carlo simulation integration

#### Blockers:
- Waiting on API rate limit increase from provider
- Data format changes in Alpaca sandbox

#### Next Steps:
- Complete TradingView chart embedding
- Write unit tests for strategy comparison

#### Notes:
- UI animations are being deferred to post-MVP for performance reasons


---

Iteration 1: Scaffold Core Structure
Set up React Router v6 with a shared DashboardLayout (sidebar + header).
Create /config/sections.ts with all section metadata (labels, routes, icons, categories).
Scaffold all pages under pages with placeholder headers and basic form controls.
Implement sidebar navigation using the config file, grouped by category.
Add TailwindCSS and enable dark mode support.
Iteration 2: Add Placeholder Content
Add stub charts/tables to each page using Recharts.
Create basic input forms for calculator pages.
Scaffold reusable UI components (e.g., Card, Form, ChartWrapper) under components.
Create hooks folder under each page for future logic (e.g., useSavingsCalculator, useBacktestMockData).
Iteration 3: Enhance Navigation & Layout
Polish sidebar and header UI.
Add active route highlighting.
Add responsive design for mobile/tablet.
Add logo and branding to header/sidebar.
Iteration 4: Calculator Logic & Data Hooks
Implement calculation logic for Savings, Compound Interest, Inflation, Retirement, Mortgage, Debt Payoff, Fee Impact.
Add mock data hooks for Backtest, Monte Carlo, Alpaca Manager, Virgin Fund overview.
Display calculation results in tables/charts.
Iteration 5: Polish & Prepare for Release
Refine UI/UX, add tooltips and help text.
Add error handling and validation to forms.
Test dark mode and accessibility.
Update README and self-hosting instructions.

Context:
We are building and maintaining a full-stack finance/trading web app with these modules:

Overview dashboard

Custom Signals & Signal Builder

Backtesting tools

Savings & Financial Calculators

Portfolio & Performance tracking

Trading Calculators (Risk/Reward, Position Size, etc.)

Monte Carlo simulations

Bot management & API integration (e.g., Alpaca Markets)

Market Data feeds (live & simulated)

User authentication & subscription plans

The app supports Free (demo mode) and Paid (live trading) environments.

DevOps Scope:
The task relates to [CI/CD | Deployment | Monitoring | Scaling | Security | Configuration].

Requirements:

Environment(s):

Local (developer machines)

Staging (QA & testing)

Production (live customers)

Infrastructure Stack:

Frontend: React + TailwindCSS + Vite

Backend: Bun.js / Node.js API

Database: PostgreSQL (Supabase)

Hosting: Docker containers (Cloud provider: AWS / GCP / Azure / Render)

CI/CD: GitHub Actions or equivalent

Monitoring: Grafana + Prometheus / NewRelic

Secrets Management: AES encryption + environment variables in secure vault

Steps to Include in the Plan:

Infrastructure provisioning (e.g., Terraform, Pulumi)

Build & test automation

Docker image creation & versioning

Deployment pipeline setup (blue-green or rolling)

Database migrations

Environment variable injection & secrets management

Performance monitoring & alerts

Auto-scaling rules

Disaster recovery plan & backups

Security & Compliance:

HTTPS / TLS setup

API key management & rotation

Role-based access control

Audit logging

Deliverable Format:
Output should be a step-by-step implementation guide with:

Commands/scripts for automation

YAML/JSON configs for pipelines

Environment-specific notes

Security considerations
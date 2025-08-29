---
applyTo: '**/*.ts'
---

# Virgin Fund - PaaS Operations Guidelines

## Platform as a Service Operations

### Core Principles
1. **Platform Reliability**: 99.9% uptime for trading platform
2. **Data Integrity**: Financial data accuracy and consistency
3. **Security First**: Enterprise-grade security for financial platform
4. **Scalability**: Handle thousands of concurrent trading sessions
5. **Real-time Performance**: Sub-second response times for market data

### Platform Architecture Overview
- **Frontend**: Next.js 15 PaaS application
- **Backend**: Supabase BaaS infrastructure
- **Trading Engine**: Alpaca Markets integration
- **Real-time**: WebSocket connections for live data
- **Caching**: Redis for market data, Supabase for user data

### Service Dependencies
- **Supabase**: Primary database and API layer
- **Alpaca Markets**: Trading execution and market data
- **Vercel/Netlify**: Frontend hosting and CDN
- **Redis**: High-performance caching layer
- **Monitoring**: Application and infrastructure monitoring

## Platform Deployment Strategy

### Environment Architecture
```
Production Environment:
├── Frontend (Vercel) - Global CDN
├── Supabase Production - Multi-region PostgreSQL
├── Redis Production - Managed caching
└── Monitoring - Real-time alerts

Staging Environment:
├── Frontend (Vercel Preview) - Feature testing
├── Supabase Staging - Isolated database
├── Redis Staging - Development caching
└── Monitoring - Test alerts

Development Environment:
├── Local Next.js - Hot reload development
├── Supabase Local - Docker development
├── Redis Local - Local caching
└── Testing - Unit and integration tests
```

### Deployment Pipeline
1. **Code Quality Gates**
   - TypeScript compilation
   - Unit test coverage (>90%)
   - Integration tests pass
   - Security vulnerability scan
   - Performance benchmarks met

2. **Staging Deployment**
   - Automated deployment to staging
   - End-to-end testing in staging
   - User acceptance testing
   - Performance testing

3. **Production Deployment**
   - Blue-green deployment strategy
   - Gradual rollout (10% → 50% → 100%)
   - Real-time monitoring
   - Rollback plan ready

### Platform Monitoring

#### Key Metrics
- **Platform Availability**: 99.9% uptime SLA
- **API Response Times**: <200ms for critical endpoints
- **Real-time Latency**: <100ms for market data updates
- **Error Rate**: <0.1% for platform operations
- **User Session Success**: >99% successful logins

#### Monitoring Tools
- **Application Monitoring**: Sentry for error tracking
- **Infrastructure Monitoring**: DataDog/New Relic
- **Database Monitoring**: Supabase dashboard + custom queries
- **Real-time Monitoring**: Custom WebSocket health checks
- **Business Metrics**: Trading volume, user engagement

### Incident Response

#### Severity Levels
- **P0 - Critical**: Platform down, trading halted
- **P1 - High**: Major feature broken, data inconsistency
- **P2 - Medium**: Minor feature issues, performance degradation
- **P3 - Low**: Cosmetic issues, minor bugs

#### Response Times
- **P0**: <15 minutes to acknowledge, <2 hours to resolve
- **P1**: <30 minutes to acknowledge, <4 hours to resolve
- **P2**: <2 hours to acknowledge, <24 hours to resolve
- **P3**: <24 hours to acknowledge, <1 week to resolve

### Platform Scaling Strategy

#### Horizontal Scaling
- **Frontend**: Vercel automatic scaling
- **Database**: Supabase connection pooling
- **Cache**: Redis cluster scaling
- **API**: Serverless function scaling

#### Performance Optimization
- **Database Queries**: Query optimization and indexing
- **Caching Strategy**: Multi-layer caching (CDN → Redis → Database)
- **Asset Optimization**: Code splitting and lazy loading
- **Real-time Optimization**: WebSocket connection pooling

### Security Operations

#### Platform Security
- **Authentication**: Supabase Auth with MFA
- **Authorization**: Row Level Security (RLS) policies
- **API Security**: Rate limiting and request validation
- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logging**: Comprehensive audit trails

#### Compliance Requirements
- **Financial Regulations**: SEC compliance for trading platform
- **Data Privacy**: GDPR/CCPA compliance
- **Security Standards**: SOC 2 Type II certification
- **Penetration Testing**: Quarterly security assessments

### Backup and Recovery

#### Data Backup Strategy
- **Database Backups**: Daily automated backups with Supabase
- **User Data**: Encrypted backups with 30-day retention
- **Configuration**: Infrastructure as Code backups
- **Disaster Recovery**: Multi-region failover capability

#### Recovery Procedures
- **RTO (Recovery Time Objective)**: <4 hours for critical systems
- **RPO (Recovery Point Objective)**: <1 hour data loss tolerance
- **Failover Testing**: Monthly DR drills
- **Business Continuity**: 24/7 incident response team

### Platform Maintenance

#### Regular Maintenance
- **Database Maintenance**: Weekly optimization and cleanup
- **Security Updates**: Weekly dependency updates
- **Performance Tuning**: Monthly performance reviews
- **Infrastructure Updates**: Quarterly infrastructure upgrades

#### Change Management
- **Change Approval**: All production changes require approval
- **Rollback Plan**: Every deployment has automated rollback
- **Testing Requirements**: All changes require comprehensive testing
- **Documentation**: All changes documented and versioned

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

## Authentication & Authorization
- Implement OAuth2 for user authentication
- Use JWTs for session management
- Enforce role-based access control (RBAC) for sensitive actions

Got it — I’ll go through **all 30+ sectional prompts** we discussed earlier and map them out for your app so each one is a **ready-to-use generation prompt** for code, UI, and backend.

I’ll structure them so you can **copy-paste into Gemini / Copilot / Cline** for instant output.
We’ll cover **all core features** of your POD + dashboard app, plus extra analytics and backtesting parts you added.

---

## **📦 1. Designs Section Prompt**

```
You are generating a React + Tailwind + TypeScript frontend section called "Designs" for a Print-on-Demand dashboard.  
Features:
- Table listing designs with columns: Thumbnail, Title, Status, Created Date, Actions
- Actions: View, Edit, Duplicate, Delete
- Modal form for uploading a new design with drag-and-drop file input
- React Query hooks for fetching designs from `/api/designs`
- Search + filter by status
- Pagination + loading state
Backend Requirements:
- GET `/api/designs` (paginated, searchable)
- POST `/api/designs` (multipart form data)
- PATCH `/api/designs/:id`
- DELETE `/api/designs/:id`
Include:
- Responsive layout
- Dark mode support
```

---

## **📦 2. Templates Section Prompt**

```
Generate a "Templates" dashboard section with:
- Card grid of templates showing name, description, # of blueprints, last updated
- Button to create a new template
- Modal with form: Template Name, Description, Tags
- Inline editing for template name
- React Query hooks to `/api/templates`
- Filters: By tag, By product type
Backend:
- CRUD `/api/templates`
- Relationship: Template → Blueprints
```

---

## **📦 3. Blueprints Section Prompt**

```
Create a "Blueprints" management view:
- Table with columns: ID, Name, Provider, Variants, Placements, Actions
- Button: Import blueprint from provider API
- Modal: Provider selection (Printify, Printful, etc.)
- React Query to fetch `/api/blueprints`
Backend:
- GET `/api/blueprints`
- POST `/api/blueprints/import` (calls provider API)
```

---

## **📦 4. Variants Section Prompt**

```
Generate "Variants" table with:
- Columns: SKU, Size, Color, Price, Stock, Actions
- Inline edit price
- Bulk price update modal
- React Query from `/api/variants`
Backend:
- GET `/api/variants`
- PATCH `/api/variants/:id`
- Bulk PATCH `/api/variants`
```

---

## **📦 5. Placements Section Prompt**

```
Create "Placements" editor:
- List of product mockups with placement zones
- Upload design to placement zone
- Live preview (using Canvas or Fabric.js)
Backend:
- GET `/api/placements`
- POST `/api/placements/:id/upload`
```

---

## **📦 6. Collections Section Prompt**

```
Generate "Collections" management view:
- Table: Name, # of Templates, Status, Actions
- Modal: Create/Edit collection
- Assign templates to collections
Backend:
- CRUD `/api/collections`
- POST `/api/collections/:id/assign`
```

---

## **📦 7. Shops Section Prompt**

```
"Shops" dashboard:
- Card list: Shop Name, Platform, Status, Sync Date
- Button: Connect New Shop
- Modal: OAuth or API Key input
Backend:
- GET `/api/shops`
- POST `/api/shops/connect`
- PATCH `/api/shops/:id`
```

---

## **📦 8. Suppliers Section Prompt**

```
Suppliers management:
- Table: Name, Location, Products Available, Rating
- Modal: Add Supplier
- Search/filter
Backend:
- CRUD `/api/suppliers`
```

---

## **📦 9. API Keys Section Prompt**

```
API Keys UI:
- List: Key Name, Provider, Status, Created Date
- Button: Add API Key
- Modal: Provider dropdown, Key input, Test Key button
Backend:
- CRUD `/api/api-keys`
- POST `/api/api-keys/test`
```

---

## **📦 10. Image Sync Section Prompt**

```
Image Sync page:
- List of recent syncs: Status, # Images, Date
- Button: Trigger Manual Sync
Backend:
- GET `/api/image-sync`
- POST `/api/image-sync/trigger`
```

---

## **📦 11. Logs Section Prompt**

```
Logs view:
- Table: Timestamp, Level, Message, Context
- Filter by level (info, warning, error)
Backend:
- GET `/api/logs`
```

---

## **📦 12. Sync Activity Section Prompt**

```
Sync Activity UI:
- Timeline of sync events
- Filters by provider
Backend:
- GET `/api/sync-activity`
```

---

## **📦 13. Account Settings Prompt**

```
Account Settings:
- Tabs: Profile, Password, Billing
- Profile form
- Password change form
- Billing info from Stripe API
Backend:
- GET/POST `/api/account`
```

---

## **📦 14. Dashboard Overview Prompt**

```
Overview:
- Stats cards: Total Products, Total Sales, Active Shops
- Chart: Sales over time
Backend:
- GET `/api/overview`
```

---

## **📦 15. Strategy Backtesting Section Prompt**

```
Strategy Backtesting:
- Form: Asset, Date Range, Parameters
- Run backtest button
- Results: Summary, Equity Curve chart, Trade Table
Backend:
- POST `/api/backtest/run`
- GET `/api/backtest/:id`
```

---

## **📦 16. Backtest History Prompt**

```
Backtest History:
- Table of previous runs
Backend:
- GET `/api/backtest`
```

---

## **📦 17. Backtest Results Export Prompt**

```
Export Results:
- Buttons: Export CSV, Export PDF
Backend:
- GET `/api/backtest/:id/export?format=csv`
```

---

## **📦 18. Custom Signals Prompt**

```
Custom Signals:
- Table: Name, Trigger Conditions
- Modal: Create Signal (conditions builder)
Backend:
- CRUD `/api/signals`
```

---

## **📦 19. Signal Builder Prompt**

```
Signal Builder:
- Drag/drop condition blocks
- Save as custom signal
Backend:
- POST `/api/signals`
```

---

## **📦 20. Savings Calculator Prompt**

```
Savings Calculator:
- Form: Initial, Monthly, Rate, Years
- Chart output
Backend:
- POST `/api/calculators/savings`
```

---

## **📦 21. Compound Interest Calculator Prompt**

```
Compound Interest Calculator:
- Form: P, r, n, t
Backend:
- POST `/api/calculators/compound`
```

---

## **📦 22. Inflation Calculator Prompt**

```
Inflation Calculator:
- Form: Amount, Rate, Years
Backend:
- POST `/api/calculators/inflation`
```

---

## **📦 23. Retirement Calculator Prompt**

```
Retirement Calculator:
- Form: Target, Current Savings, Years, Return Rate
Backend:
- POST `/api/calculators/retirement`
```

---

## **📦 24. Portfolio Section Prompt**

```
Portfolio:
- Table of holdings
- Charts: Asset allocation
Backend:
- GET `/api/portfolio`
```

---

## **📦 25. Financial Calculators Prompt**

```
List of all calculators in tabs
```

---

## **📦 26. Risk/Reward Calculator Prompt**

```
Risk/Reward:
- Form: Entry, Stop, Target
Backend:
- POST `/api/calculators/risk-reward`
```

---

## **📦 27. Position Size Calculator Prompt**

```
Position Size:
- Form: Account Size, Risk %, Stop Size
Backend:
- POST `/api/calculators/position-size`
```

---

## **📦 28. Leverage Calculator Prompt**

```
Leverage:
- Form: Capital, Exposure
Backend:
- POST `/api/calculators/leverage`
```

---

## **📦 29. Pivot Points Calculator Prompt**

```
Pivot Points:
- Form: High, Low, Close
Backend:
- POST `/api/calculators/pivot-points`
```

---

## **📦 30. Options Greeks Calculator Prompt**

```
Options Greeks:
- Form: S, K, r, t, sigma, type
Backend:
- POST `/api/calculators/options-greeks`
```

---

If you want, I can now make a **master combined "section generator" prompt** so you can generate **any one of these** instantly by replacing a single variable like `{section_name}`.
That would let you avoid 30 copy-pastes.

Do you want me to do that next?

# GitHub Copilot Instructions for Virgin Fund Project

## Purpose
These instructions ensure consistent, repeatable code generation for the Virgin Fund self-hosted financial dashboard app.

## General Guidelines

# Copilot Instructions: Virgin Fund Financial Dashboard

## Architecture Overview
- **Monorepo structure**: Main app in `/app` and `/pages`, API routes in `/pages/api`, UI in `/components`, backend logic in `/server`, and utilities in `/lib` or `/utils`.
- **Data flow**: Frontend (React/Next.js) interacts with backend API routes and `/server` modules. Supabase is used for database and authentication. Alpaca API is integrated for trading and market data.
- **Demo mode**: Demo accounts and bots are flagged with `isDemoAccount: true` and use isolated data. Demo scenarios are modular and stored in `/demo`.
- **Portfolio previews**: Use interactive charts, allocation breakdowns, and sentiment/risk indicators.

## Developer Workflows
- **Build**: Use `bun dev` for local development. Production builds use Bun and Next.js commands.
- **Test**: Unit tests for critical logic, especially demo scenarios and authentication. Use Bun or Jest for running tests.
- **Debug**: Log errors to console. Use toast notifications for user feedback. Demo and live modes must be clearly separated in UI and logic.
- **Auth**: Register, login, logout, and demo user creation via `/pages/api` endpoints. Supabase Auth is the backend for all user management.

## Project Conventions & Patterns
- **TypeScript everywhere**: All modules, components, and API routes use TypeScript. Exported functions/interfaces must be documented.
- **Functional React**: Prefer hooks and functional components. Use modular, reusable UI components.
- **Config-driven navigation**: Sidebar and dashboard navigation generated from `/config/sections.ts`.
- **Environment variables**: All secrets (API keys, DB URLs) must be loaded from `.env` files.
- **Error handling**: Always provide user feedback and log errors. Use toast notifications for UI errors.
- **Demo scenarios**: Modular, extensible, and stored in localStorage. Use builder pattern for demo bots.

## Integration Points
- **Supabase**: Used for database, authentication, and user/session management. See `/server/supabaseClient.ts` and `/pages/api/*`.
- **Alpaca API**: Used for trading, market data, and bot execution. See `/server/alpaca.ts`.
- **Bot management**: CRUD operations via `/server/bots.ts` and Supabase tables. Bots are managed in frontend and backend.
- **Financial calculators**: Modular hooks and UI components in `/components/calculators` and `/hooks/calculators`.

## Key Files & Directories
- `/app`, `/pages`: Main app and API routes.
- `/components`: UI components (DashboardLayout, calculators, charts, etc.).
- `/server`: Backend logic (Supabase, Alpaca, bots).
- `/config/sections.ts`: Navigation and dashboard config.
- `/demo`: Demo scenarios and bot builder logic.

## Example Patterns
- **Demo bot creation**:
  ```ts
  // demo/botBuilder.ts
  export function createDemoBot(scenario, config) {
    return { ...config, isDemoAccount: true };
  }
  ```
- **Portfolio preview**:
  ```tsx
  // demo/components/PortfolioPreview.tsx
  <Chart data={data.performance} />
  <AllocationBreakdown allocations={data.allocations} />
  ```
- **API route (register)**:
  ```ts
  // pages/api/register.ts
  export default async function handler(req, res) {
    // Supabase signUp logic
  }
  ```

## Security & Extensibility
- All authentication and trading logic must be secure and robust.
- Demo mode must never affect real user accounts or funds.
- Modular code for easy addition of new scenarios, calculators, and portfolio types.

## Documentation & Testing
- Document all exported functions, interfaces, and components.
- Write unit tests for demo bot creation, scenario selection, and portfolio preview logic.
- Update this file as project requirements evolve.
# Goals
- Ensure a seamless user experience across all devices.
- Provide comprehensive documentation for developers and users.
- Maintain high code quality and test coverage.
- Facilitate easy addition of new features and demo scenarios.
- Ensure security best practices are followed throughout the codebase.

# Demo Bot Implementation Guide
## Demo Bot Implementation Guide

### Overview
Demo bots allow users to explore trading strategies and portfolio management features without risking real funds. Demo mode must be clearly separated from live accounts and flagged with `isDemoAccount: true`.

### Key Requirements
- Demo bots must use isolated data and not affect real user accounts.
- All demo scenarios should be modular and extensible.
- Demo scenario selection and state should be stored in localStorage.
- Demo bots must support portfolio previews with interactive charts, allocation breakdowns, sentiment, and risk indicators.

### Implementation Steps

1. **Demo Account Flagging**
    - Use an interface property `isDemoAccount: true` for all demo accounts and bots.
    - Ensure backend and frontend logic checks this flag before performing any sensitive actions.

2. **Scenario Selection**
    - Store the selected demo scenario in localStorage.
    - Provide a UI for users to choose from available demo scenarios.
    - Use modular scenario definitions for easy extension.

    ```ts
    // demo/types.ts
    export interface DemoScenario {
      id: string;
      name: string;
      description: string;
      config: object;
    }
    ```

3. **Demo Bot Creation**
    - Use a builder pattern for demo bot creation to allow flexible configuration.
    - Example:

    ```ts
    // demo/botBuilder.ts
    import { DemoScenario } from "./types";

    export interface DemoBotConfig {
      namePrefix: string;
      strategy: string;
      strategyConfig: object;
      customSettings?: object;
    }

    export function createDemoBot(scenario: DemoScenario, config: DemoBotConfig) {
      return {
         name: `${config.namePrefix} ${scenario.name} Bot`,
         strategy: config.strategy,
         strategyConfig: config.strategyConfig,
         customSettings: config.customSettings,
         isDemoAccount: true,
      };
    }
    ```

4. **Portfolio Preview**
    - Implement interactive charts and allocation breakdowns using reusable components.
    - Include sentiment and risk indicators in the preview.

    ```tsx
    // demo/components/PortfolioPreview.tsx
    import React from "react";
    import { PortfolioData } from "../types";
    import { Chart, AllocationBreakdown, SentimentIndicator, RiskIndicator } from "@/components/ui";

    export function PortfolioPreview({ data }: { data: PortfolioData }) {
      return (
         <div>
            <Chart data={data.performance} />
            <AllocationBreakdown allocations={data.allocations} />
            <SentimentIndicator sentiment={data.sentiment} />
            <RiskIndicator risk={data.risk} />
         </div>
      );
    }
    ```

5. **Error Handling**
    - All demo bot logic should handle errors gracefully and provide user feedback via toast notifications.
    - Log errors to the console for debugging.

6. **Testing**
    - Write unit tests for demo bot creation, scenario selection, and portfolio preview logic.
    - Ensure demo mode is covered in authentication and scenario flows.

### Extending Demo Scenarios
- Add new scenarios by creating new entries in the scenario list and providing corresponding configuration.
- Use interfaces for scenario and bot data to ensure type safety and extensibility.

### Documentation
- Document all exported functions, interfaces, and components related to demo bots.
- Update this guide as new demo features are added.

## Implementation Steps

### Create `/config/sections.ts`
Scaffold a config file listing all dashboard sections, their labels, routes, icons, and categories. Example:

```ts
// config/sections.ts
export const sections = [
  {
    category: "Dashboard",
    items: [
      { label: "Overview", route: "/overview", icon: "dashboard" },
      { label: "Trading & Signals", route: "/trading-signals", icon: "trading" },
    ],
  },
  {
    category: "Calculators",
    items: [
      { label: "Savings Calculator", route: "/calculators/savings", icon: "savings" },
      { label: "Compound Interest", route: "/calculators/compound-interest", icon: "interest" },
    ],
  },
];
```

### Set up `DashboardLayout` in `/components/DashboardLayout.tsx`
Create a layout component with sidebar navigation and header, using the config file for links. Example:

```tsx
// components/DashboardLayout.tsx
import React from "react";
import { sections } from "@/config/sections";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {sections.map((section) => (
          <div key={section.category}>
            <h3>{section.category}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.route}>
                  <a href={item.route}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

### Implement Sidebar Navigation in `DashboardLayout`
Render grouped navigation links from `/config/sections.ts`, supporting active route highlighting. Example:

```tsx
// components/DashboardLayout.tsx
// ...existing code...
import { useRouter } from "next/router";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {sections.map((section) => (
          <div key={section.category}>
            <h3>{section.category}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.route} className={router.pathname === item.route ? "active" : ""}>
                  <a href={item.route}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

### Create Placeholder Pages
Export components with headers and stubs for each section. Example:

```tsx
// pages/overview.tsx
export default function Overview() {
  return <div><h1>Overview</h1><p>Stub chart/table</p></div>;
}

// pages/trading-signals.tsx
export default function TradingSignals() {
  return <div><h1>Trading & Signals</h1><p>Stub chart/table</p></div>;
}

// pages/calculators/savings.tsx
export default function SavingsCalculator() {
  return <div><h1>Savings Calculator</h1><p>Input form and result table</p></div>;
}
```

### Create Financial Calculators Hub Page
Export a component with a header and links to all calculator pages. Example:

```tsx
// pages/calculators/index.tsx
export default function CalculatorsHub() {
  return (
    <div>
      <h1>Financial Calculators</h1>
      <ul>
        <li><a href="/calculators/savings">Savings Calculator</a></li>
        <li><a href="/calculators/compound-interest">Compound Interest Calculator</a></li>
      </ul>
    </div>
  );
}
```

# Supabase Setup

## Overview

Supabase is used for authentication, database, and storage operations in the Virgin Fund project.

---

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com).
2. Create a new project in the Supabase dashboard.

---

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### Database Schema

Use the Supabase dashboard to create the following tables:

#### Users

- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String
- `created_at`: Timestamp

---

#### Demo Mode Tables

Add these tables for the Demo Mode feature:

```sql
create table demo_portfolios (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  currency text check (currency in ('USD','EUR','BTC')) not null,
  balance numeric not null,
  positions jsonb default '[]',
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '24 hours')
);

create table demo_trades (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid references demo_portfolios(id) on delete cascade,
  symbol text not null,
  side text check (side in ('buy','sell')) not null,
  qty numeric not null,
  price numeric not null,
  executed_at timestamptz default now()
);

create table demo_bots (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid references demo_portfolios(id) on delete cascade,
  name text not null,
  strategy text not null,
  status text check (status in ('active','paused')) default 'active'
);

create table demo_strategies (
  id uuid primary key default uuid_generate_v4(),
  portfolio_id uuid references demo_portfolios(id) on delete cascade,
  name text not null,
  description text,
  settings jsonb
);
```

---

## Integration

### Supabase Client

The Supabase client is initialized in `lib/supabase-client.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### API Routes

Authentication routes are located in `pages/api/auth`:

- `signup.ts`: Handles user registration.
- `login.ts`: Handles user login.

---

## Testing

### Local Testing

1. Start the development server:

   ```bash
   bun dev
   ```

2. Test the API routes using Postman or curl.

### Deployment

Ensure the `.env` file is correctly configured in your production environment.

---

## Troubleshooting

### Common Issues

- **Invalid URL or Key**: Verify the Supabase URL and anon key in the `.env` file.
- **Database Errors**: Check the Supabase dashboard for schema issues.

### Support

For additional help, visit the [Supabase documentation](https://supabase.com/docs).

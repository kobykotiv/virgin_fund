Build a "Financial & Trading Calculators" section containing multiple calculators:

Financial:
- Compound Interest
- Savings Growth
- Retirement Planning
- Mortgage Payments
- Inflation Impact
- Debt Payoff
- Fee Impact

Trading:
- Risk/Reward
- Position Size
- Leverage
- Pivot Points
- Spread
- Options Greeks

Each calculator:
- Has its own route
- Uses a shared `<CalculatorLayout>` component
- Form inputs validated with Zod
- Outputs numeric results, charts (where relevant), and export to CSV
- Persist last used inputs to localStorage

Tech:
- Frontend: React, Tailwind, React Hook Form, Chart.js
- No backend required except for storing user presets

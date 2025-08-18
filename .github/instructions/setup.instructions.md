---
applyTo: '**/*.ts'
---

# Virgin Fund App – AI Coding Guidelines & Project Context

## 1. Project Overview
Virgin Fund is a modern web application built with Next.js, TypeScript, and React. The app manages investment portfolios, user accounts, and provides real-time financial data. The backend is integrated via RESTful APIs and uses a PostgreSQL database.

## 2. Tech Stack
- **Frontend:** Next.js (React, TypeScript), Tailwind CSS
- **Backend:** Node.js (Express), TypeScript
- **Database:** PostgreSQL
- **APIs:** RESTful endpoints, Axios for HTTP requests
- **State Management:** React Context API, SWR for data fetching
- **Testing:** Jest, React Testing Library
- **CI/CD:** GitHub Actions

## 3. Coding Guidelines

### 3.1 TypeScript
- Use strict typing everywhere.
- Prefer interfaces over types for object shapes.
- Avoid `any` unless absolutely necessary.

### 3.2 React & Next.js
- Use functional components and React hooks.
- Keep components small and focused.
- Use Next.js routing and API routes where appropriate.

### 3.3 Styling
- Use Tailwind CSS utility classes.
- Avoid inline styles unless dynamic.

### 3.4 API Integration
- Use Axios for HTTP requests.
- Handle errors gracefully and provide user feedback.

### 3.5 State Management
- Use React Context for global state.
- Use SWR for remote data fetching and caching.

### 3.6 Testing
- Write unit and integration tests for all logic and components.
- Use mocks for API calls in tests.

### 3.7 Code Quality
- Follow Prettier and ESLint rules.
- Write clear, concise comments where necessary.
- Use descriptive variable and function names.

## 4. Folder Structure
- `/app` – Application entry points and pages
- `/components` – Reusable React components
- `/lib` – Utility functions and API clients
- `/contexts` – React Context providers
- `/styles` – Tailwind and global styles
- `/tests` – Test files
- `CHANGELOG.md` – Change log for the project
- `.github/` – GitHub-specific files and instructions

## 5. Contribution Guidelines
- All code must be reviewed via pull requests.
- Include tests for new features and bug fixes.
- Update documentation as needed.

## 6. Monte Carlo Simulated Markets Guidelines

- Simulated markets must support play money in USD, EUR, BTC, and ETH.
- Monte Carlo simulations should allow users to select the currency and set parameters such as initial price, volatility, simulation days, and number of simulations.
- Use strict typing for all simulation logic and currency handling.
- Ensure demo portfolio generation and simulation utilities support all four currencies.
- Visualize simulation results using reusable chart components.
- Provide clear UI feedback for currency selection and simulation outcomes.

## 7. File Structure for Monte Carlo Simulation

- `/app/monte-carlo.tsx` – Page entry for Monte Carlo simulation.
- `/components/calculators/monte-carlo.tsx` – Main simulation UI and logic.
- `/components/ui/line-chart.tsx` – Chart component for simulation results.
- `/lib/demo-portfolio.ts` – Demo portfolio generator (supports all currencies).
- `/lib/demo-portfolio-utils.ts` – Utilities for random balances, positions, and trades (supports all currencies).
- `/tests/` – Unit/integration tests for simulation and portfolio logic.

---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.


# GitHub Copilot Instructions for Virgin Fund Project

## Purpose
These instructions ensure consistent, repeatable code generation for the Virgin Fund self-hosted financial dashboard app.

## General Guidelines
- Use Next.js and Bun as the primary frameworks.
- Follow TypeScript best practices.
- Prefer functional components and React hooks.
- Use descriptive variable and function names.
- Ensure all authentication logic is secure and robust.
- Demo scenarios should be modular and easily extensible.
- Portfolio previews must be interactive and visually clear.
- All code should be self-hostable and avoid vendor lock-in.

## File Structure
- Place pages in `/app` or `/pages` as appropriate. `/app` as default for new features.
- API routes go in `/pages/api`.
- Components go in `/components`.
- Utility functions in `/lib` or `/utils`.
- Demo scenarios in `/demo`.

## Coding Standards
- Use consistent indentation (2 spaces or tabs, project standard).
- Add JSDoc or TypeScript comments for exported functions and interfaces.
- Prefer ES6+ syntax.
- Avoid hardcoding sensitive values; use environment variables.
- All demo and preview logic should be testable and isolated.

## Authentication
- Use secure, modern authentication flows.
- Store authentication state in localStorage or context.
- Demo mode must be clearly separated from real user accounts.

## Demo Mode
- Allow selection of different demo scenarios.
- Store demo scenario in localStorage.
- Demo accounts must be flagged (`isDemoAccount: true`).

## Portfolio Previews
- Support previewing portfolios with charts and allocation breakdowns.
- Sentiment and risk indicators should be included.

## Extensibility
- Write modular code for easy addition of new demo scenarios or portfolio types.
- Use interfaces for portfolio and demo scenario data.

## Error Handling
- Always handle errors gracefully and provide user feedback.
- Log errors to the console for debugging.

## UI/UX
- Use modern, accessible UI components.
- Provide clear feedback for actions (e.g., toast notifications).

## Testing
- Write unit tests for critical logic.
- Ensure demo scenarios and authentication flows are covered.

## Documentation
- Document all exported functions, interfaces, and components.
- Update this instruction file as project requirements evolve.

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



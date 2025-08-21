## Brief overview
  - Project-specific rules for frontend and backend development in the "virgin_fund" Next.js monorepo.
  - All guidelines are derived from explicit user instructions and must be strictly followed.

## Tech stack requirements

    - Bun init -> 

  - Frontend: React (Next.js, TypeScript, Tailwind CSS, shadcn/ui or Radix UI for components).
  - Backend: Next.js API routes (or Bun runtime if specified), RESTful APIs, Node.js (with Bun if specified).
  - State management: React hooks, Context API. Do not use Redux unless explicitly requested.
  - Testing: Use Vitest or Jest for unit/integration tests.
  - Styling: Tailwind CSS only. Do not use CSS-in-JS unless requested.
  - All code must be compatible with Bun and Next.js 14+.
  - Use only open-source, production-ready libraries.

## Coding conventions
  - All code must be TypeScript unless otherwise specified.
  - Use modern ES2022+ JavaScript/TypeScript features.
  - All UI must be accessible and responsive.
  - Never use placeholder components; always fetch or mock real data.
  - Use environment variables for secrets; never expose API keys in client code.

## Communication and documentation
  - Always explain any new dependencies or architectural decisions.
  - If a rule conflicts with a user prompt, ask for clarification.
  - Do not invent preferences or make assumptions beyond explicit instructions.

## Other guidelines
  - All code and suggestions must adhere to these rules unless the user provides updated instructions.

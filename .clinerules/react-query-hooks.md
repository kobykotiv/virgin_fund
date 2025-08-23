## Brief overview
- Guidelines for scaffolding and integrating React Query hooks for market data, bots, and portfolios in the Bot Army trading platform.
- Project-specific, focused on modular, testable, and source-annotated data fetching.

## React Query hook conventions
- Each data source (CoinGecko, Alpaca, Bots, Portfolio) should have its own hook: `useCoinGeckoPrice`, `useAlpacaPrice`, `useBots`, `usePortfolio`.
- Hooks must use descriptive query keys and expose loading, error, and data states.
- Hooks should annotate returned data with its source (e.g., `{ price, source }`).
- Prefer `useQuery` for fetching, `useMutation` for CRUD, and invalidate queries on mutation success.

## UI wiring and usage
- At least one page (e.g., Market Data or Bots) must consume live data from these hooks.
- Display loading and error states clearly in the UI.
- Show data source labels (e.g., "coingecko", "alpaca") next to prices or assets.
- Use hooks in a modular way so components can be reused across pages.

## Testing and type safety
- Add unit tests for each hook to cover loading, error, and success states.
- Use TypeScript for all hooks and ensure strict typing of returned data.
- Test UI components with mocked hook data for predictable results.

## Communication and progress
- When scaffolding hooks, provide a summary of changes and next steps in TASKS.md or PROGRESS.md.
- Keep communication concise and technical, focusing on actionable steps and integration points.

## Other guidelines
- Do not mix unrelated data sources in a single hook.
- Keep hooks small, focused, and easy to extend for new data sources or endpoints.

Running tests locally

This project uses Vitest and Testing Library for component and unit tests. Tests may require a browser-like environment (jsdom) and some environment variables for integration tests.

Quick start (using Bun, recommended):

```powershell
# install dependencies
bun install

# run a small subset of tests (component tests)
bun run vitest -- --include "__tests__/components/**/*.test.{ts,tsx}"
```

Using npm / node:

```powershell
npm install
npx vitest --include "__tests__/components/**/*.test.{ts,tsx}"
```

Notes and tips
- Some tests in `__tests__/integration` and `__tests__/api` rely on environment variables and a running local Supabase or test doubles. Run those only when configured.
- If you need to run a single test file, pass the path to vitest via the CLI (or use your editor's test runner).
- To re-enable project-wide tests, create a `vitest.config.ts` at the repo root. Example minimal config:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { environment: 'jsdom', globals: true }
})
```

- If you encounter "DOM is not defined" errors, ensure `environment: 'jsdom'` is set in the config or pass `--environment jsdom`.

If you'd like, I can add a lightweight test script to `package.json` (e.g. `test:unit`, `test:component`) and a CI job template. Tell me which you prefer.

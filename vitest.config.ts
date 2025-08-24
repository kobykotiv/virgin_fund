export default {
  // Minimal ESM config that avoids importing other ESM/CJS modules at top-level.
  // This prevents the vite/vitest ESM/CJS interop error when test runner attempts
  // to require() bundled modules during startup. The detailed CommonJS config
  // lives in vitest.config.cjs and the package.json test script uses it by
  // default; this file now only provides a safe fallback for tools that load
  // the TypeScript config directly.
  test: {
    include: ['__tests__/components/**/*.test.{ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    threads: false,
  },
}

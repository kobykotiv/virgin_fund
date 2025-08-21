import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.ts"],
    // Increase concurrency/timeouts if needed in CI
    // threads: false,
    // testTimeout: 10000,
  },
});

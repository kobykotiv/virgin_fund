/* Type shim for `bun:test` imports used by some in-repo tests.
   Provides minimal declarations so TypeScript compilation succeeds
   in environments that use vitest/jest instead of Bun's test runner.
   This file is intentionally permissive (uses `any`) — refine types
   later if stricter checks are desired.
*/

declare module "bun:test" {
  export const describe: (name: string, fn: () => void) => void;
  export const it: (name: string, fn: () => any) => void;
  export const test: (name: string, fn: () => any) => void;
  export const expect: any;
  export const beforeEach: (fn: () => void) => void;
  export const afterEach: (fn: () => void) => void;
  export const vi: any;
}

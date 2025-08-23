// Ambient module declarations to satisfy test and script relative imports.
// These are conservative `any`-style declarations intended only to unblock
// TypeScript checking in CI/tests. Replace with concrete types as needed.

declare module '../../../scripts/process_backtests' {
  export function computeSummary(backtests: any): any
}

declare module '../../../scripts/migration_runner' {
  export function runMigrationFile(file: string, direction: 'up' | 'down'): Promise<{ ok: boolean; file: string; appliedAt?: string }>
}

// Some scripts import 'bun' directly in repo tooling scripts; provide a light declaration.
declare module 'bun' {
  export const $: any
  export default $;
}

// Allow non-ts extension imports used in supabase functions during type-checking (conservative)
declare module '*.ts' {
  const content: any
  export default content
}

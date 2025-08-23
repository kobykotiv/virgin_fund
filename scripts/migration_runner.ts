/**
 * Minimal stub for scripts/migration_runner used by tests.
 * Exports a runMigrationFile function so tests can import it while the real
 * migration runner implementation remains in the repo.
 */

export async function runMigrationFile(filePath: string, direction: 'up' | 'down' = 'up') {
  // Placeholder: pretend migration ran successfully. `direction` is accepted to match callers in tests.
  return {
    ok: true,
    file: filePath,
    direction,
    appliedAt: new Date().toISOString(),
  }
}

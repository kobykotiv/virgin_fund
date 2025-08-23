export function runMigrationFile(file: string, direction: 'up' | 'down'): Promise<{ ok: boolean; file: string; appliedAt?: string }>;

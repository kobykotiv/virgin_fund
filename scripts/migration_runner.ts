import fs from 'fs/promises';
import { Pool } from 'pg';

/**
 * Simple migration runner that extracts the `-- Up` or `-- Down` block from a migration SQL file
 * and executes it as a single multi-statement query. This handles files that include BEGIN/COMMIT
 * transaction blocks. It uses a Postgres pool pointed by DATABASE_URL or TEST_DATABASE_URL.
 */
export async function runMigrationFile(filePath: string, direction: 'up' | 'down' = 'up') {
  const sql = await fs.readFile(filePath, 'utf8');

  const upMarker = /-- Up/i;
  const downMarker = /-- Down/i;
  const upIndex = sql.search(upMarker);
  const downIndex = sql.search(downMarker);
  if (upIndex === -1 || downIndex === -1) {
    throw new Error('Migration file must contain -- Up and -- Down markers');
  }

  const upSql = sql.substring(upIndex + '-- Up'.length, downIndex).trim();
  const downSql = sql.substring(downIndex + '-- Down'.length).trim();

  const block = direction === 'up' ? upSql : downSql;
  if (!block) return;

  const dbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('Set TEST_DATABASE_URL or DATABASE_URL');

  const pool = new Pool({ connectionString: dbUrl });
  try {
    // Execute block as a single multi-statement query. This allows nested BEGIN/COMMIT blocks.
    await pool.query(block);
  } finally {
    await pool.end();
  }
}

export default runMigrationFile;

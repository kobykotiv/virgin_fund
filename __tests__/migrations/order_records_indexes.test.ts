import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';

describe('migration: order_records_indexes', () => {
  const dbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('Set TEST_DATABASE_URL or DATABASE_URL pointing to a test Postgres instance');
  }

  const pool = new Pool({ connectionString: dbUrl });
  const migrationPath = path.join(__dirname, '..', '..', 'supabase', 'migrations', '20250819_order_records_indexes.sql');
  let migrationSql: string;

  beforeAll(async () => {
    migrationSql = await fs.readFile(migrationPath, 'utf8');

    // Ensure minimal schema exists for test: bots and order_records
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bots (
        id bigint primary key generated always as identity,
        name text
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_records (
        id bigint primary key generated always as identity,
        bot_id bigint,
        status text,
        executed_at timestamptz,
        created_at timestamptz default now()
      );
    `);

    // Clean up and seed
    await pool.query('TRUNCATE order_records, bots RESTART IDENTITY CASCADE;');
    const botRes = await pool.query("INSERT INTO bots (name) VALUES ('perf-bot') RETURNING id");
    const botId = botRes.rows[0].id;

    // Bulk insert many rows to make planner consider indexes
    await pool.query(
      `INSERT INTO order_records (bot_id, status, executed_at, created_at)
       SELECT $1, CASE WHEN gs % 5 = 0 THEN 'filled' ELSE 'pending' END,
              CASE WHEN gs % 5 = 0 THEN now() - (gs || ' seconds')::interval ELSE NULL END,
              now() - (gs || ' seconds')::interval
       FROM generate_series(1, 5000) gs;
      `,
      [botId]
    );
  }, 20000);

  afterAll(async () => {
    await pool.end();
  });

  test('index improves plan for recent filled orders', async () => {
    const botRow = await pool.query("SELECT id FROM bots WHERE name='perf-bot'");
    const botId = botRow.rows[0].id;

    const upMarker = /-- Up/i;
    const downMarker = /-- Down/i;
    const upIndex = migrationSql.search(upMarker);
    const downIndex = migrationSql.search(downMarker);
    if (upIndex === -1 || downIndex === -1) {
      throw new Error('Migration file must contain "-- Up" and "-- Down" markers');
    }

    const upSql = migrationSql.substring(upIndex + '-- Up'.length, downIndex).trim();
    const downSql = migrationSql.substring(downIndex + '-- Down'.length).trim();

    // Run EXPLAIN before index
    const explainBeforeRes = await pool.query(`EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT * FROM order_records WHERE bot_id=$1 AND status='filled' ORDER BY executed_at DESC LIMIT 1;`, [botId]);
    const planBefore = explainBeforeRes.rows.map(r => Object.values(r).join(' ')).join('\n');

    // Apply Up (create index)
    await pool.query(upSql);

    // Ensure index exists
    const idxRes = await pool.query("SELECT indexname FROM pg_indexes WHERE tablename='order_records' AND indexname='idx_order_records_bot_filled_executed_at'");
    expect(idxRes.rowCount).toBeGreaterThan(0);

    // Run EXPLAIN after index
    const explainAfterRes = await pool.query(`EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) SELECT * FROM order_records WHERE bot_id=$1 AND status='filled' ORDER BY executed_at DESC LIMIT 1;`, [botId]);
    const planAfter = explainAfterRes.rows.map(r => Object.values(r).join(' ')).join('\n');

    // Expect plan changed to use index (Index Scan or Index Only Scan)
    const usesIndex = /(Index Scan|Index Only Scan)/i.test(planAfter);
    expect(usesIndex).toBeTruthy();

    // Clean up: run Down
    await pool.query(downSql);

    // Verify index removed
    const idxResAfter = await pool.query("SELECT indexname FROM pg_indexes WHERE tablename='order_records' AND indexname='idx_order_records_bot_filled_executed_at'");
    expect(idxResAfter.rowCount).toBe(0);
  }, 60000);
});

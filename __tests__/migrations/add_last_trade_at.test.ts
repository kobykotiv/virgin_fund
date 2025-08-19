import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';

// Test expectations:
// - Migration up adds bots.last_trade_at and backfills from order_records
// - Migration down removes the column

describe('migration: add_last_trade_at', () => {
  const dbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('Set TEST_DATABASE_URL or DATABASE_URL pointing to a test Postgres instance');
  }

  const pool = new Pool({ connectionString: dbUrl });
  const migrationPath = path.join(__dirname, '..', '..', 'supabase', 'migrations', '20250818_add_last_trade_at.sql');
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
        executed_at timestamptz,
        created_at timestamptz default now()
      );
    `);

    // Clean up any existing rows
    await pool.query('TRUNCATE order_records, bots RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    await pool.end();
  });

  test('up migrates and backfills last_trade_at', async () => {
    // Seed one bot and two order_records
    const botRes = await pool.query("INSERT INTO bots (name) VALUES ('test-bot') RETURNING id");
    const botId = botRes.rows[0].id;

    // older executed_at
    await pool.query('INSERT INTO order_records (bot_id, executed_at, created_at) VALUES ($1, $2, $3)', [
      botId,
      '2024-01-01T10:00:00Z',
      '2024-01-01T10:00:00Z',
    ]);

    // newer executed_at
    await pool.query('INSERT INTO order_records (bot_id, executed_at, created_at) VALUES ($1, $2, $3)', [
      botId,
      '2024-02-02T12:00:00Z',
      '2024-02-02T12:00:00Z',
    ]);

    // Extract the Up and Down sections from migration file
    const upMarker = /-- Up/i;
    const downMarker = /-- Down/i;
    const upIndex = migrationSql.search(upMarker);
    const downIndex = migrationSql.search(downMarker);
    if (upIndex === -1 || downIndex === -1) {
      throw new Error('Migration file must contain "-- Up" and "-- Down" markers');
    }

    const upSql = migrationSql.substring(upIndex + '-- Up'.length, downIndex).trim();
    const downSql = migrationSql.substring(downIndex + '-- Down'.length).trim();

    // Run Up
    await pool.query(upSql);

    // Verify column exists
    const colRes = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name='bots' AND column_name='last_trade_at'`
    );
    expect(colRes.rowCount).toBeGreaterThan(0);

    // Verify backfill: bots.last_trade_at should equal the latest executed_at
    const botRow = await pool.query('SELECT last_trade_at FROM bots WHERE id=$1', [botId]);
    expect(botRow.rowCount).toBe(1);
    const lastTrade = botRow.rows[0].last_trade_at;
    expect(new Date(lastTrade).toISOString()).toBe('2024-02-02T12:00:00.000Z');

    // Verify index exists
    const idxRes = await pool.query("SELECT indexname FROM pg_indexes WHERE tablename='bots' AND indexname='idx_bots_last_trade_at'");
    expect(idxRes.rowCount).toBeGreaterThan(0);

    // Run Down
    await pool.query(downSql);

    // Verify column removed
    const colResAfter = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name='bots' AND column_name='last_trade_at'`
    );
    expect(colResAfter.rowCount).toBe(0);
  }, 20000);
});

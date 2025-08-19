import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { computeSummary } from '../../../scripts/process_backtests';

describe('integration: migrations + backtest processing', () => {
  const dbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('Set TEST_DATABASE_URL or DATABASE_URL pointing to a test Postgres instance');
  const pool = new Pool({ connectionString: dbUrl });

  const migrationFiles = [
    path.join(__dirname, '..', '..', 'supabase', 'migrations', '20250818_add_last_trade_at.sql'),
    path.join(__dirname, '..', '..', 'supabase', 'migrations', '20250819_order_records_indexes.sql'),
  ];

  let migrationsSql: string[] = [];

  beforeAll(async () => {
    migrationsSql = await Promise.all(migrationFiles.map((p) => fs.readFile(p, 'utf8')));

    // Ensure base tables exist for test
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bots (
        id bigint primary key generated always as identity,
        user_id uuid,
        name text,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_records (
        id bigint primary key generated always as identity,
        bot_id bigint,
        alpaca_order_id text,
        type text,
        side text,
        qty numeric,
        filled_qty numeric,
        price numeric,
        status text,
        meta jsonb,
        created_at timestamptz default now(),
        executed_at timestamptz
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS backtests (
        id bigint primary key generated always as identity,
        bot_id bigint,
        params jsonb,
        results jsonb,
        summary jsonb,
        created_at timestamptz default now()
      );
    `);

    // Cleanup
    await pool.query('TRUNCATE order_records, bots, backtests RESTART IDENTITY CASCADE;');
  }, 30000);

  afterAll(async () => {
    await pool.end();
  });

  test('migrations backfill last_trade_at and job computes backtest summary', async () => {
    // Seed a bot and orders
    const botRes = await pool.query("INSERT INTO bots (name) VALUES ('int-bot') RETURNING id");
    const botId = botRes.rows[0].id;

    // Insert two orders with executed_at
    await pool.query('INSERT INTO order_records (bot_id, status, executed_at, created_at) VALUES ($1,$2,$3,$4)', [botId, 'filled', '2024-01-01T10:00:00Z', '2024-01-01T10:00:00Z']);
    await pool.query('INSERT INTO order_records (bot_id, status, executed_at, created_at) VALUES ($1,$2,$3,$4)', [botId, 'filled', '2024-02-02T12:00:00Z', '2024-02-02T12:00:00Z']);

    // Apply the Up section of the first migration (add_last_trade_at)
  const migration1Path = migrationFiles[0];
  // Use migration runner to execute Up block safely
  const { runMigrationFile } = await import('../../../scripts/migration_runner');
  await runMigrationFile(migration1Path, 'up');

    // Verify backfill: bots.last_trade_at should equal latest executed_at
    const botRow = await pool.query('SELECT last_trade_at FROM bots WHERE id=$1', [botId]);
    expect(botRow.rowCount).toBe(1);
    const lastTrade = botRow.rows[0].last_trade_at;
    expect(new Date(lastTrade).toISOString()).toBe('2024-02-02T12:00:00.000Z');

    // Apply the order_records index migration (Up)
  const migration2Path = migrationFiles[1];
  await runMigrationFile(migration2Path, 'up');

    // Insert a backtest with results as equity series
    const results = [100, 110, 105, 120, 115];
    const btRes = await pool.query('INSERT INTO backtests (bot_id, results) VALUES ($1, $2) RETURNING id, results', [botId, JSON.stringify(results)]);
    const btId = btRes.rows[0].id;

    // Simulate job: compute summary and update DB (we call computeSummary directly)
    const summary = computeSummary(results);
    await pool.query('UPDATE backtests SET summary = $1 WHERE id = $2', [summary, btId]);

    // Verify summary stored
    const check = await pool.query('SELECT summary FROM backtests WHERE id=$1', [btId]);
    expect(check.rowCount).toBe(1);
    const stored = check.rows[0].summary;
    expect(Number(stored.total_return)).toBeCloseTo(15);
    expect(Number(stored.max_drawdown)).toBeGreaterThan(4.4);

    // Rollback Down for both migrations
  // Rollback using migration runner
  await runMigrationFile(migration2Path, 'down');
  await runMigrationFile(migration1Path, 'down');

    // Verify columns removed
    const colRes = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='bots' AND column_name='last_trade_at'");
    expect(colRes.rowCount).toBe(0);
  }, 120000);
});

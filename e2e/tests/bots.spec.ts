// @ts-ignore: optional dev dependency
import { test, expect } from '@playwright/test';

test('create bot and run backtest flow', async ({ page, request }) => {
  // Quick sanity: visit dashboard
  await page.goto('/');
  await expect(page).toHaveTitle(/Virgin Fund|Dashboard/i);

  // Try create via API (server must be running locally)
  const createResp = await request.post('/api/bots', { data: { name: 'E2E Demo Bot', strategy: 'dca', assets: ['BTCUSD'], initialBalance: 1000 } });
  expect([201,200]).toContain(createResp.status());

  const body = await createResp.json();
  const bot = body?.data || body;
  expect(bot).toBeTruthy();
  const id = bot?.id;

  // Run a backtest (if route exists)
  const bt = await request.post('/api/backtest', { data: { symbol: 'BTCUSD', start: '2023-01-01', end: '2023-03-01', initialCapital: 1000, dcaAmount: 50, frequency: 'daily' } });
  expect([200,201]).toContain(bt.status());
  const btBody = await bt.json();
  expect(btBody.result).toBeTruthy();
});

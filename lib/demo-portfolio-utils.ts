import axios from 'axios';

export function getRandomCurrency(): 'USD' | 'EUR' | 'BTC' {
  const currencies = ['USD', 'EUR', 'BTC'];
  return currencies[Math.floor(Math.random() * currencies.length)] as 'USD' | 'EUR' | 'BTC';
}

export async function getRandomBalance(currency: 'USD' | 'EUR' | 'BTC'): Promise<number> {
  if (currency === 'BTC') {
    let btcPrice = 30000; // fallback
    if (process.env.TESTING === 'true') {
      btcPrice = 30000;
    } else {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        btcPrice = res.data.bitcoin.usd;
      } catch (e) {
        // fallback
      }
    }
    const btcAmount = Math.random() * (5 - 0.1) + 0.1;
    return parseFloat((btcAmount).toFixed(4));
  }
  // USD/EUR
  return Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000;
}

export function getMockPositions(currency: 'USD' | 'EUR' | 'BTC') {
  const symbols = ['AAPL', 'TSLA', 'ETH', 'BTC', 'EURUSD', 'GOOG', 'SOL', 'MSFT'];
  const positions = [];
  const count = Math.floor(Math.random() * 4) + 3; // 3-6 holdings
  for (let i = 0; i < count; i++) {
    positions.push({
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      qty: Math.floor(Math.random() * 100) + 1,
      avgPrice: Math.random() * 1000 + 10,
      currency,
    });
  }
  return positions;
}

export function getMockTrades(portfolioId: string, currency: 'USD' | 'EUR' | 'BTC') {
  const sides = ['buy', 'sell'];
  const symbols = ['AAPL', 'TSLA', 'ETH', 'BTC', 'EURUSD', 'GOOG', 'SOL', 'MSFT'];
  const trades = [];
  const count = Math.floor(Math.random() * 11) + 10; // 10-20 trades
  for (let i = 0; i < count; i++) {
    trades.push({
      portfolio_id: portfolioId,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      side: sides[Math.floor(Math.random() * sides.length)],
      qty: Math.floor(Math.random() * 100) + 1,
      price: Math.random() * 1000 + 10,
      executed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return trades;
}

export function getMockBots(portfolioId: string) {
  const names = ['Mean Reversion Alpha', 'ScalperX', 'CryptoMomentum', 'TrendCatcher', 'ArbBot'];
  const strategies = ['mean_reversion', 'scalping', 'momentum', 'trend_following', 'arbitrage'];
  const bots = [];
  const count = Math.floor(Math.random() * 2) + 2; // 2-3 bots
  for (let i = 0; i < count; i++) {
    bots.push({
      portfolio_id: portfolioId,
      name: names[Math.floor(Math.random() * names.length)],
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      status: 'active',
    });
  }
  return bots;
}

export function getMockStrategies(portfolioId: string, bots: any[]) {
  const strategies = [];
  for (const bot of bots) {
    strategies.push({
      portfolio_id: portfolioId,
      name: bot.strategy,
      description: `${bot.name} uses ${bot.strategy} strategy`,
      settings: { risk: Math.random(), frequency: Math.floor(Math.random() * 10) + 1 },
    });
  }
  return strategies;
}

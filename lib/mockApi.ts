// Lightweight mock API for dev/demo purposes
export type Fund = {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  aum: number;
  expenseRatio: number;
  sectorTags: string[];
};

export type OptionStrike = { strike: number; bid: number; ask: number; iv: number };
export type OptionSnapshot = { expiry: string; strikes: OptionStrike[] };

export type Strategy = {
  id: string;
  name: string;
  author: string;
  params: Record<string, any>;
  performance?: Record<string, number>;
};

const mockFunds: Fund[] = [
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", price: 431.12, changePct: 0.84, aum: 350_000_000_000, expenseRatio: 0.03, sectorTags: ["Large Cap", "US"] },
  { ticker: "QQQ", name: "Invesco QQQ Trust", price: 389.5, changePct: -0.32, aum: 200_000_000_000, expenseRatio: 0.2, sectorTags: ["Large Cap", "Tech"] },
  { ticker: "VTI", name: "Vanguard Total Stock Market ETF", price: 210.33, changePct: 0.21, aum: 300_000_000_000, expenseRatio: 0.03, sectorTags: ["US", "Total Market"] },
];

const mockOptions: Record<string, OptionSnapshot[]> = {
  "VOO": [
    { expiry: "2025-09-19", strikes: [{ strike: 420, bid: 4.2, ask: 4.5, iv: 0.18 }, { strike: 430, bid: 2.1, ask: 2.4, iv: 0.16 }] },
  ],
  "QQQ": [
    { expiry: "2025-09-19", strikes: [{ strike: 390, bid: 3.5, ask: 3.8, iv: 0.26 }] },
  ],
};

const mockStrategies: Strategy[] = [
  { id: "strat_123", name: "Momentum Basket", author: "alice", params: { tickers: ["VOO", "QQQ"], allocation: [0.6, 0.4] }, performance: { "1M": 0.02, "3M": 0.07 } },
  { id: "strat_456", name: "Income Covered Calls", author: "bob", params: { ticker: "VTI", strikeOffset: 0.03 }, performance: { "1M": 0.005 } },
];

function withLatency<T>(result: T, ms = 300) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(result), ms));
}

export async function signUp(email: string, password: string) {
  // naive validation
  if (!email.includes("@") || password.length < 6) {
    throw new Error("Invalid email or password")
  }
  return withLatency({ token: "mock-token", user: { email } }, 400)
}

export async function signIn(email: string, password: string) {
  if (!email.includes("@") || password.length < 1) throw new Error("Invalid credentials")
  return withLatency({ token: "mock-token", user: { email } }, 300)
}

export async function fetchFunds(): Promise<Fund[]> {
  return withLatency(mockFunds, 220)
}

export async function fetchOptionSnapshot(ticker: string): Promise<OptionSnapshot | null> {
  const list = mockOptions[ticker] ?? [];
  return withLatency(list[0] ?? null, 180)
}

export async function fetchSharedStrategies(): Promise<Strategy[]> {
  return withLatency(mockStrategies, 250)
}

export async function importStrategy(strategyId: string) {
  const s = mockStrategies.find((m) => m.id === strategyId)
  if (!s) throw new Error("Strategy not found")
  // return a copy as imported
  return withLatency({ ...s, importedAt: new Date().toISOString() }, 200)
}

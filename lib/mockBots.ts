export type BotStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'error';

export type Bot = {
  id: string;
  name: string;
  strategy: string;
  status: BotStatus;
  currentPnL: number; // percent
  allocatedCapital: number; // USD
  createdAt: string;
  updatedAt: string;
};

const seed: Bot[] = [
  {
    id: 'bot-1',
    name: 'Gridmaster Alpha',
    strategy: 'grid',
    status: 'running',
    currentPnL: 3.4,
    allocatedCapital: 2500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-2',
    name: 'RSI Scalper',
    strategy: 'rsi',
    status: 'paused',
    currentPnL: -1.2,
    allocatedCapital: 1200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-3',
    name: 'Stat Arb 01',
    strategy: 'statarb',
    status: 'idle',
    currentPnL: 0.0,
    allocatedCapital: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const store = new Map<string, Bot>();
seed.forEach((b) => store.set(b.id, b));

function genId() {
  return 'bot-' + Math.random().toString(36).slice(2, 9);
}

export function listBots({ search, status, strategy, page = 1, pageSize = 20 }:
  {search?: string; status?: string; strategy?: string; page?: number; pageSize?: number}) {
  let items = Array.from(store.values());
  if (search) {
    const s = search.toLowerCase();
    items = items.filter((b) => b.name.toLowerCase().includes(s) || b.strategy.toLowerCase().includes(s));
  }
  if (status) items = items.filter((b) => b.status === status);
  if (strategy) items = items.filter((b) => b.strategy === strategy);
  const total = items.length;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  return { items: pageItems, total };
}

export function createBot(data: Partial<Bot>) {
  const now = new Date().toISOString();
  const bot: Bot = {
    id: genId(),
    name: data.name || 'New Bot',
    strategy: data.strategy || 'dca',
    status: (data.status as BotStatus) || 'idle',
    currentPnL: data.currentPnL ?? 0,
    allocatedCapital: data.allocatedCapital ?? 1000,
    createdAt: now,
    updatedAt: now,
  };
  store.set(bot.id, bot);
  return bot;
}

export function getBot(id: string) {
  return store.get(id) || null;
}

export function updateBot(id: string, patch: Partial<Bot>) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated: Bot = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
}

export function deleteBot(id: string) {
  return store.delete(id);
}

export function performAction(id: string, action: string) {
  const bot = store.get(id);
  if (!bot) return null;
  switch (action) {
    case 'start':
      bot.status = 'running';
      break;
    case 'pause':
      bot.status = 'paused';
      break;
    case 'stop':
      bot.status = 'stopped';
      break;
    case 'clone': {
      const clone = createBot({
        name: bot.name + ' (clone)',
        strategy: bot.strategy,
        status: 'idle',
        allocatedCapital: bot.allocatedCapital,
      });
      return clone;
    }
    default:
      // no-op
      break;
  }
  bot.updatedAt = new Date().toISOString();
  store.set(id, bot);
  return bot;
}

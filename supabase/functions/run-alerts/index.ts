import { createClient } from '@supabase/supabase-js';
// Minimal alerts runner - intended for use as a Supabase Edge Function or a scheduled job.
// Responsibilities:
// - fetch active alerts
// - fetch latest prices for symbols referenced in alerts (placeholder external API call)
// - evaluate conditions and insert notification records / call webhook

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

type AlertRow = {
  id: string;
  user_id: string;
  name?: string;
  condition: any;
  method: string;
  payload: any;
  is_active: boolean;
};

async function fetchActiveAlerts(): Promise<AlertRow[]> {
  const { data, error } = await supabase.from('alerts').select('*').eq('is_active', true);
  if (error) throw error;
  return data as AlertRow[];
}

// Placeholder price fetch - replace with real market data integration (Alpaca/CoinGecko)
async function fetchPriceForSymbol(symbol: string): Promise<number | null> {
  // TODO: implement caching and batching
  // For now, return a mock price or call an external API
  return Math.random() * 1000; // mock
}

function evaluateCondition(condition: any, price: number): boolean {
  // condition shape: { symbol: string, op: '<=|>=|<|>|==', price: number }
  const target = Number(condition.price);
  switch (condition.op) {
    case '<=': return price <= target;
    case '<': return price < target;
    case '>=': return price >= target;
    case '>': return price > target;
    case '==': return price === target;
    default: return false;
  }
}

async function triggerNotification(alert: AlertRow, price: number) {
  // Insert into notifications table or call webhook/email
  const note = {
    alert_id: alert.id,
    user_id: alert.user_id,
    payload: { alert: alert.name, condition: alert.condition, price },
  };
  await supabase.from('notifications').insert([note]);

  if (alert.method === 'webhook' && alert.payload?.url) {
    try {
      await fetch(alert.payload.url, { method: 'POST', body: JSON.stringify({ alert: alert.name, price, condition: alert.condition }), headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
      console.error('webhook delivery failed', e);
    }
  }

  // update last_triggered_at
  await supabase.from('alerts').update({ last_triggered_at: new Date().toISOString() }).eq('id', alert.id);
}

export default async function handler() {
  const alerts = await fetchActiveAlerts();
  // group by symbol for batching
  const symbols = new Set<string>();
  alerts.forEach(a => { if (a.condition?.symbol) symbols.add(a.condition.symbol); });

  const prices: Record<string, number> = {};
  for (const s of symbols) {
    const p = await fetchPriceForSymbol(s);
    if (p != null) prices[s] = p;
  }

  for (const a of alerts) {
    const symbol = a.condition?.symbol;
    if (!symbol) continue;
    const price = prices[symbol];
    if (price == null) continue;
    const matched = evaluateCondition(a.condition, price);
    if (matched) {
      await triggerNotification(a, price);
    }
  }

  return new Response(JSON.stringify({ checked: alerts.length }), { status: 200 });
}

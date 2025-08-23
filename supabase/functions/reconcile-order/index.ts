// Simple supabase Edge Function to reconcile order state by fetching from Alpaca and updating order_records
declare const Deno: any;
import { placeOrder as alpacaPlaceOrder } from '../run-bots/adapter';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function supabaseHeaders() {
  return {
    apikey: SERVICE_ROLE || '',
    Authorization: `Bearer ${SERVICE_ROLE || ''}`,
    'Content-Type': 'application/json',
  };
}

addEventListener('fetch', (evt: any) => {
  evt.respondWith(handle(evt.request));
});

async function handle(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const client_order_id = body.client_order_id || body.clientOrderId || body.clientOrderID;
    if (!client_order_id) return new Response(JSON.stringify({ error: 'missing client_order_id' }), { status: 400 });

    // For demo: call Alpaca get order by client id endpoint
    const url = `${Deno.env.get('ALPACA_BASE_URL') || 'https://paper-api.alpaca.markets'}/v2/orders:by_client_id`;
    const res = await fetch(`${url}/${encodeURIComponent(client_order_id)}`, { headers: { 'APCA-API-KEY-ID': Deno.env.get('ALPACA_KEY'), 'APCA-API-SECRET-KEY': Deno.env.get('ALPACA_SECRET') } });
    const text = await res.text();
    if (!res.ok) return new Response(JSON.stringify({ error: 'failed to fetch order', detail: text }), { status: 500 });
    const order = JSON.parse(text);

    // Update order_records where meta->>client_order_id matches
    await fetch(`${SUPABASE_URL}/rest/v1/order_records`, { method: 'PATCH', headers: { ...supabaseHeaders(), Prefer: 'return=representation' }, body: JSON.stringify({ status: order.status, meta: order }) });

    return new Response(JSON.stringify({ ok: true, order }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('reconcile-order error', e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

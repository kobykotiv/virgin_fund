import React, { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';

export function OrderForm({ onOrderPlaced }: { onOrderPlaced?: () => void }) {
  const { getAccessToken } = useAuth();
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'market' | 'limit'>('market');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ symbol, side, quantity: Number(quantity), price: Number(price), type })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      if (onOrderPlaced) onOrderPlaced();
      setSymbol(''); setQuantity(1); setPrice('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={placeOrder} className="space-y-2">
      <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Symbol" required />
      <select value={side} onChange={e => setSide(e.target.value as 'buy' | 'sell')}>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={1} required />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" required={type==='limit'} disabled={type==='market'} />
      <select value={type} onChange={e => setType(e.target.value as 'market' | 'limit')}>
        <option value="market">Market</option>
        <option value="limit">Limit</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
}

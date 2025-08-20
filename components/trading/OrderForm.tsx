import React, { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';

export function OrderForm({ onOrderPlaced }: { onOrderPlaced?: () => void }) {
  const { getAccessToken } = useAuth();
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [notional, setNotional] = useState<number | ''>('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'market' | 'limit'>('market');
  const [loading, setLoading] = useState(false);
  type OrderError = string | { message: string; details?: any } | null;
  const [error, setError] = useState<OrderError>(null);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          symbol,
          side,
          quantity: quantity !== '' ? Number(quantity) : undefined,
          notional: notional !== '' ? Number(notional) : undefined,
          price: Number(price),
          type
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError({ message: data.error || 'Order failed', details: data.details });
        return;
      }
      if (onOrderPlaced) onOrderPlaced();
      setSymbol('');
      setQuantity('');
      setNotional('');
      setPrice('');
    } catch (err: any) {
      setError(typeof err === "object" && err.message ? err.message : "Order failed");
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
      <input
        type="number"
        value={quantity}
        onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
        min={0}
        step="any"
        placeholder="Quantity (shares, optional if notional used)"
      />
      <input
        type="number"
        value={notional}
        onChange={e => setNotional(e.target.value === '' ? '' : Number(e.target.value))}
        min={0}
        step="any"
        placeholder="Notional ($, optional if quantity used)"
      />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" required={type==='limit'} disabled={type==='market'} />
      <select value={type} onChange={e => setType(e.target.value as 'market' | 'limit')}>
        <option value="market">Market</option>
        <option value="limit">Limit</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
      {typeof error === "string" && <div className="text-red-500">{error}</div>}
      {error && typeof error === "object" && (
        <>
          <div className="text-red-500">{error.message}</div>
          {error.details && (
            <pre className="text-xs text-red-400 mt-1">{JSON.stringify(error.details, null, 2)}</pre>
          )}
        </>
      )}
    </form>
  );
}

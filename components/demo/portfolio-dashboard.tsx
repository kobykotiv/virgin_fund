import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { CountdownTimer } from '@/components/demo/countdown-timer';
import { DemoBadge } from '@/components/demo/demo-badge';

/**
 * DemoPortfolioDashboard displays demo portfolio data for demo users.
 */
export function DemoPortfolioDashboard({ userId }: { userId: string }) {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDemoData() {
      const { data: portfolio } = await supabase
        .from('demo_portfolios')
        .select('*')
        .eq('user_id', userId)
        .single();
      setPortfolio(portfolio);
      if (portfolio) {
        const [{ data: trades }, { data: bots }, { data: strategies }] = await Promise.all([
          supabase.from('demo_trades').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('demo_bots').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('demo_strategies').select('*').eq('portfolio_id', portfolio.id),
        ]);
        setTrades(trades || []);
        setBots(bots || []);
        setStrategies(strategies || []);
      }
    }
    fetchDemoData();
  }, [userId]);

  if (!portfolio) return <div>Loading demo portfolio...</div>;

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
      <DemoBadge />
      <CountdownTimer expiresAt={portfolio.expires_at} />
      <h2 className="text-xl font-bold mb-2">Demo Portfolio ({portfolio.currency})</h2>
      <div className="text-2xl font-mono mb-4">Balance: {portfolio.balance} {portfolio.currency}</div>
      <div className="mb-4">Positions: {portfolio.positions.map((pos: any) => (
        <div key={pos.symbol}>{pos.symbol}: {pos.qty} @ {pos.avgPrice}</div>
      ))}</div>
      <div className="mb-4">Recent Trades:
        <ul>{trades.map((trade: any) => (
          <li key={trade.id}>{trade.symbol} {trade.side} {trade.qty} @ {trade.price}</li>
        ))}</ul>
      </div>
      <div className="mb-4">Bots:
        <ul>{bots.map((bot: any) => (
          <li key={bot.id}>{bot.name} ({bot.strategy}) [{bot.status}]</li>
        ))}</ul>
      </div>
      <div className="mb-4">Strategies:
        <ul>{strategies.map((strat: any) => (
          <li key={strat.id}>{strat.name}: {strat.description}</li>
        ))}</ul>
      </div>
      <button className="bg-yellow-400 text-black px-4 py-2 rounded shadow mt-4">Save My Portfolio — Create Account</button>
    </div>
  );
}

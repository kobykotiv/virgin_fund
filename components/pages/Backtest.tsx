"use client";
import { useState } from 'react';

type RunResult = {
  id: string;
  strategy: string;
  asset: string;
  from: string;
  to: string;
  initialCapital: number;
  netReturnPct: number; // 0..100
  trades: number;
};

// Simple util to coerce possibly NaN numeric -> 0
function safePct(v: number | undefined | null): number {
  if (typeof v !== 'number') return 0;
  if (!isFinite(v) || isNaN(v)) return 0;
  return v;
}

export default function BacktestPage() {
  const [strategy, setStrategy] = useState('rsi');
  const [asset, setAsset] = useState('BTC/USD');
  const [from, setFrom] = useState<string>(() => new Date(Date.now() - 1000*60*60*24*30).toISOString().slice(0,10));
  const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [initialCapital, setInitialCapital] = useState(10000);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<RunResult[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  function runBacktest() {
    setRunning(true);
    // Simulate async backtest
    setTimeout(() => {
      const netReturnPctRaw = (Math.random() - 0.4) * 40; // -16% .. +24%
      const netReturnPct = safePct(Number(netReturnPctRaw.toFixed(2)));
      const trades = Math.floor(Math.random()*50)+5;
      const result: RunResult = {
        id: Date.now().toString(),
        strategy,
        asset,
        from,
        to,
        initialCapital,
        netReturnPct,
        trades,
      };
      setHistory(h => [result, ...h]);
      setRunning(false);
      setExpanded(result.id);
    }, 900);
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Backtest Runner</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={(e)=>{e.preventDefault(); if(!running) runBacktest();}} className="bg-gray-900 p-5 rounded-xl space-y-4 lg:col-span-1">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Strategy</label>
            <select value={strategy} onChange={e=>setStrategy(e.target.value)} className="w-full bg-gray-800 rounded px-3 py-2">
              <option value="rsi">RSI Mean Reversion</option>
              <option value="ma-crossover">MA Crossover</option>
              <option value="grid">Grid</option>
              <option value="stat-arb">Stat Arb</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Asset</label>
            <input value={asset} onChange={e=>setAsset(e.target.value)} className="w-full bg-gray-800 rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">From</label>
              <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="w-full bg-gray-800 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">To</label>
              <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="w-full bg-gray-800 rounded px-3 py-2" />
            </div>
          </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Initial Capital (USD)</label>
              <input type="number" value={initialCapital} min={0} onChange={e=>setInitialCapital(Number(e.target.value)||0)} className="w-full bg-gray-800 rounded px-3 py-2" />
            </div>
          <button type="submit" disabled={running} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded py-2 font-medium transition">
            {running ? 'Running...' : 'Run Backtest'}
          </button>
        </form>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 p-5 rounded-xl">
            <h2 className="text-lg font-semibold mb-3">Results</h2>
            {history.length === 0 && <div className="text-gray-500 text-sm">No backtests yet. Configure and run one.</div>}
            <ul className="space-y-2">
              {history.map(r => {
                const isOpen = expanded === r.id;
                return (
                  <li key={r.id} className="bg-gray-800 rounded-md overflow-hidden">
                    <button type="button" onClick={()=>setExpanded(isOpen ? null : r.id)} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-750">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-gray-400">{r.strategy}</span>
                        <span className="text-sm font-semibold">{r.asset}</span>
                        <span className={`text-sm font-medium ${r.netReturnPct>=0?'text-green-400':'text-red-400'}`}>{safePct(r.netReturnPct).toFixed(2)}%</span>
                        <span className="text-xs text-gray-500">{r.trades} trades</span>
                      </div>
                      <span className="text-xs text-gray-500">{r.from} → {r.to}</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 text-sm space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Metric label="Initial" value={`$${r.initialCapital.toLocaleString()}`} />
                          <Metric label="Return %" value={`${safePct(r.netReturnPct).toFixed(2)}%`} highlight={true} positive={r.netReturnPct>=0} />
                          <Metric label="Net P/L" value={`$${(r.initialCapital * safePct(r.netReturnPct)/100).toFixed(2)}`} positive={r.netReturnPct>=0} />
                          <Metric label="Trades" value={r.trades.toString()} />
                        </div>
                        <div className="h-40 bg-gray-900 rounded flex items-center justify-center text-gray-600 text-xs tracking-wide">
                          (Chart placeholder)
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, highlight=false, positive }: { label: string; value: string; highlight?: boolean; positive?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <span className={"mt-1 font-semibold " + (highlight ? (positive ? 'text-green-400' : 'text-red-400') : 'text-gray-200')}>{value}</span>
    </div>
  )
}

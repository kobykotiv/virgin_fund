"use client";

import { useState } from 'react';

function RiskReward() {
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(95);
  const [target, setTarget] = useState(110);
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  const ratio = risk === 0 ? 0 : reward / risk;
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold">Risk / Reward</h3>
      <input type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={stop} onChange={(e) => setStop(Number(e.target.value))} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="bg-gray-700 p-2 rounded mt-2" />
      <div className="mt-3 text-indigo-400 font-bold">Ratio: {ratio.toFixed(2)} : 1</div>
    </div>
  );
}

function PositionSize() {
  const [account, setAccount] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(95);
  const riskPerUnit = Math.abs(entry - stop);
  const dollarRisk = account * (riskPct / 100);
  const units = riskPerUnit === 0 ? 0 : Math.floor(dollarRisk / riskPerUnit);
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold">Position Size</h3>
      <input type="number" value={account} onChange={(e) => setAccount(Number(e.target.value))} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={riskPct} onChange={(e) => setRiskPct(Number(e.target.value))} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={stop} onChange={(e) => setStop(Number(e.target.value))} className="bg-gray-700 p-2 rounded mt-2" />
      <div className="mt-3 text-indigo-400 font-bold">Units: {units} (Risk ${dollarRisk.toFixed(2)})</div>
    </div>
  );
}

function Leverage() {
  const [equity, setEquity] = useState(10000);
  const [exposure, setExposure] = useState(50000);
  const lev = equity === 0 ? 0 : exposure / equity;
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold">Leverage</h3>
      <input type="number" value={equity} onChange={(e)=>setEquity(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={exposure} onChange={(e)=>setExposure(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded mt-2" />
      <div className="mt-3 text-indigo-400 font-bold">Leverage: {lev.toFixed(2)}x</div>
    </div>
  );
}

function PivotPoints() {
  const [high, setHigh] = useState(100);
  const [low, setLow] = useState(90);
  const [close, setClose] = useState(95);
  const pp = (high + low + close) / 3;
  const r1 = 2 * pp - low;
  const s1 = 2 * pp - high;
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold">Pivot Points</h3>
      <input type="number" value={high} onChange={(e)=>setHigh(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={low} onChange={(e)=>setLow(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded mt-2" />
      <input type="number" value={close} onChange={(e)=>setClose(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded mt-2" />
      <div className="mt-3 text-indigo-400 font-bold space-y-1">
        <div>PP: {pp.toFixed(2)}</div>
        <div>R1: {r1.toFixed(2)}</div>
        <div>S1: {s1.toFixed(2)}</div>
      </div>
    </div>
  );
}

type CalcTab = 'risk' | 'position' | 'leverage' | 'pivots';

export default function TradingCalculators() {
  const [active, setActive] = useState<CalcTab>('risk');
  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Trading Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <nav className="md:col-span-1 bg-gray-900 p-3 rounded space-y-2">
          <NavBtn label="Risk/Reward" active={active==='risk'} onClick={()=>setActive('risk')} />
          <NavBtn label="Position Size" active={active==='position'} onClick={()=>setActive('position')} />
          <NavBtn label="Leverage" active={active==='leverage'} onClick={()=>setActive('leverage')} />
          <NavBtn label="Pivot Points" active={active==='pivots'} onClick={()=>setActive('pivots')} />
        </nav>
        <main className="md:col-span-3">
          {active === 'risk' && <RiskReward />}
          {active === 'position' && <PositionSize />}
          {active === 'leverage' && <Leverage />}
          {active === 'pivots' && <PivotPoints />}
        </main>
      </div>
    </div>
  );
}

function NavBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={`w-full text-left py-2 px-3 rounded transition ${active ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={onClick}>
      {label}
    </button>
  );
}

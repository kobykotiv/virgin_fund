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

export default function TradingCalculators() {
  const [active, setActive] = useState<"risk" | "position">("risk");
  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Trading Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <nav className="md:col-span-1 bg-gray-900 p-3 rounded">
          <button className={`w-full text-left py-2 px-3 rounded ${active === "risk" ? "bg-indigo-600" : "hover:bg-gray-800"}`} onClick={() => setActive("risk")}>
            Risk/Reward
          </button>
          <button className={`w-full text-left py-2 px-3 rounded mt-2 ${active === "position" ? "bg-indigo-600" : "hover:bg-gray-800"}`} onClick={() => setActive("position")}>
            Position Size
          </button>
        </nav>
        <main className="md:col-span-3">{active === "risk" ? <RiskReward /> : <PositionSize />}</main>
      </div>
    </div>
  );
}

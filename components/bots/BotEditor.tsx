import React, { useState } from 'react';

export default function BotEditor({ onSave, initial }: any) {
  const [name, setName] = useState(initial?.name || '');
  const [currency, setCurrency] = useState(initial?.currency || 'USD');
  const [dcaAmount, setDcaAmount] = useState(initial?.dca_amount || 100);
  const [stopLoss, setStopLoss] = useState(initial?.stop_loss || -5);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full" />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium">Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 block w-full">
          <option>USD</option>
          <option>EUR</option>
          <option>BTC</option>
        </select>
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium">DCA Amount</label>
        <input type="number" value={dcaAmount} onChange={(e) => setDcaAmount(Number(e.target.value))} className="mt-1 block w-full" />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-medium">Stop Loss %</label>
        <input type="number" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} className="mt-1 block w-full" />
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => onSave({ name, currency, dca_amount: dcaAmount, stop_loss: stopLoss })} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
      </div>
    </div>
  );
}

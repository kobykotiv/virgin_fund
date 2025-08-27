"use client";
import React from 'react';

type Props = {
  id: string;
  name: string;
  strategy: string;
  status: string;
  currentPnL: number;
  allocatedCapital: number;
};

export default function BotCard({ id, name, strategy, status, currentPnL, allocatedCapital }: Props) {
  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <div className="text-sm text-muted-foreground">{strategy}</div>
        </div>
        <div className="text-right">
          <div className="text-sm">{status}</div>
          <div className={`font-mono ${currentPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>{currentPnL}%</div>
        </div>
      </div>
      <div className="mt-3 text-sm">Allocated: ${allocatedCapital}</div>
      <div className="mt-3 flex gap-2">
        <button className="px-2 py-1 bg-blue-500 text-white rounded">Start</button>
        <button className="px-2 py-1 bg-gray-200 rounded">Pause</button>
        <button className="px-2 py-1 bg-red-500 text-white rounded">Stop</button>
        <button className="px-2 py-1 bg-indigo-500 text-white rounded">Clone</button>
      </div>
    </div>
  );
}

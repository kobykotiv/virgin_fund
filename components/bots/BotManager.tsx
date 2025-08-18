import React, { useState } from 'react';
import { useBots } from '@/lib/hooks/useBots';

export default function BotManager({ userId }: { userId: string }) {
  const { bots, isLoading, createBot, updateBot, deleteBot } = useBots(userId);
  const [creating, setCreating] = useState(false);

  if (isLoading) return <div>Loading bots...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Trading Bots</h2>
      <button
        onClick={async () => {
          setCreating(true);
          await createBot({ user_id: userId, name: 'AAPL DCA', currency: 'USD', dca_amount: 100, stop_loss: -5 });
          setCreating(false);
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Bot
      </button>
      <ul className="mt-4 space-y-2">
        {bots?.map((bot: any) => (
          <li key={bot.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded flex justify-between">
            <div>
              <div className="font-semibold">{bot.name}</div>
              <div className="text-sm text-gray-500">{bot.currency} • DCA {bot.dca_amount} • SL {bot.stop_loss}%</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateBot(bot.id, { stop_loss: Number(bot.stop_loss) - 1 })} className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">Lower SL</button>
              <button onClick={() => deleteBot(bot.id)} className="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

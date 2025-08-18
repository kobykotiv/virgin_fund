import React from 'react';
import { useSettings } from '@/lib/hooks/useSettings';

export default function GlobalControls({ userId }: { userId: string }) {
  const { settings } = useSettings(userId);

  const liquidateAll = async () => {
    if (!confirm('Are you sure? This will mark all bots as liquidated.')) return;
    const res = await fetch('/api/bots/liquidate-all', { method: 'POST', headers: { 'x-user-id': userId, 'x-confirmation-token': 'dev-only-unsafe' } });
    if (res.ok) alert('Liquidated');
  };

  if (!settings || !settings.developer_mode) return null;

  return (
    <div>
      <button onClick={liquidateAll} className="bg-red-600 text-white px-4 py-2 rounded">🚨 Liquidate Everything</button>
    </div>
  );
}

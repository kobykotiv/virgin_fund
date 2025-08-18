import React from 'react';
import BotManager from '@/components/bots/BotManager';
import GlobalControls from '@/components/settings/GlobalControls';

export default function BotsPage() {
  // placeholder: in real app get userId from Supabase session
  const userId = process.env.NEXT_PUBLIC_TEST_USER_ID || '';
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bots</h1>
      <BotManager userId={userId} />
      <div className="mt-6">
        <GlobalControls userId={userId} />
      </div>
    </div>
  );
}

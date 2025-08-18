import React from 'react';
import { useRouter } from 'next/router';
import BacktestResults from '@/components/bots/BacktestResults';
import { useBacktests } from '@/lib/hooks/useBacktests';

export default function BotDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const botId = id ? Number(id) : null;
  const { backtests } = useBacktests(botId);

  const latest = backtests?.[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bot Details - {id}</h1>
      {latest ? <BacktestResults results={latest.results} /> : <div>No backtests yet</div>}
    </div>
  );
}

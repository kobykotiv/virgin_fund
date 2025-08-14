import { useEffect, useState, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AuthContext } from '@/providers/auth-provider';

export default function BotAnalytics() {
  const { user } = useContext(AuthContext) || {};
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch('/api/bots/analytics', {
      headers: { 'x-user-id': user.id }
    })
      .then(res => res.json())
      .then(setStats);
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data.leaderboard || []))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <div>Loading analytics...</div>;
  if (!stats) return <div>No analytics found.</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Bot Analytics</h2>
      <div>Total Bots: {stats.count}</div>
      <div className="mt-2">
        <strong>By Type:</strong>
        <ul>
          {stats.types.map((type: string) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <strong>By Risk:</strong>
        <ul>
          {stats.riskLevels.map((risk: string) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Leaderboard (Top 10 Bots)</h3>
        <ol className="list-decimal ml-6">
          {leaderboard.map((bot, idx) => (
            <li key={bot.id} className="mb-1">
              <span className="font-bold">{bot.name}</span> (Performance: {bot.performance})
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

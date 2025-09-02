"use client";

type OverviewUser = { name?: string };
type OverviewPortfolio = { totalValue?: number; dailyChange?: number; allocation?: Record<string, number> };
type OverviewBot = { id: string; name: string; status: string };

export default function Overview({ user, portfolio, activeBots }: { user?: OverviewUser; portfolio?: OverviewPortfolio; activeBots?: OverviewBot[] }) {
  const p = portfolio ?? { totalValue: 0, dailyChange: 0, allocation: {} };
  const bots = activeBots ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-300">Your portfolio is performing exactly as expected.</h1>
        <p className="text-gray-400 mt-1">Total market dominance is only a matter of time, {user?.name ?? 'Trader'}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-gray-800 rounded-xl shadow-lg p-5">
          <h2 className="text-lg font-semibold text-white">Portfolio Summary</h2>
          <p className="text-3xl font-bold mt-3">${(p.totalValue ?? 0).toLocaleString()}</p>
          <p className={"mt-2 " + ((p.dailyChange ?? 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
            {typeof p.dailyChange === 'number' ? `${p.dailyChange >= 0 ? '+' : ''}${p.dailyChange}%` : '—'}
          </p>

          <div className="mt-4 space-y-2">
            {p.allocation && Object.keys(p.allocation).length > 0 ? (
              Object.entries(p.allocation).slice(0, 5).map(([k, raw]) => {
                const num = typeof raw === 'number' && isFinite(raw) ? raw : 0;
                return (
                  <div key={k} className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">{k}</div>
                    <div className="text-sm text-gray-200">{num.toFixed(2)}%</div>
                  </div>
                )
              })
            ) : (
              <div className="text-gray-400">No allocation data</div>
            )}
          </div>
        </section>

        <section className="bg-gray-800 rounded-xl shadow-lg p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Active Bots</h2>
          <div className="mt-3 grid gap-3">
            {bots.length === 0 ? (
              <div className="text-gray-400">No active bots</div>
            ) : (
              bots.map((bot) => (
                <div key={bot.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-md">
                  <div>
                    <div className="font-medium">{bot.name}</div>
                    <div className="text-sm text-gray-400">{bot.status}</div>
                  </div>
                  <a className="text-indigo-400 hover:underline" href={`/bots/${bot.id}`}>
                    View
                  </a>
                </div>
              ))
            )}
          </div>

          <h3 className="mt-6 text-lg font-semibold">Recent Activity</h3>
          <div className="mt-3 text-gray-400">No recent trades to show.</div>
        </section>
      </div>
    </div>
  );
}

// Dashboard landing page for Trading Bot Social Platform

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Bot Army Dashboard</h1>
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground">
          Welcome to your trading bot social platform. Here you can manage your bots, track portfolios, set up watchlists, and view live market data.
        </p>
        {/* Bot Army overview — developer prompt */}
        <div className="mt-6 text-center text-muted-foreground">
          <strong>Bot Army Overview — Implementation Prompt</strong>
          <p className="mt-2">Render a responsive grid/list of bots with these features:</p>
          <ul className="text-left inline-block mt-2 list-disc list-inside">
            <li>Bot card: name, strategy, status, current PnL, allocated capital, quick actions (start/pause/stop/edit/clone).</li>
            <li>Filter/sort by status, performance, and strategy. Add a compact search box.</li>
            <li>Bulk actions (start/stop/delete) and pagination/virtualized list for large bot counts.</li>
            <li>Data from `useBots()` React Query hook; show loading, empty, and error states.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Summary of Changes:
// - Created dashboard landing page with welcome message and placeholder for Bot Army overview.

// Bots page for Trading Bot Social Platform

export default function BotsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Your Bots</h1>
      <div className="rounded-lg border bg-card p-6">
        {/* Bots management — developer prompt */}
        <div className="text-center text-muted-foreground">
          <strong>Bots Management — Implementation Prompt</strong>
          <p className="mt-2">Implement a bots management interface that includes:</p>
          <ul className="text-left inline-block mt-2 list-disc list-inside">
            <li>List or table of bots with columns: name, strategy, status, PnL, last trade, actions.</li>
            <li>Create Bot flow: choose strategy, parameters, capital allocation, and risk settings.</li>
            <li>React Query mutations for create/update/delete with optimistic UI and error handling.</li>
            <li>Integrate Supabase for persistence and realtime updates via `useBots()` and subscriptions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Summary of Changes:
// - Created Bots page with placeholder for bot list and management UI.

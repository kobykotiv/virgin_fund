// Bots page for Trading Bot Social Platform

import BotArmyGrid from "@/components/bot-configuration/BotArmyGrid";

export default function BotsPage() {
  return (
    <main className="space-y-8">
      <h1 className="text-2xl font-bold">Your Bots</h1>
      <section className="rounded-lg border bg-card p-6">
        <BotArmyGrid />
      </section>
    </main>
  );
}

// Summary of Changes:
// - Created Bots page with placeholder for bot list and management UI.

"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { AccountSummary } from "@/components/account-summary";
import MarketQuotesWidget from "@/components/tradingview/MarketQuotesWidget";
import { PositionsTable } from "@/components/positions-table";
import { RecentOrders } from "@/components/recent-orders";
import { EnhancedDashboard } from "@/components/enhanced-dashboard";
import type { BotWithPortfolio } from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your trading account and activity."
      />
      <div className="grid gap-6">
        <AccountSummary />
        <MarketQuotesWidget colorTheme="dark" height={400} />
        <PositionsTable />
        <RecentOrders /> 
        <EnhancedDashboard 
          apiConfig={null}
          onBotAction={async () => {}}
          isLoading={false}
          portfolio={null}
          scenarios={[]}
          selectedScenario={null}
          onScenarioSelect={() => {}}
          managedBots={[]}
          selectedBot={null}
          onBotSelect={() => {}}
          onBotCreate={async (bot: Partial<BotWithPortfolio>) => {}}
          onBotUpdate={async (botId: string, updates: Partial<BotWithPortfolio>) => {}}
          onBotDelete={async (botId: string) => {}}
          onAddBot={() => {}}
        />
      </div>
    </DashboardShell>
  );
}

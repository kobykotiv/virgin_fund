"use client";

import React, { useState } from "react";
import { ToastProvider } from "@/components/toast-provider";
import AccessBanner from "@/components/access-banner";
import PortfolioSummaryCard from "@/components/portfolio-summary-card";
import QuickActionsToolbar from "@/components/quick-actions-toolbar";
import PerformanceChart from "@/components/performance-chart";
import BotManagementTable from "@/components/bot-management-table";
import TransactionTimeline from "@/components/transaction-timeline";
import NotificationDrawer from "@/components/notification-drawer";
import TeamPanel from "@/components/team-panel";
import SettingsModal from "@/components/settings-modal";
import ActivityFeed from "@/components/activity-feed";

/*
  Dashboard Demo
  - Purpose: Compose the interactive components implemented earlier so you can preview them
  - This page uses mock data where applicable (PerformanceChart is fed inline mock series)
  - Wrap with ToastProvider so components can push toasts during interactions
*/

const mockChartData = [
  { date: "2025-08-01", botA: 10000, botB: 8000, fundX: 12000 },
  { date: "2025-08-08", botA: 10250, botB: 8200, fundX: 12150 },
  { date: "2025-08-15", botA: 10100, botB: 8300, fundX: 12200 },
  { date: "2025-08-22", botA: 10350, botB: 8500, fundX: 12300 },
  { date: "2025-08-29", botA: 10600, botB: 8600, fundX: 12500 },
  { date: "2025-09-05", botA: 10800, botB: 8900, fundX: 12750 },
];

export default function DashboardDemoPage() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ToastProvider>
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Role-based banner */}
          <AccessBanner requiredRole="editor" />

          {/* Controls: Notifications / Settings (demo) */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setNotifOpen(true)}
              className="px-3 py-1 rounded border bg-white text-sm"
              aria-label="Open notifications"
            >
              Notifications
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-3 py-1 rounded border bg-white text-sm"
              aria-label="Open settings"
            >
              Settings
            </button>
          </div>

          {/* Notification drawer & Settings modal (controlled) */}
          <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

          {/* Quick actions + Summary row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="col-span-2 space-y-4">
              <QuickActionsToolbar />
              <PortfolioSummaryCard />
            </div>

            <div className="w-full">
              {/* Performance chart with mock data for demo */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Portfolio Performance</h3>
                <PerformanceChart
                  data={mockChartData}
                  series={[
                    { key: "botA", name: "Bot A", color: "#2563EB" },
                    { key: "botB", name: "Bot B", color: "#10B981" },
                    { key: "fundX", name: "Fund X", color: "#F59E0B" },
                  ]}
                  height={300}
                />
              </div>
            </div>
          </section>

          {/* Bot management + Transactions */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Bots</h3>
                <BotManagementTable />
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
                <TransactionTimeline />
              </div>
            </div>
          </section>
        </div>
      </main>
    </ToastProvider>
  );
}

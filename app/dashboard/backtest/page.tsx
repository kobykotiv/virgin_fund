// app/dashboard/backtest/page.tsx
"use client"
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { useBacktests } from "@/lib/hooks/useBacktests";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

export default function BacktestDashboardPage() {
  // Demo mode and userId would come from context/auth
  const [demoMode] = useState(false);
  const [userId] = useState(""); // TODO: Replace with actual user ID from auth
  const { backtests = [], isLoading } = useBacktests(null as any);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Backtest Dashboard"
        text="View, create, and manage your strategy backtests"
      />
      <Card className="mt-6">
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Parameters</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">Loading...</td>
              </tr>
            ) : backtests.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8">No backtests found</td>
              </tr>
            ) : (
              backtests.map((bt: any) => (
                <tr key={bt.id}>
                  <td>{bt.title}</td>
                  <td>{bt.description}</td>
                  <td>
                    <pre className="text-xs">{JSON.stringify(bt.parameters, null, 2)}</pre>
                  </td>
                  <td>{new Date(bt.created_at).toLocaleString()}</td>
                  <td>
                    {/* TODO: Add Edit/Delete buttons, modals */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </DashboardShell>
  );
}

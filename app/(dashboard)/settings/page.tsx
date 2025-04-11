"use client"; // This page needs client-side interaction for the form

import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSettings } from "@/components/dashboard-settings"; // We'll create this next

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account and application settings."
      />
      <div className="grid gap-10">
        {/* We will place the settings component here */}
        <DashboardSettings />
      </div>
    </DashboardShell>
  );
}

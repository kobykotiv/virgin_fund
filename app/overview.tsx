import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { EnhancedDashboard } from "@/components/enhanced-dashboard";
import PlanCallout from "@/components/plan-callout";

export default function Overview() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <h1 className="text-2xl font-bold mb-0">Overview</h1>
          <div className="w-full md:w-72">
            <PlanCallout plan="Free" />
          </div>
        </div>

        <EnhancedDashboard onBotAction={async () => {}} isLoading={false} />
      </div>
    </DashboardLayout>
  );
}

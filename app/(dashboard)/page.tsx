// Minimalist dashboard landing page for /dashboard

import DashboardNav from "@/components/dashboard-nav";
import DashboardFooter from "@/components/dashboard-footer";
import DashboardMetrics from "@/components/dashboard-metrics";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNav />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <DashboardMetrics />
      </main>
      <DashboardFooter />
    </div>
  );
}

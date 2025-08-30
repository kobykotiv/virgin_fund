"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard-header";
import { EnhancedDashboard } from "@/components/enhanced-dashboard";
import { BasicDashboard } from "@/components/basic-dashboard";
import { MultiPanelDashboard } from "@/components/layout/multi-panel-dashboard";
import { CompactDashboard } from "@/components/layout/compact-dashboard";
import { DashboardSwitcher, LayoutType } from "@/components/dashboard-switcher";
import { useToast } from "@/components/ui/use-toast";

interface DashboardProps {
  bots: any[];
  apiConfig?: {
    keyId: string;
    secretKey: string;
    baseUrl: string;
    isPaper: boolean;
  } | null;
}

export function Dashboard({ bots, apiConfig }: DashboardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string[]>([]);
  const [dashboardLayout, setDashboardLayout] = useState<LayoutType>('enhanced');

  const handleBotAction = async (botId: string, action: 'start' | 'stop' | 'delete') => {
    setLoading(prev => [...prev, botId]);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: `Bot action ${action} completed successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to perform bot action`,
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => prev.filter(id => id !== botId));
    }
  };

  const handleLayoutSwitch = (layout: LayoutType) => {
    setDashboardLayout(layout);
  };

  const renderDashboard = () => {
    const commonProps = {
      apiConfig,
      onBotAction: handleBotAction,
      isLoading: loading.length > 0,
      portfolio: undefined // Mock portfolio
    };

    switch (dashboardLayout) {
      case 'basic':
        return <BasicDashboard {...commonProps} />;
      case 'enhanced':
        return <EnhancedDashboard {...commonProps} />;
      case 'multi-panel':
        return <MultiPanelDashboard {...commonProps} />;
      case 'compact':
        return <CompactDashboard {...commonProps} />;
      default:
        return <EnhancedDashboard {...commonProps} />;
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your trading bots, portfolios, and strategies." />

      <DashboardSwitcher
        onSwitch={handleLayoutSwitch}
        currentLayout={dashboardLayout}
      />

      {renderDashboard()}
    </DashboardShell>
  );
}
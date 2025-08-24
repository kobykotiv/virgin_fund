"use client";
import React, { useState } from "react";
import { portfolios as demoPortfolios } from "@/lib/demo-portfolios";
import { DEMO_PORTFOLIO_KEY, initializeDemoData } from "@/services/demo-service";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

/**
 * DemoPicker
 * - Applies selected demo data to localStorage (existing behavior)
 * - Shows a transient toast confirmation after apply
 * - Attempts a best-effort server persistence by POSTing to /api/market/portfolio/demo
 *
 * Notes:
 * - Server persistence is best-effort; failures are ignored but logged.
 * - Toast uses the project's shared useToast hook for consistency with other UI.
 */

export default function DemoPicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applyAllocation, setApplyAllocation] = useState(true);
  const [applyStrategy, setApplyStrategy] = useState(true);
  const [applyIndicators, setApplyIndicators] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const selected = demoPortfolios.find((p: any) => p.id === selectedId) ?? null;

  const handleApply = async () => {
    if (!selected) return;

    // Build a minimal demo portfolio object to persist for demo services
    const payload: any = {
      id: selected.id,
      name: selected.name ?? selected.title ?? "Demo Portfolio",
      description: selected.description,
    };

    if (applyAllocation && selected.allocation) payload.allocation = selected.allocation;
    if (applyStrategy && selected.strategy) payload.strategy = selected.strategy;
    if (applyIndicators) {
      // copy any indicator / grid / config fields that look relevant
      if (selected.indicatorConfig) payload.indicatorConfig = selected.indicatorConfig;
      if (selected.gridConfig) payload.gridConfig = selected.gridConfig;
      if (selected.dcaConfig) payload.dcaConfig = selected.dcaConfig;
    }

    // Also try to persist positions/holdings if present and user chose allocation
    if (applyAllocation && selected.positions) payload.positions = selected.positions;

    try {
      localStorage.setItem(DEMO_PORTFOLIO_KEY, JSON.stringify(payload));
      // Ensure demo initialization (bots/watchlists/etc) runs when demo mode is enabled
      initializeDemoData();
      // Refresh the app router so clients re-run data fetching hooks
      router.refresh();

      // Fire a success toast summarizing what was applied
      const parts = [
        applyAllocation ? "Allocation" : null,
        applyStrategy ? "Strategy" : null,
        applyIndicators ? "Indicators" : null,
      ]
        .filter(Boolean)
        .join(", ") || "settings";

      toast({
        title: "Demo applied",
        description: `${payload.name} — applied: ${parts}`,
        variant: "default",
      });

      // Best-effort: persist to server-side portfolio record (if user is authenticated)
      // Failures are logged but don't block the UI.
      try {
        await fetch("/api/market/portfolio/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // Non-fatal; log for debugging
        // eslint-disable-next-line no-console
        console.warn("Failed to persist demo to server (best-effort)", err);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to apply demo portfolio", e);
      toast({
        title: "Failed to apply demo",
        description: "Could not apply the selected demo portfolio.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 bg-card rounded">
      <h3 className="text-lg font-semibold mb-2">Add from demos</h3>
      <p className="text-sm text-muted-foreground mb-3">Pick a demo portfolio and choose which parts to apply to your demo portfolio.</p>

      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-auto mb-3">
        {demoPortfolios.slice(0, 24).map((p: any) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`text-left p-2 rounded border ${selectedId === p.id ? 'border-primary' : 'border-transparent'} hover:border-secondary`}
          >
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={applyAllocation} onChange={(e) => setApplyAllocation(e.target.checked)} /> Allocation/Positions</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={applyStrategy} onChange={(e) => setApplyStrategy(e.target.checked)} /> Strategy/Template</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={applyIndicators} onChange={(e) => setApplyIndicators(e.target.checked)} /> Indicators/Configs</label>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handleApply} className="btn btn-primary" disabled={!selected}>Apply to my demo portfolio</button>
        <button onClick={() => { setSelectedId(null); setApplyAllocation(true); setApplyStrategy(true); setApplyIndicators(true); }} className="btn btn-ghost">Clear</button>
      </div>
    </div>
  );
}

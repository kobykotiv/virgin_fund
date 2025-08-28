"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Grid,
  Zap,
  BarChart2,
  Calculator,
  Settings,
  DollarSign,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * NavigationSidebar.tsx
 *
 * Self-contained responsive, deeply nested sidebar component.
 * - Fetches navigation from /api/navigation with a static fallback.
 * - Supports 3-4 levels of nesting.
 * - Uses a Set of open IDs to control expanded sections.
 * - Smooth CSS-based expand/collapse via max-height transitions.
 * - Mobile hamburger -> slide-out panel.
 *
 * Notes:
 * - Keeps behavior consistent with existing DeepSidebar.tsx in the repo.
 * - Maps simple icon strings (from API) to lucide-react icon components.
 */

/* ----- Types ----- */
type NavItem = {
  id: string;
  label: string;
  path?: string;
  icon?: string; // icon name from API (mapped to actual icon component)
  children?: NavItem[];
};

/* ----- Static fallback (same shape as server data) ----- */
const STATIC_NAV: NavItem[] = [
  { id: "overview", label: "Overview", path: "/overview", icon: "pie" },
  { id: "dashboard", label: "Dashboard", path: "/", icon: "grid" },
  { id: "signals", label: "Custom Signals", path: "/signals", icon: "zap" },
  { id: "backtest", label: "Backtest", path: "/backtest", icon: "bar-chart" },
  { id: "portfolio", label: "Portfolio", path: "/portfolio", icon: "settings" },
  {
    id: "financial_tools",
    label: "Financial Tools",
    icon: "calculator",
    children: [
      {
        id: "financial_calculators",
        label: "Financial Calculators",
        path: "/calculators/financial",
        icon: "calculator",
      },
      {
        id: "financial_examples",
        label: "Example Calculators",
        children: [
          { id: "compound", label: "Compound Interest", path: "/calculators/compound-interest", icon: "calculator" },
          { id: "savings", label: "Savings Calculator", path: "/calculators/savings", icon: "calculator" },
          { id: "retirement", label: "Retirement Calculator", path: "/calculators/retirement", icon: "calculator" },
          { id: "inflation", label: "Inflation Calculator", path: "/calculators/inflation", icon: "calculator" },
        ],
      },
      { id: "market_analysis", label: "Market Analysis", path: "/calculators/market-analysis", icon: "bar-chart" },
    ],
  },
  {
    id: "trading_tools",
    label: "Trading Tools",
    icon: "zap",
    children: [
      { id: "trading_calculators", label: "Trading Calculators", path: "/calculators/trading", icon: "calculator" },
      { id: "strategy_builder", label: "Strategy Builder", path: "/strategies/builder", icon: "settings" },
    ],
  },
];

/* ----- Icon mapping from API string -> lucide-react component ----- */
function IconForName({ name }: { name?: string }) {
  const className = "w-4 h-4 text-indigo-300";
  switch (name) {
    case "grid":
      return <Grid className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "bar-chart":
      return <BarChart2 className={className} />;
    case "calculator":
      return <Calculator className={className} />;
    case "settings":
      return <Settings className={className} />;
    case "dollar":
      return <DollarSign className={className} />;
    case "pie":
      return <PieChart className={className} />;
    default:
      return <Grid className={className} />;
  }
}

/* ----- Recursive nav row ----- */
function NavRow({
  item,
  depth = 0,
  openIds,
  toggle,
  onNavigate,
}: {
  item: NavItem;
  depth?: number;
  openIds: Set<string>;
  toggle: (id: string) => void;
  onNavigate: (path?: string) => void;
}) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const open = openIds.has(item.id);

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) toggle(item.id);
          else onNavigate(item.path);
        }}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          "flex items-center w-full px-3 py-2 text-sm rounded transition-colors",
          "hover:bg-indigo-700/30 hover:text-white",
          "text-gray-300",
          open ? "bg-indigo-800/50 text-white shadow-[0_0_8px_rgba(79,70,229,0.18)]" : ""
        )}
        style={{ paddingLeft: 12 + depth * 14 }}
      >
        <span className="inline-flex items-center justify-center mr-2">
          <IconForName name={item.icon} />
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        {hasChildren ? (open ? <ChevronDown className="w-4 h-4 text-gray-300" /> : <ChevronRight className="w-4 h-4 text-gray-300" />) : null}
      </button>

      {hasChildren && (
        <div className={`overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-screen" : "max-h-0"}`}>
          {item.children!.map((child) => (
            <NavRow key={child.id} item={child} depth={depth + 1} openIds={openIds} toggle={toggle} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----- Main component ----- */
export default function NavigationSidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: {
  className?: string;
  isCollapsed?: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [nav, setNav] = useState<NavItem[] | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/navigation")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: NavItem[]) => {
        if (!mounted) return;
        setNav(data);
      })
      .catch(() => {
        // fallback to static nav to ensure sidebar always renders
        setNav(STATIC_NAV);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const handleNavigate = (path?: string) => {
    if (!path) return;
    if (typeof window !== "undefined") window.location.href = path;
  };

  const items = nav ?? STATIC_NAV;

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          aria-label="Open menu"
          onClick={() => setOpenMobile((v) => !v)}
          className="p-2 rounded bg-gray-900/80 text-indigo-300 shadow"
        >
          <Menu />
        </button>
      </div>

      {/* Sidebar for md+ */}
      <aside className={cn("hidden md:flex flex-col bg-gray-950 text-gray-100 h-full", "w-64", className || "")}>
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <div className="text-indigo-300 font-semibold">Virgin Fund</div>
        </div>
        <nav className="p-2 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavRow key={item.id} item={item} openIds={openIds} toggle={toggle} onNavigate={handleNavigate} />
          ))}
        </nav>
      </aside>

      {/* Mobile slide-out */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${openMobile ? "visible opacity-100" : "invisible opacity-0"}`}
        onClick={() => setOpenMobile(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-gray-950 p-4 transform transition-transform ${openMobile ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-indigo-300 font-semibold">Virgin Fund</div>
            <button onClick={() => setOpenMobile(false)} className="p-1 text-gray-300">
              Close
            </button>
          </div>
          <nav className="space-y-1">
            {items.map((item) => (
              <NavRow
                key={item.id}
                item={item}
                openIds={openIds}
                toggle={(id) => {
                  toggle(id);
                }}
                onNavigate={(p) => {
                  handleNavigate(p);
                  setOpenMobile(false);
                }}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

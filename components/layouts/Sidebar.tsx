// Sidebar navigation for Trading Bot Social Platform
// Uses shadcn/ui and Tailwind

import { Sidebar as ShadSidebar } from "@/components/ui/sidebar";
import { Home, Users, PieChart, Eye, BarChart2 } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r flex flex-col min-h-screen">
      <div className="p-6 font-bold text-xl tracking-tight">Bot Army</div>
      <nav className="flex-1 px-4 space-y-2">
        <NavLink href="/" icon={<Home className="w-5 h-5" />}>Dashboard</NavLink>
        <NavLink href="/bots" icon={<Users className="w-5 h-5" />}>Bots</NavLink>
        <NavLink href="/portfolios" icon={<PieChart className="w-5 h-5" />}>Portfolios</NavLink>
        <NavLink href="/watchlists" icon={<Eye className="w-5 h-5" />}>Watchlists</NavLink>
        <NavLink href="/market" icon={<BarChart2 className="w-5 h-5" />}>Market Data</NavLink>
      </nav>
      <div className="p-4 text-xs text-muted-foreground">© 2025 Bot Army</div>
    </aside>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors">
      {icon}
      <span>{children}</span>
    </Link>
  );
}

// Summary of Changes:
// - Created Sidebar navigation with links for Dashboard, Bots, Portfolios, Watchlists, and Market Data.
// - Uses shadcn/ui, Tailwind, and Lucide icons for a modern look.

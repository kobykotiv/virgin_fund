// Watchlists page for Trading Bot Social Platform
import { EnhancedWatchlistManager } from "@/components/enhanced-watchlist-manager";

export default function WatchlistsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Watchlists & Alerts</h1>
      <EnhancedWatchlistManager />
    </div>
  );
}

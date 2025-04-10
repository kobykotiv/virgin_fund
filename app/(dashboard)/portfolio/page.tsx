import { AccountSummary } from '@/components/account-summary';
import { PositionsTable } from '@/components/positions-table';
import { RecentOrders } from '@/components/recent-orders';
import { MarketCalendar } from '@/components/market-calendar';
import { PortfolioHistoryChart } from '@/components/portfolio-history-chart';
import { Watchlists } from '@/components/watchlists';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="watchlists">Watchlists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccountSummary />
            <MarketCalendar days={7} />
          </div>
          
          <PortfolioHistoryChart />
        </TabsContent>
        
        <TabsContent value="positions" className="space-y-6 mt-6">
          <PositionsTable />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-6 mt-6">
          <RecentOrders />
        </TabsContent>
        
        <TabsContent value="watchlists" className="space-y-6 mt-6">
          <Watchlists />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { PortfolioCard } from "@/components/portfolio-card"
import { PortfolioSummaryWidget } from "@/components/portfolio-summary-widget"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Mock data - will be replaced with actual data fetching
const mockPortfolios = [
  {
    id: "1",
    name: "Growth Portfolio",
    type: "standard" as const,
    risk: "aggressive" as const,
    totalValue: 54298.76,
    pnl: 1245.32,
    pnlPercentage: 2.34,
    assetCount: 8
  },
  {
    id: "2",
    name: "Dividend Income",
    type: "standard" as const,
    risk: "conservative" as const,
    totalValue: 28742.19,
    pnl: -324.87,
    pnlPercentage: -1.12,
    assetCount: 5
  },
  {
    id: "3",
    name: "Tech Focus",
    type: "margin" as const,
    risk: "moderate" as const,
    totalValue: 32567.93,
    pnl: 2876.45,
    pnlPercentage: 9.68,
    assetCount: 6
  }
]

export default function PortfoliosPage() {
  // Calculate summary statistics
  const totalValue = mockPortfolios.reduce((sum, p) => sum + p.totalValue, 0)
  const totalPnl = mockPortfolios.reduce((sum, p) => sum + p.pnl, 0)
  const totalPnlPercentage = (totalPnl / (totalValue - totalPnl)) * 100
  
  // Find best performing portfolio
  const bestPerforming = [...mockPortfolios].sort((a, b) => b.pnlPercentage - a.pnlPercentage)[0]
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Portfolios</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Portfolio
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <PortfolioSummaryWidget 
            totalPortfolios={mockPortfolios.length}
            totalValue={totalValue}
            totalPnl={totalPnl}
            totalPnlPercentage={totalPnlPercentage}
            bestPerforming={bestPerforming}
          />
        </div>
        
        {mockPortfolios.map(portfolio => (
          <PortfolioCard key={portfolio.id} portfolio={portfolio} />
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {PerformanceChart} from "@/components/performance-chart";

// Example tier config
const TIER_LIMITS = {
  free: 1,
  basic: 3,
  premium: Infinity,
};

// Example templates
const PORTFOLIO_TEMPLATES = [
  { name: "S&P 500 Momentum", description: "Momentum strategy for S&P 500 stocks." },
  { name: "Crypto Grid Trading", description: "Grid trading for major cryptocurrencies." },
  { name: "DeFi Yield Optimizer", description: "Rotates capital between DeFi protocols." },
];

type UserTier = keyof typeof TIER_LIMITS;

type PortfolioTemplate = {
  name: string;
  description: string;
};

type Portfolio = PortfolioTemplate & {
  id: number;
};

export default function DemoPortfolioManager({ userTier = "free" }: { userTier?: UserTier }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const maxPortfolios = TIER_LIMITS[userTier];

  // Add portfolio from template
  const addPortfolio = (template: PortfolioTemplate) => {
    if (portfolios.length >= maxPortfolios) return alert("Upgrade your account to add more portfolios.");
    setPortfolios([...portfolios, { ...template, id: Date.now() }]);
  };

  // Remove portfolio
  const removePortfolio = (id: number) => setPortfolios(portfolios.filter((p) => p.id !== id));

  // Edit portfolio
  const editPortfolio = (id: number, newData: Partial<PortfolioTemplate>) => {
    setPortfolios(portfolios.map((p) => p.id === id ? { ...p, ...newData } : p));
  };

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Your Demo Portfolios</h2>
      <div className="mb-4">
        <Badge>
          {portfolios.length} / {maxPortfolios === Infinity ? "∞" : maxPortfolios} portfolios
        </Badge>
      </div>
      <div className="grid gap-4 mb-8">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id}>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <Input
                    value={portfolio.name}
                    onChange={e => editPortfolio(portfolio.id, { name: e.target.value })}
                    className="font-bold mb-1"
                  />
                  <Input
                    value={portfolio.description}
                    onChange={e => editPortfolio(portfolio.id, { description: e.target.value })}
                    className="text-muted-foreground mb-2"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => removePortfolio(portfolio.id)}>
                  Remove
                </Button>
              </div>
              <div className="h-[120px] w-full bg-muted/50 rounded-md overflow-hidden mb-2">
                <PerformanceChart days={30} className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

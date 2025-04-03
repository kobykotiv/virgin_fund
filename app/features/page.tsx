import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Features | Virgin Fund - Professional Automated Trading",
  description: "Explore the comprehensive features of Virgin Fund's automated trading platform, including strategy building, backtesting, and portfolio management.",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">Trading Tools Built for Performance</h1>
                <p className="text-xl text-muted-foreground">
                  Discover the comprehensive suite of features designed to help you build, test, and automate winning trading strategies.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/demo">Request Demo</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative h-[400px]">
                <Image
                  src="/images/features/dashboard-overview.jpg"
                  alt="Virgin Fund dashboard overview"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Categories Tabs */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore Our Platform Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Every tool you need to succeed in algorithmic trading, from strategy creation to performance analysis.
              </p>
            </div>

            <Tabs defaultValue="strategy" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-4xl mx-auto mb-12">
                <TabsTrigger value="strategy">Strategy Building</TabsTrigger>
                <TabsTrigger value="backtesting">Backtesting</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio Management</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="strategy" className="space-y-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative h-[350px]">
                    <Image
                      src="/images/features/strategy-builder.jpg"
                      alt="Visual Strategy Builder"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Visual Strategy Builder</h3>
                    <p className="text-lg text-muted-foreground">
                      Create complex trading strategies without writing code. Our intuitive drag-and-drop interface lets you combine indicators, set conditions, and define actions with ease.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "40+ technical indicators and candlestick patterns",
                        "Customizable entry and exit conditions",
                        "Risk management parameter integration",
                        "Strategy templates for common approaches"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Additional strategy features would go here */}
              </TabsContent>
              
              <TabsContent value="backtesting" className="space-y-12">
                {/* Backtesting content would go here */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Advanced Backtesting Engine</h3>
                    <p className="text-lg text-muted-foreground">
                      Test your strategies against historical data to validate performance before risking real capital.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "10+ years of historical market data",
                        "Detailed performance metrics and analysis",
                        "Monte Carlo simulations for robustness testing",
                        "Customizable slippage and commission models"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative h-[350px]">
                    <Image
                      src="/images/features/backtesting.jpg"
                      alt="Backtesting Engine"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="portfolio" className="space-y-12">
                {/* Portfolio management content would go here */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative h-[350px]">
                    <Image
                      src="/images/features/portfolio-management.jpg"
                      alt="Portfolio Management"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Comprehensive Portfolio Management</h3>
                    <p className="text-lg text-muted-foreground">
                      Monitor and optimize your entire trading portfolio from a single dashboard with powerful analytics.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Real-time performance tracking",
                        "Risk exposure analysis across assets",
                        "Automated portfolio rebalancing",
                        "Correlation analysis between strategies"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automation" className="space-y-12">
                {/* Automation content would go here */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Seamless Trading Automation</h3>
                    <p className="text-lg text-muted-foreground">
                      Set up your strategies to execute automatically 24/7 with reliable connections to major exchanges.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "One-click deployment to live trading",
                        "Multiple exchange integrations",
                        "Custom scheduling and market condition triggers",
                        "Email and mobile notifications for key events"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative h-[350px]">
                    <Image
                      src="/images/features/automation.jpg"
                      alt="Trading Automation"
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How We Compare</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See why traders choose Virgin Fund over other platforms for their automated trading needs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 border-b-2">Features</th>
                    <th className="p-4 border-b-2 bg-primary text-primary-foreground">Virgin Fund</th>
                    <th className="p-4 border-b-2">Competitor A</th>
                    <th className="p-4 border-b-2">Competitor B</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "No-Code Strategy Builder", vf: true, a: true, b: false },
                    { feature: "Advanced Backtesting", vf: true, a: true, b: true },
                    { feature: "Monte Carlo Simulation", vf: true, a: false, b: false },
                    { feature: "Multi-Exchange Support", vf: true, a: true, b: true },
                    { feature: "Portfolio Optimization", vf: true, a: false, b: true },
                    { feature: "Risk Management Tools", vf: true, a: true, b: false },
                    { feature: "Strategy Marketplace", vf: true, a: false, b: false },
                    { feature: "API Access", vf: true, a: true, b: true },
                    { feature: "Mobile App", vf: true, a: false, b: true }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                      <td className="p-4 border-b">{row.feature}</td>
                      <td className="p-4 border-b text-center">
                        {row.vf ? <CheckCircle className="h-5 w-5 text-primary mx-auto" /> : "-"}
                      </td>
                      <td className="p-4 border-b text-center">
                        {row.a ? <CheckCircle className="h-5 w-5 text-muted-foreground mx-auto" /> : "-"}
                      </td>
                      <td className="p-4 border-b text-center">
                        {row.b ? <CheckCircle className="h-5 w-5 text-muted-foreground mx-auto" /> : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience These Features?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
              Start your 14-day free trial and discover how Virgin Fund can transform your trading.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

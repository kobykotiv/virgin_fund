import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BarChart, Lock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Crypto Trading Solutions | Virgin Fund",
  description: "Advanced crypto trading automation for traders and institutions. Multi-exchange support, custom strategies, and advanced order types.",
};

export default function CryptoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-background">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold">
                  Automated Crypto Trading at Scale
                </h1>
                <p className="text-xl text-muted-foreground">
                  Build and deploy sophisticated trading strategies across multiple crypto exchanges. From simple market making to complex arbitrage.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/case-studies/crypto-market-maker">See Success Stories</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 relative h-[500px]">
                <Image
                  src="/images/solutions/crypto-dashboard.jpg"
                  alt="Crypto trading dashboard"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Support Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-12">Supported Exchanges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {["Binance", "Coinbase", "Kraken", "FTX", "Bitfinex", "KuCoin", "Gemini", "Bitstamp"].map((exchange) => (
                <div key={exchange} className="flex items-center justify-center p-6 bg-muted rounded-lg">
                  <span className="font-medium">{exchange}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Built for Crypto Traders</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to automate your crypto trading strategies
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: "High-Frequency Trading",
                  description: "Execute thousands of trades per second with our low-latency infrastructure"
                },
                {
                  icon: <BarChart className="h-8 w-8 text-primary" />,
                  title: "Advanced Order Types",
                  description: "TWAP, VWAP, Iceberg orders, and custom order execution strategies"
                },
                {
                  icon: <Lock className="h-8 w-8 text-primary" />,
                  title: "Secure Key Management",
                  description: "Bank-grade encryption for API keys and sensitive data"
                },
                {
                  icon: <Globe className="h-8 w-8 text-primary" />,
                  title: "Cross-Exchange Arbitrage",
                  description: "Identify and execute on price discrepancies across exchanges"
                }
              ].map((feature, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Trading in Minutes</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
              Deploy your first bot with our 14-day free trial. No credit card required.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

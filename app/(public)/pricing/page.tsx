"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const { user, isAuthenticated, isDemoMode } = useAuth()
  const router = useRouter()

  const pricingTiers = [
    {
      name: "Free Insta",
      description: "Perfect for beginners exploring algorithmic trading",
      price: billingCycle === "monthly" ? 0 : 0,
      features: [
        "Maximum 5 trading bots",
        "1% Grid trading strategy",
        "Dollar-Cost Averaging (DCA) strategy",
        "Paper trading only",
        "Basic market data",
        "Email support",
      ],
      limitations: ["No live trading", "No indicator-based strategies", "No basket trading"],
      tier: "free",
      popular: false,
    },
    {
      name: "Baby",
      description: "For active traders ready to go live",
      price: billingCycle === "monthly" ? 9 : 90,
      features: [
        "Maximum 10 trading bots",
        "Live trading capability",
        "1% Grid trading strategy",
        "Dollar-Cost Averaging (DCA) strategy",
        "Standard market data",
        "Priority email support",
      ],
      limitations: ["No indicator-based strategies", "No basket trading"],
      tier: "baby",
      popular: true,
    },
    {
      name: "Middle",
      description: "For serious traders using technical analysis",
      price: billingCycle === "monthly" ? 29 : 290,
      features: [
        "Maximum 15 trading bots",
        "Live trading capability",
        "All trading strategies",
        "Indicator-based trading (RSI, MACD, Bollinger)",
        "Advanced market data",
        "Priority email & chat support",
      ],
      limitations: ["Limited bot allocation"],
      tier: "middle",
      popular: false,
    },
    {
      name: "Big",
      description: "For portfolio managers and advanced traders",
      price: billingCycle === "monthly" ? 99 : 990,
      features: [
        "Maximum 25 trading bots",
        "Live trading capability",
        "All trading strategies",
        "Indicator-based trading",
        "Basket trading with auto-rebalancing",
        "Premium market data",
        "Priority support with dedicated manager",
      ],
      limitations: [],
      tier: "big",
      popular: false,
    },
    {
      name: "XL",
      description: "For professional traders and institutions",
      price: billingCycle === "monthly" ? 199 : 1990,
      features: [
        "Unlimited trading bots",
        "Live trading capability",
        "All trading strategies",
        "Custom strategy development",
        "Enterprise-grade market data",
        "24/7 dedicated support",
        "API access for custom integrations",
      ],
      limitations: [],
      tier: "xl",
      popular: false,
    },
  ]

  const handleSelectPlan = (tier: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=pricing")
      return
    }

    // In a real app, this would redirect to a checkout page or process the subscription
    console.log(`Selected plan: ${tier}`)
    alert(`You've selected the ${tier} plan. In a production environment, this would redirect to checkout.`)
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Trading Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the plan that fits your trading needs. All plans use the Alpaca Markets API for secure and reliable
          trading operations.
        </p>

        <div className="flex items-center justify-center mt-8 space-x-2">
          <Button
            variant={billingCycle === "monthly" ? "default" : "outline"}
            onClick={() => setBillingCycle("monthly")}
            className="rounded-r-none"
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "outline"}
            onClick={() => setBillingCycle("yearly")}
            className="rounded-l-none"
          >
            Yearly (Save 17%)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {pricingTiers.map((tier) => (
          <Card key={tier.tier} className={`flex flex-col ${tier.popular ? "border-primary shadow-lg" : ""}`}>
            <CardHeader>
              {tier.popular && (
                <div className="py-1 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-full w-fit mb-2">
                  MOST POPULAR
                </div>
              )}
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground">/{billingCycle === "monthly" ? "month" : "year"}</span>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Features</h4>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.limitations.length > 0 && (
                  <>
                    <h4 className="font-medium pt-2">Limitations</h4>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={tier.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(tier.tier)}
                disabled={isDemoMode}
                title={
                  isDemoMode ? "Upgrade not available in demo mode" : tier.price === 0 ? "Get Started" : "Subscribe"
                }
              >
                {tier.price === 0 ? "Get Started" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          All plans include secure trading via the Alpaca Markets API. Need help choosing?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our team
          </Link>
        </p>
      </div>
    </div>
  )
}


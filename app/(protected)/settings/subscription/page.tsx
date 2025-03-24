"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const subscriptionPlans = [
  {
    tier: "Starter",
    price: 9,
    maxBots: 1,
    maxCustomSignals: 5,
    backtestingLimit: "3 months",
    marketSignalsAccess: "basic",
    webhookSupport: false,
    apiAccess: false,
    whiteLabeling: false,
    dedicatedSupport: false,
  },
  {
    tier: "Basic",
    price: 19,
    maxBots: 3,
    maxCustomSignals: 15,
    backtestingLimit: "6 months",
    marketSignalsAccess: "basic",
    webhookSupport: false,
    apiAccess: false,
    whiteLabeling: false,
    dedicatedSupport: false,
  },
  {
    tier: "Advanced",
    price: 29,
    maxBots: 5,
    maxCustomSignals: 30,
    backtestingLimit: "12 months",
    marketSignalsAccess: "premium",
    webhookSupport: true,
    apiAccess: false,
    whiteLabeling: false,
    dedicatedSupport: false,
  },
  {
    tier: "Professional",
    price: 39,
    maxBots: 10,
    maxCustomSignals: "unlimited",
    backtestingLimit: "unlimited",
    marketSignalsAccess: "full",
    webhookSupport: true,
    apiAccess: false,
    whiteLabeling: false,
    dedicatedSupport: true,
  },
  {
    tier: "Enterprise",
    price: 49,
    maxBots: 20,
    maxCustomSignals: "unlimited",
    backtestingLimit: "unlimited",
    marketSignalsAccess: "full",
    webhookSupport: true,
    apiAccess: true,
    whiteLabeling: true,
    dedicatedSupport: true,
  },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (tier: string) => {
    setSelectedPlan(tier);
    // Add logic to update the user's subscription plan
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.tier} className={selectedPlan === plan.tier ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.tier}
                <Badge variant="outline">${plan.price}/month</Badge>
              </CardTitle>
              <CardDescription>
                {plan.maxBots} bots, {plan.maxCustomSignals} custom signals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Backtesting:</strong> {plan.backtestingLimit}
              </p>
              <p>
                <strong>Market Signals:</strong> {plan.marketSignalsAccess}
              </p>
              <p>
                <strong>Webhooks:</strong> {plan.webhookSupport ? "Enabled" : "Disabled"}
              </p>
              <p>
                <strong>API Access:</strong> {plan.apiAccess ? "Enabled" : "Disabled"}
              </p>
              <p>
                <strong>White Labeling:</strong> {plan.whiteLabeling ? "Available" : "Not Available"}
              </p>
              <p>
                <strong>Dedicated Support:</strong> {plan.dedicatedSupport ? "Available" : "Not Available"}
              </p>
            </CardContent>
            <Button
              variant={selectedPlan === plan.tier ? "default" : "outline"}
              onClick={() => handleSelectPlan(plan.tier)}
            >
              {selectedPlan === plan.tier ? "Selected" : "Select Plan"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

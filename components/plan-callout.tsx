"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Info } from "lucide-react"

interface PlanCalloutProps {
  plan?: "Free" | "Pro" | "Enterprise"
}

export default function PlanCallout({ plan = "Free" }: PlanCalloutProps) {
  const isFree = plan === "Free"

  return (
    <Card className="border border-muted/20">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-sm">Account Plan</CardTitle>
          <CardDescription className="text-xs">
            {isFree ? "You're on the Free plan" : `${plan} plan active`}
          </CardDescription>
        </div>
        <Badge className={isFree ? "destructive" : "success"}>{plan}</Badge>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm">
            {isFree
              ? "Upgrade to unlock live trading, increased bot limits, advanced analytics, and priority support."
              : "Your plan includes advanced features and higher limits."}
          </p>

          {isFree && (
            <ul className="text-sm list-disc list-inside text-muted-foreground">
              <li>Live Alpaca trading (Pro)</li>
              <li>Unlimited bots & strategies (Pro)</li>
              <li>Advanced backtests & exports (Pro)</li>
              <li>Priority support and team seats (Enterprise)</li>
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isFree ? (
            <Button
              className={buttonVariants({ variant: "default" }) + " whitespace-nowrap"}
              onClick={() => window.open("https://checkout.virginfund.com", "_blank")}
            >
              Upgrade Plan
            </Button>
          ) : (
            <Button
              className={buttonVariants({ variant: "outline" }) + " whitespace-nowrap"}
              onClick={() => window.location.assign("/account")}
            >
              Manage Plan
            </Button>
          )}

          <Button
            className={buttonVariants({ variant: "ghost" }) + " text-xs"}
            onClick={() => {
              const event = new CustomEvent("openBillingInfo")
              window.dispatchEvent(event)
            }}
            aria-label="Plan help"
            title="Plan help"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

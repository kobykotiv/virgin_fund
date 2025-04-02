"use client"

import * as React from "react"
import { AnimatedWordCycle } from "@/components/ui/animated-word-cycle"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, LineChart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function MiddleHeroSection() {
  return (
    <section className="py-24 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
                alt="Trading analytics dashboard"
                fill
                className="object-cover brightness-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
            {/* Floating Stats Card */}
            <div className="absolute -right-8 top-1/3 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border">
              <div className="flex items-center gap-3">
                <LineChart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Performance</p>
                  <p className="text-sm text-muted-foreground">+34.5% YTD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Smart Portfolio Analytics
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                Take control of your{" "}
                <AnimatedWordCycle 
                  words={[
                    "investments",
                    "portfolio",
                    "future",
                    "wealth",
                    "strategy",
                  ]}
                  interval={3000}
                  className="text-primary"
                />{" "}
                today
              </h2>
              <p className="text-xl text-muted-foreground">
                Our AI-powered platform helps you make data-driven decisions with real-time market analysis and automated trading strategies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg">
                  View Demo Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

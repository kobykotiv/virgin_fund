"use client"

import * as React from "react"
import { AnimatedWordCycle } from "@/components/ui/animated-word-cycle"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ChartBar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function MiddleSection() {
  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              New AI-Powered Features
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Transform your <br />
                <AnimatedWordCycle 
                  words={[
                    "trading strategy",
                    "market analysis",
                    "portfolio growth",
                    "investment ROI",
                    "wealth building"
                  ]}
                  interval={3000}
                  className="text-primary"
                />
              </h2>
              
              <p className="text-xl text-muted-foreground">
                Take advantage of our advanced AI algorithms and proven trading strategies to maximize your returns.
              </p>
              
              {/* Feature List */}
              <ul className="space-y-4">
                {[
                  "Real-time market analysis",
                  "Automated trading signals",
                  "Risk management tools",
                  "Portfolio optimization"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ChartBar className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="default">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1642790551116-18e150f248e3"
                alt="Trading platform interface"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -left-8 top-1/4 bg-background/95 backdrop-blur p-4 rounded-xl shadow-xl border">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-primary">87%</div>
                <div className="text-sm">
                  <div className="font-medium">Success Rate</div>
                  <div className="text-muted-foreground">Last 30 days</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-8 bottom-1/4 bg-background/95 backdrop-blur p-4 rounded-xl shadow-xl border">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-green-500">+142%</div>
                <div className="text-sm">
                  <div className="font-medium">ROI</div>
                  <div className="text-muted-foreground">Annual return</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

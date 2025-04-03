"use client"

import * as React from "react"
import { AnimatedWordCycle } from "@/components/ui/animated-word-cycle"
import { Button } from "@/components/ui/button"
import { Bitcoin, ArrowRight, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CryptoHeroSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900/50 to-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-orange-500/10 text-orange-400">
              <Bitcoin className="h-5 w-5" />
              <span className="text-sm font-medium">Crypto Trading</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Trade{" "}
                <AnimatedWordCycle 
                  words={[
                    "ETFs",
                    "CRYPTO",
                    "BITCOIN",
                    "FUTURES",
                    "money",
                    "most of your money",
                    "Assets",
                    "digital gold",
                    "the only one that matters"
                  ]}
                  interval={2000}
                  className="text-orange-500"
                />{" "}
                like never before
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                Experience professional-grade trading with our AI-powered platform. 
                Built for both beginners and experts.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Start Trading Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Demo Account
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Trading Volume", value: "$4K+" },
                { label: "Active Traders", value: "1K+" },
                { label: "Success Rate", value: "59%" }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040"
                alt="Crypto trading visualization"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-primary/20 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -right-8 top-1/3 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">24h Change</p>
                  <p className="text-sm text-green-500">+12.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

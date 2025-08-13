"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"

export default function HeroSection() {
  return (
    <section id="hero-section" className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
      <AnimatedBackground />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge className="inline-flex rounded-md px-3.5 py-1.5" variant="secondary">
                <span className="text-xs font-medium">Self-Hosted & Secure</span>
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Virgin Fund : GenEric TraDer AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our AI-powered platform bridges the gap between bot-based trading and copy trading with our isolated, self-hosted solution. Connect to Alpaca Markets and CoinGecko for real-time data and paper trading.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/login?tab=demo">
                <Button className="gap-1.5">
                  Try the Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login?tab=signup">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <Image src="/images/hero-image.png" alt="Hero Image" width={600} height={600} className="max-w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  )
}

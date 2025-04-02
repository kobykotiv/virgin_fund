import { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero"
import { ProblemSolutionSection } from "@/components/sections/problem-solution"
import { FeaturesOverviewSection } from "@/components/sections/features-overview"
import { FeaturesGridSection } from "@/components/sections/features-grid"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { MarqueesSection } from "@/components/sections/marquees"
import { IntegrationStatusSection } from "@/components/sections/integration-status"
import { ReviewsSection } from "@/components/sections/reviews"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { BotShowcase } from "@/components/bot-showcase"
import { MiddleHeroSection } from "@/components/sections/middle-hero"
import { MiddleSection } from "@/components/sections/middle-section"
import { CryptoHeroSection } from "@/components/sections/crypto-hero-section"

export const metadata: Metadata = {
  title: "Virgin Fund: AI-Powered Automated Trading Platform",
  description: "Professional-grade algorithmic trading platform. Build, test, and automate your trading strategies with ease. Start your free trial today.",
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Problem/Solution Section */}
        <ProblemSolutionSection />
        
        {/* Crypto Hero Section */}
        <CryptoHeroSection />
        
        {/* Middle Hero Section */}
        <MiddleHeroSection />
        
        {/* Middle Section */}
        <MiddleSection />
        
        {/* Features Overview Section */}
        <FeaturesOverviewSection />
        
        {/* Features Grid Section */}
        <FeaturesGridSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* Call to Action Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Trading?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
              Join thousands of traders who are already seeing results with Virgin Fund.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="font-medium">
                Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </section>
        
        {/* Bot Showcase Section */}
        <BotShowcase />
        
        {/* Marquees Section */}
        <MarqueesSection />
        
        {/* Integration Status Section */}
        <IntegrationStatusSection />
        
        {/* Reviews Section */}
        <ReviewsSection />
      </main>
    </div>
  )
}


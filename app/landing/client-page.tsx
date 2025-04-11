"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useContent } from "@/providers/content-provider"
import { useAuth } from "@/providers/auth-provider"
import { AnimatedBackground } from "@/components/animated-background"
import { ConfigEditor } from "@/components/config-editor"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bot, Sparkles, Users, LineChart, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function ClientPage() {
  const { content, isAdmin } = useContent()
  const { isAuthenticated } = useAuth()
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">{content.hero.title}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary">Testimonials</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button size="sm">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link href="/login?tab=signup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditor(!showEditor)}
              >
                {showEditor ? "Hide Editor" : "Edit Content"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {showEditor && isAdmin ? (
          <ConfigEditor />
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
              <AnimatedBackground />
              <div className="container px-4 md:px-6 relative z-10">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <Badge className="inline-flex rounded-md px-3.5 py-1.5" variant="secondary">
                        <span className="text-xs font-medium">{content.hero.subtitle}</span>
                      </Badge>
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                        {content.hero.title}
                      </h1>
                      <p className="max-w-[600px] text-muted-foreground md:text-xl">
                        {content.hero.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Link href="/login?tab=signup">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500">
                          Get Started Free
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button size="lg" variant="outline">
                          Try Demo Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                  {content.features.map((feature) => (
                    <Card key={feature.id} className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20">
                      <CardContent className="p-6">
                        {/* Use dynamic icon component */}
                        <div className="h-12 w-12 mb-4 text-primary">
                          {feature.icon === 'Robot' && <Bot className="h-full w-full" />}
                          {feature.icon === 'LineChart' && <LineChart className="h-full w-full" />}
                          {feature.icon === 'Shield' && <Shield className="h-full w-full" />}
                          {feature.icon === 'Sparkles' && <Sparkles className="h-full w-full" />}
                        </div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
              <div className="container px-4 md:px-6">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
                  {content.pricing.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className={cn(
                        "relative overflow-hidden border-2 bg-background/60 backdrop-blur-md",
                        plan.isPopular ? "border-primary" : "border-muted"
                      )}
                    >
                      {plan.isPopular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                          Popular
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex flex-col space-y-4">
                          <h3 className="text-2xl font-bold">{plan.name}</h3>
                          <p className="text-4xl font-bold">
                            ${plan.price}<span className="text-lg font-normal">/month</span>
                          </p>
                          <p className="text-muted-foreground">{plan.description}</p>
                          <ul className="space-y-2">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button className="w-full mt-4">
                            {plan.price === 0 ? "Get Started" : "Start Trial"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
                  {content.testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="relative overflow-hidden bg-background/60 backdrop-blur-md border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{testimonial.author}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{testimonial.quote}</p>
                          <div className="flex text-yellow-500">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Sparkles key={i} className="h-4 w-4" />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Bot className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Virgin Fund
              </a>
              . Open source on{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | GenEric TraDer - Advanced Trading Platform",
  description:
    "Latest insights, trading strategies, market analysis, and platform updates from the GenEric TraDer team.",
  keywords:
    "trading blog, finance blog, trading strategies, market analysis, trading platform, automated trading, copy trading",
  openGraph: {
    title: "Blog | GenEric TraDer - Advanced Trading Platform",
    description:
      "Latest insights, trading strategies, market analysis, and platform updates from the GenEric TraDer team.",
    type: "website",
  },
}

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Maximizing Returns with Grid Trading Strategies",
    excerpt: "Learn how to implement effective grid trading strategies to maximize returns in sideways markets.",
    date: "2023-03-15",
    readTime: "8 min read",
    author: "Alex Johnson",
    category: "Trading Strategies",
    image: "/placeholder.svg?height=200&width=400",
    slug: "maximizing-returns-with-grid-trading",
    featured: true,
  },
  {
    id: 2,
    title: "Q1 2023 Market Analysis: Trends and Opportunities",
    excerpt: "A comprehensive analysis of market trends and trading opportunities for the first quarter of 2023.",
    date: "2023-03-10",
    readTime: "12 min read",
    author: "Sarah Chen",
    category: "Market Analysis",
    image: "/placeholder.svg?height=200&width=400",
    slug: "q1-2023-market-analysis",
    featured: true,
  },
  {
    id: 3,
    title: "New Feature Release: Advanced Backtesting Engine",
    excerpt: "Introducing our new advanced backtesting engine with improved accuracy and performance metrics.",
    date: "2023-03-05",
    readTime: "5 min read",
    author: "Michael Rodriguez",
    category: "Platform Updates",
    image: "/placeholder.svg?height=200&width=400",
    slug: "new-feature-advanced-backtesting-engine",
    featured: false,
  },
  {
    id: 4,
    title: "From Novice to Pro: A Trader's Success Story",
    excerpt: "How one trader went from complete beginner to consistent profitability using GenEric TraDer.",
    date: "2023-03-01",
    readTime: "10 min read",
    author: "Emma Wilson",
    category: "Success Stories",
    image: "/placeholder.svg?height=200&width=400",
    slug: "novice-to-pro-trader-success-story",
    featured: false,
  },
  {
    id: 5,
    title: "Understanding Risk Management in Automated Trading",
    excerpt: "Essential risk management principles every automated trader should implement.",
    date: "2023-02-25",
    readTime: "7 min read",
    author: "David Park",
    category: "Trading Strategies",
    image: "/placeholder.svg?height=200&width=400",
    slug: "risk-management-automated-trading",
    featured: false,
  },
  {
    id: 6,
    title: "Cryptocurrency Market Outlook for 2023",
    excerpt: "Analysis of cryptocurrency market trends and predictions for the remainder of 2023.",
    date: "2023-02-20",
    readTime: "9 min read",
    author: "Lisa Chang",
    category: "Market Analysis",
    image: "/placeholder.svg?height=200&width=400",
    slug: "cryptocurrency-market-outlook-2023",
    featured: false,
  },
]

// Categories with counts
const categories = [
  { name: "Trading Strategies", count: 15, slug: "trading-strategies" },
  { name: "Market Analysis", count: 12, slug: "market-analysis" },
  { name: "Platform Updates", count: 8, slug: "platform-updates" },
  { name: "Success Stories", count: 6, slug: "success-stories" },
  { name: "Tutorials", count: 10, slug: "tutorials" },
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const recentPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trading Insights & Platform Updates</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Stay informed with the latest trading strategies, market analysis, and platform updates from the
                  GenEric TraDer team.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/blog/category/trading-strategies">
                  <Button variant="outline" className="rounded-full">
                    Trading Strategies
                  </Button>
                </Link>
                <Link href="/blog/category/market-analysis">
                  <Button variant="outline" className="rounded-full">
                    Market Analysis
                  </Button>
                </Link>
                <Link href="/blog/category/platform-updates">
                  <Button variant="outline" className="rounded-full">
                    Platform Updates
                  </Button>
                </Link>
                <Link href="/blog/category/success-stories">
                  <Button variant="outline" className="rounded-full">
                    Success Stories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:gap-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Featured Articles</h2>
                <p className="text-muted-foreground">Our most popular and informative content</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary">{post.category}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>
                        <Link href={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4 md:gap-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Latest Articles</h2>
                <p className="text-muted-foreground">Browse our most recent content</p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full max-w-md mx-auto mb-8">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="strategies" className="flex-1">
                    Strategies
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex-1">
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="updates" className="flex-1">
                    Updates
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentPosts.map((post) => (
                      <Card key={post.id}>
                        <div className="relative h-40 w-full">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{post.category}</Badge>
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                          </div>
                          <CardTitle className="text-lg">
                            <Link href={`/blog/${post.slug}`} className="hover:underline">
                              {post.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-1 h-3 w-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {post.readTime}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="strategies" className="mt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentPosts
                      .filter((post) => post.category === "Trading Strategies")
                      .map((post) => (
                        <Card key={post.id}>
                          <div className="relative h-40 w-full">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{post.category}</Badge>
                              <span className="text-xs text-muted-foreground">{post.date}</span>
                            </div>
                            <CardTitle className="text-lg">
                              <Link href={`/blog/${post.slug}`} className="hover:underline">
                                {post.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="mr-1 h-3 w-3" />
                              {post.author}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {post.readTime}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                {/* Similar TabsContent for "analysis" and "updates" would go here */}
              </Tabs>

              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More Articles</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Stay Updated</h2>
                <p className="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed">
                  Subscribe to our newsletter to receive the latest trading insights, market analysis, and platform
                  updates.
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <form className="flex space-x-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 focus:ring-offset-2 focus:ring-offset-primary"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" variant="secondary">
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-primary-foreground/60">We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category.name} ({category.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Cryptocurrency</Badge>
                <Badge variant="outline">Stocks</Badge>
                <Badge variant="outline">Technical Analysis</Badge>
                <Badge variant="outline">Risk Management</Badge>
                <Badge variant="outline">Backtesting</Badge>
                <Badge variant="outline">Algorithmic Trading</Badge>
                <Badge variant="outline">Market Trends</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Archives</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog/archive/2023/03"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    March 2023
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/archive/2023/02"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    February 2023
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/archive/2023/01"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    January 2023
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/archive/2022/12"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    December 2022
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">About the Blog</h3>
              <p className="text-sm text-muted-foreground">
                The GenEric TraDer blog provides valuable insights, strategies, and updates for traders of all
                experience levels. Our content is written by industry experts and platform developers.
              </p>
              <Link href="/about" className="text-sm font-medium hover:underline">
                Learn more about our team
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GenEric TraDer. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


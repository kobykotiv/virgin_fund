export interface Hero {
  title: string
  subtitle: string
  description: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  isPopular?: boolean
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  rating: number
}

export interface LandingPageContent {
  hero: Hero
  features: Feature[]
  pricing: PricingPlan[]
  testimonials: Testimonial[]
}

export const defaultContent: LandingPageContent = {
  hero: {
    title: "Automated Trading for Everyone",
    subtitle: "Next Generation Portfolio Management",
    description: "Start your trading journey with our intelligent automated trading platform. From simple portfolios to complex strategies, we've got you covered."
  },
  features: [
    {
      id: "1",
      title: "Smart Automation",
      description: "Set up automated trading strategies that work 24/7 to maintain your portfolio goals.",
      icon: "Robot"
    },
    {
      id: "2",
      title: "Real-time Analytics",
      description: "Monitor your portfolio performance with advanced analytics and real-time market data.",
      icon: "LineChart"
    },
    {
      id: "3",
      title: "Risk Management",
      description: "Built-in risk management tools to protect your investments and optimize returns.",
      icon: "Shield"
    }
  ],
  pricing: [
    {
      id: "free",
      name: "Basic",
      price: 0,
      description: "Perfect for getting started with automated trading",
      features: [
        "1 Active Bot",
        "Basic Strategies",
        "Paper Trading",
        "Community Support"
      ]
    },
    {
      id: "pro",
      name: "Professional",
      price: 29,
      description: "For serious traders who need more power",
      features: [
        "Unlimited Bots",
        "Advanced Strategies",
        "Real-time Alerts",
        "Priority Support",
        "API Access"
      ],
      isPopular: true
    }
  ],
  testimonials: [
    {
      id: "1",
      quote: "This platform has completely changed how I manage my investments. The automation is incredible!",
      author: "Sarah Johnson",
      role: "Full-time Trader",
      rating: 5
    },
    {
      id: "2",
      quote: "The risk management features helped me sleep better at night. Great for passive investing.",
      author: "Michael Chen",
      role: "Portfolio Manager",
      rating: 5
    },
    {
      id: "3",
      quote: "Started with paper trading and now managing real assets. The learning curve was smooth.",
      author: "Alex Rodriguez",
      role: "Individual Investor",
      rating: 4
    }
  ]
}
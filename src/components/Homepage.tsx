import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  BarChart2,
  Shield,
  Github,
  ChevronRight,
  CreditCard,
  LineChart,
  Wallet,
  Database,
  Globe2,
  Cpu,
  Layers,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { BlobBackground } from "./ui/blob-background";
import { MobileMenu } from "./ui/mobile-menu";
// import { useMediaQuery } from '@/hooks/useMediaQuery';

const techStack = [
  {
    name: "React",
    icon: <Layers className="w-5 h-5" />,
    color: "text-blue-500",
  },
  {
    name: "TypeScript",
    icon: <Cpu className="w-5 h-5" />,
    color: "text-blue-600",
  },
  {
    name: "Vite",
    icon: <Globe2 className="w-5 h-5" />,
    color: "text-purple-500",
  },
  {
    name: "Supabase",
    icon: <Database className="w-5 h-5" />,
    color: "text-green-500",
  },
  {
    name: "TailwindCSS",
    icon: <Layers className="w-5 h-5" />,
    color: "text-cyan-500",
  },
  {
    name: "Framer Motion",
    icon: <Layers className="w-5 h-5" />,
    color: "text-pink-500",
  },
  {
    name: "Chart.js",
    icon: <LineChart className="w-5 h-5" />,
    color: "text-red-500",
  },
  {
    name: "Zustand",
    icon: <Layers className="w-5 h-5" />,
    color: "text-yellow-500",
  },
  // {
  //   name: "React Query",
  //   icon: <Globe2 className="w-5 h-5" />,
  //   color: "text-purple-600",
  // },
  // {
  //   name: "React Router",
  //   icon: <Globe2 className="w-5 h-5" />,
  //   color: "text-red-600",
  // },
];

const testimonials = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    name: "Sarah Johnson",
    role: "Individual Investor",
    content: "Virgin Fund has completely transformed how I approach dollar-cost averaging. The analytics are incredibly insightful."
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    name: "Michael Chen",
    role: "Financial Advisor",
    content: "The backtesting tools are exceptional. My clients love seeing the historical performance data of different DCA strategies."
  },
  {
    icon: <LineChart className="w-5 h-5" />,
    name: "Emma Wilson",
    role: "Portfolio Manager",
    content: "A game-changer for portfolio optimization. The risk management features are particularly impressive."
  },
  {
    icon: <Shield className="w-5 h-5" />,
    name: "David Thompson",
    role: "Investment Analyst",
    content: "Virgin Fund is a must-have for any serious investor. The market analysis tools are top-notch."
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    name: "Jessica Lee",
    role: "Financial Planner",
    content: "The smart portfolio feature is fantastic. It's helped me build and manage my clients' investments more effectively."
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    name: "Alex Miller",
    role: "Crypto Enthusiast",
    content: "I've been using Virgin Fund to optimize my crypto DCA strategy. The performance tracking is incredibly useful."
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    name: "Sophia Garcia",
    role: "Stock Trader",
    content: "The platform is user-friendly and the support is excellent. I highly recommend Virgin Fund to anyone looking to invest smarter."
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    name: "Ryan Clark",
    role: "Financial Analyst",
    content: "Virgin Fund is a game-changer for anyone looking to optimize their investment strategy. The analytics are second to none."
  },
  {
    icon: <LineChart className="w-5 h-5" />,
    name: "Olivia Roberts",
    role: "Hedge Fund Manager",
    content: "The risk management tools are incredibly powerful. I've been able to protect and optimize my investments more effectively."
  }
];

const faqs = [
  {
    question: "What is Dollar-Cost Averaging (DCA)?",
    answer: "DCA is an investment strategy where you invest a fixed amount regularly, regardless of market conditions, helping to reduce the impact of volatility."
  },
  {
    question: "How does Virgin Fund help with investment decisions?",
    answer: "We provide advanced analytics, backtesting tools, and performance metrics to help you optimize your DCA strategy and make data-driven decisions."
  },
  {
    question: "Is Virgin Fund suitable for beginners?",
    answer: "Yes! Our platform is designed to be user-friendly while offering powerful features for investors of all experience levels."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide comprehensive documentation, email support, and regular webinars to help you make the most of our platform."
  },
  {
    question: "Is my data secure with Virgin Fund?",
    answer: "Absolutely, just trust me bro."
  },
  {
    question: "Can I use Virgin Fund for crypto investments?",
    answer: "Yes, you can use Virgin Fund to optimize your crypto DCA strategy and track the performance of your crypto investments."
  },
  {
    question: "How do I get started with Virgin Fund?",
    answer: "Simply create a free account, and start analyzing your DCA strategy with our powerful tools."
  },
  {
    question: "Do you offer a mobile app?",
    answer: "Not yet, but we're working on it! Our platform is fully responsive and works great on mobile devices."
  },
  {
    question: "Can I integrate Virgin Fund with my brokerage account?",
    answer: "Not Yet, but we're working on it! We plan to offer integrations with popular brokerage platforms in the future."
  }
];

export function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  // const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BlobBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span className="font-bold">Virgin Fund</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#blog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </a>
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Tech Stack Marquee */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-background via-primary/5 to-background py-4 border-y border-border/50">
        <div className="flex gap-8 animate-marquee whitespace-nowrap hover:pause">
          {[...techStack, ...techStack].map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <span
                className={cn("transition-colors duration-300", tech.color)}
              >
                {tech.icon}
              </span>
              <span className="font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
        <div
          className="flex gap-8 animate-marquee whitespace-nowrap absolute top-[1rem] left-[100%]"
          aria-hidden="true"
        >
          {/* {[...techStack, ...techStack].map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <span className={cn("transition-colors duration-300", tech.color)}>
                {tech.icon}
              </span>
              <span className="font-medium">{tech.name}</span>
            </div>
          ))} */}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Smart Investment
                <br />
                Made Simple
              </motion.h1>
              <motion.p
                className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Analyze and optimize your Dollar-Cost Averaging strategy with
                our powerful backtesting tools. Make data-driven investment
                decisions with confidence.
              </motion.p>
              <motion.div
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600"
                >
                  <Link to="/signup">
                    Get Started
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="glass-button"
                >
                  <a
                    href="https://github.com/yourusername/virgin-fund"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 w-5 h-5" />
                    Star on GitHub
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Hero Image/Animation */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl" />
                <div className="relative glass-card p-4 rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1642790106117-e829e14a795f"
                    alt="Investment Dashboard"
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold">
              Why Choose Virgin Fund?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Advanced tools for smarter investment decisions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 mx-auto">
          <div className="glass-card p-8 sm:p-12 rounded-2xl text-center">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Ready to Start Investing Smarter?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are already using Virgin Fund to
              optimize their investment strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600"
                >
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of satisfied investors using Virgin Fund
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {testimonial.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about Virgin Fund
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto grid gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              <span className="font-bold">Virgin Fund</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Careers
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Virgin Fund. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: LineChart,
    title: "Advanced Analytics",
    description:
      "Comprehensive analysis of your investment strategy with key performance metrics.",
  },
  {
    icon: CreditCard,
    title: "Smart Portfolio",
    description:
      "Build and manage your investment portfolio with intelligent insights.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Advanced risk assessment tools to protect and optimize your investments.",
  },
  {
    icon: BarChart2,
    title: "Market Analysis",
    description:
      "Real-time market data and trend analysis to inform your decisions.",
  },
  {
    icon: Wallet,
    title: "Cost Averaging",
    description:
      "Optimize your DCA strategy with historical performance analysis.",
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Monitor and analyze your investment performance over time.",
  },
];

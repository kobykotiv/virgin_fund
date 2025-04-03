import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | Virgin Fund - Automated Trading Platform",
  description: "Choose the right plan for your trading needs. Transparent pricing with no hidden fees.",
};

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for beginners exploring algorithmic trading",
    price: "$29",
    billing: "per month",
    features: [
      "Up to 3 active trading bots",
      "Basic backtesting capabilities",
      "10 years of historical data",
      "Standard technical indicators",
      "Email support",
      "1 connected exchange",
    ],
    limitations: [
      "No strategy marketplace access",
      "Limited strategy templates",
      "Basic portfolio analytics",
    ],
    ctaText: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "For serious traders ready to scale their strategies",
    price: "$79",
    billing: "per month",
    features: [
      "Up to 10 active trading bots",
      "Advanced backtesting with Monte Carlo",
      "20 years of historical data",
      "All technical indicators",
      "Priority email support",
      "3 connected exchanges",
      "Strategy marketplace access",
      "Advanced portfolio analytics",
      "Custom risk management tools",
    ],
    limitations: [],
    ctaText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Tailored solutions for institutional traders",
    price: "Custom",
    billing: "pricing",
    features: [
      "Unlimited active trading bots",
      "Full backtesting suite with custom scenarios",
      "Complete historical data access",
      "Custom indicators development",
      "Dedicated account manager",
      "Unlimited connected exchanges",
      "White-label options",
      "Advanced API access",
      "Custom integration development",
      "On-premises deployment option",
    ],
    limitations: [],
    ctaText: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* Pricing Header */}
        <section className="py-20 bg-muted/30">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transparent Pricing for Every Trader</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the plan that fits your trading goals. All plans include a 14-day free trial with no credit card required.
            </p>
            <div className="inline-flex items-center bg-muted rounded-full p-1 mb-8">
              <Button variant="ghost" className="rounded-full">Monthly</Button>
              <Button className="rounded-full">Annually (Save 20%)</Button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg relative' : 'border-muted'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.billing}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex gap-2 text-muted-foreground">
                          <HelpCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                        {plan.ctaText}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  question: "Do you offer a free trial?",
                  answer: "Yes, all our plans include a 14-day free trial with full access to features. No credit card is required to start your trial."
                },
                {
                  question: "Can I change plans later?",
                  answer: "Absolutely! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service. Simply contact our support team within 30 days of your purchase."
                },
                {
                  question: "Which exchanges do you support?",
                  answer: "We currently support major exchanges including Binance, Coinbase Pro, Kraken, Bitstamp, and FTX. We're continuously adding more exchanges based on user demand."
                },
                {
                  question: "Is there a limit on backtesting?",
                  answer: "Each plan includes different backtesting capabilities. The Starter plan includes basic backtesting with limitations on data range and frequency, while Professional and Enterprise plans offer more comprehensive backtesting features."
                },
                {
                  question: "Do you offer educational resources?",
                  answer: "Yes, all plans include access to our knowledge base with tutorials and guides. Professional and Enterprise plans also include access to webinars and strategy templates."
                }
              ].map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Trading?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
              Join thousands of traders already using Virgin Fund to automate their strategies.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Start Your Free Trial</Link>
            </Button>
            <p className="mt-4 text-primary-foreground/70">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

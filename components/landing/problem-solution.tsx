import { Clock, Brain, TrendingUp, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ProblemSolutionSection() {
  const problems = [
    {
      icon: <Clock className="h-6 w-6 text-red-500" />,
      title: "Time-Consuming",
      description: "Manual trading requires constant market monitoring and split-second decisions."
    },
    {
      icon: <Brain className="h-6 w-6 text-red-500" />,
      title: "Emotional Bias",
      description: "Fear and greed lead to impulsive decisions and missed opportunities."
    }
  ]
  
  const solutions = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Automated Strategies",
      description: "Pre-built and customizable algorithms that execute trades based on your criteria."
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Risk Management",
      description: "Built-in tools to protect your capital and optimize returns."
    }
  ]
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trading Shouldn't Be This Hard</h2>
          <p className="text-lg text-muted-foreground">
            Modern markets require modern solutions. Virgin Fund bridges the gap between professional algo-trading and everyday investors.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">The Challenge</h3>
            {problems.map((problem, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="mt-1">{problem.icon}</div>
                <div>
                  <h4 className="font-medium">{problem.title}</h4>
                  <p className="text-muted-foreground">{problem.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">The Virgin Fund Solution</h3>
            {solutions.map((solution, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="mt-1">{solution.icon}</div>
                <div>
                  <h4 className="font-medium">{solution.title}</h4>
                  <p className="text-muted-foreground">{solution.description}</p>
                </div>
              </div>
            ))}
            <Link href="/learn-more">
              <Button variant="link" className="p-0">
                Learn how it works →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

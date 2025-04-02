import { Card, CardContent } from "@/components/ui/card"
import { 
  Bot, LineChart, History, Shield, Clock, Zap, 
  BookOpen, Code, RefreshCcw, Bell, Users, Terminal 
} from "lucide-react"

export function FeaturesGridSection() {
  const features = [
    {
      category: "Strategy Building",
      items: [
        {
          icon: <Bot className="h-5 w-5 text-primary" />,
          title: "Visual Strategy Builder",
          description: "Drag-and-drop interface for creating custom trading strategies"
        },
        {
          icon: <Clock className="h-5 w-5 text-primary" />,
          title: "Scheduling Options",
          description: "Run your bots on specific intervals or market conditions"
        },
        {
          icon: <BookOpen className="h-5 w-5 text-primary" />,
          title: "Strategy Library",
          description: "Browse and implement pre-built trading strategies"
        },
        {
          icon: <Code className="h-5 w-5 text-primary" />,
          title: "Advanced Mode",
          description: "Use custom code for sophisticated trading algorithms"
        }
      ]
    },
    {
      category: "Portfolio Management",
      items: [
        {
          icon: <LineChart className="h-5 w-5 text-primary" />,
          title: "Performance Analytics",
          description: "Detailed metrics on returns, drawdowns, and volatility"
        },
        {
          icon: <RefreshCcw className="h-5 w-5 text-primary" />,
          title: "Auto-Rebalancing",
          description: "Keep your portfolio aligned with your target allocations"
        },
        {
          icon: <Bell className="h-5 w-5 text-primary" />,
          title: "Custom Alerts",
          description: "Get notified about important market events or performance thresholds"
        },
        {
          icon: <Users className="h-5 w-5 text-primary" />,
          title: "Social Trading",
          description: "Follow and copy strategies from top-performing traders"
        }
      ]
    },
    {
      category: "Performance & Risk",
      items: [
        {
          icon: <History className="h-5 w-5 text-primary" />,
          title: "Advanced Backtesting",
          description: "Test your strategies against historical market data"
        },
        {
          icon: <Shield className="h-5 w-5 text-primary" />,
          title: "Risk Controls",
          description: "Set stop-losses, take-profits, and exposure limits"
        },
        {
          icon: <Terminal className="h-5 w-5 text-primary" />,
          title: "Performance Metrics",
          description: "Track Sharpe ratio, max drawdown, win rate, and more"
        },
        {
          icon: <Zap className="h-5 w-5 text-primary" />,
          title: "Real-Time Execution",
          description: "Lightning-fast trade execution with minimal slippage"
        }
      ]
    }
  ]
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Features</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build, manage, and optimize automated trading strategies
          </p>
        </div>
        
        <div className="grid gap-12">
          {features.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold mb-6">{category.category}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((feature, i) => (
                  <Card key={i} className="border border-muted h-full">
                    <CardContent className="pt-6">
                      <div className="mb-4">{feature.icon}</div>
                      <h4 className="font-medium mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

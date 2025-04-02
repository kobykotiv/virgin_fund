import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { BotIcon, LineChart, History, Settings, CheckCircle } from "lucide-react"

export function FeaturesOverviewSection() {
  const features = [
    {
      id: "bot-builder",
      title: "Bot Builder",
      description: "Create custom trading bots with our visual strategy builder - no coding required.",
      icon: <BotIcon className="h-5 w-5" />,
      image: "/images/bot-builder-screenshot.png"
    },
    {
      id: "portfolio",
      title: "Portfolio Management",
      description: "Track performance, analyze trends, and optimize your investments in real-time.",
      icon: <LineChart className="h-5 w-5" />,
      image: "/images/portfolio-screenshot.png"
    },
    {
      id: "backtesting",
      title: "Backtesting Engine",
      description: "Test your strategies against historical data before risking real capital.",
      icon: <History className="h-5 w-5" />,
      image: "/images/backtesting-screenshot.png"
    },
    {
      id: "settings",
      title: "Risk Controls",
      description: "Set stop-losses, take-profits, and exposure limits to protect your investments.",
      icon: <Settings className="h-5 w-5" />,
      image: "/images/risk-controls-screenshot.png"
    }
  ]
  
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Professional-Grade Trading Tools</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build, test, and automate sophisticated trading strategies in one integrated platform.
          </p>
        </div>
        
        <Tabs defaultValue="bot-builder" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-3xl mx-auto mb-8">
            {features.map((feature) => (
              <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
                {feature.icon}
                <span className="hidden sm:inline">{feature.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                  
                  {feature.id === "bot-builder" && (
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Drag-and-drop visual strategy builder</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Pre-built strategy templates for quick start</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Custom indicators and conditions</span>
                      </li>
                    </ul>
                  )}
                  
                  {feature.id === "portfolio" && (
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Real-time performance tracking and analytics</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Asset allocation visualization and optimization</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Risk/reward analysis and reporting</span>
                      </li>
                    </ul>
                  )}
                  
                  {feature.id === "backtesting" && (
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Test against historical data across multiple markets</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Detailed performance metrics and statistics</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Monte Carlo simulations for risk analysis</span>
                      </li>
                    </ul>
                  )}
                  
                  {feature.id === "settings" && (
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Customizable stop-loss and take-profit settings</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Position sizing and portfolio exposure controls</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Automated risk adjustment based on market conditions</span>
                      </li>
                    </ul>
                  )}
                </div>
                
                <div className="relative rounded-lg overflow-hidden shadow-xl border bg-background">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

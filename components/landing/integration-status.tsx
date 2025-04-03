import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"

export function IntegrationStatusSection() {
  const integrations = [
    {
      name: "Alpaca Markets",
      logo: "/images/integrations/alpaca.png",
      status: "operational",
      uptime: "99.98%",
      latency: "124ms"
    },
    {
      name: "CoinGecko API",
      logo: "/images/integrations/coingecko.png",
      status: "operational",
      uptime: "99.95%",
      latency: "178ms"
    },
    {
      name: "Yahoo Finance",
      logo: "/images/integrations/yahoo.png",
      status: "operational",
      uptime: "99.99%",
      latency: "145ms"
    },
    {
      name: "Binance API",
      logo: "/images/integrations/binance.png",
      status: "degraded",
      uptime: "98.87%",
      latency: "210ms"
    }
  ]
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "down":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }
  
  const getStatusText = (status) => {
    switch (status) {
      case "operational":
        return "Operational"
      case "degraded":
        return "Degraded Performance"
      case "down":
        return "Service Disruption"
      default:
        return "Operational"
    }
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "operational":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>
      case "degraded":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Degraded</Badge>
      case "down":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Disruption</Badge>
      default:
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>
    }
  }
  
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real-Time Integration Status</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We monitor our API integrations 24/7 to ensure reliable execution of your trading strategies
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map((integration, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative h-10 w-10">
                    <Image 
                      src={integration.logo} 
                      alt={integration.name} 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                  <h4 className="font-medium">{integration.name}</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(integration.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span>{integration.uptime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Latency</span>
                    <span>{integration.latency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </section>
  )
}

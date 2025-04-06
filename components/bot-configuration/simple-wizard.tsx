import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Grid2X2, Timer, ArrowsUpDown, LineChart } from "lucide-react"

const QUICK_TEMPLATES = [
  {
    id: 'dca-btc',
    name: 'BTC DCA Bot',
    icon: Timer,
    description: 'Daily Bitcoin purchases',
    defaults: {
      symbol: 'BTC/USD',
      amount: 100,
      interval: 24
    }
  },
  {
    id: 'grid-eth',
    name: 'ETH Grid Bot',
    icon: Grid2X2,
    description: 'ETH grid trading strategy',
    defaults: {
      symbol: 'ETH/USD',
      gridLevels: 5,
      investmentAmount: 1000
    }
  }
]

export function SimpleBotWizard({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { toast } = useToast()

  const handleTemplateSelect = (templateId: string) => {
    const template = QUICK_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      onSubmit({
        ...template.defaults,
        name: `${template.name}-${Math.floor(Math.random() * 1000)}`,
        template: templateId
      })
      toast({
        title: "Template Selected",
        description: `Created bot from ${template.name} template`
      })
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {QUICK_TEMPLATES.map(template => (
        <Card 
          key={template.id}
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => handleTemplateSelect(template.id)}
        >
          <CardHeader>
            <div className="flex items-center space-x-2">
              <template.icon className="h-5 w-5" />
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="mt-4 space-y-2">
              {Object.entries(template.defaults).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Use Template</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

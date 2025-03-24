import { BotConfig } from "@/types/bot"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Props {
  config: Partial<BotConfig>
  onUpdate: (updates: Partial<BotConfig>) => void
}

export function StrategyStep({ config, onUpdate }: Props) {
  const updateStrategy = (field: string, value: any) => {
    onUpdate({
      strategy: {
        ...config.strategy,
        [field]: value,
      },
    })
  }

  const updateIndicator = (index: number, field: string, value: any) => {
    const indicators = [...(config.strategy?.indicators || [])]
    indicators[index] = {
      ...indicators[index],
      [field]: value,
    }
    updateStrategy('indicators', indicators)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium">Strategy Type</label>
        <Select 
          value={config.strategy?.type}
          onValueChange={(value) => updateStrategy('type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select strategy type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="momentum">Momentum</SelectItem>
            <SelectItem value="meanReversion">Mean Reversion</SelectItem>
            <SelectItem value="trend">Trend Following</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Indicators</label>
        {config.strategy?.indicators?.map((indicator, index) => (
          <div key={index} className="space-y-4 mb-4 p-4 border rounded">
            <div>
              <label className="block text-sm">Name</label>
              <Input
                value={indicator.name}
                onChange={(e) => updateIndicator(index, 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm">Period</label>
              <Input
                type="number"
                value={indicator.period}
                onChange={(e) => updateIndicator(index, 'period', parseInt(e.target.value))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



















































































































































































































































































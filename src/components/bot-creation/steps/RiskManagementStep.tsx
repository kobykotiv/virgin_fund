import { BotConfig } from "@/types/bot"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Props {
  config: Partial<BotConfig>
  onUpdate: (updates: Partial<BotConfig>) => void
}

export function RiskManagementStep({ config, onUpdate }: Props) {
  const updateRiskSettings = (field: string, value: any) => {
    onUpdate({
      riskManagement: {
        ...config.riskManagement,
        [field]: value,
      },
    })
  }

  const updateStopLoss = (field: string, value: any) => {
    updateRiskSettings('stopLoss', {
      ...config.riskManagement?.stopLoss,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Stop Loss Settings</label>
        <div className="space-y-4 p-4 border rounded">
          <Select
            value={config.riskManagement?.stopLoss?.type}
            onValueChange={(value) => updateStopLoss('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stop loss type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="trailing">Trailing</SelectItem>
              <SelectItem value="atr">ATR Based</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Stop Loss Value (%)"
            value={config.riskManagement?.stopLoss?.value}
            onChange={(e) => updateStopLoss('value', parseFloat(e.target.value))}
          />

          {config.riskManagement?.stopLoss?.type === 'atr' && (
            <Input
              type="number"
              placeholder="ATR Multiplier"
              value={config.riskManagement?.stopLoss?.atrMultiplier}
              onChange={(e) => updateStopLoss('atrMultiplier', parseFloat(e.target.value))}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Position Sizing</label>
        <Input
          type="number"
          placeholder="Risk per trade (%)"
          value={config.riskManagement?.riskPerTrade}
          onChange={(e) => updateRiskSettings('riskPerTrade', parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Maximum Drawdown</label>
        <Input
          type="number"
          placeholder="Max drawdown (%)"
          value={config.riskManagement?.maxDrawdown}
          onChange={(e) => updateRiskSettings('maxDrawdown', parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}

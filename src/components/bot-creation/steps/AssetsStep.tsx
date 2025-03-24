import { BotConfig } from "@/types/bot"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  config: Partial<BotConfig>
  onUpdate: (updates: Partial<BotConfig>) => void
}

export function AssetsStep({ config, onUpdate }: Props) {
  const addAsset = () => {
    const assets = [...(config.assets || [])]
    assets.push({ symbol: '', allocation: 0 })
    onUpdate({ assets })
  }

  const updateAsset = (index: number, field: string, value: any) => {
    const assets = [...(config.assets || [])]
    assets[index] = {
      ...assets[index],
      [field]: value,
    }
    onUpdate({ assets })
  }

  const removeAsset = (index: number) => {
    const assets = [...(config.assets || [])]
    assets.splice(index, 1)
    onUpdate({ assets })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-4">Trading Assets</label>
        {config.assets?.map((asset, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <Input
              placeholder="Symbol (e.g. BTCUSDT)"
              value={asset.symbol}
              onChange={(e) => updateAsset(index, 'symbol', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Allocation %"
              value={asset.allocation}
              onChange={(e) => updateAsset(index, 'allocation', parseFloat(e.target.value))}
            />
            <Button variant="destructive" onClick={() => removeAsset(index)}>
              Remove
            </Button>
          </div>
        ))}
        
        <Button onClick={addAsset} className="mt-2">
          Add Asset
        </Button>
      </div>
    </div>
  )
}

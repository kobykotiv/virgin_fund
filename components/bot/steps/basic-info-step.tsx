import { type BotConfig } from "@/types/bot"

interface Props {
  config: Partial<BotConfig>
  onUpdate: (updates: Partial<BotConfig>) => void
}

export function BasicInfoStep({ config, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input 
          type="text"
          value={config.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={config.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>
    </div>
  )
}

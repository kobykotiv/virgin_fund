import { BotConfig } from '@/types/bot';

interface Props {
  config: Partial<BotConfig>;
  onUpdate: (updates: Partial<BotConfig>) => void;
}

export function BasicInfoStep({ config, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Bot Basic Information</div>
      <div className="text-gray-600">
        Let's start by giving your trading bot a name and description.
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bot Name
          </label>
          <input
            type="text"
            value={config.name || ''}
            onChange={e => onUpdate({ name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="My Trading Bot"
          />
        </div>

        <div className="text-sm text-gray-500">
          <p>Tips for creating your bot:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Choose a descriptive name that reflects your strategy</li>
            <li>You can create multiple bots with different strategies</li>
            <li>Start with a small allocation to test your strategy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

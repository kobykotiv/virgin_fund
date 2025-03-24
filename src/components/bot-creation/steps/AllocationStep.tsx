import { BotConfig, TradingFrequency } from '@/types/bot';

interface Props {
  config: Partial<BotConfig>;
  onUpdate: (updates: Partial<BotConfig>) => void;
}

export function AllocationStep({ config, onUpdate }: Props) {
  const frequencies: TradingFrequency[] = ['daily', 'weekly', 'monthly', 'quarterly'];

  const updateAllocation = (field: keyof BotConfig['allocation'], value: number | TradingFrequency) => {
    onUpdate({
      allocation: {
        ...config.allocation,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Investment Allocation</div>
      <div className="text-gray-600">
        Set your investment amount and recurring deposit schedule.
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Initial Investment ($)
          </label>
          <input
            type="number"
            value={config.allocation?.initialAmount || ''}
            onChange={(e) => updateAllocation('initialAmount', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="1000"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recurring Investment ($)
          </label>
          <input
            type="number"
            value={config.allocation?.recurringAmount || ''}
            onChange={(e) => updateAllocation('recurringAmount', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="100"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Investment Frequency
          </label>
          <select
            value={config.allocation?.frequency || ''}
            onChange={(e) => updateAllocation('frequency', e.target.value as TradingFrequency)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select frequency</option>
            {frequencies.map((freq) => (
              <option key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

import { BotConfig } from '@/types/bot';

interface Props {
  config: Partial<BotConfig>;
}

export function ReviewStep({ config }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Review Configuration</div>
      <div className="text-gray-600">
        Review your bot configuration before creating it.
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Basic Information</h3>
          <p className="text-gray-600">Name: {config.name}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Strategy</h3>
          <p className="text-gray-600">Type: {config.strategy?.type}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Risk Management</h3>
          <div className="space-y-1 text-gray-600">
            <p>Stop Loss: {config.riskManagement?.stopLoss}%</p>
            <p>Take Profit: {config.riskManagement?.takeProfit}%</p>
            <p>Max Drawdown: {config.riskManagement?.maxDrawdown}%</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Allocation</h3>
          <div className="space-y-1 text-gray-600">
            <p>Initial Investment: ${config.allocation?.initialAmount}</p>
            <p>Recurring Investment: ${config.allocation?.recurringAmount}</p>
            <p>Frequency: {config.allocation?.frequency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

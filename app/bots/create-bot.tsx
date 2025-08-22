import { useState } from 'react';
import { BotForm } from '@/components/bot-form';
import { toast } from '@/components/ui/use-toast';
import { useCreateBot } from '@/hooks/useBots';

const TEMPLATES = [
	{
		name: 'Tech Growth Portfolio',
		type: 'Stock',
		assets: ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'META'],
		allocation: 'Growth',
		risk: 'Medium-High',
		description: 'FAANG stocks with growth focus',
		prefill: {
			strategy: 'growth',
			assets: ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'META'],
			risk: 'medium-high',
		},
	},
	{
		name: 'Crypto Grid Trading',
		type: 'Crypto',
		assets: ['BTC', 'ETH', 'SOL', 'ADA'],
		allocation: 'Grid',
		risk: 'High',
		description: 'Automated grid strategy for crypto volatility',
		prefill: {
			strategy: 'grid',
			assets: ['BTC', 'ETH', 'SOL', 'ADA'],
			risk: 'high',
		},
	},
	{
		name: 'Dividend DCA Strategy',
		type: 'Stock',
		assets: ['KO', 'PG', 'JNJ', 'T', 'VZ'],
		allocation: 'DCA',
		risk: 'Low-Medium',
		description: 'Dollar-cost averaging into dividend stocks',
		prefill: {
			strategy: 'dca',
			assets: ['KO', 'PG', 'JNJ', 'T', 'VZ'],
			risk: 'low-medium',
			recurringBuys: true,
			recurringFrequency: 'weekly',
		},
	},
	{
		name: 'Momentum Indicator Bot',
		type: 'Stock',
		assets: ['SPY', 'QQQ'],
		allocation: 'Momentum',
		risk: 'Medium',
		description: 'RSI/MACD-based momentum trading',
		prefill: {
			strategy: 'momentum',
			assets: ['SPY', 'QQQ'],
			risk: 'medium',
		},
	},
	{
		name: 'AI Trend Follower',
		type: 'Stock/ETF',
		assets: ['NVDA', 'AMD', 'TSLA', 'QQQ'],
		allocation: 'Trend',
		risk: 'Medium-High',
		description: 'Follows AI/tech trends using moving averages.',
		prefill: {
			strategy: 'trend',
			assets: ['NVDA', 'AMD', 'TSLA', 'QQQ'],
			risk: 'medium-high',
		},
	},
	{
		name: 'Commodities Hedge',
		type: 'Commodities',
		assets: ['GLD', 'SLV', 'USO'],
		allocation: 'Hedge',
		risk: 'Low-Medium',
		description: 'Diversifies with gold, silver, and oil ETFs.',
		prefill: {
			strategy: 'hedge',
			assets: ['GLD', 'SLV', 'USO'],
			risk: 'low-medium',
		},
	},
	{
		name: 'Stablecoin Yield',
		type: 'Crypto',
		assets: ['USDC', 'DAI'],
		allocation: 'Yield',
		risk: 'Low',
		description: 'Stablecoin staking/yield farming.',
		prefill: {
			strategy: 'yield',
			assets: ['USDC', 'DAI'],
			risk: 'low',
		},
	},
	{
		name: 'Volatility Breakout',
		type: 'Stock',
		assets: ['VIXY', 'UVXY'],
		allocation: 'Breakout',
		risk: 'High',
		description: 'Trades volatility spikes using VIX ETFs.',
		prefill: {
			strategy: 'breakout',
			assets: ['VIXY', 'UVXY'],
			risk: 'high',
		},
	},
];

export default function CreateBotPage() {
const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
const [showForm, setShowForm] = useState(false);
const createBot = useCreateBot();

	const handleTemplateClick = (template: any) => {
		setSelectedTemplate(template);
		setShowForm(true);
		toast({ title: `Template: ${template.name} selected!` });
	};

	const handleCustom = () => {
		setSelectedTemplate(null);
		setShowForm(true);
		toast({ title: 'Custom bot creation started!' });
	};

	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Create Trading Bot</h1>
			{!showForm && (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						{TEMPLATES.map((tpl) => (
							<div
								key={tpl.name}
								className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer bg-white"
								onClick={() => handleTemplateClick(tpl)}
							>
								<h2 className="text-xl font-semibold mb-2">{tpl.name}</h2>
								<div className="mb-1 text-sm text-gray-600">
									Type: {tpl.type}
								</div>
								<div className="mb-1 text-sm text-gray-600">
									Assets: {tpl.assets.join(', ')}
								</div>
								<div className="mb-1 text-sm text-gray-600">
									Allocation: {tpl.allocation}
								</div>
								<div className="mb-1 text-sm text-gray-600">Risk: {tpl.risk}</div>
								<div className="text-xs text-gray-500 mt-2">
									{tpl.description}
								</div>
							</div>
						))}
						<div
							className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer bg-blue-50 flex flex-col justify-center items-center"
							onClick={handleCustom}
						>
							<h2 className="text-xl font-semibold mb-2">Custom Bot</h2>
							<div className="text-gray-600">
								Build from scratch with full control
							</div>
						</div>
					</div>
					<div className="mb-4 text-gray-700">
						<strong>How it works:</strong> Select a template for a quick start, or
						build your own custom bot. All bots can be further configured after
						selection.
					</div>
				</>
			)}
			{showForm && (
				<div>
					<button
						className="mb-4 text-blue-600 hover:underline"
						onClick={() => setShowForm(false)}
					>
						&rarr; Back to templates
					</button>
<BotForm
  initialBot={selectedTemplate ? { ...selectedTemplate.prefill, recurringBuys: true } : null}
  onSubmit={async (bot) => {
    try {
      await createBot.mutateAsync({
        name: bot.name ?? (selectedTemplate?.name ?? "New Bot"),
        strategy: bot.strategy ?? selectedTemplate?.prefill?.strategy ?? "default",
        capital: bot.capital ?? 10000,
        metadata: bot,
      });
      toast({ title: 'Bot created' });
      setShowForm(false);
    } catch (e: any) {
      toast({ title: 'Failed to create bot', description: e?.message ?? 'Unknown error', variant: 'destructive' });
    }
  }}
  onCancel={() => setShowForm(false)}
/>
				</div>
			)}
		</div>
	);
}

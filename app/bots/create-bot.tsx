"use client"

import { useState } from 'react'
import BotForm from '@/components/bot-configuration/BotForm'
import { toast } from '@/components/ui/use-toast'
import { useCreateBot } from '@/hooks/useBots'
import type { CreateBotPayload } from '@/types/api'
import { useRouter } from 'next/navigation'

const TEMPLATES = [
	{
		name: 'Tech Growth Portfolio',
		type: 'Stock',
		assets: ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'META'],
		allocation: 'Growth',
		risk: 'Medium-High',
		description: 'FAANG and large-cap growth names',
		prefill: { strategy: 'grid', assets: ['AAPL', 'AMZN', 'GOOGL'] },
	},
	{
		name: 'Crypto Bluechips',
		type: 'Crypto',
		assets: ['BTC', 'ETH', 'SOL', 'ADA'],
		allocation: 'Core',
		risk: 'High',
		description: 'Top-cap cryptocurrencies',
		prefill: { strategy: 'dca', assets: ['BTC', 'ETH'] },
	},
	{
		name: 'Commodities Hedge',
		type: 'Commodities',
		assets: ['GLD', 'SLV', 'USO'],
		allocation: 'Hedge',
		risk: 'Low-Medium',
		description: 'Diversifies with gold, silver, and oil ETFs.',
		prefill: { strategy: 'hedge', assets: ['GLD', 'SLV', 'USO'] },
	},
]

export default function CreateBotPage() {
	const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
	const [showForm, setShowForm] = useState(false)
	const createBot = useCreateBot()
	const router = useRouter()

	const handleTemplateClick = (template: any) => {
		setSelectedTemplate(template)
		setShowForm(true)
		toast({ title: `Template: ${template.name} selected!` })
	}

	const handleCustom = () => {
		setSelectedTemplate(null)
		setShowForm(true)
		toast({ title: 'Custom bot creation started!' })
	}

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
								<div className="mb-1 text-sm text-gray-600">Type: {tpl.type}</div>
								<div className="mb-1 text-sm text-gray-600">Assets: {tpl.assets.join(', ')}</div>
								<div className="mb-1 text-sm text-gray-600">Allocation: {tpl.allocation}</div>
								<div className="mb-1 text-sm text-gray-600">Risk: {tpl.risk}</div>
								<div className="text-xs text-gray-500 mt-2">{tpl.description}</div>
							</div>
						))}
						<div
							className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer bg-blue-50 flex flex-col justify-center items-center"
							onClick={handleCustom}
						>
							<h2 className="text-xl font-semibold mb-2">Custom Bot</h2>
							<div className="text-gray-600">Build from scratch with full control</div>
						</div>
					</div>
					<div className="mb-4 text-gray-700">
						<strong>How it works:</strong> Select a template for a quick start, or build your own custom bot. All bots can be further configured after selection.
					</div>
				</>
			)}
			{showForm && (
				<div>
					<button className="mb-4 text-blue-600 hover:underline" onClick={() => setShowForm(false)}>
						&rarr; Back to templates
					</button>

					<BotForm
						open={showForm}
						onOpenChange={(open) => setShowForm(open)}
						initial={selectedTemplate ? { ...selectedTemplate.prefill, recurringBuys: true } : undefined}
						mode="create"
												onSubmit={async (bot) => {
														const payload: CreateBotPayload = {
															name: bot.name ?? selectedTemplate?.name ?? 'New Bot',
															strategy: bot.strategy ?? selectedTemplate?.prefill?.strategy ?? 'default',
															capital: bot.capital ?? 10000,
															parameters: bot,
														}
														await createBot.mutateAsync(payload)
												}}
						onSuccess={() => {
							toast({ title: 'Bot created' })
							setShowForm(false)
						}}
					/>
				</div>
			)}
		</div>
	)
}

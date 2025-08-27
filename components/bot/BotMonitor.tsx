import React from 'react'
import PositionSummary from './PositionSummary'
import useBotLive from '@/hooks/useBotLive'

export default function BotMonitor({ botId }: { botId: string }) {
  const { data, status } = useBotLive(botId)

  return (
    <div className="p-3 bg-white rounded border">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Bot Monitor</div>
        <div className="text-xs text-gray-500">{status}</div>
      </div>
      <div className="mt-2">
        <div className="text-sm">Price: {data?.price ?? '—'}</div>
        <div className="text-sm">Last trade: {data?.lastTradeAt ?? '—'}</div>
      </div>
      <div className="mt-3">
        <PositionSummary positions={data?.positions ?? []} />
      </div>
    </div>
  )
}

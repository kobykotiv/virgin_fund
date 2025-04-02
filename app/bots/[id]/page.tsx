import { demoBots } from '@/data/demo-bots'
import { BotDetailView } from '@/components/bot-detail-view'
import { notFound } from 'next/navigation'

interface BotPageProps {
  params: {
    id: string
  }
}

export default function BotPage({ params }: BotPageProps) {
  const bot = demoBots.find(bot => bot.id === params.id)
  
  if (!bot) {
    return notFound()
  }
  
  return <BotDetailView bot={bot} />
}

// Generate static paths for each bot
export async function generateStaticParams() {
  return demoBots.map(bot => ({
    id: bot.id
  }))
}
```

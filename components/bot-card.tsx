"use client"

import { useState } from 'react'
import { DemoBot } from '@/types/portfolio'
import { Card } from '@/components/ui/card'
import { LineChart, PieChart } from '@/components/charts'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import { BotDetailView } from './bot-detail-view'

interface BotCardProps {
  bot: DemoBot
}

export function BotCard({ bot }: BotCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  if (showDetails) {
    return (
      <BotDetailView bot={bot} onBack={() => setShowDetails(false)} />
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative w-full"
    >
      <Card className="p-6 backdrop-blur-sm bg-background/60 border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{bot.nickname}</h3>
              <p className="text-sm text-muted-foreground">ID: {bot.id}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${bot.costBasis.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Cost Basis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-24">
              <LineChart data={bot.performance} />
            </div>
            <div className="h-24">
              <PieChart data={bot.allocation} />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <p>{bot.positions.length} Positions</p>
              <p>Margin: {(bot.margin * 100).toFixed(1)}%</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetails(true)}
              className="gap-1"
            >
              Details <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

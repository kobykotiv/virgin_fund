"use client"

import { useRef } from 'react'
import { DemoBot } from '@/types/portfolio'
import { Card } from '@/components/ui/card'
import { LineChart, PieChart } from '@/components/charts'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { BotDetailView } from './bot-detail-view'
import { useExpandable } from '@/components/hooks/use-expandable'

interface BotCardProps {
  bot: DemoBot
}

export function BotCard({ bot }: BotCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable()
  const contentRef = useRef<HTMLDivElement>(null)
  
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

          <motion.div
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-4"
                  >
                    <BotDetailView bot={bot} onBack={toggleExpand} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-sm">
              <p>{bot.positions.length} Positions</p>
              <p>Margin: {(bot.margin * 100).toFixed(1)}%</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpand}
              className="gap-1"
            >
              {isExpanded ? (
                <>Less <ArrowUpIcon className="h-4 w-4" /></>
              ) : (
                <>More <ArrowDownIcon className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

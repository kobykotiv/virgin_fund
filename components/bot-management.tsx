import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Settings, Play, Pause, Trash, Plus, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Bot } from "@/types/bot"
import { SimpleBotConfig, ComplexBotConfig } from "@/components/bot-configuration"
import { useState } from "react"

interface BotHeroProps {
  bot: Bot
  onAction: (action: 'start' | 'stop' | 'delete') => void
  isLoading?: boolean
}

export function BotHero({ bot, onAction, isLoading }: BotHeroProps) {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
        <Badge className="w-fit mb-3">{bot.type}</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {bot.name}
        </h1>
        <p className="text-white/90 text-lg max-w-3xl mb-6">
          {bot.description}
        </p>
        <div className="flex items-center text-white/80 mb-4">
          <Clock className="mr-2 h-4 w-4" />
          <span className="mr-4">Active since {new Date(bot.createdAt).toLocaleDateString()}</span>
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Last trade: {bot.lastTradeAt ? new Date(bot.lastTradeAt).toLocaleString() : 'No trades yet'}</span>
        </div>
        <div className="flex gap-4">
          <Button 
            variant={bot.status === 'active' ? "destructive" : "secondary"} 
            size="lg"
            onClick={() => onAction(bot.status === 'active' ? 'stop' : 'start')}
            disabled={isLoading}
          >
            {bot.status === 'active' ? (
              <><Pause className="mr-2 h-5 w-5" /> Stop Bot</>
            ) : (
              <><Play className="mr-2 h-5 w-5" /> Start Bot</>
            )}
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="mr-2 h-5 w-5" />
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}

export function BotGrid({ bots, onAction }: { bots: Bot[], onAction: (botId: string, action: string) => void }) {
  const [showConfig, setShowConfig] = useState<'simple' | 'complex' | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <Card key={bot.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {bot.type}
                  </Badge>
                  <CardTitle className="text-xl">{bot.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {bot.description}
                  </CardDescription>
                </div>
                <Badge 
                  variant={bot.status === 'active' ? "success" : "secondary"}
                >
                  {bot.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">P&L</span>
                  <span className={bot.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                    {bot.pnl >= 0 ? '+' : ''}{bot.pnl.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Positions</span>
                  <span>{bot.positions?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Trade</span>
                  <span>{bot.lastTradeAt ? new Date(bot.lastTradeAt).toLocaleString() : 'Never'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction(bot.id, bot.status === 'active' ? 'stop' : 'start')}
              >
                {bot.status === 'active' ? (
                  <><Pause className="mr-2 h-4 w-4" /> Stop</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Start</>
                )}
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onAction(bot.id, 'delete')}
                  disabled={bot.status === 'active'}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {/* Add New Bot Card */}
        <Card className="flex flex-col items-center justify-center p-6 border-dashed">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Create New Bot</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Choose your configuration method
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setShowConfig('simple')}>
              Quick Setup
            </Button>
            <Button variant="outline" onClick={() => setShowConfig('complex')}>
              Advanced
            </Button>
          </div>
        </Card>
      </div>

      {/* Configuration Dialogs */}
      <Dialog open={showConfig !== null} onOpenChange={() => setShowConfig(null)}>
        <DialogContent className="sm:max-w-[800px]">
          {showConfig === 'simple' ? (
            <SimpleBotConfig onSubmit={handleCreateBot} />
          ) : (
            <ComplexBotConfig onSubmit={handleCreateBot} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

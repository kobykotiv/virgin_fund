"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StrategyBuilder } from "@/components/strategy-builder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import type { Bot, BotValidation } from "@/types/bot"

interface BotCreatorProps {
  availableAssets: string[]
  existingBot?: Bot
  portfolioId?: string
}

export function BotCreator({ availableAssets, existingBot, portfolioId }: BotCreatorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationResult, setValidationResult] = useState<BotValidation | null>(null)
  
  const handleSaveBot = async (botData: Partial<Bot>) => {
    setIsSubmitting(true)
    setValidationResult(null)
    
    try {
      // First validate the bot (optional)
      const validationResponse = await fetch('/api/db/bots/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(botData)
      })
      
      const validation = await validationResponse.json()
      setValidationResult(validation)
      
      // If there are critical errors, stop
      if (validation.errors && validation.errors.length > 0) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors before saving",
          variant: "destructive"
        })
        setIsSubmitting(false)
        return
      }
      
      // Create or update the bot
      const url = existingBot 
        ? `/api/db/bots/${existingBot.id}` 
        : '/api/db/bots'
      
      const response = await fetch(url, {
        method: existingBot ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(botData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save bot')
      }
      
      const savedBot = await response.json()
      
      // If portfolio ID is provided, add bot to portfolio
      if (portfolioId && !existingBot) {
        const portfolioResponse = await fetch('/api/db/portfolios/bots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            portfolioId,
            botId: savedBot._id,
            status: 'paused',
            permissions: ['read', 'trade']
          })
        })
        
        if (!portfolioResponse.ok) {
          toast({
            title: "Bot created but not added to portfolio",
            description: "There was an issue connecting the bot to your portfolio",
            variant: "warning"
          })
        }
      }
      
      toast({
        title: existingBot ? "Bot Updated" : "Bot Created",
        description: existingBot 
          ? "Your trading bot has been updated" 
          : "Your new trading bot has been created"
      })
      
      // Redirect to appropriate page
      if (portfolioId) {
        router.push(`/portfolios/${portfolioId}`)
      } else {
        router.push('/bots')
      }
    } catch (error) {
      console.error('Error saving bot:', error)
      toast({
        title: "Error",
        description: "Failed to save bot. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {existingBot ? 'Edit Trading Bot' : 'Create New Trading Bot'}
        </h1>
        <Button 
          variant="outline"
          onClick={() => {
            if (portfolioId) {
              router.push(`/portfolios/${portfolioId}`)
            } else {
              router.push('/bots')
            }
          }}
        >
          Cancel
        </Button>
      </div>
      
      {validationResult && (validationResult.warnings.length > 0 || validationResult.suggestions.length > 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Strategy Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationResult.warnings.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-amber-800 mb-1">Warnings</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="text-amber-700 text-sm">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Suggestions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validationResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-amber-600 text-sm">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <StrategyBuilder 
        onSave={handleSaveBot}
        existingBot={existingBot}
        availableAssets={availableAssets}
      />
      
      <div className="flex justify-end mt-6">
        <Button 
          variant="outline"
          className="mr-2"
          onClick={() => {
            if (portfolioId) {
              router.push(`/portfolios/${portfolioId}`)
            } else {
              router.push('/bots')
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          disabled={isSubmitting}
          onClick={() => document.getElementById('save-strategy-button')?.click()}
        >
          {isSubmitting ? 'Saving...' : existingBot ? 'Update Bot' : 'Create Bot'}
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"

const DISCORD_INVITE_URL = "https://discord.gg/your-invite-here" // Replace with actual Discord invite

export function ForumRedirect() {
  useEffect(() => {
    // Optional: Automatic redirect after delay
    const timer = setTimeout(() => {
      window.location.href = DISCORD_INVITE_URL
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 space-y-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">Redirecting to Discord...</h2>
          <p className="text-muted-foreground">
            If you're not redirected automatically, click the button below
          </p>
          <Button 
            onClick={() => window.open(DISCORD_INVITE_URL, '_blank')}
            className="gap-2"
          >
            Open Discord <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

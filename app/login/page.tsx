"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login, enableDemoMode } = useAuth()
  const { toast } = useToast()

  const [apiKey, setApiKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [isPaper, setIsPaper] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      if (!apiKey || !secretKey) {
        setError("API key and Secret key are required")
        setIsLoading(false)
        return
      }

      await login({ apiKey, secretKey, isPaper })
      toast({ title: "Connected", description: "Alpaca credentials verified" })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate with Alpaca")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemo = () => {
    enableDemoMode()
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle>Sign in — Alpaca / Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-destructive">{error}</div>}

            <div>
              <Label htmlFor="apiKey">Alpaca API Key</Label>
              <Input id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="secretKey">Alpaca Secret Key</Label>
              <Input id="secretKey" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
                tabIndex={0}
              >
                Forgot password?
              </a>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPaper"
                type="checkbox"
                checked={isPaper}
                onChange={(e) => setIsPaper(e.target.checked)}
              />
              <Label htmlFor="isPaper">Use paper trading</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect Alpaca"}
              </Button>
              <Button type="button" variant="ghost" onClick={handleDemo}>
                Try Demo Account
              </Button>
            </div>
            <div className="my-4 flex flex-col gap-2">
              <div className="text-xs text-muted-foreground text-center">or sign in with</div>
              <div className="flex gap-2 justify-center">
                <Button type="button" variant="outline" disabled>
                  Google
                </Button>
                <Button type="button" variant="outline" disabled>
                  GitHub
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

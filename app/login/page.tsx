"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // ensure cookies are accepted
        body: JSON.stringify({ email, password }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(body?.error || "Login failed")
        setLoading(false)
        return
      }

      toast({
        title: "Signed in",
        description: "You are now signed in.",
      })

      // Redirect to dashboard (server sets httponly cookie)
      router.push("/dashboard")
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setError(null)
    if (!email) {
      setError("Enter your email to receive a magic link.")
      return
    }
    setMagicLoading(true)
    try {
      const res = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(body?.error || "Could not send magic link")
        return
      }

      toast({
        title: "Magic link sent",
        description: "Check your inbox for a link to sign in.",
      })
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setMagicLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in with your Supabase account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <Button
                type="button"
                className="flex-1"
                onClick={handleMagicLink}
                disabled={magicLoading}
              >
                {magicLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send magic link"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between text-sm">
          <a href="/forgot-password" className="text-muted-foreground hover:underline">
            Forgot password?
          </a>
          <a href="/signup" className="text-primary hover:underline">Create account</a>
        </CardFooter>
      </Card>
    </div>
  )
}

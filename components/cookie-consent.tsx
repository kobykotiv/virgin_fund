"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, X } from "lucide-react"
import { setCookie, getCookie } from "@/lib/cookies"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already consented
    const consent = getCookie("cookie-consent")
    if (!consent) {
      // Show cookie consent after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })

    setCookie("cookie-consent", "all", 365)
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    setCookie(
      "cookie-consent",
      Object.entries(preferences)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(","),
      365,
    )
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })

    setCookie("cookie-consent", "necessary", 365)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="mx-auto max-w-4xl bg-background/95 backdrop-blur-md shadow-lg border-primary/20">
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Cookie Preferences</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
            traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>

          {showSettings && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Necessary Cookies</p>
                  <p className="text-xs text-muted-foreground">Essential for the website to function properly.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Functional Cookies</p>
                  <p className="text-xs text-muted-foreground">
                    Enable personalized features and save your preferences.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics Cookies</p>
                  <p className="text-xs text-muted-foreground">
                    Help us understand how visitors interact with the website.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Cookies</p>
                  <p className="text-xs text-muted-foreground">
                    Used to deliver relevant ads and track their performance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAcceptAll} className="flex-1">
              Accept All
            </Button>
            {showSettings ? (
              <Button onClick={handleAcceptSelected} variant="outline" className="flex-1">
                Save Preferences
              </Button>
            ) : (
              <Button onClick={() => setShowSettings(true)} variant="outline" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            )}
            <Button onClick={handleRejectAll} variant="ghost" className="flex-1">
              Reject All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem("cookieConsent")
    if (!consentGiven) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true")
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">We value your privacy</h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={declineCookies}>
            Decline
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            Accept All
          </Button>
          <Button variant="ghost" size="icon" onClick={declineCookies} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


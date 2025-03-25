"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/providers/auth-provider"

export type SubscriptionTier = "free" | "baby" | "middle" | "big" | "xl"

interface TierLimits {
  maxBots: number
  allowedBotTypes: string[]
  liveTrading: boolean
}

interface SubscriptionContextType {
  currentTier: SubscriptionTier
  tierLimits: TierLimits
  upgradeTier: (newTier: SubscriptionTier) => void
  canCreateBot: (botType: string) => boolean
  canCreateMoreBots: (currentBotCount: number) => boolean
  isFeatureAvailable: (feature: string) => boolean
}

const tierLimitsConfig: Record<SubscriptionTier, TierLimits> = {
  free: {
    maxBots: 5,
    allowedBotTypes: ["grid", "dca"],
    liveTrading: false,
  },
  baby: {
    maxBots: 10,
    allowedBotTypes: ["grid", "dca"],
    liveTrading: true,
  },
  middle: {
    maxBots: 15,
    allowedBotTypes: ["grid", "dca", "indicator"],
    liveTrading: true,
  },
  big: {
    maxBots: 25,
    allowedBotTypes: ["grid", "dca", "indicator", "basket"],
    liveTrading: true,
  },
  xl: {
    maxBots: Number.POSITIVE_INFINITY,
    allowedBotTypes: ["grid", "dca", "indicator", "basket"],
    liveTrading: true,
  },
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("free")

  useEffect(() => {
    // In a real app, this would fetch the user's subscription from an API
    const storedTier = localStorage.getItem("subscriptionTier") as SubscriptionTier
    if (storedTier && Object.keys(tierLimitsConfig).includes(storedTier)) {
      setCurrentTier(storedTier)
    }
  }, [user])

  const upgradeTier = (newTier: SubscriptionTier) => {
    // In a real app, this would handle payment processing and API calls
    setCurrentTier(newTier)
    localStorage.setItem("subscriptionTier", newTier)
  }

  const canCreateBot = (botType: string) => {
    return tierLimitsConfig[currentTier].allowedBotTypes.includes(botType)
  }

  const canCreateMoreBots = (currentBotCount: number) => {
    return currentBotCount < tierLimitsConfig[currentTier].maxBots
  }

  const isFeatureAvailable = (feature: string) => {
    switch (feature) {
      case "liveTrading":
        return tierLimitsConfig[currentTier].liveTrading
      case "basketTrading":
        return tierLimitsConfig[currentTier].allowedBotTypes.includes("basket")
      case "indicatorTrading":
        return tierLimitsConfig[currentTier].allowedBotTypes.includes("indicator")
      default:
        return false
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        currentTier,
        tierLimits: tierLimitsConfig[currentTier],
        upgradeTier,
        canCreateBot,
        canCreateMoreBots,
        isFeatureAvailable,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}


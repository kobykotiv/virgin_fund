"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-provider"

export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise" | "xl"

interface TierLimits {
  maxBots: number
  maxStrategies: number
  liveTrading: boolean
  backtesting: boolean
  customStrategies: boolean
}

interface SubscriptionContextType {
  currentTier: SubscriptionTier
  tierLimits: TierLimits
  isSubscribed: boolean
  canCreateMoreBots: (currentBots: number) => boolean
  upgradeTier: (tier: SubscriptionTier) => Promise<void>
}

const tierLimitsMap: Record<SubscriptionTier, TierLimits> = {
  free: {
    maxBots: 2,
    maxStrategies: 3,
    liveTrading: false,
    backtesting: true,
    customStrategies: false,
  },
  basic: {
    maxBots: 5,
    maxStrategies: 10,
    liveTrading: true,
    backtesting: true,
    customStrategies: false,
  },
  pro: {
    maxBots: 15,
    maxStrategies: 25,
    liveTrading: true,
    backtesting: true,
    customStrategies: true,
  },
  enterprise: {
    maxBots: 50,
    maxStrategies: 100,
    liveTrading: true,
    backtesting: true,
    customStrategies: true,
  },
  xl: {
    maxBots: Infinity,
    maxStrategies: Infinity,
    liveTrading: true,
    backtesting: true,
    customStrategies: true,
  },
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, updateUserSubscription } = useAuth()
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("free")
  const [tierLimits, setTierLimits] = useState<TierLimits>(tierLimitsMap.free)

  useEffect(() => {
    if (user?.subscriptionTier) {
      setCurrentTier(user.subscriptionTier)
      setTierLimits(tierLimitsMap[user.subscriptionTier])
    }
  }, [user])

  const canCreateMoreBots = (currentBots: number) => {
    return currentBots < tierLimits.maxBots
  }

  const upgradeTier = async (tier: SubscriptionTier) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentTier(tier)
      setTierLimits(tierLimitsMap[tier])
      updateUserSubscription(tier)
      localStorage.setItem("subscription-tier", tier)
    } catch (error) {
      throw new Error("Failed to upgrade subscription")
    }
  }

  return (
    <SubscriptionContext.Provider 
      value={{
        currentTier,
        tierLimits,
        isSubscribed: currentTier !== "free",
        canCreateMoreBots,
        upgradeTier
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


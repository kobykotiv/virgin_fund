"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react"

type SubscriptionTier = "free" | "baby" | "middle" | "big" | "xl"

interface TierLimits {
  maxBots: number
  liveTrading: boolean
  strategies: string[]
  basketTrading: boolean
  backtestingLevel: "basic" | "standard" | "advanced" | "advanced+"
  apiAccess: boolean
  supportLevel: "community" | "email" | "priority" | "vip" | "dedicated"
}

const tierLimitsConfig: Record<SubscriptionTier, TierLimits> = {
  free: {
    maxBots: 5,
    liveTrading: false,
    strategies: ["grid", "dca"],
    basketTrading: false,
    backtestingLevel: "basic",
    apiAccess: false,
    supportLevel: "community"
  },
  baby: {
    maxBots: 10,
    liveTrading: true,
    strategies: ["grid", "dca"],
    basketTrading: false,
    backtestingLevel: "standard",
    apiAccess: false,
    supportLevel: "email"
  },
  middle: {
    maxBots: 15,
    liveTrading: true,
    strategies: ["grid", "dca", "indicators"],
    basketTrading: false,
    backtestingLevel: "advanced",
    apiAccess: false,
    supportLevel: "priority"
  },
  big: {
    maxBots: 25,
    liveTrading: true,
    strategies: ["grid", "dca", "indicators", "custom"],
    basketTrading: true,
    backtestingLevel: "advanced",
    apiAccess: true,
    supportLevel: "vip"
  },
  xl: {
    maxBots: Infinity,
    liveTrading: true,
    strategies: ["grid", "dca", "indicators", "custom", "ai"],
    basketTrading: true,
    backtestingLevel: "advanced+",
    apiAccess: true,
    supportLevel: "dedicated"
  }
}

interface SubscriptionContextType {
  currentTier: SubscriptionTier
  tierLimits: TierLimits
  upgradeTier: (tier: SubscriptionTier) => void
  canCreateMoreBots: (currentBotCount: number) => boolean
  isFeatureAvailable: (feature: keyof TierLimits) => boolean
  checkStrategyAccess: (strategy: string) => boolean
  // Added for BotForm compatibility: check if a given bot type is allowed for the current tier
  canCreateBot: (type: string) => boolean
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  currentTier: "free",
  tierLimits: tierLimitsConfig.free,
  upgradeTier: () => {},
  canCreateMoreBots: () => false,
  isFeatureAvailable: () => false,
  checkStrategyAccess: () => false,
  canCreateBot: () => false,
})

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("free")
  const [tierLimits, setTierLimits] = useState<TierLimits>(tierLimitsConfig.free)

  useEffect(() => {
    // Load subscription from localStorage or API in a real app
    const savedTier = localStorage.getItem("subscriptionTier") as SubscriptionTier | null
    if (savedTier && tierLimitsConfig[savedTier]) {
      setCurrentTier(savedTier)
      setTierLimits(tierLimitsConfig[savedTier])
    }
  }, [])

  const upgradeTier = (tier: SubscriptionTier) => {
    setCurrentTier(tier)
    setTierLimits(tierLimitsConfig[tier])
    localStorage.setItem("subscriptionTier", tier)
  }

  const canCreateMoreBots = (currentBotCount: number) => {
    return currentBotCount < tierLimits.maxBots
  }

  const isFeatureAvailable = (feature: keyof TierLimits) => {
    if (typeof tierLimits[feature] === "boolean") {
      return tierLimits[feature] as boolean
    }
    if (feature === "maxBots") {
      return tierLimits.maxBots > 0
    }
    if (feature === "strategies") {
      return tierLimits.strategies.length > 0
    }
    return false
  }

  const checkStrategyAccess = (strategy: string) => {
    return tierLimits.strategies.includes(strategy.toLowerCase())
  }

  // New helper used by the BotForm component to check if a given bot type is allowed
  const canCreateBot = (type: string) => {
    const t = type.toLowerCase()
    if (t === "basket") return Boolean(tierLimits.basketTrading)
    if (t === "grid") return tierLimits.strategies.includes("grid")
    if (t === "dca") return tierLimits.strategies.includes("dca")
    if (t === "indicator" || t === "indicators") return (
      tierLimits.strategies.includes("indicators") || tierLimits.strategies.includes("indicator")
    )
    // For any custom/unknown types, fallback to true if apiAccess is allowed or strategies include 'custom'
    if (t === "custom") return tierLimits.strategies.includes("custom") || Boolean(tierLimits.apiAccess)
    return true
  }

  return (
    <SubscriptionContext.Provider
      value={{
        currentTier,
        tierLimits,
        upgradeTier,
        canCreateMoreBots,
        isFeatureAvailable,
        checkStrategyAccess,
        canCreateBot,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)


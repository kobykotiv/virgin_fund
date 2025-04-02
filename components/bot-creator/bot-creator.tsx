"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Stepper } from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { BasicInfoForm } from "./basic-info-form"
import { SignalBuilder } from "./signal-builder"
import { ConditionBuilder } from "./condition-builder"
import { ActionBuilder } from "./action-builder"
import { RiskManagementForm } from "./risk-management-form"
import { BotReview } from "./bot-review"
import { TradingBotBuilder } from "./bot-prototype"

const STEPS = [
  { id: 0, title: "Basic Info" },
  { id: 1, title: "Signals" },
  { id: 2, title: "Conditions" },
  { id: 3, title: "Actions" },
  { id: 4, title: "Risk Management" },
  { id: 5, title: "Review" },
]

export function BotCreator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [canProceed, setCanProceed] = useState(false)
  const [botBuilder, setBotBuilder] = useState<TradingBotBuilder>()
  const [botData, setBotData] = useState({
    name: "",
    type: "",
    description: "",
    config: {
      signals: [],
      conditions: [],
      actions: [],
      exitStrategies: [],
      riskManagement: {
        maxPositionSize: 5
      }
    }
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleBasicInfoSubmit = (data: { name: string; type: string; description?: string }) => {
    setBotData(prev => ({ ...prev, ...data }))
    try {
      const builder = new TradingBotBuilder(data.type)
      builder.withName(data.name)
      setBotBuilder(builder)
      setCanProceed(true)
    } catch (error) {
      setCanProceed(false)
      toast({
        title: "Error",
        description: "Invalid bot type selected",
        variant: "destructive"
      })
    }
  }

  const handleSignalsChange = (signals: any[]) => {
    setBotData(prev => ({
      ...prev,
      config: { ...prev.config, signals }
    }))
    signals.forEach(signal => botBuilder?.withSignal(signal))
    setCanProceed(signals.length > 0)
  }

  const handleConditionsChange = (conditions: any[]) => {
    setBotData(prev => ({
      ...prev,
      config: { ...prev.config, conditions }
    }))
    conditions.forEach(condition => botBuilder?.withCondition(condition))
    setCanProceed(conditions.length > 0)
  }

  const handleActionsChange = (actions: any[], exitStrategies: any[]) => {
    setBotData(prev => ({
      ...prev,
      config: { ...prev.config, actions, exitStrategies }
    }))
    actions.forEach(action => botBuilder?.withAction(action))
    exitStrategies.forEach(strategy => botBuilder?.withExitStrategy(strategy))
    setCanProceed(actions.length > 0)
  }

  const handleRiskManagementChange = (riskManagement: any) => {
    setBotData(prev => ({
      ...prev,
      config: { ...prev.config, riskManagement }
    }))
    botBuilder?.withRiskManagement(riskManagement)
    setCanProceed(true)
  }

  const handleSubmit = async () => {
    try {
      const bot = botBuilder?.build()
      if (!bot) throw new Error("Invalid bot configuration")

      const response = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botData)
      })

      if (!response.ok) throw new Error("Failed to create bot")

      toast({
        title: "Success",
        description: "Bot created successfully"
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create bot",
        variant: "destructive"
      })
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      setCanProceed(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setCanProceed(true)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoForm
            initialData={botData}
            onSubmit={handleBasicInfoSubmit}
          />
        )
      case 1:
        return (
          <SignalBuilder
            signals={botData.config.signals}
            onChange={handleSignalsChange}
          />
        )
      case 2:
        return (
          <ConditionBuilder
            conditions={botData.config.conditions}
            signals={botData.config.signals}
            onChange={handleConditionsChange}
          />
        )
      case 3:
        return (
          <ActionBuilder
            actions={botData.config.actions}
            exitStrategies={botData.config.exitStrategies}
            onChange={handleActionsChange}
          />
        )
      case 4:
        return (
          <RiskManagementForm
            riskManagement={botData.config.riskManagement}
            onChange={handleRiskManagementChange}
          />
        )
      case 5:
        return (
          <BotReview
            data={botData}
            onEdit={setCurrentStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 p-6">
      <Stepper
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>

        {currentStep === STEPS.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed}
          >
            Create Bot
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
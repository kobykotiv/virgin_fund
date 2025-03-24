import { useState } from "react"
import { type BotConfig } from "@/types/bot"
import { BasicInfoStep } from "./steps/basic-info-step"
import { StrategyStep } from "./steps/strategy-step"
import { RiskManagementStep } from "./steps/risk-management-step"
import { AssetsStep } from "./steps/assets-step"
import { ReviewStep } from "./steps/review-step"
import { DeploymentStep } from "./steps/deployment-step" // New step
import { useAlpaca } from "@/context/alpaca-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BotWizardProps {
  onSubmit: (config: BotConfig) => void
}

export function BotWizard({ onSubmit }: BotWizardProps) {
  const { isConnected, isLive } = useAlpaca()
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState<Partial<BotConfig>>({})

  const steps = [
    {
      title: "Basic Info",
      component: BasicInfoStep,
    },
    {
      title: "Strategy", 
      component: StrategyStep,
    },
    {
      title: "Risk Management",
      component: RiskManagementStep,
    },
    {
      title: "Assets",
      component: AssetsStep,
    },
    {
      title: "Deployment",  // New step
      component: DeploymentStep,
    },
    {
      title: "Review",
      component: ReviewStep,
    }
  ]

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Required</AlertTitle>
          <AlertDescription>
            You need to connect to Alpaca before you can create trading bots.
          </AlertDescription>
        </Alert>
        
        <Button asChild>
          <a href="/settings/api-keys">Connect to Alpaca</a>
        </Button>
      </div>
    )
  }

  const currentStep = steps[step]

  const handleNext = () => {
    if (step === steps.length - 1) {
      onSubmit(config as BotConfig)
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const StepComponent = currentStep.component
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{currentStep.title}</h2>
        
        {!isLive && step === 4 && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You're currently in paper trading mode. Your bot will trade with simulated money.
            </AlertDescription>
          </Alert>
        )}
        
        <StepComponent
          config={config}
          onUpdate={(updates) => setConfig({ ...config, ...updates })}
        />
      </div>

      <div className="flex justify-between">
        {step > 0 && (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}
        <Button onClick={handleNext}>
          {step === steps.length - 1 ? 'Create Bot' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

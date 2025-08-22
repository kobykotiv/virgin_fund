import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, CheckCircle2, AlertCircle, ArrowRight, 
  PlayCircle, AlertTriangle, ShieldCheck 
} from "lucide-react"

interface ActivationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'loading' | 'complete' | 'error'
  validation?: () => Promise<boolean>
}

export function BotActivationWizard({ 
  botConfig, 
  onActivate, 
  onCancel 
}: { 
  botConfig: any
  onActivate: () => Promise<void>
  onCancel: () => void
}) {
  const [steps, setSteps] = useState<ActivationStep[]>([
    {
      id: 'verify',
      title: 'Verify Configuration',
      description: 'Checking strategy parameters and risk settings',
      status: 'pending',
      validation: async () => {
        // Add your validation logic here
        return true
      }
    },
    {
      id: 'balance',
      title: 'Check Balance',
      description: 'Verifying available funds for trading',
      status: 'pending'
    },
    {
      id: 'market',
      title: 'Market Check',
      description: 'Verifying market conditions and liquidity',
      status: 'pending'
    },
    {
      id: 'deploy',
      title: 'Deploy Bot',
      description: 'Initializing trading strategy',
      status: 'pending'
    }
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const processNextStep = async () => {
    if (isProcessing) return
    setIsProcessing(true)

    const updatedSteps = [...steps]
    const step = updatedSteps[currentStep]
    step.status = 'loading'
    setSteps(updatedSteps)

    try {
      if (step.validation) {
        await step.validation()
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      step.status = 'complete'
      setSteps(updatedSteps)
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        await onActivate()
      }
    } catch (error) {
      step.status = 'error'
      setSteps(updatedSteps)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin" />
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2" />
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Activate Trading Bot</CardTitle>
        <CardDescription>Complete the verification process to start trading</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy Summary */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">{botConfig.name}</h3>
              <p className="text-sm text-muted-foreground">{botConfig.description}</p>
            </div>
            <Badge className="outline">{botConfig.type}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Initial Investment:</span>
              <span className="ml-2 font-medium">${botConfig.investment}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Risk Level:</span>
              <span className="ml-2 font-medium">{botConfig.risk}</span>
            </div>
          </div>
        </div>

        {/* Activation Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg border 
                ${index === currentStep ? 'bg-muted' : ''} 
                ${step.status === 'error' ? 'border-red-200 bg-red-50' : ''}`}
            >
              {getStepIcon(step.status)}
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {step.status === 'error' && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </div>

        {/* Warnings and Notices */}
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            Trading involves risk of loss. Make sure you understand the strategy before activating.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button 
          onClick={processNextStep} 
          disabled={isProcessing || currentStep >= steps.length || steps[currentStep].status === 'error'}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Activate Bot
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

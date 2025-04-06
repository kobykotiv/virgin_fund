import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotParameters } from "./parameters"
import { RiskControls } from "./risk-controls"
import { BotBacktester } from "./backtester"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"

interface WizardStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'strategy',
    title: 'Strategy Selection',
    description: 'Choose your trading strategy',
    component: BotParameters
  },
  {
    id: 'risk',
    title: 'Risk Management',
    description: 'Configure risk parameters',
    component: RiskControls
  },
  {
    id: 'backtest',
    title: 'Backtest',
    description: 'Test your strategy',
    component: BotBacktester
  }
]

export function ComplexBotWizard({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  
  const handleStepComplete = (stepData: any) => {
    setFormData(prev => ({ ...prev, [WIZARD_STEPS[currentStep].id]: stepData }))
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onSubmit(formData)
    }
  }

  const StepComponent = WIZARD_STEPS[currentStep].component

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Progress value={(currentStep + 1) / WIZARD_STEPS.length * 100} />
        <div className="flex justify-between text-sm text-muted-foreground">
          {WIZARD_STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center space-x-2 ${
                index === currentStep ? 'text-primary font-medium' : ''
              }`}
            >
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${index < currentStep ? 'bg-primary text-white' :
                  index === currentStep ? 'border-2 border-primary' :
                  'border-2 border-muted'}
              `}>
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span>{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{WIZARD_STEPS[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <StepComponent 
            data={formData[WIZARD_STEPS[currentStep].id]}
            onChange={(data: any) => handleStepComplete(data)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={() => handleStepComplete(formData[WIZARD_STEPS[currentStep].id])}
          >
            {currentStep === WIZARD_STEPS.length - 1 ? (
              <>Create Bot</>
            ) : (
              <>Next <ChevronRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

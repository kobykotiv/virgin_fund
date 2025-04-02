import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="relative">
      {/* Progress bar background */}
      <div 
        className="absolute top-5 left-0 h-1 w-full bg-gray-200 dark:bg-gray-800" 
        aria-hidden="true"
      />
      
      {/* Progress bar fill */}
      <div
        className="absolute top-5 left-0 h-1 bg-primary transition-all duration-500"
        style={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`
        }}
        aria-hidden="true"
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center cursor-pointer",
                onStepClick && "hover:opacity-80"
              )}
              onClick={() => onStepClick?.(step.id)}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary",
                  !isCompleted && !isCurrent && "border-gray-300 dark:border-gray-700"
                )}
              >
                {isCompleted ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-primary",
                      !isCurrent && "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.id + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  (isCompleted || isCurrent) && "text-primary",
                  !isCompleted && !isCurrent && "text-gray-500 dark:text-gray-400"
                )}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
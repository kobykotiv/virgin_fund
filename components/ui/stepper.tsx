"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number
  children: React.ReactNode
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Stepper({ activeStep, children, className, ...props }: StepperProps) {
  const steps = React.Children.toArray(children)

  return (
    <div className={cn("flex items-center w-full", className)} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                index <= activeStep 
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background"
              )}
            >
              {index < activeStep ? "✓" : index + 1}
            </div>
            {index !== steps.length - 1 && (
              <div 
                className={cn(
                  "w-full h-[2px] mx-2",
                  index < activeStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
          <div 
            className={cn(
              "absolute mt-10 transform -translate-x-1/2",
              "text-xs text-muted-foreground",
              index <= activeStep && "text-primary"
            )}
            style={{ left: `${(index * 100) / (steps.length - 1)}%` }}
          >
            {step}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

export function Step({ children, className, ...props }: StepProps) {
  return (
    <div className={cn("text-center", className)} {...props}>
      {children}
    </div>
  )
}

"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

interface ErrorRecoveryBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  recoveryAttempts: number
  maxRecoveryAttempts: number
  isRecovering: boolean
  recoverySuccessful: boolean
}

export class ErrorRecoveryBoundary extends React.Component<
  { 
    children: React.ReactNode,
    fallback?: React.ReactNode,
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void,
    recoveryStrategies?: Array<() => Promise<boolean>>,
    maxRecoveryAttempts?: number
  },
  ErrorRecoveryBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
      recoveryAttempts: 0,
      maxRecoveryAttempts: props.maxRecoveryAttempts || 3,
      isRecovering: false,
      recoverySuccessful: false
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)
    console.error("Error caught by recovery boundary:", error, errorInfo)
    
    // Attempt auto-recovery if strategies are provided
    if (this.props.recoveryStrategies && this.props.recoveryStrategies.length > 0) {
      this.attemptRecovery()
    }
  }

  async attemptRecovery() {
    const { recoveryAttempts, maxRecoveryAttempts } = this.state
    const { recoveryStrategies } = this.props
    
    if (!recoveryStrategies || recoveryAttempts >= maxRecoveryAttempts) {
      return
    }
    
    this.setState({ isRecovering: true })
    
    // Try each recovery strategy in order
    try {
      const strategyIndex = Math.min(recoveryAttempts, recoveryStrategies.length - 1)
      const strategy = recoveryStrategies[strategyIndex]
      
      const success = await strategy()
      
      if (success) {
        this.setState({
          hasError: false,
          error: undefined,
          errorInfo: undefined,
          isRecovering: false,
          recoverySuccessful: true
        })
        
        // Reset recovery status after showing success
        setTimeout(() => {
          this.setState({ recoverySuccessful: false })
        }, 3000)
      } else {
        this.setState({
          recoveryAttempts: recoveryAttempts + 1,
          isRecovering: false
        })
      }
    } catch (error) {
      console.error("Recovery attempt failed:", error)
      this.setState({
        recoveryAttempts: recoveryAttempts + 1,
        isRecovering: false
      })
    }
  }

  render() {
    const { hasError, error, recoveryAttempts, maxRecoveryAttempts, isRecovering, recoverySuccessful } = this.state
    
    if (recoverySuccessful) {
      return (
        <>
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Recovery successful</span>
          </div>
          {this.props.children}
        </>
      )
    }
    
    if (hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="w-full max-w-md mx-auto my-8 shadow-lg">
          <CardHeader className="bg-red-50 text-red-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle>Error Occurred</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2">
                {error?.message || "An unexpected error occurred"}
              </AlertDescription>
            </Alert>
            
            {recoveryAttempts > 0 && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Recovery attempts:
                  </span>
                  <span className="text-sm font-medium">
                    {recoveryAttempts} / {maxRecoveryAttempts}
                  </span>
                </div>
                <Progress value={(recoveryAttempts / maxRecoveryAttempts) * 100} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            {this.props.recoveryStrategies && (
              <Button 
                onClick={() => this.attemptRecovery()}
                disabled={isRecovering || recoveryAttempts >= maxRecoveryAttempts}
              >
                {isRecovering ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Recovering...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Recovery
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
}

export default ErrorRecoveryBoundary

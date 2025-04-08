"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DatabaseService } from '@/lib/services/database'
import { AlertCircle, Database, Server, WifiOff } from 'lucide-react'

export function DatabaseConnectionOverride() {
  const [connectionMode, setConnectionMode] = useState<'normal' | 'demo' | 'override' | 'ignore'>('normal')
  const [configString, setConfigString] = useState('')
  const [isValidJson, setIsValidJson] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const db = DatabaseService.getInstance()

  useEffect(() => {
    // Get current settings from database service
    setConnectionMode(db.getConnectionMode())
  }, [])

  useEffect(() => {
    // Validate JSON as user types
    if (configString.trim() === '' || connectionMode !== 'override') {
      setIsValidJson(true)
      return
    }
    
    try {
      JSON.parse(configString)
      setIsValidJson(true)
    } catch (e) {
      setIsValidJson(false)
    }
  }, [configString, connectionMode])

  const handleSave = () => {
    if (connectionMode === 'override' && !isValidJson) {
      return
    }

    let config = null
    if (connectionMode === 'override' && configString) {
      try {
        config = JSON.parse(configString)
      } catch (e) {
        return
      }
    }

    db.setConnectionMode(connectionMode, config)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleReset = () => {
    db.clearOverride()
    setConnectionMode('normal')
    setConfigString('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Database Connection Settings
        </CardTitle>
        <CardDescription>
          Configure how the application connects to the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionMode === 'ignore' && (
          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <WifiOff className="h-4 w-4 mr-2" />
            <AlertTitle>Database Connections Disabled</AlertTitle>
            <AlertDescription>
              All database operations are disabled and using demo data.
            </AlertDescription>
          </Alert>
        )}
        
        {isSaved && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertTitle>Settings saved</AlertTitle>
            <AlertDescription>
              Connection settings have been updated successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label>Connection Mode</Label>
            <RadioGroup 
              value={connectionMode} 
              onValueChange={(value) => setConnectionMode(value as any)}
              className="mt-2 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="cursor-pointer">Normal (Use configured database)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="demo" id="demo" />
                <Label htmlFor="demo" className="cursor-pointer">Demo (Use built-in sample data)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="override" id="override" />
                <Label htmlFor="override" className="cursor-pointer">Override (Custom connection settings)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ignore" id="ignore" />
                <Label htmlFor="ignore" className="cursor-pointer">Ignore (Disable all database operations)</Label>
              </div>
            </RadioGroup>
          </div>

          {connectionMode === 'override' && (
            <div className="space-y-2">
              <Label>Connection Configuration (JSON)</Label>
              <Textarea
                value={configString}
                onChange={(e) => setConfigString(e.target.value)}
                placeholder='{"host": "localhost", "port": 5432, "user": "username", "password": "password", "database": "db_name"}'
                rows={5}
                className={!isValidJson ? 'border-red-500' : ''}
              />
              {!isValidJson && (
                <p className="text-xs text-red-500">Invalid JSON format</p>
              )}
            </div>
          )}

          {connectionMode === 'ignore' && (
            <div className="rounded-md bg-amber-50 p-3 text-amber-800">
              <p className="text-sm font-medium">⚠️ Warning: Ignore Mode</p>
              <p className="text-xs mt-1">
                In ignore mode, all database operations will be skipped and the application will use demo data only.
                This is useful for development and testing without any database dependencies.
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="advanced"
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
            />
            <Label htmlFor="advanced">Show advanced options</Label>
          </div>

          {showAdvanced && (
            <div className="space-y-2 rounded-md bg-slate-50 p-3">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Current Status</span>
              </div>
              <div className="text-sm text-slate-600">
                <p>Mode: <span className="font-medium">{db.getConnectionMode()}</span></p>
                <p>Using Demo Data: <span className="font-medium">{db.isUsingDemo() ? 'Yes' : 'No'}</span></p>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleReset}
                >
                  Reset All Overrides
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={connectionMode === 'override' && !isValidJson}
        >
          Save Connection Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

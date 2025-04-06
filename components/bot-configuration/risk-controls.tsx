import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, AlertTriangle } from "lucide-react"

export function RiskControls({ onChange }: { onChange: (controls: any) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Risk Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base">Position Controls</Label>
          <div className="grid grid-cols-2 gap-4">
            <Label htmlFor="maxPositionSize">Max Position Size (%)</Label>
            <Input 
              id="maxPositionSize" 
              type="number" 
              defaultValue={5}
              onChange={e => onChange({ maxPositionSize: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Label htmlFor="maxOpenPositions">Max Open Positions</Label>
            <Input 
              id="maxOpenPositions" 
              type="number" 
              defaultValue={3}
              onChange={e => onChange({ maxOpenPositions: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base">Stop Loss Controls</Label>
          <div className="grid grid-cols-2 gap-4">
            <Label htmlFor="stopLoss">Stop Loss (%)</Label>
            <Input 
              id="stopLoss" 
              type="number" 
              defaultValue={2}
              onChange={e => onChange({ stopLoss: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Label htmlFor="trailingStop">Trailing Stop (%)</Label>
            <Input 
              id="trailingStop" 
              type="number" 
              defaultValue={1}
              onChange={e => onChange({ trailingStop: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">
              These settings will override strategy-specific risk parameters
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

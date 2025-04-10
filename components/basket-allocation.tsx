import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BasketAllocationProps {
  allocation: Record<string, number>
  onUpdateAllocation: (allocation: Record<string, number>) => void
}

export function BasketAllocation({ allocation, onUpdateAllocation }: BasketAllocationProps) {
  const [newSymbol, setNewSymbol] = useState('')
  const [newWeight, setNewWeight] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAddAsset = () => {
    if (!newSymbol || !newWeight) {
      setError('Both symbol and weight are required')
      return
    }

    const weight = parseFloat(newWeight)
    if (isNaN(weight) || weight <= 0 || weight > 100) {
      setError('Weight must be between 0 and 100')
      return
    }

    const totalWeight = Object.values(allocation).reduce((sum, w) => sum + w, 0) + weight / 100
    if (totalWeight > 1) {
      setError('Total allocation cannot exceed 100%')
      return
    }

    onUpdateAllocation({
      ...allocation,
      [newSymbol.toUpperCase()]: weight / 100
    })

    setNewSymbol('')
    setNewWeight('')
    setError(null)
  }

  const handleRemoveAsset = (symbol: string) => {
    const { [symbol]: removed, ...rest } = allocation
    onUpdateAllocation(rest)
  }

  const totalAllocation = Object.values(allocation).reduce((sum, weight) => sum + weight, 0) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basket Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(allocation).map(([symbol, weight]) => (
              <Badge key={symbol} variant="secondary" className="flex items-center gap-2">
                {symbol} ({(weight * 100).toFixed(1)}%)
                <button
                  type="button"
                  onClick={() => handleRemoveAsset(symbol)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Symbol</label>
              <Input
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="e.g. AAPL"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Weight (%)</label>
              <Input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="e.g. 20"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <Button 
              onClick={handleAddAsset}
              className="mb-[2px]"
              disabled={!newSymbol || !newWeight}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm font-medium">Total Allocation:</span>
            <Badge variant={totalAllocation === 100 ? "default" : "secondary"}>
              {totalAllocation.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
import { useState } from "react"
import { Position, Trade } from "@/types/bot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface PositionManagerProps {
  position: Position
  onClose?: (position: Position) => void
  onModify?: (position: Position) => void
}

export function PositionManager({ position, onClose, onModify }: PositionManagerProps) {
  const [quantity, setQuantity] = useState(position.quantity)
  const [price, setPrice] = useState(position.currentPrice)
  const { toast } = useToast()

  const handleClose = async () => {
    try {
      const response = await fetch(`/api/positions/${position.id}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price })
      })

      if (!response.ok) throw new Error('Failed to close position')

      const closed = await response.json()
      onClose?.(closed)
      toast({
        title: "Position Closed",
        description: `Successfully closed ${position.symbol} position`
      })
    } catch (error) {
      console.error('Error closing position:', error)
      toast({
        title: "Error",
        description: "Failed to close position",
        variant: "destructive"
      })
    }
  }

  const handleModify = async () => {
    try {
      const response = await fetch(`/api/positions/${position.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })

      if (!response.ok) throw new Error('Failed to modify position')

      const modified = await response.json()
      onModify?.(modified)
      toast({
        title: "Position Modified",
        description: `Successfully modified ${position.symbol} position`
      })
    } catch (error) {
      console.error('Error modifying position:', error)
      toast({
        title: "Error",
        description: "Failed to modify position",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{position.symbol} Position</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              placeholder="Quantity"
            />
            <Button onClick={handleModify}>Modify</Button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              placeholder="Close Price"
            />
            <Button 
              variant="destructive"
              onClick={handleClose}
            >
              Close Position
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

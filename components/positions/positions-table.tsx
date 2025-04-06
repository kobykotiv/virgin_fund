import { Position } from "@/types/bot"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface PositionsTableProps {
  positions: Position[]
  onClosePosition: (positionId: string) => void
}

export function PositionsTable({ positions, onClosePosition }: PositionsTableProps) {
  const calculateUnrealizedPnL = (position: Position) => {
    const currentValue = position.quantity * (position.currentPrice || 0)
    const costBasis = position.quantity * position.entryPrice
    return currentValue - costBasis
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Entry Price</TableHead>
          <TableHead className="text-right">Current Price</TableHead>
          <TableHead className="text-right">Market Value</TableHead>
          <TableHead className="text-right">Unrealized P&L</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => {
          const unrealizedPnL = calculateUnrealizedPnL(position)
          const marketValue = position.quantity * (position.currentPrice || 0)

          return (
            <TableRow key={position.id}>
              <TableCell className="font-medium">{position.symbol}</TableCell>
              <TableCell>
                <Badge variant={position.side === 'long' ? 'default' : 'destructive'}>
                  {position.side.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{position.quantity}</TableCell>
              <TableCell className="text-right">${position.entryPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                ${position.currentPrice?.toFixed(2) || 'N/A'}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(marketValue)}</TableCell>
              <TableCell className={`text-right ${unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(unrealizedPnL)}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onClosePosition(position.id)}
                >
                  Close
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

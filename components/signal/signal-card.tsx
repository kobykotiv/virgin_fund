import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SignalCardProps {
  title: string
  description: string
  type: string
  lastUpdated: string
  performance: string
  onDelete?: () => void
}

export function SignalCard({ title, description, type, lastUpdated, performance, onDelete }: SignalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Type: {type}</p>
        <p>Last Updated: {lastUpdated}</p>
        <p>Performance: {performance}</p>
        {onDelete && (
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

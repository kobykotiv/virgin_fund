import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bot } from "lucide-react"

interface BotStatusWidgetProps {
  name: string
  status: "active" | "inactive" | "error"
  type: string
  lastActive: string
  profit: number
}

export function BotStatusWidget({ name, status, type, lastActive, profit }: BotStatusWidgetProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            {name}
          </CardTitle>
          <Badge 
            variant={status === "active" ? "success" : status === "error" ? "destructive" : "secondary"}
            className="px-2 py-0 h-5"
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span>{type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Active:</span>
            <span>{lastActive}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Profit:</span>
            <span className={profit >= 0 ? "text-green-500" : "text-red-500"}>
              {profit >= 0 ? "+" : ""}{profit}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

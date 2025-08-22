"use client"

import type { Bot } from "@/types/bot"
import { Card, CardContent } from "@/components/ui/card"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Edit, Trash2, Play, Pause, AlertTriangle, RefreshCw, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useAuth } from "@/providers/auth-provider"

interface BotListProps {
  bots: Bot[]
  onEdit: (bot: Bot) => void
  onDelete: (botId: string) => void
  onToggleStatus: (botId: string) => void
  isLoading?: boolean
}

export function BotList({ bots, onEdit, onDelete, onToggleStatus, isLoading = false }: BotListProps) {
  const [botToDelete, setBotToDelete] = useState<string | null>(null)
  const { isDemoMode } = useAuth()

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "paused":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Helper function to get bot type display name
  const getBotTypeDisplay = (type: string) => {
    switch (type) {
      case "basket":
        return "Basket Trading"
      case "grid":
        return "Grid Trading"
      case "dca":
        return "Dollar Cost Averaging"
      case "indicator":
        return "Indicator-Based"
      default:
        return type
    }
  }

  // Helper function to get status toggle icon
  const getStatusToggleIcon = (status: string) => {
    if (status === "error") return <AlertTriangle className="h-4 w-4" />
    return status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
  }

  // Helper function to get status toggle title
  const getStatusToggleTitle = (status: string) => {
    if (status === "error") return "Bot in error state"
    return status === "active" ? "Pause Bot" : "Activate Bot"
  }

  const handleDeleteConfirm = () => {
    if (botToDelete) {
      onDelete(botToDelete)
      setBotToDelete(null)
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              {isDemoMode && <TableHead>Allocation</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={isDemoMode ? 7 : 6} className="h-24 text-center">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading bots...</p>
                </TableCell>
              </TableRow>
            ) : bots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isDemoMode ? 7 : 6} className="text-center py-6 text-muted-foreground">
                  No bots created yet. Create your first bot to get started.
                </TableCell>
              </TableRow>
            ) : (
              bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-medium">{bot.name}</TableCell>
                  <TableCell>{getBotTypeDisplay(bot.type)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bot.assets.slice(0, 3).map((asset) => (
                        <Badge key={asset} className={`${badgeVariants({ variant: "outline" })} text-xs`}>
                          {asset}
                        </Badge>
                      ))}
                      {bot.assets.length > 3 && (
                        <Badge className={`${badgeVariants({ variant: "outline" })} text-xs`}>
                          +{bot.assets.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={badgeVariants({ variant: getStatusBadgeVariant(bot.status) })}>
                      {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {bot.performance ? (
                      <div>
                        <span className={bot.performance.pnlPercentage > 0 ? "text-green-500" : "text-red-500"}>
                          {bot.performance.pnlPercentage > 0 ? "+" : ""}
                          {bot.performance.pnlPercentage.toFixed(2)}%
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {bot.performance.totalTrades} trades, {(bot.performance.winRate * 100).toFixed(0)}% win rate
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No data</span>
                    )}
                  </TableCell>
                  {isDemoMode && (
                    <TableCell>
                      {bot.allocation ? (
                        <div className="flex items-center">
                          <DollarSign className="h-3.5 w-3.5 text-green-500 mr-1" />
                          <span>${bot.allocation.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not allocated</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button className={buttonVariants({ variant: "outline", size: "icon" })} onClick={() => {
                          console.log(`Toggle status clicked for bot: ${bot.id}`) // Add logging
                          bot.status !== "error" && onToggleStatus(bot.id)
                        }} title={getStatusToggleTitle(bot.status)} disabled={bot.status === "error"}>
                        {getStatusToggleIcon(bot.status)}
                      </Button>

                      <Button className={buttonVariants({ variant: "outline", size: "icon" })} onClick={() => onEdit(bot)} title="Edit Bot">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog open={botToDelete === bot.id} onOpenChange={(open) => !open && setBotToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button className={buttonVariants({ variant: "outline", size: "icon" })} onClick={() => setBotToDelete(bot.id)} title="Delete Bot">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the bot "{bot.name}" and all its data. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

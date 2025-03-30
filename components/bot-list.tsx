"use client"

import { Bot, BotStatus } from "@/types/bot"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Settings, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface BotListProps {
  bots: Bot[]
  onEdit: (bot: Bot) => void
  onDelete: (botId: string) => void
  onToggleStatus: (botId: string) => void
}

export function BotList({ bots, onEdit, onDelete, onToggleStatus }: BotListProps) {
  const [botToDelete, setBotToDelete] = useState<Bot | null>(null)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bots.length === 0 ? (
        <div className="md:col-span-2 lg:col-span-3 text-center py-10">
          <p className="text-muted-foreground">No bots configured yet</p>
        </div>
      ) : (
        bots.map((bot) => (
          <Card key={bot.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{bot.name}</h3>
                <p className="text-sm text-muted-foreground">{bot.strategy}</p>
              </div>
              <Badge
                variant={
                  bot.status === "active" 
                    ? "success" 
                    : bot.status === "error" 
                      ? "destructive" 
                      : "secondary"
                }
              >
                {bot.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Assets:</span>{" "}
                {bot.assets?.join(", ") || "None"}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Last Updated:</span>{" "}
                {new Date(bot.updatedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStatus(bot.id)}
              >
                {bot.status === "active" ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(bot)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBotToDelete(bot)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))
      )}

      <AlertDialog open={!!botToDelete} onOpenChange={() => setBotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {botToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (botToDelete) {
                  onDelete(botToDelete.id)
                  setBotToDelete(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

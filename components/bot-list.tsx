"use client";

import { Bot } from "@/app/(dashboard)/bots/page"; // Import the Bot type from the page
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Play, Pause } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // For relative time formatting

interface BotListProps {
  bots: Bot[];
  onEdit: (bot: Bot) => void;
  onDelete: (botId: string) => void;
  onToggleStatus: (bot: Bot) => void; // Pass the whole bot object
}

export default function BotList({ bots, onEdit, onDelete, onToggleStatus }: BotListProps) {

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bots.map((bot) => (
        <Card key={bot.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{bot.name}</CardTitle>
                <CardDescription>Type: {bot.type} | Created: {formatDistanceToNow(new Date(bot.createdAt), { addSuffix: true })}</CardDescription>
              </div>
              <Badge className={`capitalize ${getStatusColor(bot.status)}`}>
                {bot.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Display some key settings or info here later */}
            <p className="text-sm text-muted-foreground">Strategy: {bot.strategy || 'N/A'}</p> 
            {/* Add more details from bot.settings if available */}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
             <div className="flex items-center space-x-2">
               <Switch
                 id={`active-${bot.id}`}
                 checked={bot.active}
                 onCheckedChange={() => onToggleStatus(bot)}
                 aria-label={bot.active ? "Deactivate Bot" : "Activate Bot"}
               />
               <span className="text-xs font-medium">{bot.active ? 'Active' : 'Inactive'}</span>
             </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(bot)} aria-label="Edit Bot">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => onDelete(bot.id)} aria-label="Delete Bot">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

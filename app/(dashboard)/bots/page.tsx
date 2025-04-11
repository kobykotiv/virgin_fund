"use client";

import { useCallback, useState, useEffect } from "react";
import { Bot } from "@prisma/client";
import { BotList } from "@/components/bot-list-new";
import { BotForm } from "@/components/bot-form";
import { BotDetails } from "@/components/bot-details";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BOT_TYPES } from "@/types/bot";
import { deleteBot } from "@/lib/bot-api";

// Initial assets to show while loading
const INITIAL_ASSETS = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "AAPL",
  "GOOGL",
  "MSFT",
];

export default function BotsPage() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [availableAssets, setAvailableAssets] = useState(INITIAL_ASSETS);
  const [assetsLoading, setAssetsLoading] = useState(true);

  // Fetch available assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/assets');
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data = await response.json();
        setAvailableAssets(data.assets);

        // Show warning if using fallback assets
        if (response.status === 206) {
          toast({
            title: "Limited Asset List",
            description: "Using cached asset list. Some assets may not be available.",
            variant: "warning",
          });
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast({
          title: "Warning",
          description: "Using default asset list due to connection issues",
          variant: "warning",
        });
      } finally {
        setAssetsLoading(false);
      }
    };

    fetchAssets();
  }, [toast]);

  const handleEdit = useCallback((bot: Bot) => {
    setSelectedBot(bot);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((bot: Bot) => {
    setSelectedBot(bot);
    setDeleteDialogOpen(true);
  }, []);

  const handleViewDetails = useCallback((bot: Bot) => {
    setSelectedBot(bot);
    setDetailsOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedBot) return;

    try {
      await deleteBot(selectedBot.id);
      toast({
        title: "Success",
        description: "Bot deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bot",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBot(null);
    }
  };

  const handleFormSuccess = useCallback(() => {
    setFormOpen(false);
    setSelectedBot(null);
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Bots</h1>
          <p className="text-muted-foreground">
            Create and manage your automated trading strategies
          </p>
        </div>
        <Button 
          onClick={() => setFormOpen(true)}
          disabled={assetsLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Bot
        </Button>
      </div>

      <BotList
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />

      {/* Bot Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBot ? 'Edit Bot' : 'Create New Bot'}</DialogTitle>
            <DialogDescription>
              {selectedBot 
                ? 'Modify your bot configuration'
                : 'Configure a new trading bot with your desired strategy'
              }
            </DialogDescription>
          </DialogHeader>
          <BotForm
            bot={selectedBot}
            onSuccess={handleFormSuccess}
            onCancel={() => setFormOpen(false)}
            availableAssets={availableAssets}
            botTypes={BOT_TYPES}
          />
        </DialogContent>
      </Dialog>

      {/* Bot Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="right" className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5">
          <SheetHeader>
            <SheetTitle>Bot Details</SheetTitle>
            <SheetDescription>
              View performance metrics and trade history
            </SheetDescription>
          </SheetHeader>
          {selectedBot && (
            <div className="mt-6">
              <BotDetails
                bot={selectedBot}
                onClose={() => setDetailsOpen(false)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bot? This action cannot be undone.
              {selectedBot?.active && (
                <p className="mt-2 text-red-500">
                  Warning: This bot is currently active. Deleting it will stop all trading activities.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

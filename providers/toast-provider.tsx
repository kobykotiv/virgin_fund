"use client";

import { Toaster } from "@/components/ui/sonner";
import { Trade } from "@prisma/client";
import { TradeNotification } from "@/components/trade-notification";
import { toast } from "sonner";
import { soundEffects } from "@/components/sound-effects";
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ToastProvider() {
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const enabled = soundEffects.toggle();
    setSoundEnabled(enabled);
    toast.info(
      enabled ? "Notifications unmuted" : "Notifications muted",
      { icon: enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" /> }
    );
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    soundEffects.setVolume(newVolume);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <div className={cn(
          "transition-all duration-200",
          showVolumeControl ? "w-32 opacity-100" : "w-0 opacity-0"
        )}>
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowVolumeControl(!showVolumeControl)}
        >
          {volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
        >
          {soundEnabled ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Toaster
        position="top-right"
        closeButton
        theme="system"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
          duration: 6000,
        }}
      />
    </>
  );
}

// Enhanced toast functions with sound effects
export const toasts = {
  trade: (trade: Trade) => {
    toast.custom((t) => (
      <TradeNotification
        trade={trade}
        onClose={() => toast.dismiss(t)}
      />
    ), {
      duration: 8000,
    });

    soundEffects.playTradeSound(trade.profitLoss);
  },

  milestone: (amount: number, message: string) => {
    const isProfit = amount > 0;
    toast.custom((t) => (
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-lg border shadow-lg",
        isProfit ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
      )}>
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
          isProfit ? "bg-green-500" : "bg-red-500"
        )}>
          <span className="text-white text-xl font-bold">
            {isProfit ? '🎯' : '📉'}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">
            {isProfit ? 'Profit Milestone!' : 'Loss Alert'}
          </h4>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className={cn(
            "text-lg font-bold mt-1",
            isProfit ? "text-green-500" : "text-red-500"
          )}>
            ${Math.abs(amount).toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ×
        </button>
      </div>
    ), {
      duration: 10000,
    });

    soundEffects.playSound('milestone');
  },

  botStatus: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const icons = {
      success: <CheckCircle2 className="h-4 w-4" />,
      error: <XCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />
    };

    toast[type](message, {
      icon: icons[type],
      duration: 4000,
    });

    if (type === 'error') {
      soundEffects.playSound('error');
    }
  },

  notification: (title: string, message: string, icon?: React.ReactNode) => {
    toast(title, {
      description: message,
      icon: icon,
      duration: 5000,
    });
  },
};

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Settings2,
  PlayCircle,
} from "lucide-react";
import { soundEffects } from "@/components/sound-effects";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SoundSettingsProps {
  triggerClassName?: string;
}

export function SoundSettings({ triggerClassName }: SoundSettingsProps) {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [enabled, setEnabled] = useState(true);
  const [lastVolume, setLastVolume] = useState(0.5);

  useEffect(() => {
    setEnabled(soundEffects.isEnabled());
  }, []);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0) {
      setLastVolume(newVolume);
    }
    soundEffects.setVolume(newVolume);
  };

  const toggleEnabled = () => {
    const newState = soundEffects.toggle();
    setEnabled(newState);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      handleVolumeChange([0]);
    } else {
      handleVolumeChange([lastVolume]);
    }
  };

  const playTestSound = (type: "trade" | "profit" | "loss" | "milestone" | "error") => {
    if (type === "trade") {
      soundEffects.playSound("trade");
    } else if (type === "profit") {
      soundEffects.playSound("profit");
    } else if (type === "loss") {
      soundEffects.playSound("loss");
    } else if (type === "milestone") {
      soundEffects.playSound("milestone");
    } else {
      soundEffects.playSound("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={triggerClassName}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Configure sound notifications for trading events
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Sounds</Label>
              <div className="text-[0.8rem] text-muted-foreground">
                Toggle all notification sounds
              </div>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={toggleEnabled}
            />
          </div>

          <div className="space-y-3">
            <Label>Volume</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className="shrink-0"
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Test Sounds</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => playTestSound("trade")}
                disabled={!enabled || volume === 0}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Trade
              </Button>
              <Button
                variant="outline"
                onClick={() => playTestSound("profit")}
                className="text-green-500"
                disabled={!enabled || volume === 0}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Profit
              </Button>
              <Button
                variant="outline"
                onClick={() => playTestSound("loss")}
                className="text-red-500"
                disabled={!enabled || volume === 0}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Loss
              </Button>
              <Button
                variant="outline"
                onClick={() => playTestSound("milestone")}
                className="text-yellow-500"
                disabled={!enabled || volume === 0}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Milestone
              </Button>
              <Button
                variant="outline"
                onClick={() => playTestSound("error")}
                className="text-destructive"
                disabled={!enabled || volume === 0}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Error
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

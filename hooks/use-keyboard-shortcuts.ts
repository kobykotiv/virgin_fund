import { useEffect, useCallback } from "react";
import { soundEffects } from "@/components/sound-effects";
import { toast } from "sonner";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";

interface UseKeyboardShortcutsProps {
  onVolumeChange?: (volume: number) => void;
  onToggleSound?: (enabled: boolean) => void;
}

export function useKeyboardShortcuts({
  onVolumeChange,
  onToggleSound,
}: UseKeyboardShortcutsProps = {}) {
  const handleShortcuts = useCallback(
    (event: KeyboardEvent) => {
      // Only handle shortcuts if Alt key is pressed
      if (!event.altKey) return;

      switch (event.key.toLowerCase()) {
        case "m": {
          // Alt + M: Toggle mute
          event.preventDefault();
          const newState = soundEffects.toggle();
          onToggleSound?.(newState);
          toast.info(
            newState ? "Notifications unmuted" : "Notifications muted",
            {
              icon: newState ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />,
            }
          );
          break;
        }

        case "arrowup": {
          // Alt + Up Arrow: Increase volume
          event.preventDefault();
          const currentVolume = soundEffects.getVolume();
          const newVolume = Math.min(1, currentVolume + 0.1);
          soundEffects.setVolume(newVolume);
          onVolumeChange?.(newVolume);
          
          toast.info(
            `Volume: ${Math.round(newVolume * 100)}%`,
            { icon: <Volume2 className="h-4 w-4" /> }
          );
          break;
        }

        case "arrowdown": {
          // Alt + Down Arrow: Decrease volume
          event.preventDefault();
          const currentVolume = soundEffects.getVolume();
          const newVolume = Math.max(0, currentVolume - 0.1);
          soundEffects.setVolume(newVolume);
          onVolumeChange?.(newVolume);

          const icon = newVolume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          );
          
          toast.info(
            `Volume: ${Math.round(newVolume * 100)}%`,
            { icon }
          );
          break;
        }
      }
    },
    [onVolumeChange, onToggleSound]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, [handleShortcuts]);

  // Return the list of available shortcuts for documentation
  return {
    shortcuts: [
      {
        keys: ["Alt", "M"],
        description: "Toggle sound notifications",
      },
      {
        keys: ["Alt", "↑"],
        description: "Increase volume",
      },
      {
        keys: ["Alt", "↓"],
        description: "Decrease volume",
      },
    ],
  };
}

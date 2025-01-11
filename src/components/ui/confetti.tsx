import React from "react";
import JSConfetti from "js-confetti";

export function useConfetti() {
  const confettiRef = React.useRef<JSConfetti>();

  React.useEffect(() => {
    confettiRef.current = new JSConfetti();
    return () => {
      confettiRef.current = undefined;
    };
  }, []);

  const triggerConfetti = React.useCallback(() => {
    confettiRef.current?.addConfetti({
      confettiColors: [
        "#3b82f6", // blue
        "#10b981", // green
        "#6366f1", // indigo
        "#f59e0b", // amber
      ],
      confettiRadius: 6,
      confettiNumber: 100,
    });
  }, []);

  return triggerConfetti;
}

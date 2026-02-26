"use client";

import { useEffect, useRef, useState } from "react";
import { useTimer } from "@/lib/hooks/use-timer";
import { useAudio } from "@/lib/hooks/use-audio";
import { TimerDisplay } from "./timer-display";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";

interface RestTimerProps {
  duration: number;
  nextExerciseName: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({
  duration,
  nextExerciseName,
  onComplete,
  onSkip,
}: RestTimerProps) {
  const { playCountdownTick, playComplete } = useAudio();
  const [started, setStarted] = useState(false);

  const timer = useTimer({
    onComplete,
    onTick: (remaining) => {
      if (remaining <= 3 && remaining > 0) {
        playCountdownTick();
      }
      if (remaining === 0) {
        playComplete();
      }
    },
  });

  // Auto-start the rest timer
  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current && duration > 0) {
      startedRef.current = true;
      setStarted(true);
      timer.startCountdown(duration);
    }
  }, [duration, timer]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-muted-foreground">Riposo</h2>
      </div>

      <TimerDisplay
        seconds={timer.displaySeconds}
        totalSeconds={duration}
        mode="countdown"
        size="large"
      />

      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">Prossimo:</p>
        <p className="font-semibold text-teal-600">{nextExerciseName}</p>
      </div>

      <Button variant="outline" size="lg" onClick={onSkip} className="gap-2">
        <SkipForward className="h-4 w-4" />
        Salta riposo
      </Button>
    </div>
  );
}

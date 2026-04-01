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
  isPaused?: boolean;
}

export function RestTimer({
  duration,
  nextExerciseName,
  onComplete,
  onSkip,
  isPaused = false,
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

  // Auto-start the rest timer (or skip immediately if duration is 0)
  const startedRef = useRef(false);
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      if (duration <= 0) {
        onComplete();
      } else {
        setStarted(true);
        timer.startCountdown(duration);
      }
    }
  }, [duration, timer, onComplete]);

  // Pause/resume rest timer when global pause is toggled
  useEffect(() => {
    if (!started) return;
    if (isPaused) {
      timer.pause();
    } else {
      timer.resume();
    }
  }, [isPaused, started, timer]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-10 w-full px-4">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-muted-foreground uppercase tracking-widest">Riposo</h2>
      </div>

      <TimerDisplay
        seconds={timer.displaySeconds}
        totalSeconds={duration}
        mode="countdown"
        size="large"
      />

      <div className="text-center space-y-3 mt-6">
        <p className="text-lg text-muted-foreground uppercase tracking-widest font-bold">Prossimo Esercizio</p>
        <p className="text-3xl md:text-4xl font-extrabold text-primary text-balance leading-tight">{nextExerciseName}</p>
      </div>

      <Button size="lg" onClick={onSkip} className="h-16 mt-8 w-full max-w-sm rounded-2xl bg-muted border-2 border-border hover:border-border/80 hover:bg-muted/80 text-foreground gap-2 text-xl font-bold transition-all shadow-lg">
        <SkipForward className="h-6 w-6" />
        Salta e inizia
      </Button>
    </div>
  );
}

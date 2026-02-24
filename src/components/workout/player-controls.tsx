"use client";

import { Button } from "@/components/ui/button";
import { Check, Pause, Play, SkipForward } from "lucide-react";

interface PlayerControlsProps {
  exerciseType: "timed" | "reps";
  isTimerRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

export function PlayerControls({
  exerciseType,
  isTimerRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onComplete,
  onSkip,
}: PlayerControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        {exerciseType === "timed" ? (
          <>
            {!isTimerRunning && !isPaused && (
              <Button
                size="lg"
                onClick={onStart}
                className="h-16 w-16 rounded-full"
              >
                <Play className="h-7 w-7" />
              </Button>
            )}
            {isTimerRunning && (
              <Button
                size="lg"
                variant="outline"
                onClick={onPause}
                className="h-16 w-16 rounded-full"
              >
                <Pause className="h-7 w-7" />
              </Button>
            )}
            {isPaused && (
              <Button
                size="lg"
                onClick={onResume}
                className="h-16 w-16 rounded-full"
              >
                <Play className="h-7 w-7" />
              </Button>
            )}
          </>
        ) : (
          <Button
            size="lg"
            onClick={onComplete}
            className="h-20 w-20 rounded-full bg-sage-500 hover:bg-sage-600"
          >
            <Check className="h-9 w-9" />
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSkip}
        className="text-muted-foreground"
      >
        <SkipForward className="mr-1 h-4 w-4" />
        Salta
      </Button>
    </div>
  );
}

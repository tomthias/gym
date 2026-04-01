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
    <div className="flex flex-col items-stretch w-full gap-4">
      {exerciseType === "timed" ? (
        <>
          {!isTimerRunning && !isPaused && (
            <Button
              size="lg"
              onClick={onStart}
              className="h-20 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold tracking-wide shadow-xl shadow-indigo-900/20"
            >
              <Play className="h-8 w-8 mr-3 fill-current" />
              Avvia Timer
            </Button>
          )}
          {isTimerRunning && (
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={onPause}
                className="h-20 flex-1 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-2xl font-bold tracking-wide shadow-xl shadow-amber-900/20"
              >
                <Pause className="h-8 w-8 mr-3 fill-current" />
                Pausa
              </Button>
              <Button
                size="lg"
                onClick={onComplete}
                className="h-20 w-24 rounded-2xl border-none outline-none bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
              >
                <Check className="h-8 w-8" />
              </Button>
            </div>
          )}
          {isPaused && (
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={onResume}
                className="h-20 flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold tracking-wide shadow-xl shadow-indigo-900/20"
              >
                <Play className="h-8 w-8 mr-3 fill-current" />
                Riprendi
              </Button>
              <Button
                size="lg"
                onClick={onComplete}
                className="h-20 w-24 rounded-2xl border-none outline-none bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
              >
                <Check className="h-8 w-8" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Button
          size="lg"
          onClick={onComplete}
          className="h-20 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold tracking-wide shadow-xl shadow-indigo-900/20"
        >
          <Check className="h-8 w-8 mr-3" />
          Fatto
        </Button>
      )}

      <Button
        variant="ghost"
        size="lg"
        onClick={onSkip}
        className="h-14 w-full rounded-2xl text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300 text-lg font-bold"
      >
        <SkipForward className="h-5 w-5 mr-2" />
        Salta
      </Button>
    </div>
  );
}

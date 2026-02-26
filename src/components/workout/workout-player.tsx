"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkoutStore } from "@/lib/stores/workout-store";
import { useTimer } from "@/lib/hooks/use-timer";
import { useAudio } from "@/lib/hooks/use-audio";
import { useWakeLock } from "@/lib/hooks/use-wake-lock";
import { getExerciseType } from "@/types/workout";
import type { PlanItemWithExercise } from "@/types/workout";
import { WorkoutProgressBar } from "./progress-bar";
import { ExerciseDisplay } from "./exercise-display";
import { TimerDisplay } from "./timer-display";
import { PlayerControls } from "./player-controls";
import { RestTimer } from "./rest-timer";
import { SupersetIndicator } from "./superset-indicator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, X, Zap } from "lucide-react";

/** Returns all items in the same superset group, sorted by order */
function getSupersetGroup(
  items: PlanItemWithExercise[],
  currentIndex: number
): PlanItemWithExercise[] | null {
  const current = items[currentIndex];
  if (!current || current.superset_group == null) return null;
  return items
    .filter((item) => item.superset_group === current.superset_group)
    .sort((a, b) => a.order - b.order);
}

/** Builds grouped blocks for the ready-phase preview */
type PreviewBlock =
  | { type: "standalone"; item: PlanItemWithExercise; globalIndex: number }
  | { type: "superset"; group: number; items: PlanItemWithExercise[] };

function buildPreviewBlocks(items: PlanItemWithExercise[]): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.superset_group != null) {
      const group = item.superset_group;
      const groupItems: PlanItemWithExercise[] = [];
      while (i < items.length && items[i].superset_group === group) {
        groupItems.push(items[i]);
        i++;
      }
      blocks.push({ type: "superset", group, items: groupItems });
    } else {
      blocks.push({ type: "standalone", item, globalIndex: i });
      i++;
    }
  }
  return blocks;
}

export function WorkoutPlayer() {
  const router = useRouter();
  const store = useWorkoutStore();
  const { playCountdownTick, playComplete, unlock } = useAudio();
  const wakeLock = useWakeLock();
  const [isPaused, setIsPaused] = useState(false);

  const currentItem = store.items[store.currentItemIndex];
  const exerciseType = currentItem ? getExerciseType(currentItem) : "reps";

  const timer = useTimer({
    onComplete: () => {
      if (store.phase === "exercising" && exerciseType === "timed") {
        playComplete();
        store.completeSet();
      }
    },
    onTick: (remaining) => {
      if (
        store.phase === "exercising" &&
        exerciseType === "timed" &&
        remaining <= 3 &&
        remaining > 0
      ) {
        playCountdownTick();
      }
    },
  });

  // Handle workout start
  const handleStartWorkout = useCallback(() => {
    unlock(); // Unlock audio context on user gesture
    wakeLock.request();
    store.startWorkout();
  }, [unlock, wakeLock, store]);

  // Handle starting a timed exercise
  const handleStartTimer = useCallback(() => {
    if (currentItem?.duration) {
      timer.startCountdown(currentItem.duration);
      setIsPaused(false);
    }
  }, [currentItem, timer]);

  // Handle starting a stopwatch for reps
  const handleStartStopwatch = useCallback(() => {
    timer.startStopwatch();
    setIsPaused(false);
  }, [timer]);

  const handlePause = useCallback(() => {
    timer.pause();
    setIsPaused(true);
  }, [timer]);

  const handleResume = useCallback(() => {
    timer.resume();
    setIsPaused(false);
  }, [timer]);

  const handleCompleteSet = useCallback(() => {
    timer.stop();
    playComplete();
    setIsPaused(false);
    store.completeSet();
  }, [timer, playComplete, store]);

  const handleSkipExercise = useCallback(() => {
    timer.stop();
    setIsPaused(false);
    store.completeSet();
  }, [timer, store]);

  const handleRestComplete = useCallback(() => {
    store.completeRest();
  }, [store]);

  const handleSkipRest = useCallback(() => {
    store.skipRest();
  }, [store]);

  const handleQuit = useCallback(() => {
    timer.stop();
    wakeLock.release();
    store.reset();
    router.push("/dashboard");
  }, [timer, wakeLock, store, router]);

  // Auto-start stopwatch for reps exercises when entering exercising phase
  const prevPhaseRef = useRef(store.phase);
  useEffect(() => {
    if (
      store.phase === "exercising" &&
      prevPhaseRef.current !== "exercising" &&
      currentItem
    ) {
      const type = getExerciseType(currentItem);
      if (type === "reps") {
        timer.startStopwatch();
      }
    }
    prevPhaseRef.current = store.phase;
  }, [store.phase, currentItem, timer]);

  // Release wake lock on completed
  useEffect(() => {
    if (store.phase === "completed") {
      wakeLock.release();
      timer.stop();
      router.push("/workout/complete");
    }
  }, [store.phase, wakeLock, timer, router]);

  if (store.phase === "idle" || !store.planId) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <p className="text-muted-foreground">Nessun workout caricato</p>
        <Button onClick={() => router.push("/dashboard")} variant="outline">
          Torna alla dashboard
        </Button>
      </div>
    );
  }

  if (store.phase === "ready") {
    const previewBlocks = buildPreviewBlocks(store.items);
    let counter = 0;

    return (
      <div className="space-y-6 px-4 pt-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{store.planName}</h1>
          <p className="text-muted-foreground">
            {store.items.length} esercizi
          </p>
        </div>

        <div className="space-y-2">
          {previewBlocks.map((block) => {
            if (block.type === "standalone") {
              counter++;
              return (
                <Card key={block.item.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-600">
                        {counter}
                      </span>
                      <div>
                        <p className="font-medium text-sm">
                          {block.item.exercise.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {block.item.sets}x
                          {block.item.reps
                            ? ` ${block.item.reps} rep`
                            : ` ${block.item.duration}s`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // Superset block
            counter++;
            const blockNumber = counter;
            // Count superset as one logical item for numbering
            return (
              <div
                key={`ss-${block.group}`}
                className="rounded-lg border-2 border-golden-300 p-2 space-y-1"
              >
                <div className="flex items-center gap-1 px-1">
                  <Badge className="bg-golden-100 text-golden-700 text-xs gap-1">
                    <Zap className="h-3 w-3" /> Superserie
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {block.items[0].sets} round
                  </span>
                </div>
                {block.items.map((item, i) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-golden-100 text-sm font-bold text-golden-700">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <div>
                          <p className="font-medium text-sm">
                            {item.exercise.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.sets}x
                            {item.reps
                              ? ` ${item.reps} rep`
                              : ` ${item.duration}s`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleQuit} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Annulla
          </Button>
          <Button onClick={handleStartWorkout} className="flex-1 gap-2">
            <Play className="h-4 w-4" />
            Inizia
          </Button>
        </div>
      </div>
    );
  }

  if (store.phase === "resting" && currentItem) {
    // Determine next exercise name for rest screen
    const ssGroup = getSupersetGroup(store.items, store.currentItemIndex);
    let nextName: string;

    if (ssGroup) {
      const ssIndex = store.supersetExerciseIndex;
      if (ssIndex > 0 || store.supersetRound > 1) {
        // We're already inside the superset
        nextName = currentItem.exercise.name;
      } else {
        nextName = currentItem.exercise.name;
      }
    } else {
      nextName = currentItem.exercise.name;
    }

    // More precise: the current item IS the next exercise to do (store already advanced)
    const nextItem = store.items[store.currentItemIndex];
    nextName = nextItem?.exercise.name ?? "Fine workout";

    // Add round info for superserie
    if (ssGroup && ssGroup.length > 1) {
      const letter = String.fromCharCode(65 + store.supersetExerciseIndex);
      nextName = `${letter}. ${nextName} (Round ${store.supersetRound})`;
    }

    return (
      <div className="px-4 pt-6 space-y-4">
        <WorkoutProgressBar
          currentExercise={store.currentItemIndex + 1}
          totalExercises={store.items.length}
          currentSet={store.currentSet}
          totalSets={currentItem.sets}
        />
        <RestTimer
          key={`rest-${store.currentItemIndex}-${store.currentSet}-${store.supersetRound}-${store.supersetExerciseIndex}`}
          duration={store.timerSeconds}
          nextExerciseName={nextName}
          onComplete={handleRestComplete}
          onSkip={handleSkipRest}
        />
      </div>
    );
  }

  if (store.phase === "exercising" && currentItem) {
    const ssGroup = getSupersetGroup(store.items, store.currentItemIndex);

    return (
      <div className="px-4 pt-6 space-y-6">
        <WorkoutProgressBar
          currentExercise={store.currentItemIndex + 1}
          totalExercises={store.items.length}
          currentSet={store.currentSet}
          totalSets={currentItem.sets}
        />

        {/* Superset indicator */}
        {ssGroup && ssGroup.length > 1 && (
          <SupersetIndicator
            items={ssGroup}
            currentItemId={currentItem.id}
            round={store.supersetRound}
            totalRounds={ssGroup[0].sets}
          />
        )}

        <ExerciseDisplay
          item={currentItem}
          currentSet={ssGroup ? store.supersetRound : store.currentSet}
        />

        <div className="flex justify-center">
          <TimerDisplay
            seconds={timer.displaySeconds}
            totalSeconds={
              exerciseType === "timed"
                ? (currentItem.duration ?? 0)
                : undefined
            }
            mode={exerciseType === "timed" ? "countdown" : "stopwatch"}
            size="large"
          />
        </div>

        <PlayerControls
          exerciseType={exerciseType}
          isTimerRunning={
            !isPaused &&
            timer.displaySeconds > 0 &&
            exerciseType === "timed"
          }
          isPaused={isPaused}
          onStart={handleStartTimer}
          onPause={handlePause}
          onResume={handleResume}
          onComplete={handleCompleteSet}
          onSkip={handleSkipExercise}
        />

        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQuit}
            className="text-muted-foreground"
          >
            Esci dal workout
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pause, Play, X, Link2, Dumbbell, Timer, ArrowRight, CheckCircle2 } from "lucide-react";

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

function QuitDialog({ onConfirm, children }: { onConfirm: () => void; children: React.ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border text-foreground rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Sei sicuro di uscire?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-lg">
            Il workout verrà interrotto. Potrai riprendere in seguito dalla dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-3">
          <AlertDialogCancel className="h-14 rounded-2xl bg-muted border-none text-foreground font-bold hover:bg-muted/80">
            Indietro
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold tracking-wide"
          >
            Sì, Esci
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function WorkoutPlayer() {
  const router = useRouter();

  // Individual selectors — avoid subscribing to the entire store
  const phase = useWorkoutStore((s) => s.phase);
  const items = useWorkoutStore((s) => s.items);
  const currentItemIndex = useWorkoutStore((s) => s.currentItemIndex);
  const currentSet = useWorkoutStore((s) => s.currentSet);
  const planName = useWorkoutStore((s) => s.planName);
  const planId = useWorkoutStore((s) => s.planId);
  const storeTimerSeconds = useWorkoutStore((s) => s.timerSeconds);
  const supersetRound = useWorkoutStore((s) => s.supersetRound);
  const supersetExerciseIndex = useWorkoutStore((s) => s.supersetExerciseIndex);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const completeSet = useWorkoutStore((s) => s.completeSet);
  const completeRest = useWorkoutStore((s) => s.completeRest);
  const skipRest = useWorkoutStore((s) => s.skipRest);
  const resetStore = useWorkoutStore((s) => s.reset);

  const { playCountdownTick, playComplete, unlock } = useAudio();
  const wakeLock = useWakeLock();
  const [isPaused, setIsPaused] = useState(false);

  const currentItem = items[currentItemIndex];
  const exerciseType = currentItem ? getExerciseType(currentItem) : "reps";

  const timer = useTimer({
    onComplete: () => {
      if (phase === "exercising" && exerciseType === "timed") {
        playComplete();
        completeSet();
      }
    },
    onTick: (remaining) => {
      if (
        phase === "exercising" &&
        exerciseType === "timed" &&
        remaining <= 3 &&
        remaining > 0
      ) {
        playCountdownTick();
      }
    },
  });

  const handleStartWorkout = useCallback(() => {
    unlock();
    wakeLock.request();
    startWorkout();
  }, [unlock, wakeLock, startWorkout]);

  const handleStartTimer = useCallback(() => {
    if (currentItem?.duration) {
      timer.startCountdown(currentItem.duration);
      setIsPaused(false);
    }
  }, [currentItem, timer]);

  const handlePause = useCallback(() => {
    timer.pause();
    setIsPaused(true);
  }, [timer]);

  const handleResume = useCallback(() => {
    timer.resume();
    setIsPaused(false);
  }, [timer]);

  const handleGlobalPause = useCallback(() => {
    timer.pause();
    setIsPaused(true);
  }, [timer]);

  const handleGlobalResume = useCallback(() => {
    timer.resume();
    setIsPaused(false);
  }, [timer]);

  const handleCompleteSet = useCallback(() => {
    timer.stop();
    playComplete();
    setIsPaused(false);
    completeSet();
  }, [timer, playComplete, completeSet]);

  const handleSkipExercise = useCallback(() => {
    timer.stop();
    setIsPaused(false);
    completeSet();
  }, [timer, completeSet]);

  const handleRestComplete = useCallback(() => {
    completeRest();
  }, [completeRest]);

  const handleSkipRest = useCallback(() => {
    skipRest();
  }, [skipRest]);

  const handleQuit = useCallback(() => {
    timer.stop();
    wakeLock.release();
    resetStore();
    router.push("/dashboard");
  }, [timer, wakeLock, resetStore, router]);

  const prevPhaseRef = useRef(phase);
  useEffect(() => {
    if (
      phase === "exercising" &&
      prevPhaseRef.current !== "exercising" &&
      currentItem
    ) {
      const type = getExerciseType(currentItem);
      if (type === "reps") {
        timer.startStopwatch();
      }
    }
    prevPhaseRef.current = phase;
  }, [phase, currentItem, timer]);

  useEffect(() => {
    if (phase === "completed") {
      wakeLock.release();
      timer.stop();
      router.push("/workout/complete");
    }
  }, [phase, wakeLock, timer, router]);

  if (phase === "idle" || !planId) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground gap-6 py-20 px-6">
        <p className="text-muted-foreground text-2xl font-bold">Inizializzazione...</p>
      </div>
    );
  }

  // Global pause overlay
  if (isPaused && (phase === "exercising" || phase === "resting")) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/98 backdrop-blur-md text-foreground px-6">
        <Pause className="h-28 w-28 text-primary mb-8" />
        <h2 className="text-5xl font-extrabold mb-4 tracking-tight">In pausa</h2>
        <p className="text-2xl text-muted-foreground mb-16 text-center">{planName}</p>
        <Button size="lg" onClick={handleGlobalResume} className="h-24 w-full max-w-sm rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground text-3xl font-bold shadow-2xl shadow-primary/30">
          <Play className="h-10 w-10 mr-4 fill-current" />
          Riprendi
        </Button>
      </div>
    );
  }

  if (phase === "ready") {
    const previewBlocks = buildPreviewBlocks(items);
    let counter = 0;

    return (
      <div className="flex flex-col min-h-[100dvh] bg-background text-foreground pb-40 relative">
        <div className="px-6 pt-12 pb-8">
          <h1 className="text-[2.75rem] font-extrabold tracking-tight mb-3 leading-none text-balance">{planName}</h1>
          <p className="text-xl text-primary font-bold uppercase tracking-wider">
            {items.length} esercizi • {items.reduce((acc, curr) => acc + curr.sets, 0)} Set
          </p>
        </div>

        <div className="px-4 space-y-2">
          {previewBlocks.map((block) => {
            if (block.type === "standalone") {
              counter++;
              const isTimed = block.item.duration ? true : false;
              return (
                <div key={block.item.id} className="flex items-center gap-5 py-4 px-2">
                  <div className="relative flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-border bg-muted text-muted-foreground">
                      {isTimed ? <Timer className="h-6 w-6" /> : <Dumbbell className="h-6 w-6" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-bold truncate text-foreground">
                      {block.item.exercise.name}
                    </p>
                    <p className="text-lg text-muted-foreground mt-1 font-medium">
                      <span className="text-foreground">{block.item.sets} set</span> • {block.item.reps ? `${block.item.reps} rip` : `${block.item.duration}s`}
                    </p>
                  </div>
                </div>
              );
            }

            // Superset block with DropSet style vertical link connecting the circles
            return (
              <div key={`ss-${block.group}`} className="relative py-4 px-2">
                <div className="mb-4 ml-[5.5rem] text-sm font-extrabold text-primary uppercase tracking-widest">
                  Superserie • {block.items[0].sets} Round
                </div>
                {block.items.map((item, i) => {
                  counter++;
                  const isTimed = item.duration ? true : false;
                  const isLast = i === block.items.length - 1;
                  return (
                    <div key={item.id} className={`relative flex items-center gap-5 ${!isLast ? "mb-6" : ""}`}>
                      {/* Vertical line connector (Superset Link) */}
                      {!isLast && (
                        <div className="absolute left-8 top-[4rem] bottom-[-2.5rem] w-0.5 bg-neutral-800 z-0">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 p-1 rounded-full">
                            <Link2 className="h-5 w-5 text-neutral-600 rotate-90" />
                          </div>
                        </div>
                      )}
                      
                      <div className="relative z-10 flex-shrink-0">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-primary/30 bg-background text-primary shadow-[0_0_15px_hsl(var(--primary)/0.1)]">
                          {isTimed ? <Timer className="h-6 w-6" /> : <Dumbbell className="h-6 w-6" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold truncate text-foreground">
                          {item.exercise.name}
                        </p>
                        <p className="text-lg text-muted-foreground mt-1 font-medium">
                          <span className="text-primary">{item.sets} set</span> • {item.reps ? `${item.reps} rip` : `${item.duration}s`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Floating Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom)+4rem)] pt-16 bg-gradient-to-t from-background via-background to-transparent flex gap-4 pointer-events-none">
          <div className="flex gap-4 w-full pointer-events-auto">
            <QuitDialog onConfirm={handleQuit}>
              <Button variant="outline" size="lg" className="h-20 px-8 rounded-2xl border-none bg-muted hover:bg-muted/80 text-muted-foreground focus:ring-0">
                <X className="h-8 w-8" />
              </Button>
            </QuitDialog>
            <Button onClick={handleStartWorkout} size="lg" className="h-20 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-2xl font-bold tracking-wide shadow-2xl shadow-primary/30">
              Inizia <ArrowRight className="ml-3 h-7 w-7" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground pb-[180px]">
      <div className="px-6 pt-10">
        <WorkoutProgressBar
          currentExercise={currentItemIndex + 1}
          totalExercises={items.length}
          currentSet={currentSet}
          totalSets={currentItem?.sets ?? 1}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-4 relative mt-8">
        {phase === "resting" && currentItem ? (
          <RestTimer
            key={`rest-${currentItemIndex}-${currentSet}-${supersetRound}-${supersetExerciseIndex}`}
            duration={storeTimerSeconds}
            nextExerciseName={
              (getSupersetGroup(items, currentItemIndex)?.length ?? 0) > 1 
                ? `${String.fromCharCode(65 + supersetExerciseIndex)}. ${items[currentItemIndex]?.exercise.name} (Round ${supersetRound})`
                : items[currentItemIndex]?.exercise.name ?? "Fine workout"
            }
            onComplete={handleRestComplete}
            onSkip={handleSkipRest}
            isPaused={isPaused}
          />
        ) : (
          <>
            {/* Superset indicator */}
            {getSupersetGroup(items, currentItemIndex) && (getSupersetGroup(items, currentItemIndex)?.length ?? 0) > 1 && (
              <div className="mb-6 flex justify-center">
                <span className="bg-primary/10 text-primary font-extrabold px-5 py-2 rounded-full text-base uppercase tracking-widest border border-primary/20">
                  Superserie • Round {supersetRound}/{(getSupersetGroup(items, currentItemIndex) ?? [])[0]?.sets}
                </span>
              </div>
            )}

            <ExerciseDisplay
              item={currentItem}
              currentSet={getSupersetGroup(items, currentItemIndex) ? supersetRound : currentSet}
            />

            <div className="flex justify-center mt-12 mb-8">
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
          </>
        )}
      </div>

      {/* Floating Bottom Navigation for Active Exercise */}
      {phase === "exercising" && currentItem && !isPaused && (
        <div className="fixed bottom-0 left-0 right-0 px-6 pb-[calc(2rem+env(safe-area-inset-bottom)+4rem)] pt-16 bg-gradient-to-t from-background via-background/95 to-transparent flex flex-col items-center">
          <div className="w-full max-w-sm flex flex-col gap-4">
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
            <div className="flex items-center justify-center gap-4 w-full">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGlobalPause}
                className="flex-1 h-14 rounded-2xl border-border bg-muted shadow-md hover:bg-muted/80 text-foreground gap-2 text-lg font-bold"
              >
                <Pause className="h-5 w-5 fill-current" /> Pausa
              </Button>
              <QuitDialog onConfirm={handleQuit}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1 h-14 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 text-lg font-bold"
                >
                  <X className="h-5 w-5 mr-2" /> Esci
                </Button>
              </QuitDialog>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation for Resting Phase pause and quit */}
      {phase === "resting" && currentItem && (
        <div className="fixed bottom-0 left-0 right-0 px-6 pb-[calc(2rem+env(safe-area-inset-bottom)+4rem)] pt-16 bg-gradient-to-t from-background via-background/95 to-transparent flex flex-col items-center">
          <div className="w-full max-w-sm flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleGlobalPause}
              className="flex-1 h-14 rounded-2xl border-border bg-muted shadow-md hover:bg-muted/80 text-foreground gap-2 text-lg font-bold"
            >
              <Pause className="h-5 w-5 fill-current" /> Pausa
            </Button>
            <QuitDialog onConfirm={handleQuit}>
              <Button
                variant="ghost"
                size="lg"
                className="flex-1 h-14 rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 text-lg font-bold"
              >
                <X className="h-5 w-5 mr-2" /> Esci
              </Button>
            </QuitDialog>
          </div>
        </div>
      )}
    </div>
  );
}

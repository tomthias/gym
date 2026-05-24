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
import { Pause, Play, X, Link2, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { ExerciseDetailSheet, getCategoryIcon } from "./exercise-detail-sheet";

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
  const [selectedItem, setSelectedItem] = useState<PlanItemWithExercise | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      timer.stop(); // ensure clean state before starting
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
    setShowTransition(true);
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      setShowTransition(false);
      completeRest();
    }, 5000);
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
      timer.stop(); // always clear stale state before new exercise
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

  // Cleanup transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  if (phase === "idle" || !planId) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground gap-6 py-20 px-6">
        <p className="text-muted-foreground text-2xl font-bold">Inizializzazione...</p>
      </div>
    );
  }

  if (phase === "completed") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <CheckCircle2 className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  // Exercise transition flash overlay ("Pronti?")
  if (showTransition && currentItem) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary text-primary-foreground px-8"
        style={{ animation: "fadeIn 0.3s ease-out forwards" }}
      >
        <style>{`
          @keyframes fadeIn {
            0%   { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes shrink {
            0%   { width: 100%; }
            100% { width: 0%; }
          }
        `}</style>
        <p className="text-2xl font-bold uppercase tracking-widest mb-6 opacity-80">Pronti?</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-balance leading-tight">
          {currentItem.exercise.name}
        </h2>
        {currentItem.reps && (
          <p className="text-3xl font-bold mt-6 opacity-80">
            {currentItem.reps} {currentItem.per_lato ? "rip per lato" : "rip"}
          </p>
        )}
        {currentItem.duration && (
          <p className="text-3xl font-bold mt-6 opacity-80">{currentItem.duration}s</p>
        )}
        {/* Countdown progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary-foreground/20">
          <div
            className="h-full bg-primary-foreground/70 rounded-full"
            style={{ animation: "shrink 5s linear forwards" }}
          />
        </div>
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
    const totalSets = items.reduce((acc, curr) => acc + curr.sets, 0);

    return (
      <div className="flex flex-col min-h-[100dvh] bg-background text-foreground pb-60 relative">
        <div className="px-6 pt-12 pb-6">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-3">Pronto a iniziare</p>
          <h1 className="text-[2.75rem] font-extrabold tracking-tight leading-[0.95] text-balance mb-5">{planName}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-bold text-primary">
              {items.length} esercizi
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-3.5 py-1.5 text-sm font-bold text-foreground">
              {totalSets} set totali
            </span>
          </div>
        </div>

        <div className="px-4 space-y-3">
          {previewBlocks.map((block) => {
            if (block.type === "standalone") {
              return (
                <button
                  key={block.item.id}
                  onClick={() => setSelectedItem(block.item)}
                  className="w-full flex items-center gap-4 py-3.5 px-3 rounded-2xl bg-card border border-border/60 active:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground flex-shrink-0">
                    {getCategoryIcon(block.item.exercise.category, "h-6 w-6")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold line-clamp-2 text-foreground leading-tight">
                      {block.item.exercise.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                      <span className="text-foreground font-semibold">{block.item.sets} set</span> · {block.item.reps ? `${block.item.reps} rip` : `${block.item.duration}s`}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                </button>
              );
            }

            // Superset block — grouped in a tinted card for visual cohesion
            return (
              <div key={`ss-${block.group}`} className="rounded-2xl bg-primary/[0.06] border border-primary/15 p-2.5">
                <div className="flex items-center justify-between px-2 pt-1 pb-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary uppercase tracking-widest">
                    <Link2 className="h-3.5 w-3.5" />
                    Superserie
                  </span>
                  <span className="text-xs font-bold text-primary/70 uppercase tracking-wider">
                    {block.items[0].sets} Round
                  </span>
                </div>
                <div className="space-y-1.5">
                  {block.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="w-full flex items-center gap-4 py-3 px-2.5 rounded-xl bg-card border border-border/50 active:bg-muted/40 transition-colors text-left"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                        {getCategoryIcon(item.exercise.category, "h-5 w-5")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold line-clamp-2 text-foreground leading-tight">
                          {item.exercise.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                          <span className="text-primary font-semibold">{item.sets} set</span> · {item.reps ? `${item.reps} rip` : `${item.duration}s`}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-[calc(1rem+env(safe-area-inset-bottom)+4rem)] pt-10 bg-gradient-to-t from-background via-background/95 to-transparent flex gap-3 pointer-events-none">
          <div className="flex gap-3 w-full pointer-events-auto">
            <QuitDialog onConfirm={handleQuit}>
              <Button variant="outline" size="lg" className="h-16 px-6 rounded-2xl border-none bg-muted hover:bg-muted/80 text-muted-foreground focus:ring-0">
                <X className="h-6 w-6" />
              </Button>
            </QuitDialog>
            <Button onClick={handleStartWorkout} size="lg" className="h-16 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold tracking-wide shadow-lg shadow-primary/25">
              Inizia <ArrowRight className="ml-2.5 h-6 w-6" />
            </Button>
          </div>
        </div>

        <ExerciseDetailSheet
          item={selectedItem}
          open={selectedItem !== null}
          onClose={() => setSelectedItem(null)}
        />
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
              isActive
            />

            {exerciseType === "timed" ? (
              <div className="flex justify-center mt-12 mb-8">
                <TimerDisplay
                  seconds={timer.displaySeconds}
                  totalSeconds={currentItem.duration ?? 0}
                  mode="countdown"
                  size="large"
                />
              </div>
            ) : (
              /* Rep exercises: show elapsed stopwatch small, unobtrusive */
              <div className="flex justify-center mt-8 mb-4">
                <TimerDisplay
                  seconds={timer.displaySeconds}
                  mode="stopwatch"
                  size="normal"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Bottom Navigation for Active Exercise */}
      {phase === "exercising" && currentItem && !isPaused && (
        <div className="fixed bottom-0 left-0 right-0 px-6 pb-[calc(2rem+env(safe-area-inset-bottom)+4rem)] pt-16 bg-gradient-to-t from-background via-background/95 to-transparent flex flex-col items-center">
          <div className="w-full max-w-sm flex flex-col gap-4">
            {(() => {
              const isTimerRunning =
                !isPaused &&
                timer.displaySeconds > 0 &&
                exerciseType === "timed";
              return isTimerRunning || isPaused ? (
                <PlayerControls
                  exerciseType={exerciseType}
                  isTimerRunning={isTimerRunning}
                  isPaused={isPaused}
                  onStart={handleStartTimer}
                  onPause={handlePause}
                  onResume={handleResume}
                  onComplete={handleCompleteSet}
                  onSkip={handleSkipExercise}
                />
              ) : (
                <>
                  <PlayerControls
                    exerciseType={exerciseType}
                    isTimerRunning={false}
                    isPaused={false}
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
                </>
              );
            })()}
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

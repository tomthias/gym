import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanItemWithExercise, PlayerPhase } from "@/types/workout";

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

interface WorkoutState {
  planId: string | null;
  planName: string;
  items: PlanItemWithExercise[];
  currentItemIndex: number;
  currentSet: number;
  phase: PlayerPhase;
  timerSeconds: number;
  isTimerRunning: boolean;
  startedAt: string | null;
  totalSetsCompleted: number;
  // Superset tracking
  supersetRound: number; // 1-based round within superset
  supersetExerciseIndex: number; // 0-based index within the superset group
  _savedAt: number | null;
}

interface WorkoutActions {
  loadPlan: (
    planId: string,
    planName: string,
    items: PlanItemWithExercise[]
  ) => void;
  startWorkout: () => void;
  setPhase: (phase: PlayerPhase) => void;
  setTimerSeconds: (seconds: number) => void;
  setTimerRunning: (running: boolean) => void;
  completeSet: () => void;
  startRest: () => void;
  completeRest: () => void;
  skipRest: () => void;
  completeWorkout: () => void;
  reset: () => void;
}

const initialState: WorkoutState = {
  planId: null,
  planName: "",
  items: [],
  currentItemIndex: 0,
  currentSet: 1,
  phase: "idle",
  timerSeconds: 0,
  isTimerRunning: false,
  startedAt: null,
  totalSetsCompleted: 0,
  supersetRound: 1,
  supersetExerciseIndex: 0,
  _savedAt: null,
};

export const useWorkoutStore = create<WorkoutState & WorkoutActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      loadPlan: (planId, planName, items) =>
        set({
          planId,
          planName,
          items: items.sort((a, b) => a.order - b.order),
          currentItemIndex: 0,
          currentSet: 1,
          phase: "ready",
          timerSeconds: 0,
          isTimerRunning: false,
          startedAt: null,
          totalSetsCompleted: 0,
          supersetRound: 1,
          supersetExerciseIndex: 0,
        }),

      startWorkout: () =>
        set({
          phase: "exercising",
          startedAt: new Date().toISOString(),
          isTimerRunning: false,
          timerSeconds: 0,
        }),

      setPhase: (phase) => set({ phase }),
      setTimerSeconds: (seconds) => set({ timerSeconds: seconds }),
      setTimerRunning: (running) => set({ isTimerRunning: running }),

      completeSet: () => {
        const state = get();
        const currentItem = state.items[state.currentItemIndex];
        if (!currentItem) return;

        const newTotalSets = state.totalSetsCompleted + 1;
        const ssGroup = getSupersetGroup(state.items, state.currentItemIndex);

        // --- STANDALONE EXERCISE (no superset) ---
        if (!ssGroup) {
          if (state.currentSet < currentItem.sets) {
            // More sets for this exercise -> rest between sets
            set({
              currentSet: state.currentSet + 1,
              totalSetsCompleted: newTotalSets,
              phase: "resting",
              timerSeconds: currentItem.rest_time,
              isTimerRunning: false,
            });
          } else if (state.currentItemIndex < state.items.length - 1) {
            // Last set, more exercises -> rest before next exercise
            const restAfter = currentItem.rest_after ?? 90;
            set({
              currentItemIndex: state.currentItemIndex + 1,
              currentSet: 1,
              totalSetsCompleted: newTotalSets,
              phase: "resting",
              timerSeconds: restAfter,
              isTimerRunning: false,
              supersetRound: 1,
              supersetExerciseIndex: 0,
            });
          } else {
            // Last set of last exercise -> completed
            set({
              totalSetsCompleted: newTotalSets,
              phase: "completed",
              isTimerRunning: false,
            });
          }
          return;
        }

        // --- SUPERSET EXERCISE ---
        const ssIndex = ssGroup.findIndex(
          (i) => i.id === currentItem.id
        );
        const totalRounds = ssGroup[0].sets; // All exercises have same sets

        if (ssIndex < ssGroup.length - 1) {
          // CASE 1: More exercises in this round -> transition rest
          const nextInGroup = ssGroup[ssIndex + 1];
          const nextGlobalIndex = state.items.findIndex(
            (i) => i.id === nextInGroup.id
          );
          set({
            currentItemIndex: nextGlobalIndex,
            currentSet: state.supersetRound,
            totalSetsCompleted: newTotalSets,
            phase: "resting",
            timerSeconds: currentItem.transition_rest ?? 10,
            isTimerRunning: false,
            supersetExerciseIndex: ssIndex + 1,
          });
        } else if (state.supersetRound < totalRounds) {
          // CASE 2: Round complete, more rounds remain -> rest between rounds
          const firstInGroup = ssGroup[0];
          const firstGlobalIndex = state.items.findIndex(
            (i) => i.id === firstInGroup.id
          );
          const newRound = state.supersetRound + 1;
          set({
            currentItemIndex: firstGlobalIndex,
            currentSet: newRound,
            totalSetsCompleted: newTotalSets,
            phase: "resting",
            timerSeconds: firstInGroup.rest_time,
            isTimerRunning: false,
            supersetRound: newRound,
            supersetExerciseIndex: 0,
          });
        } else {
          // CASE 3: All rounds of superset complete
          const lastInGroup = ssGroup[ssGroup.length - 1];
          const lastGlobalIndex = state.items.findIndex(
            (i) => i.id === lastInGroup.id
          );

          if (lastGlobalIndex < state.items.length - 1) {
            // More exercises after superset -> rest then next exercise
            const restAfter = lastInGroup.rest_after ?? 90;
            set({
              currentItemIndex: lastGlobalIndex + 1,
              currentSet: 1,
              totalSetsCompleted: newTotalSets,
              phase: "resting",
              timerSeconds: restAfter,
              isTimerRunning: false,
              supersetRound: 1,
              supersetExerciseIndex: 0,
            });
          } else {
            // Workout complete
            set({
              totalSetsCompleted: newTotalSets,
              phase: "completed",
              isTimerRunning: false,
            });
          }
        }
      },

      startRest: () => {
        set({ phase: "resting", isTimerRunning: false });
      },

      completeRest: () => {
        set({ phase: "exercising", timerSeconds: 0, isTimerRunning: false });
      },

      skipRest: () => {
        set({ phase: "exercising", timerSeconds: 0, isTimerRunning: false });
      },

      completeWorkout: () => {
        set({ phase: "completed", isTimerRunning: false });
      },

      reset: () => set(initialState),
    }),
    {
      name: "physio-track-workout",
      partialize: (state) => ({
        planId: state.planId,
        planName: state.planName,
        items: state.items,
        currentItemIndex: state.currentItemIndex,
        currentSet: state.currentSet,
        phase: state.phase,
        timerSeconds: state.timerSeconds,
        startedAt: state.startedAt,
        totalSetsCompleted: state.totalSetsCompleted,
        supersetRound: state.supersetRound,
        supersetExerciseIndex: state.supersetExerciseIndex,
        _savedAt: Date.now(),
      }),
      onRehydrateStorage: () => (state) => {
        // Discard state older than 6 hours
        if (
          state?._savedAt &&
          Date.now() - state._savedAt > 6 * 60 * 60 * 1000
        ) {
          useWorkoutStore.getState().reset();
        }
      },
    }
  )
);

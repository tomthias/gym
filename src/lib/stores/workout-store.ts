import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanItemWithExercise, PlayerPhase } from "@/types/workout";

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
          });
        } else {
          // Last set of last exercise -> completed
          set({
            totalSetsCompleted: newTotalSets,
            phase: "completed",
            isTimerRunning: false,
          });
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

export type ExerciseType = "timed" | "reps";

export type PlayerPhase =
  | "idle"
  | "ready"
  | "exercising"
  | "resting"
  | "completed";

export interface PlanItemWithExercise {
  id: string;
  exercise: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    video_url: string | null;
  };
  sets: number;
  reps: number | null;
  duration: number | null;
  rest_time: number;
  rest_after: number | null;
  order: number;
  notes: string | null;
  superset_group: number | null;
  transition_rest: number | null;
}

export interface WorkoutSession {
  planId: string;
  planName: string;
  items: PlanItemWithExercise[];
  startedAt: string;
}

export interface WorkoutResult {
  planId: string;
  planName: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  exercisesCompleted: number;
  totalSetsCompleted: number;
}

export function getExerciseType(item: PlanItemWithExercise): ExerciseType {
  return item.duration != null ? "timed" : "reps";
}

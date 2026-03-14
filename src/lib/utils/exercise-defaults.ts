/**
 * Default configurations for seed exercises (ACL rehab program).
 * Used by Boomer Mode autocomplete to precompile rows.
 */

interface ExerciseDefaults {
  type: "reps" | "timed";
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
  notes: string;
}

const EXERCISE_DEFAULTS: Record<string, ExerciseDefaults> = {
  bike: { type: "timed", sets: 1, reps: 10, duration: 300, restTime: 0, notes: "" },
  "deadbug con bastone": { type: "reps", sets: 3, reps: 20, duration: 30, restTime: 60, notes: "" },
  "plank tocco spalla": { type: "reps", sets: 3, reps: 20, duration: 30, restTime: 60, notes: "" },
  "extension knee banded": { type: "reps", sets: 3, reps: 10, duration: 30, restTime: 60, notes: "" },
  "squat al trx": { type: "reps", sets: 3, reps: 8, duration: 30, restTime: 60, notes: "" },
  "heel raises da gradino": { type: "reps", sets: 3, reps: 15, duration: 30, restTime: 60, notes: "" },
  "sl bridge": { type: "reps", sets: 3, reps: 8, duration: 30, restTime: 60, notes: "" },
  "plank stacco una gamba": { type: "timed", sets: 3, reps: 10, duration: 30, restTime: 60, notes: "" },
  "l sit": { type: "timed", sets: 3, reps: 10, duration: 30, restTime: 60, notes: "" },
  slr: { type: "reps", sets: 3, reps: 10, duration: 30, restTime: 60, notes: "" },
  "slr in long sitting a muro": { type: "reps", sets: 3, reps: 10, duration: 30, restTime: 60, notes: "" },
  clamshell: { type: "reps", sets: 3, reps: 12, duration: 30, restTime: 60, notes: "" },
  "squat bfr": { type: "reps", sets: 4, reps: 30, duration: 30, restTime: 60, notes: "Schema: 30-15-15-15" },
};

const FALLBACK: ExerciseDefaults = {
  type: "reps",
  sets: 3,
  reps: 10,
  duration: 30,
  restTime: 60,
  notes: "",
};

export function getExerciseDefaults(name: string): ExerciseDefaults {
  return EXERCISE_DEFAULTS[name.toLowerCase()] ?? FALLBACK;
}

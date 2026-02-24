"use client";

import { Progress } from "@/components/ui/progress";

interface WorkoutProgressBarProps {
  currentExercise: number;
  totalExercises: number;
  currentSet: number;
  totalSets: number;
}

export function WorkoutProgressBar({
  currentExercise,
  totalExercises,
  currentSet,
  totalSets,
}: WorkoutProgressBarProps) {
  const totalSteps = totalExercises;
  const progress = ((currentExercise - 1) / totalSteps) * 100 + (1 / totalSteps) * ((currentSet - 1) / totalSets) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Esercizio {currentExercise}/{totalExercises}
        </span>
        <span className="text-muted-foreground">
          Serie {currentSet}/{totalSets}
        </span>
      </div>
      <Progress value={Math.min(progress, 100)} className="h-2" />
    </div>
  );
}

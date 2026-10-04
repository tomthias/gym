"use client";

import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/lib/i18n/client";

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
  const { t } = useI18n();
  const totalSteps = totalExercises;
  const progress = ((currentExercise - 1) / totalSteps) * 100 + (1 / totalSteps) * ((currentSet - 1) / totalSets) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {t.workout.progress.exerciseOf(currentExercise, totalExercises)}
        </span>
        <span className="text-muted-foreground">
          {t.workout.progress.setOf(currentSet, totalSets)}
        </span>
      </div>
      <Progress value={Math.min(progress, 100)} className="h-2" />
    </div>
  );
}

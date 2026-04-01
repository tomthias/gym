"use client";

import type { PlanItemWithExercise } from "@/types/workout";
import { getExerciseType } from "@/types/workout";
import { Clock, Repeat, ExternalLink, Info } from "lucide-react";

interface ExerciseDisplayProps {
  item: PlanItemWithExercise;
  currentSet: number;
}

export function ExerciseDisplay({ item, currentSet }: ExerciseDisplayProps) {
  const type = getExerciseType(item);

  return (
    <div className="space-y-6 text-center px-2">
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance leading-tight drop-shadow-sm">
        {item.exercise.name}
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-3 rounded-2xl text-2xl font-bold shadow-sm">
          {type === "timed" ? (
            <>
              <Clock className="h-7 w-7" />
              {item.duration}s
            </>
          ) : (
            <>
              <Repeat className="h-7 w-7" />
              {item.reps} rip
            </>
          )}
        </div>

        {item.per_lato && (
          <div className="flex items-center gap-2 bg-golden-100 text-golden-800 dark:bg-golden-900 dark:text-golden-300 px-5 py-3 rounded-2xl text-2xl font-bold shadow-sm">
            Per lato
          </div>
        )}

        <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-2xl text-2xl font-bold shadow-sm">
          Serie {currentSet}/{item.sets}
        </div>
      </div>

      {/* Description / Notes block, much more readable */}
      {(item.exercise.description || item.notes) && (
        <div className="max-w-md mx-auto mt-6 bg-muted/40 rounded-2xl p-5 text-left border border-border/50 shadow-sm space-y-3">
          {item.notes && (
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-teal-500 shrink-0 mt-0.5" />
              <p className="text-lg text-teal-700 dark:text-teal-400 font-medium">
                {item.notes}
              </p>
            </div>
          )}
          {item.exercise.description && (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {item.exercise.description}
            </p>
          )}
        </div>
      )}

      {item.exercise.video_url && (
        <div className="pt-2">
          <a
            href={item.exercise.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-400 dark:hover:bg-teal-900 transition-colors text-lg font-medium shadow-sm"
          >
            <ExternalLink className="h-5 w-5" />
            Guarda il video tutorial
          </a>
        </div>
      )}
    </div>
  );
}

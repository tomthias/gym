"use client";

import type { PlanItemWithExercise } from "@/types/workout";
import { getExerciseType } from "@/types/workout";
import { Clock, Repeat, ExternalLink, Info } from "lucide-react";
import { ExerciseImageCarousel } from "@/components/workout/exercise-image-carousel";

interface ExerciseDisplayProps {
  item: PlanItemWithExercise;
  currentSet: number;
  /** When true (active workout), rep count is shown as a large hero number */
  isActive?: boolean;
}

export function ExerciseDisplay({ item, currentSet, isActive = false }: ExerciseDisplayProps) {
  const type = getExerciseType(item);

  return (
    <div className="space-y-6 text-center px-2">
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance leading-tight drop-shadow-sm">
        {item.exercise.name}
      </h2>

      {/* Rep exercises in active mode: show a large hero rep count */}
      {type === "reps" && isActive && (
        <div className="flex flex-col items-center gap-1 my-2">
          <span className="text-[5rem] leading-none font-extrabold tabular-nums text-primary drop-shadow-sm">
            {item.reps}
          </span>
          <span className="text-xl font-bold text-muted-foreground uppercase tracking-widest">
            {item.per_lato ? "per lato" : "ripetizioni"}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* For timed or non-active mode, show the standard metric badge */}
        {(type === "timed" || !isActive) && (
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-3 rounded-2xl text-2xl font-bold shadow-sm">
            {type === "timed" ? (
              <>
                <Clock className="h-7 w-7" />
                {item.duration}s
              </>
            ) : (
              <>
                <Repeat className="h-7 w-7" />
                {item.reps} {item.per_lato ? "× lato" : "rip"}
              </>
            )}
          </div>
        )}


        {item.per_lato && !(isActive && type === "reps") && (
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

      {(item.exercise.image_urls?.length ?? 0) > 0 && (
        <div className="max-w-sm mx-auto w-full">
          <ExerciseImageCarousel
            images={item.exercise.image_urls}
            exerciseName={item.exercise.name}
          />
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

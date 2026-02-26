"use client";

import type { PlanItemWithExercise } from "@/types/workout";
import { getExerciseType } from "@/types/workout";
import { Badge } from "@/components/ui/badge";
import { Clock, Repeat, ExternalLink } from "lucide-react";

interface ExerciseDisplayProps {
  item: PlanItemWithExercise;
  currentSet: number;
}

export function ExerciseDisplay({ item, currentSet }: ExerciseDisplayProps) {
  const type = getExerciseType(item);

  return (
    <div className="space-y-3 text-center">
      <h2 className="text-2xl font-bold">{item.exercise.name}</h2>

      <div className="flex items-center justify-center gap-2">
        <Badge variant="secondary" className="gap-1">
          {type === "timed" ? (
            <>
              <Clock className="h-3 w-3" />
              {item.duration}s
            </>
          ) : (
            <>
              <Repeat className="h-3 w-3" />
              {item.reps} ripetizioni
            </>
          )}
        </Badge>
        <Badge variant="outline">
          Serie {currentSet}/{item.sets}
        </Badge>
      </div>

      {item.exercise.description && (
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {item.exercise.description}
        </p>
      )}

      {item.notes && (
        <p className="text-sm text-teal-600 italic">
          {item.notes}
        </p>
      )}

      {item.exercise.video_url && (
        <a
          href={item.exercise.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Video guida
        </a>
      )}
    </div>
  );
}

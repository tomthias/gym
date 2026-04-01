import type { PlanItemWithExercise } from "@/types/workout";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface SupersetIndicatorProps {
  items: PlanItemWithExercise[];
  currentItemId: string;
  round: number;
  totalRounds: number;
}

export function SupersetIndicator({
  items,
  currentItemId,
  round,
  totalRounds,
}: SupersetIndicatorProps) {
  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-sm">
          <Zap className="h-4 w-4" />
          <span>Superserie</span>
        </div>
        <span className="text-sm font-bold text-neutral-400">
          Round {round}/{totalRounds}
        </span>
      </div>
      <div className="flex gap-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "flex-1 rounded-xl px-3 py-2 text-center text-sm font-bold transition-colors truncate",
              item.id === currentItemId
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-neutral-800 text-neutral-500"
            )}
          >
            {item.exercise.name.split(" ")[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

import type { PlanItemWithExercise } from "@/types/workout";
import { Badge } from "@/components/ui/badge";
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
    <div className="rounded-lg bg-golden-50 dark:bg-golden-950/30 border border-golden-200 dark:border-golden-800 p-3">
      <div className="flex items-center justify-between mb-2">
        <Badge className="bg-golden-100 text-golden-700 gap-1">
          <Zap className="h-3 w-3" />
          Superserie
        </Badge>
        <span className="text-xs text-muted-foreground">
          Round {round}/{totalRounds}
        </span>
      </div>
      <div className="flex gap-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "flex-1 rounded px-2 py-1 text-center text-xs font-medium transition-colors truncate",
              item.id === currentItemId
                ? "bg-golden-500 text-white"
                : "bg-golden-100 dark:bg-golden-900/50 text-golden-600 dark:text-golden-400"
            )}
          >
            {String.fromCharCode(65 + i)}. {item.exercise.name.split(" ")[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

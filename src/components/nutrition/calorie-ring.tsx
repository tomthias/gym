"use client";

import { cn } from "@/lib/utils";

interface CalorieRingProps {
  consumed: number;
  budget: number;
}

export function CalorieRing({ consumed, budget }: CalorieRingProps) {
  const radius = 60;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const svgSize = (radius + stroke) * 2;

  const fraction = Math.min(consumed / budget, 1);
  const offset = circumference * (1 - fraction);
  const isOver = consumed > budget;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/20"
        />
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-500 ease-out",
            isOver ? "stroke-destructive" : "stroke-golden-500"
          )}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-2xl font-bold", isOver && "text-destructive")}>
          {consumed}
        </span>
        <span className="text-xs text-muted-foreground">/ {budget} kcal</span>
      </div>
    </div>
  );
}

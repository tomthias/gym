"use client";

import { formatTime } from "@/lib/utils/format-time";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  seconds: number;
  totalSeconds?: number;
  mode: "countdown" | "stopwatch";
  size?: "normal" | "large";
}

export function TimerDisplay({
  seconds,
  totalSeconds,
  mode,
  size = "normal",
}: TimerDisplayProps) {
  const radius = size === "large" ? 110 : 80;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const svgSize = (radius + stroke) * 2;

  let progressFraction = 0;
  if (mode === "countdown" && totalSeconds && totalSeconds > 0) {
    progressFraction = seconds / totalSeconds;
  } else if (mode === "stopwatch") {
    progressFraction = 0;
  }

  const strokeDashoffset = circumference * (1 - progressFraction);

  const isWarning = mode === "countdown" && seconds <= 3 && seconds > 0;
  const strokeColor = isWarning ? "stroke-destructive" : "stroke-medical-500";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={svgSize}
        height={svgSize}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/30"
        />
        {/* Progress circle */}
        {mode === "countdown" && (
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-[stroke-dashoffset] duration-1000 ease-linear", strokeColor)}
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={cn(
            "font-mono font-bold tabular-nums",
            size === "large" ? "text-5xl" : "text-4xl",
            isWarning && "text-destructive"
          )}
        >
          {formatTime(seconds)}
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          {mode === "countdown" ? "Rimanente" : "Tempo"}
        </span>
      </div>
    </div>
  );
}

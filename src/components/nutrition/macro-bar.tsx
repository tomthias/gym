"use client";

import { useI18n } from "@/lib/i18n/client";

interface MacroBarProps {
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export function MacroBar({ proteinGrams, carbsGrams, fatsGrams }: MacroBarProps) {
  const { t } = useI18n();
  const tm = t.nutrition.macros;
  const total = proteinGrams + carbsGrams + fatsGrams;

  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={tm.aria(proteinGrams, carbsGrams, fatsGrams)}>
        {total > 0 && (
          <>
            <div
              className="bg-blue-500 transition-all"
              style={{ width: `${(proteinGrams / total) * 100}%` }}
            />
            <div
              className="bg-amber-400 transition-all"
              style={{ width: `${(carbsGrams / total) * 100}%` }}
            />
            <div
              className="bg-orange-500 transition-all"
              style={{ width: `${(fatsGrams / total) * 100}%` }}
            />
          </>
        )}
      </div>
      <div className="flex justify-between text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          {tm.protein} {proteinGrams}g
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          {tm.carbsShort} {carbsGrams}g
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          {tm.fats} {fatsGrams}g
        </span>
      </div>
    </div>
  );
}

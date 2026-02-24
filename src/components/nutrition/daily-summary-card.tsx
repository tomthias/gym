"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalorieRing } from "./calorie-ring";
import { MacroBar } from "./macro-bar";

interface DailySummaryCardProps {
  consumed: number;
  budget: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export function DailySummaryCard({
  consumed,
  budget,
  proteinGrams,
  carbsGrams,
  fatsGrams,
}: DailySummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Riepilogo giornaliero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <CalorieRing consumed={consumed} budget={budget} />
        </div>
        <MacroBar
          proteinGrams={proteinGrams}
          carbsGrams={carbsGrams}
          fatsGrams={fatsGrams}
        />
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { MealSlot } from "@/types/nutrition";

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

interface MealSectionProps {
  slot: MealSlot;
  label: string;
  meals: MealEntry[];
  dayType: string;
  onRemove: (id: string) => void;
}

export function MealSection({
  slot,
  label,
  meals,
  dayType,
  onRemove,
}: MealSectionProps) {
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{label}</h3>
            {totalCalories > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalCalories} kcal
              </Badge>
            )}
          </div>
          <Link href={`/nutrition/add-meal?slot=${slot}&dayType=${dayType}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {meals.length === 0 ? (
          <Link
            href={`/nutrition/add-meal?slot=${slot}&dayType=${dayType}`}
            className="flex items-center justify-center rounded-lg border border-dashed py-4 text-sm text-muted-foreground hover:border-medical-300 hover:text-medical-600 transition-colors"
          >
            <Plus className="mr-1 h-4 w-4" />
            Aggiungi pasto
          </Link>
        ) : (
          <div className="space-y-2">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{meal.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {meal.calories} kcal &middot; P:{meal.proteinGrams}g C:
                    {meal.carbsGrams}g F:{meal.fatsGrams}g
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRemove(meal.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

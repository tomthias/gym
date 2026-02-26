"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { DailySummaryCard } from "@/components/nutrition/daily-summary-card";
import { MealSection } from "@/components/nutrition/meal-section";
import { Button } from "@/components/ui/button";
import { MEAL_SLOTS, type MealSlot, type DayType } from "@/types/nutrition";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LogEntry {
  id: string;
  meal_slot: string;
  recipe_id: string | null;
  custom_name: string | null;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  calories: number;
  recipes?: { name: string } | null;
}

export default function NutritionPage() {
  const [dayType, setDayType] = useState<DayType>("workout");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [budget, setBudget] = useState({ workout: 2100, rest: 1900 });
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const [logsRes, budgetRes] = await Promise.all([
      supabase
        .from("nutrition_logs")
        .select("*, recipes(name)")
        .eq("patient_id", user.id)
        .eq("date", today),
      supabase
        .from("calorie_budgets")
        .select("*")
        .eq("patient_id", user.id)
        .maybeSingle(),
    ]);

    if (logsRes.data) setLogs(logsRes.data as LogEntry[]);
    if (budgetRes.data) {
      setBudget({
        workout: budgetRes.data.workout_day_calories,
        rest: budgetRes.data.rest_day_calories,
      });
    }
    setLoading(false);
  }, [today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemove = useCallback(
    async (logId: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("nutrition_logs").delete().eq("id", logId);
      if (error) {
        alert("Errore nell'eliminazione del pasto");
        return;
      }
      setLogs((prev) => prev.filter((l) => l.id !== logId));
    },
    []
  );

  const totalCalories = logs.reduce((sum, l) => sum + l.calories, 0);
  const totalProtein = logs.reduce((sum, l) => sum + Number(l.protein_grams), 0);
  const totalCarbs = logs.reduce((sum, l) => sum + Number(l.carbs_grams), 0);
  const totalFats = logs.reduce((sum, l) => sum + Number(l.fats_grams), 0);
  const currentBudget = dayType === "workout" ? budget.workout : budget.rest;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Nutrizione" />
      <div className="px-4 pt-4 space-y-4">
        {/* Day type toggle */}
        <div className="flex gap-2">
          {(["workout", "rest"] as const).map((type) => (
            <Button
              key={type}
              variant={dayType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setDayType(type)}
              className={cn(
                "flex-1",
                dayType === type && "bg-teal-600 hover:bg-teal-700"
              )}
            >
              {type === "workout" ? "Giorno allenamento" : "Giorno riposo"}
            </Button>
          ))}
        </div>

        <DailySummaryCard
          consumed={totalCalories}
          budget={currentBudget}
          proteinGrams={Math.round(totalProtein)}
          carbsGrams={Math.round(totalCarbs)}
          fatsGrams={Math.round(totalFats)}
        />

        {MEAL_SLOTS.map(({ key, label }) => {
          const slotLogs = logs.filter((l) => l.meal_slot === key);
          const meals = slotLogs.map((l) => ({
            id: l.id,
            name: l.recipes?.name ?? l.custom_name ?? "Pasto",
            calories: l.calories,
            proteinGrams: Number(l.protein_grams),
            carbsGrams: Number(l.carbs_grams),
            fatsGrams: Number(l.fats_grams),
          }));

          return (
            <MealSection
              key={key}
              slot={key}
              label={label}
              meals={meals}
              dayType={dayType}
              onRemove={handleRemove}
            />
          );
        })}
      </div>
    </div>
  );
}

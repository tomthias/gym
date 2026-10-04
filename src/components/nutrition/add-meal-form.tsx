"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";

interface AddMealFormProps {
  onSubmit: (data: {
    name: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
  }) => void;
  loading?: boolean;
}

export function AddMealForm({ onSubmit, loading }: AddMealFormProps) {
  const { t } = useI18n();
  const tf = t.nutrition.form;
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cal = Number(calories) || 0;
    const prot = Number(protein) || 0;
    const carb = Number(carbs) || 0;
    const fat = Number(fats) || 0;

    if (cal < 0 || prot < 0 || carb < 0 || fat < 0) {
      setError(tf.negative);
      return;
    }
    if (cal > 5000 || prot > 500 || carb > 500 || fat > 500) {
      setError(tf.tooHigh);
      return;
    }

    onSubmit({
      name,
      calories: cal,
      proteinGrams: prot,
      carbsGrams: carb,
      fatsGrams: fat,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
      <div className="space-y-2">
        <Label htmlFor="meal-name">{tf.mealName}</Label>
        <Input
          id="meal-name"
          placeholder={tf.mealNamePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="meal-cal">{tf.calories}</Label>
          <Input
            id="meal-cal"
            type="number"
            min="0"
            placeholder="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meal-prot">{tf.protein}</Label>
          <Input
            id="meal-prot"
            type="number"
            min="0"
            placeholder="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meal-carbs">{tf.carbs}</Label>
          <Input
            id="meal-carbs"
            type="number"
            min="0"
            placeholder="0"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meal-fats">{tf.fats}</Label>
          <Input
            id="meal-fats"
            type="number"
            min="0"
            placeholder="0"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading || !name}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t.nutrition.add}
      </Button>
    </form>
  );
}

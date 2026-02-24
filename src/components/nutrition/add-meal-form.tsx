"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      calories: Number(calories) || 0,
      proteinGrams: Number(protein) || 0,
      carbsGrams: Number(carbs) || 0,
      fatsGrams: Number(fats) || 0,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meal-name">Nome pasto</Label>
        <Input
          id="meal-name"
          placeholder="Es. Insalata di pollo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="meal-cal">Calorie (kcal)</Label>
          <Input
            id="meal-cal"
            type="number"
            placeholder="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meal-prot">Proteine (g)</Label>
          <Input
            id="meal-prot"
            type="number"
            placeholder="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meal-carbs">Carboidrati (g)</Label>
          <Input
            id="meal-carbs"
            type="number"
            placeholder="0"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meal-fats">Grassi (g)</Label>
          <Input
            id="meal-fats"
            type="number"
            placeholder="0"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading || !name}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Aggiungi
      </Button>
    </form>
  );
}

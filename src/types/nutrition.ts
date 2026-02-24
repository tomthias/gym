export type DayType = "workout" | "rest";
export type MealSlot = "colazione" | "spuntino" | "pranzo" | "merenda" | "cena";

export interface Macros {
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  calories: number;
}

export interface Recipe {
  id: string;
  slug: string;
  name: string;
  dayType: DayType;
  mealSlot: MealSlot;
  difficulty: string;
  prepTime: number;
  category: string | null;
  tags: string[];
  ingredients: string[];
  steps: string[];
  tips: string | null;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  calories: number;
}

export interface NutritionLog {
  id: string;
  date: string;
  mealSlot: MealSlot;
  recipeId: string | null;
  customName: string | null;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  calories: number;
}

export interface DailyTotals extends Macros {
  mealCount: number;
}

export const MEAL_SLOTS: { key: MealSlot; label: string; icon: string }[] = [
  { key: "colazione", label: "Colazione", icon: "Coffee" },
  { key: "spuntino", label: "Spuntino", icon: "Apple" },
  { key: "pranzo", label: "Pranzo", icon: "UtensilsCrossed" },
  { key: "merenda", label: "Merenda", icon: "Cookie" },
  { key: "cena", label: "Cena", icon: "Moon" },
];

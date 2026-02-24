"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { AddMealForm } from "@/components/nutrition/add-meal-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Search, Loader2 } from "lucide-react";
import type { MealSlot } from "@/types/nutrition";

interface RecipeRow {
  id: string;
  slug: string;
  name: string;
  difficulty: string;
  prep_time: number;
  category: string | null;
  tags: string[];
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  calories: number;
}

export default function AddMealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slot = (searchParams.get("slot") ?? "pranzo") as MealSlot;
  const dayType = searchParams.get("dayType") ?? "workout";

  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchRecipes() {
      const supabase = createClient();
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("day_type", dayType)
        .eq("meal_slot", slot)
        .order("name");

      if (data) setRecipes(data);
      setLoading(false);
    }
    fetchRecipes();
  }, [dayType, slot]);

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectRecipe = useCallback(
    async (recipe: RecipeRow) => {
      setSaving(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("nutrition_logs").insert({
          patient_id: user.id,
          date: new Date().toISOString().split("T")[0],
          meal_slot: slot,
          recipe_id: recipe.id,
          protein_grams: recipe.protein_grams,
          carbs_grams: recipe.carbs_grams,
          fats_grams: recipe.fats_grams,
          calories: recipe.calories,
        });
      }

      router.push("/nutrition");
    },
    [slot, router]
  );

  const handleManualAdd = useCallback(
    async (data: {
      name: string;
      calories: number;
      proteinGrams: number;
      carbsGrams: number;
      fatsGrams: number;
    }) => {
      setSaving(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("nutrition_logs").insert({
          patient_id: user.id,
          date: new Date().toISOString().split("T")[0],
          meal_slot: slot,
          custom_name: data.name,
          protein_grams: data.proteinGrams,
          carbs_grams: data.carbsGrams,
          fats_grams: data.fatsGrams,
          calories: data.calories,
        });
      }

      router.push("/nutrition");
    },
    [slot, router]
  );

  const slotLabel =
    {
      colazione: "Colazione",
      spuntino: "Spuntino",
      pranzo: "Pranzo",
      merenda: "Merenda",
      cena: "Cena",
    }[slot] ?? slot;

  return (
    <div>
      <Header title={`Aggiungi - ${slotLabel}`} backHref="/nutrition" />
      <div className="px-4 pt-4 space-y-4">
        <Tabs defaultValue="recipes">
          <TabsList className="w-full">
            <TabsTrigger value="recipes" className="flex-1">
              Ricette
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">
              Manuale
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-3 mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cerca ricetta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-medical-500" />
              </div>
            ) : filteredRecipes.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {search
                  ? "Nessuna ricetta trovata"
                  : "Nessuna ricetta disponibile per questo pasto"}
              </p>
            ) : (
              filteredRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="cursor-pointer hover:border-medical-300 transition-colors"
                  onClick={() => handleSelectRecipe(recipe)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{recipe.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            {recipe.prep_time}min
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {recipe.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-medical-600">
                        {recipe.calories} kcal
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      P:{Number(recipe.protein_grams)}g C:{Number(recipe.carbs_grams)}g F:
                      {Number(recipe.fats_grams)}g
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-3">
            <AddMealForm onSubmit={handleManualAdd} loading={saving} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

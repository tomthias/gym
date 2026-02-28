"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { AddMealForm } from "@/components/nutrition/add-meal-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { MacroBar } from "@/components/nutrition/macro-bar";
import { ChefHat, Clock, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
  ingredients: string[];
  steps: string[];
  tips: string | null;
}

export default function AddMealPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
        </div>
      }
    >
      <AddMealPageContent />
    </Suspense>
  );
}

function AddMealPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slot = (searchParams.get("slot") ?? "pranzo") as MealSlot;
  const dayType = searchParams.get("dayType") ?? "workout";

  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeRow | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchRecipes() {
      const supabase = createClient();
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("day_type", dayType)
        .eq("meal_slot", slot)
        .order("name");

      if (!ignore) {
        if (data) setRecipes(data);
        setLoading(false);
      }
    }
    setLoading(true);
    fetchRecipes();
    return () => { ignore = true; };
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
        const { error } = await supabase.from("nutrition_logs").insert({
          patient_id: user.id,
          date: new Date().toISOString().split("T")[0],
          meal_slot: slot,
          recipe_id: recipe.id,
          protein_grams: recipe.protein_grams,
          carbs_grams: recipe.carbs_grams,
          fats_grams: recipe.fats_grams,
          calories: recipe.calories,
        });

        if (error) {
          toast.error("Errore nell'aggiunta del pasto");
          setSaving(false);
          return;
        }
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
        const { error } = await supabase.from("nutrition_logs").insert({
          patient_id: user.id,
          date: new Date().toISOString().split("T")[0],
          meal_slot: slot,
          custom_name: data.name,
          protein_grams: data.proteinGrams,
          carbs_grams: data.carbsGrams,
          fats_grams: data.fatsGrams,
          calories: data.calories,
        });

        if (error) {
          toast.error("Errore nell'aggiunta del pasto");
          setSaving(false);
          return;
        }
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
                <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
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
                  className="cursor-pointer hover:border-teal-300 transition-colors"
                  onClick={() => setSelectedRecipe(recipe)}
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
                      <span className="text-sm font-semibold text-teal-600">
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
            <Sheet
              open={!!selectedRecipe}
              onOpenChange={(open) => !open && setSelectedRecipe(null)}
            >
              <SheetContent
                side="bottom"
                className="max-h-[85vh] flex flex-col rounded-t-xl"
              >
                {selectedRecipe && (
                  <>
                    <SheetHeader>
                      <SheetTitle>{selectedRecipe.name}</SheetTitle>
                      <SheetDescription asChild>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {selectedRecipe.prep_time} min
                          </Badge>
                          <Badge variant="outline">
                            {selectedRecipe.difficulty}
                          </Badge>
                          {selectedRecipe.category && (
                            <Badge variant="outline">
                              {selectedRecipe.category}
                            </Badge>
                          )}
                        </div>
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto px-4 space-y-4">
                      {/* Macros */}
                      <div className="text-center">
                        <span className="text-2xl font-bold text-teal-600">
                          {selectedRecipe.calories}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          kcal
                        </span>
                      </div>
                      <MacroBar
                        proteinGrams={Number(selectedRecipe.protein_grams)}
                        carbsGrams={Number(selectedRecipe.carbs_grams)}
                        fatsGrams={Number(selectedRecipe.fats_grams)}
                      />

                      {/* Ingredienti */}
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-1">
                          <ChefHat className="h-4 w-4" />
                          Ingredienti
                        </h3>
                        <ul className="space-y-1">
                          {selectedRecipe.ingredients.map((ing, i) => (
                            <li
                              key={i}
                              className="text-sm flex items-start gap-2"
                            >
                              <span className="text-teal-500 mt-1">
                                &#8226;
                              </span>
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Preparazione */}
                      <div>
                        <h3 className="font-semibold mb-2">Preparazione</h3>
                        <ol className="space-y-3">
                          {selectedRecipe.steps.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-600">
                                {i + 1}
                              </span>
                              <span className="pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tips */}
                      {selectedRecipe.tips && (
                        <p className="text-sm italic text-muted-foreground pb-2">
                          💡 {selectedRecipe.tips}
                        </p>
                      )}
                    </div>

                    <SheetFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleSelectRecipe(selectedRecipe)}
                        disabled={saving}
                      >
                        {saving && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Aggiungi
                      </Button>
                    </SheetFooter>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </TabsContent>

          <TabsContent value="manual" className="mt-3">
            <AddMealForm onSubmit={handleManualAdd} loading={saving} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

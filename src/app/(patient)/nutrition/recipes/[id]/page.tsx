import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MacroBar } from "@/components/nutrition/macro-bar";
import { Clock, ChefHat } from "lucide-react";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (!recipe) notFound();

  return (
    <div>
      <Header title={recipe.name} backHref="/nutrition" />
      <div className="px-4 pt-4 space-y-4">
        {/* Meta */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {recipe.prep_time} min
          </Badge>
          <Badge variant="outline">{recipe.difficulty}</Badge>
          {recipe.category && <Badge variant="outline">{recipe.category}</Badge>}
        </div>

        {/* Macros */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="text-center">
              <span className="text-3xl font-bold text-teal-600">
                {recipe.calories}
              </span>
              <span className="text-sm text-muted-foreground"> kcal</span>
            </div>
            <MacroBar
              proteinGrams={Number(recipe.protein_grams)}
              carbsGrams={Number(recipe.carbs_grams)}
              fatsGrams={Number(recipe.fats_grams)}
            />
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              Ingredienti
            </h3>
            <ul className="space-y-1">
              {recipe.ingredients.map((ing: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-teal-500 mt-1">&#8226;</span>
                  {ing}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Preparazione</h3>
            <ol className="space-y-3">
              {recipe.steps.map((step: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-medium text-teal-600">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Tips */}
        {recipe.tips && (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm italic text-muted-foreground">
                💡 {recipe.tips}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function togglePlanActive(planId: string, active: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase
    .from("workout_plans")
    .update({ active })
    .eq("id", planId)
    .eq("physio_id", user.id);

  if (error) throw new Error("Errore nell'aggiornamento della scheda");

  revalidatePath("/physio/dashboard");
}

export async function deletePlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase
    .from("workout_plans")
    .delete()
    .eq("id", planId)
    .eq("physio_id", user.id);

  if (error) throw new Error("Errore nell'eliminazione della scheda");

  revalidatePath("/physio/dashboard");
}

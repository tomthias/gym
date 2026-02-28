"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database";

type PlanItemRow = Database["public"]["Tables"]["plan_items"]["Row"];

function revalidatePhysio() {
  revalidatePath("/physio/dashboard");
  revalidatePath("/physio/plans");
}

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

  revalidatePhysio();
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

  revalidatePhysio();
}

export async function duplicatePlan(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Get the original plan
  const { data: plan } = await supabase
    .from("workout_plans")
    .select("*, plan_items(*)")
    .eq("id", planId)
    .eq("physio_id", user.id)
    .single();

  if (!plan) throw new Error("Scheda non trovata");

  // Create duplicated plan
  const { data: newPlan, error: planError } = await supabase
    .from("workout_plans")
    .insert({
      name: `${plan.name} (copia)`,
      description: plan.description,
      patient_id: plan.patient_id,
      physio_id: user.id,
      active: false,
    })
    .select()
    .single();

  if (planError || !newPlan) throw new Error("Errore nella duplicazione della scheda");

  // Copy plan items
  if (plan.plan_items?.length) {
    const newItems = plan.plan_items.map((item: PlanItemRow) => ({
      plan_id: newPlan.id,
      exercise_id: item.exercise_id,
      order: item.order,
      sets: item.sets,
      reps: item.reps,
      duration: item.duration,
      rest_time: item.rest_time,
      rest_after: item.rest_after,
      notes: item.notes,
      superset_group: item.superset_group,
      transition_rest: item.transition_rest,
    }));

    const { error: itemsError } = await supabase
      .from("plan_items")
      .insert(newItems);

    if (itemsError) throw new Error("Errore nella copia degli esercizi");
  }

  revalidatePhysio();
}

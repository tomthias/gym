"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { PlanEditor, type PlanItem } from "@/components/physio/plan-editor";
import { Loader2 } from "lucide-react";

function generateTempId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function EditPlanPage() {
  const params = useParams<{ planId: string }>();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [initialPlan, setInitialPlan] = useState<{
    name: string;
    description: string;
    items: PlanItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: plan } = await supabase
        .from("workout_plans")
        .select(
          `
          id, name, description, patient_id,
          plan_items (
            id, exercise_id, "order", sets, reps, duration,
            rest_time, rest_after, notes, superset_group, transition_rest,
            exercises (id, name)
          )
        `
        )
        .eq("id", params.planId)
        .eq("physio_id", user.id)
        .single();

      if (!plan) {
        setLoading(false);
        return;
      }

      setPatientId(plan.patient_id);

      const planItems = (plan.plan_items ?? []) as Array<
        typeof plan.plan_items extends Array<infer T> ? T : never
      >;
      const loadedItems: PlanItem[] = planItems
        .sort((a, b) => a.order - b.order)
        .map((pi) => ({
          tempId: generateTempId(),
          exerciseId: pi.exercise_id,
          exerciseName: (pi.exercises as unknown as { id: string; name: string } | null)?.name ?? "",
          type: pi.duration ? ("timed" as const) : ("reps" as const),
          sets: pi.sets,
          reps: pi.reps ?? 10,
          duration: pi.duration ?? 30,
          restTime: pi.rest_time,
          restAfter: pi.rest_after ?? 90,
          notes: pi.notes ?? "",
          supersetGroup: pi.superset_group,
          transitionRest: pi.transition_rest ?? 10,
        }));

      setInitialPlan({
        name: plan.name,
        description: plan.description ?? "",
        items: loadedItems,
      });
      setLoading(false);
    }
    load();
  }, [params.planId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!patientId || !initialPlan) {
    return (
      <div>
        <Header title="Modifica scheda" />
        <div className="px-4 pt-8 text-center text-muted-foreground">
          Scheda non trovata
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Modifica scheda" />
      <PlanEditor
        mode="edit"
        planId={params.planId}
        patientId={patientId}
        initialPlan={initialPlan}
      />
    </div>
  );
}

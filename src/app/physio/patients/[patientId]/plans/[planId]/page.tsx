import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { PlanViewTable } from "@/components/physio/plan-view-table";

interface Props {
  params: Promise<{ patientId: string; planId: string }>;
}

export default async function ViewPatientPlanPage({ params }: Props) {
  const { patientId, planId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plan } = await supabase
    .from("workout_plans")
    .select(
      `
      id, name, description, active, created_at,
      plan_items (
        id, exercise_id, "order", sets, reps, duration,
        rest_time, rest_after, notes, superset_group, transition_rest, per_lato,
        exercises (id, name)
      )
    `
    )
    .eq("id", planId)
    .eq("physio_id", user.id)
    .single();

  if (!plan) {
    return (
      <div>
        <Header title="Scheda" backHref={`/physio/patients/${patientId}/plans`} />
        <div className="px-4 pt-8 text-center text-muted-foreground">
          Scheda non trovata
        </div>
      </div>
    );
  }

  const planItems = (plan.plan_items ?? []) as unknown as Array<{
    id: string;
    exercise_id: string;
    order: number;
    sets: number;
    reps: number | null;
    duration: number | null;
    rest_time: number;
    rest_after: number | null;
    notes: string | null;
    superset_group: number | null;
    transition_rest: number | null;
    per_lato: boolean | null;
    exercises: { id: string; name: string } | null;
  }>;

  const sortedItems = planItems
    .filter((pi) => pi.exercises != null)
    .sort((a, b) => a.order - b.order)
    .map((pi) => ({
      exerciseName: pi.exercises?.name ?? "",
      type: pi.duration ? ("timed" as const) : ("reps" as const),
      sets: pi.sets,
      reps: pi.reps ?? 10,
      duration: pi.duration ?? 30,
      restTime: pi.rest_time,
      notes: pi.notes ?? "",
      supersetGroup: pi.superset_group,
      perLato: pi.per_lato ?? false,
    }));

  const basePath = `/physio/patients/${patientId}`;

  return (
    <div>
      <Header title={plan.name} backHref={`${basePath}/plans`} />
      <div className="px-4 pt-4 lg:px-0 lg:pt-0 space-y-4">
        {/* Plan header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              {plan.active && (
                <Badge className="bg-golden-100 text-golden-700">Attiva</Badge>
              )}
            </div>
            {plan.description && (
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {sortedItems.length} esercizi &middot;{" "}
              {new Date(plan.created_at).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Link href={`${basePath}/plans/edit/${plan.id}`}>
            <Button className="gap-2">
              <Pencil className="h-4 w-4" />
              Modifica
            </Button>
          </Link>
        </div>

        {/* Read-only table */}
        <PlanViewTable items={sortedItems} planName={plan.name} />
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TogglePlanButton,
  DeletePlanButton,
  DuplicatePlanButton,
} from "@/components/physio/plan-actions";
import { Dumbbell, Pencil, Plus } from "lucide-react";

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get linked patient
  const { data: patient } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("physio_id", user.id)
    .eq("role", "patient")
    .limit(1)
    .maybeSingle();

  if (!patient) {
    return (
      <div>
        <Header title="Schede" />
        <div className="px-4 pt-4 lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center gap-4 py-20">
            <Dumbbell className="h-10 w-10 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              Collega un paziente per creare schede di allenamento.
            </p>
            <Link href="/physio/settings">
              <Button variant="outline">Genera codice invito</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: plans } = await supabase
    .from("workout_plans")
    .select("id, name, description, active, created_at, plan_items(id)")
    .eq("patient_id", patient.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Header title="Schede" />
      <div className="px-4 pt-4 lg:px-0 lg:pt-0 space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Schede per <span className="font-medium text-foreground">{patient.full_name}</span>
          </p>
          <Link href="/physio/plans/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nuova scheda
            </Button>
          </Link>
        </div>

        {/* Plans list */}
        {!plans?.length ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12">
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Nessuna scheda creata. Crea la prima scheda di allenamento.
              </p>
              <Link href="/physio/plans/new">
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Crea scheda
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{plan.name}</p>
                        {plan.active && (
                          <Badge className="bg-golden-100 text-golden-700 shrink-0">
                            Attiva
                          </Badge>
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {plan.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {plan.plan_items?.length ?? 0} esercizi &middot;{" "}
                        {new Date(plan.created_at).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <TogglePlanButton planId={plan.id} active={plan.active} />
                      <Link href={`/physio/plans/edit/${plan.id}`}>
                        <Button size="sm" variant="ghost" className="h-8">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <DuplicatePlanButton planId={plan.id} />
                      <DeletePlanButton planId={plan.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

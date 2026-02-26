import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPainColor } from "@/lib/utils/constants";
import { formatDuration } from "@/lib/utils/format-time";
import {
  Calendar,
  Clock,
  Dumbbell,
  Plus,
  TrendingUp,
  User,
} from "lucide-react";

export default async function PhysioDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get linked patient (1:1 — maybeSingle to avoid crash if 0 or >1)
  const { data: patient } = await supabase
    .from("profiles")
    .select("id, full_name, username")
    .eq("physio_id", user.id)
    .eq("role", "patient")
    .limit(1)
    .maybeSingle();

  if (!patient) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="flex flex-col items-center gap-4 py-20 px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-center text-muted-foreground">
            Nessun paziente collegato. Genera un codice invito.
          </p>
          <Link href="/physio/invite">
            <Button>Genera codice invito</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get patient's active plan
  const { data: activePlan } = await supabase
    .from("workout_plans")
    .select("id, name, created_at, plan_items(id)")
    .eq("patient_id", patient.id)
    .eq("active", true)
    .maybeSingle();

  // Get patient's logs
  const { data: logs } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("patient_id", patient.id)
    .order("completed_at", { ascending: false })
    .limit(10);

  const sessionsThisWeek =
    logs?.filter((log) => {
      const logDate = new Date(log.completed_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length ?? 0;

  const avgPain =
    logs?.length && logs.some((l) => l.feedback_score)
      ? Math.round(
          logs.reduce((s, l) => s + (l.feedback_score ?? 0), 0) /
            logs.filter((l) => l.feedback_score).length
        )
      : null;

  return (
    <div>
      <Header title="Dashboard" />
      <div className="px-4 pt-4 space-y-6 max-w-2xl">
        {/* Patient info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-teal-600" />
              {patient.full_name}
            </CardTitle>
            <CardDescription>@{patient.username}</CardDescription>
          </CardHeader>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="flex flex-col items-center p-3">
              <Calendar className="h-5 w-5 text-teal-500 mb-1" />
              <span className="text-xl font-bold">{sessionsThisWeek}</span>
              <span className="text-xs text-muted-foreground text-center">
                Sessioni settimana
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-3">
              <TrendingUp className="h-5 w-5 text-golden-500 mb-1" />
              <span className="text-xl font-bold">{logs?.length ?? 0}</span>
              <span className="text-xs text-muted-foreground text-center">
                Totale sessioni
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-3">
              <span className="text-xl font-bold">
                {avgPain !== null ? (
                  <span className={getPainColor(avgPain)}>{avgPain}/10</span>
                ) : (
                  "--"
                )}
              </span>
              <span className="text-xs text-muted-foreground text-center">
                Dolore medio
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Active plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Scheda attiva</CardTitle>
              <Link href="/physio/plans/new">
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  {activePlan ? "Modifica" : "Crea"}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activePlan ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activePlan.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {activePlan.plan_items?.length ?? 0} esercizi
                  </p>
                </div>
                <Badge variant="secondary" className="bg-golden-100 text-golden-700">
                  Attiva
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nessuna scheda attiva
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessioni recenti</CardTitle>
          </CardHeader>
          <CardContent>
            {!logs?.length ? (
              <p className="text-sm text-muted-foreground">
                Nessuna sessione completata
              </p>
            ) : (
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {new Date(log.completed_at).toLocaleDateString("it-IT", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        {log.duration_seconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(log.duration_seconds)}
                          </span>
                        )}
                        {log.exercises_completed && (
                          <span className="flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" />
                            {log.exercises_completed} esercizi
                          </span>
                        )}
                      </div>
                    </div>
                    {log.feedback_score && (
                      <Badge
                        variant="secondary"
                        className={getPainColor(log.feedback_score)}
                      >
                        {log.feedback_score}/10
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

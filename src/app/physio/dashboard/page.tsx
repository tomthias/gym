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
import { PainTrendChart } from "@/components/physio/pain-trend-chart";
import { ComplianceReport } from "@/components/physio/compliance-report";
import { SendNote } from "@/components/physio/send-note";
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

  // Get linked patient (1:1 for now)
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
          <Link href="/physio/settings">
            <Button>Genera codice invito</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get active plans count
  const { count: activePlans } = await supabase
    .from("workout_plans")
    .select("id", { count: "exact", head: true })
    .eq("patient_id", patient.id)
    .eq("active", true);

  // Get patient's logs (more for charts)
  const { data: logs } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("patient_id", patient.id)
    .order("completed_at", { ascending: false })
    .limit(30);

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
      <div className="px-4 pt-4 lg:px-0 lg:pt-0 space-y-6">
        {/* Patient info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-teal-600" />
                  {patient.full_name}
                </CardTitle>
                <CardDescription>@{patient.username}</CardDescription>
              </div>
              <Link href="/physio/plans/new">
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nuova scheda
                </Button>
              </Link>
            </div>
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

        {/* Pain trend chart */}
        {logs && logs.length > 0 && (
          <PainTrendChart
            logs={logs.map((l) => ({
              completed_at: l.completed_at,
              feedback_score: l.feedback_score,
              feedback_notes: l.feedback_notes,
            }))}
          />
        )}

        {/* Compliance report */}
        {logs && (
          <ComplianceReport
            logs={logs.map((l) => ({ completed_at: l.completed_at }))}
            targetPerWeek={2}
          />
        )}

        {/* Private notes */}
        <SendNote patientId={patient.id} />

        {/* Quick overview: active plans */}
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
                <Dumbbell className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {activePlans ?? 0} {(activePlans ?? 0) === 1 ? "scheda attiva" : "schede attive"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gestisci le schede di allenamento
                </p>
              </div>
            </div>
            <Link href="/physio/plans">
              <Button variant="outline" size="sm">
                Vedi tutte
              </Button>
            </Link>
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
                        {new Date(log.completed_at).toLocaleDateString(
                          "it-IT",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          }
                        )}
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

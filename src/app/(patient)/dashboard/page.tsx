import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Dumbbell,
  Calendar,
  TrendingUp,
  Play,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Fetch active plan with items and exercises
  const { data: activePlan } = await supabase
    .from("workout_plans")
    .select(
      `
      id,
      name,
      description,
      created_at,
      plan_items (
        id,
        order,
        sets,
        reps,
        duration,
        rest_time,
        exercises (
          id,
          name,
          category
        )
      )
    `
    )
    .eq("patient_id", user.id)
    .eq("active", true)
    .single();

  // Fetch recent logs
  const { data: recentLogs } = await supabase
    .from("workout_logs")
    .select("id, completed_at, duration_seconds, feedback_score")
    .eq("patient_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(7);

  const sessionsThisWeek = recentLogs?.filter((log) => {
    const logDate = new Date(log.completed_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  }).length ?? 0;

  const lastSession = recentLogs?.[0];

  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Ciao, {profile?.full_name?.split(" ")[0] ?? ""}
        </h1>
        <p className="text-muted-foreground">Il tuo percorso di riabilitazione</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-medical-100">
              <Calendar className="h-5 w-5 text-medical-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessionsThisWeek}</p>
              <p className="text-xs text-muted-foreground">Questa settimana</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100">
              <TrendingUp className="h-5 w-5 text-sage-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {lastSession
                  ? new Date(lastSession.completed_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })
                  : "--"}
              </p>
              <p className="text-xs text-muted-foreground">Ultima sessione</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active plan */}
      {activePlan ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-medical-600" />
                  {activePlan.name}
                </CardTitle>
                <CardDescription>
                  {activePlan.plan_items?.length ?? 0} esercizi
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-sage-100 text-sage-700">
                Attivo
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exercise list preview */}
            <div className="space-y-2">
              {activePlan.plan_items
                ?.sort((a, b) => a.order - b.order)
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {(item as any).exercises?.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.sets}x
                      {item.reps
                        ? `${item.reps} rep`
                        : `${item.duration}s`}
                    </span>
                  </div>
                ))}
              {(activePlan.plan_items?.length ?? 0) > 4 && (
                <p className="text-center text-xs text-muted-foreground">
                  +{(activePlan.plan_items?.length ?? 0) - 4} altri esercizi
                </p>
              )}
            </div>

            <Link href="/workout" className="block">
              <Button className="w-full gap-2" size="lg">
                <Play className="h-5 w-5" />
                Inizia Workout
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-center text-muted-foreground">
              La tua fisioterapista non ha ancora assegnato una scheda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

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
    .select("full_name, username")
    .eq("id", user.id)
    .single();

  // Fetch all active plans
  const { data: activePlans } = await supabase
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
        superset_group,
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
    .order("created_at", { ascending: false });

  // Fetch recent logs
  const { data: recentLogs } = await supabase
    .from("workout_logs")
    .select("id, completed_at, duration_seconds, feedback_score")
    .eq("patient_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(7);

  const sessionsThisWeek =
    recentLogs?.filter((log) => {
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
          Ciao,{" "}
          {profile?.username ?? profile?.full_name?.split(" ")[0] ?? ""}
        </h1>
        <p className="text-muted-foreground">Il tuo percorso di riabilitazione</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <Calendar className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessionsThisWeek}</p>
              <p className="text-xs text-muted-foreground">Questa settimana</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-golden-100">
              <TrendingUp className="h-5 w-5 text-golden-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {lastSession
                  ? new Date(lastSession.completed_at).toLocaleDateString(
                      "it-IT",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )
                  : "--"}
              </p>
              <p className="text-xs text-muted-foreground">Ultima sessione</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active plans */}
      {activePlans && activePlans.length > 0 ? (
        <div className="space-y-4">
          {activePlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-teal-600" />
                      {plan.name}
                    </CardTitle>
                    <CardDescription>
                      {plan.plan_items?.length ?? 0} esercizi
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-golden-100 text-golden-700"
                  >
                    Attiva
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Exercise list preview */}
                <div className="space-y-2">
                  {plan.plan_items
                    ?.sort((a: any, b: any) => a.order - b.order)
                    .slice(0, 4)
                    .map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {item.exercises?.name}
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
                  {(plan.plan_items?.length ?? 0) > 4 && (
                    <p className="text-center text-xs text-muted-foreground">
                      +{(plan.plan_items?.length ?? 0) - 4} altri esercizi
                    </p>
                  )}
                </div>

                <Link
                  href={`/workout?planId=${plan.id}`}
                  className="block"
                >
                  <Button className="w-full gap-2" size="lg">
                    <Play className="h-5 w-5" />
                    Inizia Workout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
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

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPainColor } from "@/lib/utils/constants";
import { formatDuration } from "@/lib/utils/format-time";
import { Calendar, Clock, Dumbbell } from "lucide-react";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: logs } = await supabase
    .from("workout_logs")
    .select(
      `
      id,
      started_at,
      completed_at,
      duration_seconds,
      exercises_completed,
      total_sets_completed,
      feedback_score,
      feedback_notes,
      workout_plans (
        name
      )
    `
    )
    .eq("patient_id", user.id)
    .order("completed_at", { ascending: false });

  return (
    <div>
      <Header title="Storico sessioni" />
      <div className="px-4 pt-4 space-y-3">
        {!logs?.length ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Nessuna sessione completata</p>
          </div>
        ) : (
          logs.map((log) => {
            const date = new Date(log.completed_at);
            const painColor = log.feedback_score
              ? getPainColor(log.feedback_score)
              : "";

            return (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {(log as any).workout_plans?.name ?? "Sessione"}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {date.toLocaleDateString("it-IT", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                    {log.feedback_score && (
                      <Badge className={painColor} variant="secondary">
                        Dolore: {log.feedback_score}/10
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                    {log.duration_seconds && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(log.duration_seconds)}
                      </div>
                    )}
                    {log.exercises_completed && (
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-3.5 w-3.5" />
                        {log.exercises_completed} esercizi
                      </div>
                    )}
                  </div>

                  {log.feedback_notes && (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      &quot;{log.feedback_notes}&quot;
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

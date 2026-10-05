import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import { localize } from "@/lib/i18n/content";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPainColor } from "@/lib/utils/constants";
import { Calendar, Clock, Dumbbell } from "lucide-react";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { t: { history: t }, tag, locale } = await getI18n();

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
        name,
        translations
      )
    `
    )
    .eq("patient_id", user.id)
    .order("completed_at", { ascending: false });

  const planName = (plan: unknown) => {
    const row = plan as { name: string; translations: unknown } | null;
    return row ? localize(row, locale, ["name"]).name : null;
  };

  return (
    <div>
      <Header title={t.title} />
      <div className="px-4 pt-4 space-y-3">
        {!logs?.length ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t.empty}</p>
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
                        {planName(log.workout_plans) ?? t.session}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {date.toLocaleDateString(tag, {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                    {log.feedback_score && (
                      <Badge className={painColor} variant="secondary">
                        {t.pain(log.feedback_score)}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                    {log.duration_seconds && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(log.duration_seconds, tag)}
                      </div>
                    )}
                    {log.exercises_completed && (
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-3.5 w-3.5" />
                        {t.exercises(log.exercises_completed)}
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

function formatDuration(totalSeconds: number, tag: string): string {
  const fmt = (value: number, unit: "minute" | "second") =>
    new Intl.NumberFormat(tag, { style: "unit", unit, unitDisplay: "narrow" }).format(value);
  if (totalSeconds < 60) return fmt(totalSeconds, "second");
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (secs === 0) return fmt(mins, "minute");
  return `${fmt(mins, "minute")} ${fmt(secs, "second")}`;
}

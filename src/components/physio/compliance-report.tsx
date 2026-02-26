"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Flame, Target } from "lucide-react";

interface ComplianceReportProps {
  logs: {
    completed_at: string;
  }[];
  targetPerWeek?: number;
}

export function ComplianceReport({
  logs,
  targetPerWeek = 4,
}: ComplianceReportProps) {
  const now = new Date();

  // Sessions this week
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);
  const sessionsThisWeek = logs.filter(
    (log) => new Date(log.completed_at) >= weekStart
  ).length;

  // Average sessions per week (last 30 days)
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentLogs = logs.filter(
    (log) => new Date(log.completed_at) >= thirtyDaysAgo
  );
  const weeksInPeriod = Math.max(1, Math.min(4, Math.ceil(recentLogs.length > 0 ? 30 / 7 : 1)));
  const avgPerWeek =
    recentLogs.length > 0
      ? (recentLogs.length / weeksInPeriod).toFixed(1)
      : "0";

  // Current streak (consecutive days with sessions)
  const sortedDates = [...new Set(
    logs.map((log) =>
      new Date(log.completed_at).toISOString().slice(0, 10)
    )
  )].sort().reverse();

  let streak = 0;
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (sortedDates[0] === today || sortedDates[0] === yesterdayStr) {
    let checkDate = new Date(sortedDates[0]);
    for (const dateStr of sortedDates) {
      const expected = checkDate.toISOString().slice(0, 10);
      if (dateStr === expected) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const compliancePercent = Math.min(
    100,
    Math.round((sessionsThisWeek / targetPerWeek) * 100)
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Aderenza al programma
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-muted-foreground">Questa settimana</span>
            <span className="text-sm font-medium">
              {sessionsThisWeek}/{targetPerWeek} sessioni
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-teal-500"
              style={{ width: `${compliancePercent}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-lg border p-3">
            <Target className="h-4 w-4 text-teal-500 shrink-0" />
            <div>
              <p className="text-lg font-bold leading-none">{avgPerWeek}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                sessioni/sett.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border p-3">
            <Flame className="h-4 w-4 text-golden-500 shrink-0" />
            <div>
              <p className="text-lg font-bold leading-none">
                {streak > 0 ? streak : "--"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {streak === 1 ? "giorno di fila" : "giorni di fila"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";

interface LogEntry {
  completed_at: string;
  feedback_score: number | null;
  feedback_notes: string | null;
}

interface PainTrendChartProps {
  logs: LogEntry[];
}

export function PainTrendChart({ logs }: PainTrendChartProps) {
  const data = logs
    .filter((log) => log.feedback_score !== null)
    .reverse()
    .map((log) => ({
      date: new Date(log.completed_at).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
      }),
      dolore: log.feedback_score,
      note: log.feedback_notes,
    }));

  if (data.length < 2) {
    return null;
  }

  const trend =
    data.length >= 2
      ? data[data.length - 1].dolore! - data[0].dolore!
      : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Andamento dolore
          </CardTitle>
          {trend !== 0 && (
            <span
              className={`text-xs font-medium ${
                trend < 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {trend < 0 ? "In miglioramento" : "In peggioramento"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const entry = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="text-sm font-medium">{entry.date}</p>
                      <p className="text-sm">
                        Dolore:{" "}
                        <span className="font-bold">{entry.dolore}/10</span>
                      </p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                          &ldquo;{entry.note}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              <ReferenceLine
                y={3}
                stroke="hsl(142 71% 45%)"
                strokeDasharray="3 3"
                strokeOpacity={0.4}
              />
              <Line
                type="monotone"
                dataKey="dolore"
                stroke="hsl(181 50% 33%)"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "hsl(181 50% 33%)",
                  stroke: "hsl(181 50% 33%)",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

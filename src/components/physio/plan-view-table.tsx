"use client";

import { useCallback, useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatSerieReps,
  formatRest,
  generateRowLabels,
} from "@/lib/utils/plan-format";
import type { PlanItem } from "@/components/physio/plan-editor";

const NOTES_SEPARATOR = "|||";

function extractCarico(notes: string): string {
  if (!notes) return "/";
  const idx = notes.indexOf(NOTES_SEPARATOR);
  const carico = idx === -1 ? notes : notes.substring(0, idx);
  return carico || "/";
}

function extractNoteFisio(notes: string): string {
  if (!notes) return "";
  const idx = notes.indexOf(NOTES_SEPARATOR);
  if (idx === -1) return "";
  return notes.substring(idx + NOTES_SEPARATOR.length);
}

interface ViewItem {
  exerciseName: string;
  type: "reps" | "timed";
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
  notes: string;
  supersetGroup: number | null;
}

interface PlanViewTableProps {
  items: ViewItem[];
  planName: string;
}

const thClass =
  "bg-excel-green dark:bg-excel-green-dark text-excel-cream px-4 py-3 text-sm font-bold uppercase tracking-wider border border-excel-border dark:border-excel-border-dark";

const cellClass =
  "bg-excel-yellow dark:bg-excel-yellow-dark dark:text-excel-cream border border-excel-border dark:border-excel-border-dark px-4 py-3 text-sm font-medium uppercase";

export function PlanViewTable({ items, planName }: PlanViewTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Cast ViewItem[] to PlanItem-compatible for format functions
  const fakePlanItems = items.map((item) => ({
    ...item,
    tempId: "",
    exerciseId: "",
    restAfter: 90,
    transitionRest: 10,
  })) as PlanItem[];

  const labels = generateRowLabels(fakePlanItems);

  const handleDownload = useCallback(async () => {
    if (!tableRef.current || items.length === 0) return;
    setDownloading(true);
    try {
      const dataUrl = await toJpeg(tableRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        style: { borderRadius: "0" },
      });
      const link = document.createElement("a");
      link.download = `${planName || "scheda"}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silently fail
    } finally {
      setDownloading(false);
    }
  }, [items.length, planName]);

  const hasNoteFisio = items.some(
    (item) => item.notes && item.notes.includes(NOTES_SEPARATOR)
  );

  return (
    <div className="space-y-3">
      <div
        ref={tableRef}
        className="overflow-x-auto rounded-lg border border-excel-border dark:border-excel-border-dark"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`${thClass} w-[50px]`}>&nbsp;</th>
              <th className={`${thClass} min-w-[200px]`}>Esercizio</th>
              <th className={`${thClass} min-w-[120px]`}>Serie x Reps</th>
              <th className={`${thClass} min-w-[80px]`}>Rest</th>
              <th className={`${thClass} min-w-[150px]`}>Carico</th>
              {hasNoteFisio && (
                <th className={`${thClass} min-w-[200px]`}>Note Fisio</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td className="bg-excel-green dark:bg-excel-green-dark text-excel-cream text-center font-bold text-sm px-4 py-3 border border-excel-border dark:border-excel-border-dark">
                  {labels[i]}
                </td>
                <td className={cellClass}>{item.exerciseName}</td>
                <td className={`${cellClass} text-center`}>
                  {formatSerieReps(fakePlanItems[i])}
                </td>
                <td className={`${cellClass} text-center`}>
                  {formatRest(fakePlanItems[i])}
                </td>
                <td className={cellClass}>{extractCarico(item.notes)}</td>
                {hasNoteFisio && (
                  <td className={`${cellClass} normal-case`}>
                    {extractNoteFisio(item.notes)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleDownload}
        disabled={downloading || items.length === 0}
      >
        <Download className="h-4 w-4" />
        {downloading ? "Scaricando..." : "Scarica JPG"}
      </Button>
    </div>
  );
}

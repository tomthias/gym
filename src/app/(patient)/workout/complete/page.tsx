"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useWorkoutStore } from "@/lib/stores/workout-store";
import { PainFeedback } from "@/components/workout/pain-feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils/format-time";
import { CheckCircle2, Clock, Dumbbell, Layers } from "lucide-react";

export default function WorkoutCompletePage() {
  const router = useRouter();
  const store = useWorkoutStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const startedAt = store.startedAt;
  const completedAt = new Date().toISOString();
  const durationSeconds = startedAt
    ? Math.floor(
        (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000
      )
    : 0;

  const handleSaveFeedback = useCallback(
    async (score: number, notes: string) => {
      setSaving(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && store.planId) {
        await supabase.from("workout_logs").insert({
          patient_id: user.id,
          plan_id: store.planId,
          started_at: startedAt!,
          completed_at: completedAt,
          duration_seconds: durationSeconds,
          exercises_completed: store.items.length,
          total_sets_completed: store.totalSetsCompleted,
          feedback_score: score,
          feedback_notes: notes || null,
        });
      }

      store.reset();
      setSaving(false);
      setSaved(true);
    },
    [store, startedAt, completedAt, durationSeconds]
  );

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 pt-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-100">
          <CheckCircle2 className="h-10 w-10 text-sage-600" />
        </div>
        <h1 className="text-2xl font-bold">Sessione salvata!</h1>
        <p className="text-muted-foreground text-center">
          Ottimo lavoro. Continua cosi.
        </p>
        <Button onClick={() => router.push("/dashboard")} size="lg">
          Torna alla dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
          <CheckCircle2 className="h-8 w-8 text-sage-600" />
        </div>
        <h1 className="text-2xl font-bold">Workout completato!</h1>
        <p className="text-muted-foreground">{store.planName}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex flex-col items-center p-3">
            <Clock className="h-5 w-5 text-medical-500 mb-1" />
            <span className="text-lg font-bold">{formatDuration(durationSeconds)}</span>
            <span className="text-xs text-muted-foreground">Durata</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-3">
            <Dumbbell className="h-5 w-5 text-medical-500 mb-1" />
            <span className="text-lg font-bold">{store.items.length}</span>
            <span className="text-xs text-muted-foreground">Esercizi</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-3">
            <Layers className="h-5 w-5 text-medical-500 mb-1" />
            <span className="text-lg font-bold">{store.totalSetsCompleted}</span>
            <span className="text-xs text-muted-foreground">Serie</span>
          </CardContent>
        </Card>
      </div>

      {/* Pain feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Come ti senti?</CardTitle>
        </CardHeader>
        <CardContent>
          <PainFeedback onSubmit={handleSaveFeedback} loading={saving} />
        </CardContent>
      </Card>
    </div>
  );
}

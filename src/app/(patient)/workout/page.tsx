"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useWorkoutStore } from "@/lib/stores/workout-store";
import { WorkoutPlayer } from "@/components/workout/workout-player";
import type { PlanItemWithExercise } from "@/types/workout";
import { Loader2 } from "lucide-react";

export default function WorkoutPage() {
  const router = useRouter();
  const store = useWorkoutStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If already loaded (e.g., coming back from background), skip fetch
    if (store.phase !== "idle" && store.planId) {
      setLoading(false);
      return;
    }

    async function loadPlan() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: plan } = await supabase
        .from("workout_plans")
        .select(
          `
          id,
          name,
          plan_items (
            id,
            order,
            sets,
            reps,
            duration,
            rest_time,
            rest_after,
            notes,
            exercises (
              id,
              name,
              description,
              category,
              video_url
            )
          )
        `
        )
        .eq("patient_id", user.id)
        .eq("active", true)
        .maybeSingle();

      if (!plan || !plan.plan_items?.length) {
        router.push("/dashboard");
        return;
      }

      const items: PlanItemWithExercise[] = plan.plan_items.map((pi: any) => ({
        id: pi.id,
        exercise: pi.exercises,
        sets: pi.sets,
        reps: pi.reps,
        duration: pi.duration,
        rest_time: pi.rest_time,
        rest_after: pi.rest_after,
        order: pi.order,
        notes: pi.notes,
      }));

      store.loadPlan(plan.id, plan.name, items);
      setLoading(false);
    }

    loadPlan();
  }, [store, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return <WorkoutPlayer />;
}

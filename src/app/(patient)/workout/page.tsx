"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useWorkoutStore } from "@/lib/stores/workout-store";
import { WorkoutPlayer } from "@/components/workout/workout-player";
import type { PlanItemWithExercise } from "@/types/workout";
import { Loader2 } from "lucide-react";

export default function WorkoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      }
    >
      <WorkoutPageContent />
    </Suspense>
  );
}

function WorkoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useWorkoutStore();
  const [loading, setLoading] = useState(true);

  const planIdParam = searchParams.get("planId");

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

      let query = supabase
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
            superset_group,
            transition_rest,
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
        .eq("patient_id", user.id);

      if (planIdParam) {
        query = query.eq("id", planIdParam);
      } else {
        query = query.eq("active", true).limit(1);
      }

      const { data: plans } = await query;
      const plan = plans?.[0];

      if (!plan || !plan.plan_items?.length) {
        router.push("/dashboard");
        return;
      }

      const items: PlanItemWithExercise[] = plan.plan_items.map(
        (pi: any) => ({
          id: pi.id,
          exercise: pi.exercises,
          sets: pi.sets,
          reps: pi.reps,
          duration: pi.duration,
          rest_time: pi.rest_time,
          rest_after: pi.rest_after,
          order: pi.order,
          notes: pi.notes,
          superset_group: pi.superset_group,
          transition_rest: pi.transition_rest,
        })
      );

      store.loadPlan(plan.id, plan.name, items);
      setLoading(false);
    }

    loadPlan();
  }, [store, router, planIdParam]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return <WorkoutPlayer />;
}

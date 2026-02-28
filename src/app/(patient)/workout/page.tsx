"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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

  // Individual selectors — avoid subscribing to the entire store
  const phase = useWorkoutStore((s) => s.phase);
  const storePlanId = useWorkoutStore((s) => s.planId);
  const loadPlanAction = useWorkoutStore((s) => s.loadPlan);
  const reset = useWorkoutStore((s) => s.reset);

  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);

  const planIdParam = searchParams.get("planId");

  useEffect(() => {
    // If resuming the SAME plan (e.g., coming back from background), skip fetch
    if (phase !== "idle" && storePlanId && storePlanId === planIdParam) {
      setLoading(false);
      return;
    }

    // If store has a different plan, reset before loading new one.
    // Return so the effect re-runs cleanly with phase="idle".
    if (phase !== "idle" && storePlanId !== planIdParam) {
      reset();
      return;
    }

    // Guard against double-invocation (React Strict Mode / hydration races)
    if (loadingRef.current) return;

    async function fetchAndLoadPlan() {
      loadingRef.current = true;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        loadingRef.current = false;
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
        loadingRef.current = false;
        router.push("/dashboard");
        return;
      }

      const items: PlanItemWithExercise[] = plan.plan_items
        .filter((pi: any) => pi.exercises != null)
        .map((pi: any) => ({
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
        }));

      if (!items.length) {
        loadingRef.current = false;
        router.push("/dashboard");
        return;
      }

      loadPlanAction(plan.id, plan.name, items);
      loadingRef.current = false;
      setLoading(false);
    }

    fetchAndLoadPlan();
  }, [phase, storePlanId, planIdParam, router, loadPlanAction, reset]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return <WorkoutPlayer />;
}

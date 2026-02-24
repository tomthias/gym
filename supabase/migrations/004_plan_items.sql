-- Plan items (exercises within a plan)
CREATE TABLE public.plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id),
  "order" INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps INTEGER,
  duration INTEGER,
  rest_time INTEGER NOT NULL DEFAULT 60,
  rest_after INTEGER DEFAULT 90,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plan_items_plan ON public.plan_items(plan_id);

-- Must have either reps or duration
ALTER TABLE public.plan_items ADD CONSTRAINT check_reps_or_duration
  CHECK (reps IS NOT NULL OR duration IS NOT NULL);

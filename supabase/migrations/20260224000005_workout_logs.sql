-- Workout session logs
CREATE TABLE public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_seconds INTEGER,
  exercises_completed INTEGER,
  total_sets_completed INTEGER,
  feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 10),
  feedback_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workout_logs_patient ON public.workout_logs(patient_id);
CREATE INDEX idx_workout_logs_completed ON public.workout_logs(completed_at);

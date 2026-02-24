-- Workout plans
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  physio_id UUID NOT NULL REFERENCES public.profiles(id),
  name TEXT NOT NULL DEFAULT 'Piano Riabilitazione',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workout_plans_patient ON public.workout_plans(patient_id);

-- Only one active plan per patient
CREATE UNIQUE INDEX idx_one_active_plan_per_patient
  ON public.workout_plans(patient_id) WHERE active = true;

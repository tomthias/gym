-- Exercises library
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  video_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  is_global BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exercises_category ON public.exercises(category);
CREATE INDEX idx_exercises_created_by ON public.exercises(created_by);

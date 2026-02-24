-- Recipes (seed data from reference app)
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  day_type TEXT NOT NULL CHECK (day_type IN ('workout', 'rest')),
  meal_slot TEXT NOT NULL CHECK (meal_slot IN ('colazione', 'spuntino', 'pranzo', 'merenda', 'cena')),
  difficulty TEXT NOT NULL DEFAULT 'facile',
  prep_time INTEGER NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  ingredients TEXT[] NOT NULL,
  steps TEXT[] NOT NULL,
  tips TEXT,
  protein_grams NUMERIC(5,1) NOT NULL,
  carbs_grams NUMERIC(5,1) NOT NULL,
  fats_grams NUMERIC(5,1) NOT NULL,
  calories INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recipes_day_type ON public.recipes(day_type);
CREATE INDEX idx_recipes_meal_slot ON public.recipes(meal_slot);
CREATE INDEX idx_recipes_day_meal ON public.recipes(day_type, meal_slot);

-- Daily nutrition logs (what the patient actually ate)
CREATE TABLE public.nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_slot TEXT NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  custom_name TEXT,
  protein_grams NUMERIC(5,1) NOT NULL DEFAULT 0,
  carbs_grams NUMERIC(5,1) NOT NULL DEFAULT 0,
  fats_grams NUMERIC(5,1) NOT NULL DEFAULT 0,
  calories INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_nutrition_logs_patient_date ON public.nutrition_logs(patient_id, date);

-- Calorie budget per patient
CREATE TABLE public.calorie_budgets (
  patient_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_day_calories INTEGER NOT NULL DEFAULT 2100,
  rest_day_calories INTEGER NOT NULL DEFAULT 1900,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invite codes for patient-physio linking
CREATE TABLE public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  physio_id UUID NOT NULL REFERENCES public.profiles(id),
  used_by UUID REFERENCES public.profiles(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX idx_invite_codes_physio ON public.invite_codes(physio_id);

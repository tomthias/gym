-- Translations for patient-facing content (Italian stays in the base columns).
-- Shape: { "en": { "<field>": "..." }, "fr": { "<field>": "..." } }
--   exercises.translations      → name, description
--   workout_plans.translations  → name, description
--   plan_items.translations     → notes
ALTER TABLE public.exercises
  ADD COLUMN translations JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.workout_plans
  ADD COLUMN translations JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.plan_items
  ADD COLUMN translations JSONB NOT NULL DEFAULT '{}'::jsonb;

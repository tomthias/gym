-- Add superset support to plan_items
ALTER TABLE public.plan_items
  ADD COLUMN superset_group INTEGER,
  ADD COLUMN transition_rest INTEGER DEFAULT 10;

-- Index for efficient grouping queries
CREATE INDEX idx_plan_items_superset ON public.plan_items(plan_id, superset_group)
  WHERE superset_group IS NOT NULL;

-- Allow multiple active plans per patient
DROP INDEX IF EXISTS idx_one_active_plan_per_patient;

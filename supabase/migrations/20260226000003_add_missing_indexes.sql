-- Indici mancanti per performance
CREATE INDEX IF NOT EXISTS idx_workout_logs_plan ON public.workout_logs(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_exercise ON public.plan_items(exercise_id);

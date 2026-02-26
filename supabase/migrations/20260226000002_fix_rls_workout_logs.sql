-- Fix: la policy FOR ALL su workout_logs non validava che plan_id appartenga al paziente
-- Un utente poteva manipolare plan_id dal client (localStorage)

-- Rimuovi la policy troppo permissiva
DROP POLICY IF EXISTS "Patients can manage own logs" ON public.workout_logs;

-- Policies granulari
CREATE POLICY "Patients can insert own logs"
  ON public.workout_logs FOR INSERT
  WITH CHECK (
    patient_id = auth.uid()
    AND (
      plan_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.workout_plans
        WHERE id = plan_id AND patient_id = auth.uid()
      )
    )
  );

CREATE POLICY "Patients can view own logs"
  ON public.workout_logs FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can update own logs"
  ON public.workout_logs FOR UPDATE
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can delete own logs"
  ON public.workout_logs FOR DELETE
  USING (patient_id = auth.uid());

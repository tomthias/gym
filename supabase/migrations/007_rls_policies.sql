-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calorie_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Physios can view their patients"
  ON public.profiles FOR SELECT
  USING (physio_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- EXERCISES
CREATE POLICY "Anyone can read global exercises"
  ON public.exercises FOR SELECT
  USING (is_global = true OR created_by = auth.uid());

CREATE POLICY "Physios can create exercises"
  ON public.exercises FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'physio')
  );

CREATE POLICY "Physios can update own exercises"
  ON public.exercises FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Physios can delete own exercises"
  ON public.exercises FOR DELETE
  USING (created_by = auth.uid());

-- WORKOUT PLANS
CREATE POLICY "Patients can view own plans"
  ON public.workout_plans FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Physios can view patient plans"
  ON public.workout_plans FOR SELECT
  USING (physio_id = auth.uid());

CREATE POLICY "Physios can create plans"
  ON public.workout_plans FOR INSERT
  WITH CHECK (physio_id = auth.uid());

CREATE POLICY "Physios can update plans"
  ON public.workout_plans FOR UPDATE
  USING (physio_id = auth.uid());

CREATE POLICY "Physios can delete plans"
  ON public.workout_plans FOR DELETE
  USING (physio_id = auth.uid());

-- PLAN ITEMS
CREATE POLICY "Plan items visible to patient and physio"
  ON public.plan_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans wp
      WHERE wp.id = plan_id
      AND (wp.patient_id = auth.uid() OR wp.physio_id = auth.uid())
    )
  );

CREATE POLICY "Physios can insert plan items"
  ON public.plan_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_plans wp
      WHERE wp.id = plan_id AND wp.physio_id = auth.uid()
    )
  );

CREATE POLICY "Physios can update plan items"
  ON public.plan_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans wp
      WHERE wp.id = plan_id AND wp.physio_id = auth.uid()
    )
  );

CREATE POLICY "Physios can delete plan items"
  ON public.plan_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_plans wp
      WHERE wp.id = plan_id AND wp.physio_id = auth.uid()
    )
  );

-- WORKOUT LOGS
CREATE POLICY "Patients can manage own logs"
  ON public.workout_logs FOR ALL
  USING (patient_id = auth.uid());

CREATE POLICY "Physios can view patient logs"
  ON public.workout_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = patient_id AND p.physio_id = auth.uid()
    )
  );

-- RECIPES (readable by everyone - seed data)
CREATE POLICY "Anyone can read recipes"
  ON public.recipes FOR SELECT
  USING (true);

-- NUTRITION LOGS
CREATE POLICY "Patients can manage own nutrition logs"
  ON public.nutrition_logs FOR ALL
  USING (patient_id = auth.uid());

-- CALORIE BUDGETS
CREATE POLICY "Patients can manage own calorie budget"
  ON public.calorie_budgets FOR ALL
  USING (patient_id = auth.uid());

-- INVITE CODES
CREATE POLICY "Physios can manage their invite codes"
  ON public.invite_codes FOR ALL
  USING (physio_id = auth.uid());

CREATE POLICY "Anyone can read unused invite codes by code"
  ON public.invite_codes FOR SELECT
  USING (used_by IS NULL AND expires_at > now());

-- Reset: drop all existing tables, triggers, and functions to start fresh
-- This removes the old schema (programs, program_exercises, etc.)

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop all RLS policies (ignore errors if they don't exist)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Drop all tables
DROP TABLE IF EXISTS public.pain_feedback CASCADE;
DROP TABLE IF EXISTS public.workout_logs CASCADE;
DROP TABLE IF EXISTS public.workout_sessions CASCADE;
DROP TABLE IF EXISTS public.program_history CASCADE;
DROP TABLE IF EXISTS public.program_exercises CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.daily_nutrition CASCADE;
DROP TABLE IF EXISTS public.recipes CASCADE;
DROP TABLE IF EXISTS public.nutrition_logs CASCADE;
DROP TABLE IF EXISTS public.calorie_budgets CASCADE;
DROP TABLE IF EXISTS public.invite_codes CASCADE;
DROP TABLE IF EXISTS public.plan_items CASCADE;
DROP TABLE IF EXISTS public.workout_plans CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

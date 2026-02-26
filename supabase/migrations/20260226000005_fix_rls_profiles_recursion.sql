-- Fix infinite recursion in RLS policy for profiles table
-- The policy "Patients can view their physio" was using a subquery on profiles
-- within a profiles RLS policy, causing PostgreSQL error 42P17.

-- 1. Remove the problematic policy
DROP POLICY IF EXISTS "Patients can view their physio" ON public.profiles;

-- 2. Create a SECURITY DEFINER helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.get_my_physio_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT physio_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. Recreate the policy using the function (no self-referencing subquery)
CREATE POLICY "Patients can view their physio"
  ON public.profiles FOR SELECT
  USING (id = public.get_my_physio_id());

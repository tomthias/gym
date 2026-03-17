-- Fix: physio_notes INSERT policy fails due to nested RLS on profiles table.
-- Same pattern as 20260226000005_fix_rls_profiles_recursion.sql:
-- use a SECURITY DEFINER function to bypass RLS when checking patient ownership.

-- 1. Helper function: checks if a patient belongs to the current physio (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_my_patient(p_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_patient_id
    AND physio_id = auth.uid()
    AND role = 'patient'
  );
$$;

-- 2. Replace the INSERT policy with one that uses the helper function
DROP POLICY IF EXISTS "Physio can create notes for their patients" ON physio_notes;

CREATE POLICY "Physio can create notes for their patients"
  ON physio_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    physio_id = auth.uid()
    AND public.is_my_patient(patient_id)
  );

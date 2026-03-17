-- Add role column to invite_codes so the physio can specify
-- whether the invite is for a patient (default) or another physio.
ALTER TABLE public.invite_codes
  ADD COLUMN role TEXT NOT NULL DEFAULT 'patient'
  CHECK (role IN ('patient', 'physio'));

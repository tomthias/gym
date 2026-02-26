-- Allow patients to view their linked physio's profile
CREATE POLICY "Patients can view their physio"
  ON public.profiles FOR SELECT
  USING (
    id IN (SELECT physio_id FROM public.profiles WHERE id = auth.uid())
  );

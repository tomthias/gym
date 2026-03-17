-- Fix: i pazienti non possono vedere gli esercizi creati dalla loro fisioterapista.
-- La policy attuale permette solo esercizi globali o creati dall'utente stesso.
-- Aggiunge: il paziente può vedere gli esercizi del proprio fisioterapista.
-- Usa la funzione SECURITY DEFINER get_my_physio_id() già esistente.

DROP POLICY IF EXISTS "Anyone can read global exercises" ON public.exercises;

CREATE POLICY "Anyone can read global exercises"
  ON public.exercises FOR SELECT
  USING (
    is_global = true
    OR created_by = auth.uid()
    OR created_by = public.get_my_physio_id()
  );

-- Physio notes: private notes about a patient (visible only to physio)
CREATE TABLE IF NOT EXISTS physio_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  physio_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_physio_notes_patient ON physio_notes(patient_id, created_at DESC);
CREATE INDEX idx_physio_notes_physio ON physio_notes(physio_id, created_at DESC);

-- RLS
ALTER TABLE physio_notes ENABLE ROW LEVEL SECURITY;

-- Physio can insert notes for their patients
CREATE POLICY "Physio can create notes for their patients"
  ON physio_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    physio_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = patient_id
      AND physio_id = auth.uid()
      AND role = 'patient'
    )
  );

-- Physio can read their own notes
CREATE POLICY "Physio can read own notes"
  ON physio_notes FOR SELECT
  TO authenticated
  USING (physio_id = auth.uid());

-- Physio can delete their own notes
CREATE POLICY "Physio can delete own notes"
  ON physio_notes FOR DELETE
  TO authenticated
  USING (physio_id = auth.uid());

-- Create private invoices storage bucket (PDF only, 10MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('invoices', 'invoices', false, 10485760, ARRAY['application/pdf']);

-- Storage RLS policies for invoices bucket
-- Path pattern: {physio_id}/{patient_id}/{filename}.pdf

-- Physios can upload files into their own folder
CREATE POLICY "Physios upload own invoices" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Physios can read files they uploaded
CREATE POLICY "Physios read own invoices" ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Physios can update (upsert) files they uploaded
CREATE POLICY "Physios update own invoices" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Physios can delete files they uploaded
CREATE POLICY "Physios delete own invoices" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Patients can read invoices in their subfolder
CREATE POLICY "Patients read own invoices" ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

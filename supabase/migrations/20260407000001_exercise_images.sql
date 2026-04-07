-- Add image_urls array column to exercises table
ALTER TABLE public.exercises
  ADD COLUMN image_urls TEXT[] NOT NULL DEFAULT '{}';

-- Storage bucket 'exercise-images' must be created manually via Supabase Dashboard:
-- Name: exercise-images, Public: true, MIME: image/*, Max size: 5MB
--
-- Then run these RLS policies:

-- Physios can upload exercise images
CREATE POLICY "Physios can upload exercise images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'exercise-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'physio'
  )
);

-- Physios can update exercise images
CREATE POLICY "Physios can update exercise images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'exercise-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'physio'
  )
);

-- Physios can delete exercise images
CREATE POLICY "Physios can delete exercise images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'exercise-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'physio'
  )
);

-- All authenticated users can read exercise images
CREATE POLICY "Authenticated users can read exercise images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'exercise-images');

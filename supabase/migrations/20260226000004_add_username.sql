-- Aggiunge campo username ai profili
ALTER TABLE public.profiles ADD COLUMN username TEXT;
CREATE UNIQUE INDEX idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;

-- Aggiorna il trigger per leggere username dai metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, email, physio_id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'physio_id', '')::uuid,
    NULLIF(NEW.raw_user_meta_data->>'username', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

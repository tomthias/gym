-- RPC function to resolve username to email for login
-- SECURITY DEFINER bypasses RLS so unauthenticated users can look up email by username
CREATE OR REPLACE FUNCTION public.get_email_by_username(lookup_username TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE username = lower(lookup_username) LIMIT 1;
$$;

-- Allow anon and authenticated users to call this function
GRANT EXECUTE ON FUNCTION public.get_email_by_username(TEXT) TO anon, authenticated;

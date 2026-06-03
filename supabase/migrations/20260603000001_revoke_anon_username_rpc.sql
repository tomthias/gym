-- Security hardening: prevent username enumeration.
--
-- get_email_by_username() (SECURITY DEFINER) was granted to anon/authenticated,
-- so anyone could resolve a username to its account email without logging in.
-- Username->email resolution now happens server-side via the service-role
-- client (see src/app/(auth)/login/actions.ts), so the public grants are no
-- longer needed.
REVOKE EXECUTE ON FUNCTION public.get_email_by_username(TEXT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_email_by_username(TEXT) FROM authenticated;

"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Resolve a username to its account email — SERVER ONLY.
 *
 * This runs with the service-role client so the lookup never happens through a
 * publicly-callable RPC (which would let anyone enumerate accounts by username).
 * Returns null when the username does not exist; the caller shows a generic
 * "invalid credentials" message so the response does not reveal which usernames
 * are registered.
 */
export async function resolveUsernameToEmail(
  username: string
): Promise<string | null> {
  const lookup = username.trim().toLowerCase();
  if (!lookup) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", lookup)
    .maybeSingle();

  if (error || !data?.email) return null;
  return data.email;
}

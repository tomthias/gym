"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getI18n } from "@/lib/i18n/server";
import type { Messages } from "@/lib/i18n/messages";

function updateProfileSchema(t: Messages["settings"]["errors"]) {
  return z.object({
    fullName: z.string().min(1, t.nameRequired).max(100),
    username: z
      .string()
      .min(3, t.usernameMin)
      .max(30, t.usernameMax)
      .regex(/^[a-z0-9_]+$/, t.usernameFormat),
  });
}

export async function updateProfile(data: {
  fullName: string;
  username: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const { t: { settings: { errors: t } } } = await getI18n();
  const result = updateProfileSchema(t).safeParse({
    ...data,
    username: data.username.trim().toLowerCase(),
  });
  if (!result.success)
    return { success: false, error: result.error.issues[0].message };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: t.notAuthenticated };

    // Check username uniqueness (excluding current user)
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", result.data.username)
      .neq("id", user.id)
      .maybeSingle();

    if (existing)
      return { success: false, error: t.usernameTaken };

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: result.data.fullName,
        username: result.data.username,
      })
      .eq("id", user.id);

    if (updateError)
      return { success: false, error: t.profileUpdate };

    revalidatePath("/settings");
    revalidatePath("/physio/settings");
    return { success: true };
  } catch {
    return { success: false, error: t.unexpected };
  }
}

function updateEmailSchema(t: Messages["settings"]["errors"]) {
  return z.object({
    email: z.string().email(t.invalidEmail),
  });
}

export async function updateEmail(
  newEmail: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { t: { settings: { errors: t } } } = await getI18n();
  const result = updateEmailSchema(t).safeParse({ email: newEmail.trim() });
  if (!result.success)
    return { success: false, error: result.error.issues[0].message };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: t.notAuthenticated };

    const admin = createAdminClient();
    const { error: authError } = await admin.auth.admin.updateUserById(user.id, {
      email: result.data.email,
      email_confirm: true,
    });
    if (authError)
      return { success: false, error: authError.message };

    const { error: profileError } = await admin
      .from("profiles")
      .update({ email: result.data.email })
      .eq("id", user.id);
    if (profileError)
      return { success: false, error: t.profileUpdate };

    revalidatePath("/settings");
    revalidatePath("/physio/settings");
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: t.unexpectedWithDetail(msg) };
  }
}

export async function deleteAccount(): Promise<
  { success: true } | { success: false; error: string }
> {
  const { t: { settings: { errors: t } } } = await getI18n();
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: t.notAuthenticated };

    const admin = createAdminClient();

    // Delete profile first (explicit, in case cascade is not set)
    await admin.from("profiles").delete().eq("id", user.id);

    // Delete auth user
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error)
      return { success: false, error: t.deleteAccount };

    return { success: true };
  } catch {
    return { success: false, error: t.unexpected };
  }
}

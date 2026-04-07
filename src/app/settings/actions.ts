"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Il nome è obbligatorio").max(100),
  username: z
    .string()
    .min(3, "L'username deve avere almeno 3 caratteri")
    .max(30, "L'username non può superare 30 caratteri")
    .regex(
      /^[a-z0-9_]+$/,
      "L'username può contenere solo lettere minuscole, numeri e underscore"
    ),
});

export async function updateProfile(data: {
  fullName: string;
  username: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const result = updateProfileSchema.safeParse({
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
    if (!user) return { success: false, error: "Non autenticato" };

    // Check username uniqueness (excluding current user)
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", result.data.username)
      .neq("id", user.id)
      .maybeSingle();

    if (existing)
      return { success: false, error: "Username già in uso, scegline un altro" };

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: result.data.fullName,
        username: result.data.username,
      })
      .eq("id", user.id);

    if (updateError)
      return { success: false, error: "Errore nell'aggiornamento del profilo" };

    revalidatePath("/settings");
    revalidatePath("/physio/settings");
    return { success: true };
  } catch {
    return { success: false, error: "Errore imprevisto" };
  }
}

const updateEmailSchema = z.object({
  email: z.string().email("Formato email non valido"),
});

export async function updateEmail(
  newEmail: string
): Promise<{ success: true } | { success: false; error: string }> {
  const result = updateEmailSchema.safeParse({ email: newEmail.trim() });
  if (!result.success)
    return { success: false, error: result.error.issues[0].message };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non autenticato" };

    const { error: authError } = await supabase.auth.updateUser({
      email: result.data.email,
    });
    if (authError)
      return { success: false, error: authError.message };

    return { success: true };
  } catch {
    return { success: false, error: "Errore imprevisto" };
  }
}

export async function deleteAccount(): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non autenticato" };

    const admin = createAdminClient();

    // Delete profile first (explicit, in case cascade is not set)
    await admin.from("profiles").delete().eq("id", user.id);

    // Delete auth user
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error)
      return { success: false, error: "Errore nell'eliminazione dell'account" };

    return { success: true };
  } catch {
    return { success: false, error: "Errore imprevisto" };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const uuidSchema = z.string().uuid("ID non valido");

const editPatientSchema = z.object({
  fullName: z.string().min(1, "Nome obbligatorio").max(100),
  username: z.string().min(3, "Username minimo 3 caratteri").max(30),
  email: z.string().email("Email non valida"),
});

const saveInvoiceSchema = z.object({
  patientId: uuidSchema,
  invoiceNumber: z.string().min(1, "Numero fattura obbligatorio"),
  invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida (YYYY-MM-DD)"),
  paymentMethod: z.string().nullable(),
  subtotal: z.number().min(0, "Totale competenze non valido"),
  stampDuty: z.number().min(0, "Marca da bollo non valida"),
  grandTotal: z.number().min(0, "Totale documento non valido"),
  lineItems: z.array(
    z.object({
      description: z.string().min(1),
      session_date: z.string().nullable(),
      quantity: z.number().positive(),
      unit_price: z.number().min(0),
      discount_percent: z.number().min(0).max(100),
      total: z.number().min(0),
    })
  ).min(1, "Almeno una riga richiesta"),
  pdfStoragePath: z.string().min(1),
});

function revalidatePatients() {
  revalidatePath("/physio/patients");
}

export async function editPatient(
  patientId: string,
  data: { fullName: string; username: string; email: string }
): Promise<{ success: true } | { success: false; error: string }> {
  const idResult = uuidSchema.safeParse(patientId);
  if (!idResult.success) return { success: false, error: "ID non valido" };

  const dataResult = editPatientSchema.safeParse(data);
  if (!dataResult.success)
    return { success: false, error: dataResult.error.issues[0].message };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non autenticato" };

    // Verify patient belongs to this physio
    const { data: patient } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", idResult.data)
      .eq("physio_id", user.id)
      .single();

    if (!patient) return { success: false, error: "Paziente non trovato" };

    const admin = createAdminClient();

    // Update profile
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        full_name: dataResult.data.fullName,
        username: dataResult.data.username.trim().toLowerCase(),
        email: dataResult.data.email,
      })
      .eq("id", idResult.data);

    if (profileError)
      return { success: false, error: "Errore nell'aggiornamento del profilo" };

    // If email changed, update auth.users too
    if (dataResult.data.email !== patient.email) {
      const { error: authError } = await admin.auth.admin.updateUserById(
        idResult.data,
        { email: dataResult.data.email, email_confirm: true }
      );
      if (authError)
        return {
          success: false,
          error: "Errore nell'aggiornamento dell'email di accesso",
        };
    }

    revalidatePatients();
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `Errore imprevisto: ${msg}` };
  }
}

export async function resetPatientPassword(
  patientId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const idResult = uuidSchema.safeParse(patientId);
  if (!idResult.success) return { success: false, error: "ID non valido" };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non autenticato" };

    // Verify patient belongs to this physio
    const { data: patient } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", idResult.data)
      .eq("physio_id", user.id)
      .single();

    if (!patient) return { success: false, error: "Paziente non trovato" };

    const patientEmail = patient.email;
    if (!patientEmail)
      return { success: false, error: "Email del paziente non trovata" };

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email: patientEmail,
    });

    if (error)
      return { success: false, error: "Errore nell'invio dell'email di reset" };

    return { success: true };
  } catch {
    return { success: false, error: "Errore imprevisto nel reset" };
  }
}

export async function unlinkPatient(
  patientId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const idResult = uuidSchema.safeParse(patientId);
  if (!idResult.success) return { success: false, error: "ID non valido" };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non autenticato" };

    // Verify patient belongs to this physio
    const { data: patient } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", idResult.data)
      .eq("physio_id", user.id)
      .single();

    if (!patient) return { success: false, error: "Paziente non trovato" };

    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .update({ physio_id: null })
      .eq("id", idResult.data);

    if (error)
      return { success: false, error: "Errore nella rimozione del paziente" };

    revalidatePatients();
    return { success: true };
  } catch {
    return { success: false, error: "Errore imprevisto nella rimozione" };
  }
}

export async function uploadInvoice(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const patientId = formData.get("patientId") as string;
  const file = formData.get("file") as File;

  if (!patientId || !file) throw new Error("Dati mancanti");
  uuidSchema.parse(patientId);
  if (file.type !== "application/pdf") throw new Error("Il file deve essere un PDF");
  if (file.size > 10 * 1024 * 1024) throw new Error("File troppo grande (max 10MB)");

  // Verify patient belongs to this physio
  const { data: patient } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", patientId)
    .eq("physio_id", user.id)
    .single();

  if (!patient) throw new Error("Paziente non trovato");

  // Upload PDF to storage
  const storagePath = `${user.id}/${patientId}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("invoices")
    .upload(storagePath, file, { upsert: true });

  if (uploadError) throw new Error("Errore nel caricamento del file");

  // Parse the PDF
  const { parseInvoicePdf } = await import("@/lib/utils/parse-invoice");
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const parsed = await parseInvoicePdf(buffer);
    return { success: true, parsed, storagePath };
  } catch (err) {
    console.error('[uploadInvoice] parse error:', err);
    return {
      success: false,
      parsed: null,
      storagePath,
      parseError: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function saveInvoice(data: {
  patientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentMethod: string | null;
  subtotal: number;
  stampDuty: number;
  grandTotal: number;
  lineItems: Array<{
    description: string;
    session_date: string | null;
    quantity: number;
    unit_price: number;
    discount_percent: number;
    total: number;
  }>;
  pdfStoragePath: string;
}) {
  const validData = saveInvoiceSchema.parse(data);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Verify patient belongs to this physio
  const { data: patient } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", validData.patientId)
    .eq("physio_id", user.id)
    .single();

  if (!patient) throw new Error("Paziente non trovato");

  const { error } = await supabase.from("invoices").insert({
    physio_id: user.id,
    patient_id: validData.patientId,
    invoice_number: validData.invoiceNumber,
    invoice_date: validData.invoiceDate,
    payment_method: validData.paymentMethod,
    subtotal: validData.subtotal,
    stamp_duty: validData.stampDuty,
    grand_total: validData.grandTotal,
    line_items: validData.lineItems,
    pdf_storage_path: validData.pdfStoragePath,
  });

  if (error) throw new Error("Errore nel salvataggio della fattura");

  revalidatePath(`/physio/patients/${validData.patientId}/invoices`);
}

export async function deleteInvoice(invoiceId: string) {
  const validId = uuidSchema.parse(invoiceId);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Get invoice to find storage path
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, patient_id, pdf_storage_path")
    .eq("id", validId)
    .eq("physio_id", user.id)
    .single();

  if (!invoice) throw new Error("Fattura non trovata");

  // Delete from storage
  await supabase.storage.from("invoices").remove([invoice.pdf_storage_path]);

  // Delete from database
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", validId);

  if (error) throw new Error("Errore nell'eliminazione della fattura");

  revalidatePath(`/physio/patients/${invoice.patient_id}/invoices`);
}

export async function toggleInvoiceStatus(invoiceId: string) {
  const validId = uuidSchema.parse(invoiceId);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, patient_id, status")
    .eq("id", validId)
    .eq("physio_id", user.id)
    .single();

  if (!invoice) throw new Error("Fattura non trovata");

  const newStatus = invoice.status === "paid" ? "unpaid" : "paid";

  const { error } = await supabase
    .from("invoices")
    .update({ status: newStatus })
    .eq("id", validId);

  if (error) throw new Error("Errore nell'aggiornamento dello stato");

  revalidatePath(`/physio/patients/${invoice.patient_id}/invoices`);
}

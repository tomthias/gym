"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

function revalidatePatients() {
  revalidatePath("/physio/patients");
}

export async function editPatient(
  patientId: string,
  data: { fullName: string; username: string; email: string }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Verify patient belongs to this physio
  const { data: patient } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("id", patientId)
    .eq("physio_id", user.id)
    .single();

  if (!patient) throw new Error("Paziente non trovato");

  const admin = createAdminClient();

  // Update profile
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      full_name: data.fullName,
      username: data.username.trim().toLowerCase(),
      email: data.email,
    })
    .eq("id", patientId);

  if (profileError) throw new Error("Errore nell'aggiornamento del profilo");

  // If email changed, update auth.users too
  if (data.email !== patient.email) {
    const { error: authError } = await admin.auth.admin.updateUserById(
      patientId,
      { email: data.email }
    );
    if (authError)
      throw new Error("Errore nell'aggiornamento dell'email di accesso");
  }

  revalidatePatients();
}

export async function resetPatientPassword(patientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Verify patient belongs to this physio
  const { data: patient } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", patientId)
    .eq("physio_id", user.id)
    .single();

  if (!patient) throw new Error("Paziente non trovato");

  // Generate random 12-char password
  const newPassword = randomBytes(9).toString("base64url");

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(patientId, {
    password: newPassword,
  });

  if (error) throw new Error("Errore nel reset della password");

  return newPassword;
}

export async function unlinkPatient(patientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Verify patient belongs to this physio
  const { data: patient } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", patientId)
    .eq("physio_id", user.id)
    .single();

  if (!patient) throw new Error("Paziente non trovato");

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ physio_id: null })
    .eq("id", patientId);

  if (error) throw new Error("Errore nella rimozione del paziente");

  revalidatePatients();
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
  } catch {
    return { success: false, parsed: null, storagePath };
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase.from("invoices").insert({
    physio_id: user.id,
    patient_id: data.patientId,
    invoice_number: data.invoiceNumber,
    invoice_date: data.invoiceDate,
    payment_method: data.paymentMethod,
    subtotal: data.subtotal,
    stamp_duty: data.stampDuty,
    grand_total: data.grandTotal,
    line_items: data.lineItems,
    pdf_storage_path: data.pdfStoragePath,
  });

  if (error) throw new Error("Errore nel salvataggio della fattura");

  revalidatePath(`/physio/patients/${data.patientId}/invoices`);
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Get invoice to find storage path
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, patient_id, pdf_storage_path")
    .eq("id", invoiceId)
    .eq("physio_id", user.id)
    .single();

  if (!invoice) throw new Error("Fattura non trovata");

  // Delete from storage
  await supabase.storage.from("invoices").remove([invoice.pdf_storage_path]);

  // Delete from database
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId);

  if (error) throw new Error("Errore nell'eliminazione della fattura");

  revalidatePath(`/physio/patients/${invoice.patient_id}/invoices`);
}

export async function toggleInvoiceStatus(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, patient_id, status")
    .eq("id", invoiceId)
    .eq("physio_id", user.id)
    .single();

  if (!invoice) throw new Error("Fattura non trovata");

  const newStatus = invoice.status === "paid" ? "unpaid" : "paid";

  const { error } = await supabase
    .from("invoices")
    .update({ status: newStatus })
    .eq("id", invoiceId);

  if (error) throw new Error("Errore nell'aggiornamento dello stato");

  revalidatePath(`/physio/patients/${invoice.patient_id}/invoices`);
}

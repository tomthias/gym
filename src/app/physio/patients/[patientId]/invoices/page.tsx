import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { InvoiceTable } from "@/components/physio/invoice-table";
import { InvoiceUpload } from "@/components/physio/invoice-upload";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default async function PatientInvoicesPage({ params }: Props) {
  const { patientId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: patient } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", patientId)
    .eq("physio_id", user.id)
    .single();

  if (!patient) redirect("/physio/patients");

  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("patient_id", patientId)
    .eq("physio_id", user.id)
    .order("invoice_date", { ascending: false });

  if (invoicesError) {
    console.error("Invoices query error:", invoicesError);
  }

  return (
    <div>
      <Header
        title="Fatture"
        backHref={`/physio/patients/${patientId}`}
      />
      <div className="px-4 pt-4 lg:px-0 lg:pt-0 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Fatture per{" "}
            <span className="font-medium text-foreground">
              {patient.full_name}
            </span>
          </p>
          <InvoiceUpload patientId={patientId} />
        </div>

        <InvoiceTable invoices={invoices ?? []} />
      </div>
    </div>
  );
}

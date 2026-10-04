import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { PatientInvoiceList } from "./invoice-list";

export default async function PatientInvoicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { t: { invoices: t } } = await getI18n();

  const { data: invoices } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, invoice_date, grand_total, status, pdf_storage_path"
    )
    .eq("patient_id", user.id)
    .order("invoice_date", { ascending: false });

  return (
    <div className="px-4 pt-6 space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      {!invoices || invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t.empty}
            </p>
          </CardContent>
        </Card>
      ) : (
        <PatientInvoiceList invoices={invoices} />
      )}
    </div>
  );
}

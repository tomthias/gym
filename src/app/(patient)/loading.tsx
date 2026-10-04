import { Loader2 } from "lucide-react";
import { getI18n } from "@/lib/i18n/server";

export default async function PatientLoading() {
  const { t } = await getI18n();

  return (
    <div role="status" className="flex min-h-[60dvh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" aria-hidden="true" />
      <span className="sr-only">{t.common.loading}</span>
    </div>
  );
}
